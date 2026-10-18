import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { createRequire } from "node:module";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { chromium, type Page } from "playwright";
import { ASSETS, type DtcgToken, readContrast, renderReference, variable } from "./reference.ts";

// The proof consumer installs @bubbacore/elvis from the npm registry, or from a packed tarball,
// into an empty project outside the repository and uses only the public entries of the package.
// It never reads the Elvis sources nor runs the generation tools. The page it builds is the visual
// reference of the Elvis, described in reference.ts.

const PACKAGE = "@bubbacore/elvis";

// Paths a consumer must not reach: the package root, the generated folder and the sources.
const PRIVATE_IMPORTS = [
  PACKAGE,
  `${PACKAGE}/package.json`,
  `${PACKAGE}/dist/tokens.css`,
  `${PACKAGE}/tokens/semantic.tokens.json`,
];

// Everything the package may contain: the generated outputs and the licences.
const PACKAGE_FILES = /^(dist\/.+|LICENSE\.md|README\.md|package\.json)$/;

const ROOT_FONT_SIZE_PX = 16;

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

type Manifest = { name: string; version: string; files: { file: string; sha256: string }[] };

// One CSS check per semantic token: the variable applied to a property, and the same property
// with the value written from tokens.json. Both must compute to the same value.
type TokenProbe = { path: string; variable: string; property: string; literal: string };

type RunResult = {
  version: string;
  site: string;
  screenshot: string;
  computed: Record<string, string>;
  tokens: Map<string, DtcgToken>;
  problems: string[];
};

const EXACT_VERSION = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/;

// A consumer adopts an exact version, never a range or a dist-tag. A packed tarball stands in for
// the registry before a version is published.
function packageSpec(input: string): { spec: string; version: string | null } {
  if (input.endsWith(".tgz")) return { spec: resolve(input), version: null };
  if (!EXACT_VERSION.test(input)) throw new Error(`${input} is not an exact version`);
  return { spec: `${PACKAGE}@${input}`, version: input };
}

function npm(project: string, args: string[]): void {
  execFileSync("npm", [...args, "--no-audit", "--no-fund", "--ignore-scripts"], {
    cwd: project,
    stdio: "inherit",
  });
}

async function emptyProject(): Promise<string> {
  const project = await mkdtemp(join(tmpdir(), "elvis-consumer-"));
  const manifest = { name: "elvis-consumer", private: true, type: "module" };
  await writeFile(join(project, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  return project;
}

async function listFiles(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(folder, join(entry.parentPath, entry.name)).split(sep).join("/"));
}

function tokenPaths(node: Record<string, unknown>, path: string[] = []): [string, DtcgToken][] {
  if ("$value" in node) return [[path.join("."), node as DtcgToken]];
  return Object.entries(node)
    .filter(([key, child]) => !key.startsWith("$") && typeof child === "object" && child !== null)
    .flatMap(([key, child]) => tokenPaths(child as Record<string, unknown>, [...path, key]));
}

// Writes a token value as CSS, following the contract in the Elvis CONTRIBUTING.md.
function literal(path: string, token: DtcgToken): { property: string; literal: string } | string {
  const value = token.$value;
  switch (token.$type) {
    case "color": {
      const { components, alpha } = value as { components: number[]; alpha?: number };
      const [r, g, b] = components.map((c) => Math.round(c * 255));
      return { property: "color", literal: `rgb(${r} ${g} ${b} / ${alpha ?? 1})` };
    }
    case "dimension": {
      const { value: size, unit } = value as { value: number; unit: string };
      const px = unit === "rem" ? size * ROOT_FONT_SIZE_PX : size;
      return { property: "padding-left", literal: `${px}px` };
    }
    case "fontFamily": {
      const names = Array.isArray(value) ? value : [value];
      return { property: "font-family", literal: names.map((n) => JSON.stringify(n)).join(", ") };
    }
    case "fontWeight":
      return typeof value === "number"
        ? { property: "font-weight", literal: String(value) }
        : `${path}: the proof does not know the weight keyword ${JSON.stringify(value)}`;
    case "number":
      return path.startsWith("font.width.")
        ? { property: "font-stretch", literal: `${value}%` }
        : { property: "", literal: String(value) };
    default:
      return `${path}: the proof does not know the type ${token.$type}`;
  }
}

function serve(folder: string): Promise<Server> {
  const server = createServer(async (request, response) => {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://proof").pathname);
    const file = join(folder, path.endsWith("/") ? `${path}index.html` : path);
    try {
      if (!file.startsWith(folder)) throw new Error("outside the site");
      const data = await readFile(file);
      response.writeHead(200, { "content-type": CONTENT_TYPES[extname(file)] ?? "text/plain" });
      response.end(data);
    } catch {
      response.writeHead(404).end();
    }
  });
  return new Promise((done) => server.listen(0, "127.0.0.1", () => done(server)));
}

// Builds the visual reference from the public entries and checks it in Chromium.
async function check(project: string, expected: string | null, out: string): Promise<RunResult> {
  const problems: string[] = [];
  const require = createRequire(join(project, "package.json"));
  const entry = (path: string) => require.resolve(`${PACKAGE}/${path}`);

  for (const path of PRIVATE_IMPORTS) {
    try {
      require.resolve(path);
      problems.push(`${path} resolves, but it is not a public entry`);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") {
        problems.push(`${path} failed with ${code}, not ERR_PACKAGE_PATH_NOT_EXPORTED`);
      }
    }
  }

  const installed = join(project, "node_modules", ...PACKAGE.split("/"));
  for (const file of await listFiles(installed)) {
    if (!PACKAGE_FILES.test(file)) problems.push(`the package contains ${file}`);
  }

  const manifest: Manifest = JSON.parse(await readFile(entry("manifest.json"), "utf8"));
  if (expected !== null && manifest.version !== expected) {
    problems.push(`installed ${manifest.version}, expected ${expected}`);
  }
  for (const { file, sha256 } of manifest.files) {
    try {
      const data = await readFile(entry(file));
      if (createHash("sha256").update(data).digest("hex") !== sha256) {
        problems.push(`${file} does not match its SHA-256 in the manifest`);
      }
    } catch (error) {
      problems.push(`${file} is not reachable as a public entry: ${(error as Error).message}`);
    }
  }

  // The site serves every file of the manifest, so the reference can show and offer each one.
  const site = join(project, "site");
  await rm(site, { recursive: true, force: true });
  const files = manifest.files.map(({ file }) => file);
  for (const path of [...files, "manifest.json"]) {
    try {
      const data = await readFile(entry(path));
      await mkdir(dirname(join(site, ASSETS, path)), { recursive: true });
      await writeFile(join(site, ASSETS, path), data);
    } catch (error) {
      problems.push(`${path} is missing from the public entries: ${(error as Error).message}`);
    }
  }
  await writeFile(join(site, "favicon.ico"), await readFile(entry("exports/favicon/favicon.ico")));

  const tree = JSON.parse(await readFile(entry("tokens.json"), "utf8"));
  const tokens = new Map(tokenPaths(tree));
  const reference = renderReference({
    version: manifest.version,
    tokens,
    contrast: readContrast(tree),
    files,
  });
  problems.push(...reference.problems);
  await writeFile(join(site, "index.html"), reference.html);

  const probes: TokenProbe[] = [];
  for (const [path, token] of tokens) {
    const written = literal(path, token);
    if (typeof written === "string") problems.push(written);
    else probes.push({ path, variable: variable(path), ...written });
  }
  const families = [...tokens.values()]
    .filter((token) => token.$type === "fontFamily")
    .map((token) => (Array.isArray(token.$value) ? token.$value[0] : token.$value) as string);

  const server = await serve(site);
  const browser = await chromium.launch();
  const version = manifest.version;
  const screenshot = join(out, `elvis-${version}.png`);
  let computed: Record<string, string> = {};
  try {
    const page = await browser.newPage({ viewport: { width: 1024, height: 800 } });
    page.on("response", (response) => {
      if (response.status() >= 400)
        problems.push(`${response.url()} answered ${response.status()}`);
    });
    page.on("requestfailed", (request) => problems.push(`${request.url()} failed to load`));
    page.on("pageerror", (error) => problems.push(`page error: ${error.message}`));
    const { port } = server.address() as AddressInfo;
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    problems.push(...(await checkPage(page, probes, families, [...tokens.keys()])));
    computed = await page.evaluate(
      (list) =>
        Object.fromEntries(
          list.map((probe) => [
            probe.path,
            getComputedStyle(document.documentElement).getPropertyValue(probe.variable).trim(),
          ]),
        ),
      probes,
    );
    await mkdir(out, { recursive: true });
    await page.screenshot({ path: screenshot, fullPage: true });
  } finally {
    await browser.close();
    server.close();
  }
  return { version, site, screenshot, computed, tokens, problems };
}

async function checkPage(
  page: Page,
  probes: TokenProbe[],
  families: string[],
  paths: string[],
): Promise<string[]> {
  return page.evaluate(
    async ({ probes, families, paths }) => {
      const problems: string[] = [];
      const shown = new Set(
        [...document.querySelectorAll("[data-token]")].map((card) =>
          card.getAttribute("data-token"),
        ),
      );
      for (const path of paths) {
        if (!shown.has(path)) problems.push(`${path} has no sample in the visual reference`);
      }
      await document.fonts.ready;
      const loaded = new Set(
        [...document.fonts]
          .filter((face) => face.status === "loaded")
          .map((face) => face.family.replace(/^["']|["']$/g, "")),
      );
      for (const family of families) {
        if (!loaded.has(family)) problems.push(`the font ${family} did not load`);
      }
      for (const image of document.images) {
        if (!image.complete || image.naturalWidth === 0) {
          problems.push(`${image.getAttribute("src")} did not render`);
        }
      }

      const root = getComputedStyle(document.documentElement);
      const declared = new Set<string>();
      for (const sheet of document.styleSheets) {
        for (const rule of sheet.cssRules) {
          if (!(rule instanceof CSSStyleRule) || rule.selectorText !== ":root") continue;
          for (const name of rule.style) if (name.startsWith("--bubba-")) declared.add(name);
        }
      }
      const element = document.createElement("div");
      const reference = document.createElement("div");
      document.body.append(element, reference);
      for (const probe of probes) {
        declared.delete(probe.variable);
        const raw = root.getPropertyValue(probe.variable).trim();
        if (raw === "") {
          problems.push(`${probe.variable} is not defined for ${probe.path}`);
          continue;
        }
        if (probe.property === "") {
          if (raw !== probe.literal)
            problems.push(`${probe.variable} is ${raw}, not ${probe.literal}`);
          continue;
        }
        element.style.setProperty(probe.property, `var(${probe.variable})`);
        reference.style.setProperty(probe.property, probe.literal);
        const actual = getComputedStyle(element).getPropertyValue(probe.property);
        const wanted = getComputedStyle(reference).getPropertyValue(probe.property);
        if (actual !== wanted) {
          problems.push(`${probe.variable} computes to ${actual}, but tokens.json gives ${wanted}`);
        }
        element.removeAttribute("style");
        reference.removeAttribute("style");
      }
      element.remove();
      reference.remove();
      for (const name of declared) problems.push(`${name} is in tokens.css but not in tokens.json`);
      return problems;
    },
    { probes, families, paths },
  );
}

function report(result: RunResult): void {
  console.log(`\n${PACKAGE}@${result.version}: ${result.tokens.size} tokens checked`);
  console.log(`Screenshot: ${result.screenshot}`);
  console.log(`Visual reference: ${join(result.site, "index.html")}`);
  for (const problem of result.problems) console.log(`✗ ${problem}`);
  if (result.problems.length === 0) console.log("✓ public entries, fonts, files and CSS variables");
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      package: { type: "string" },
      from: { type: "string" },
      out: { type: "string", default: "proof-results" },
      serve: { type: "boolean", default: false },
    },
  });
  if (!values.package) {
    throw new Error(
      "usage: node proof/consumer.ts --package <version|file.tgz> [--from <version>] [--out <folder>] [--serve]",
    );
  }
  const out = resolve(values.out);
  const project = await emptyProject();
  console.log(`Empty consumer project: ${project}`);
  const results: RunResult[] = [];

  if (values.from) {
    const from = packageSpec(values.from);
    npm(project, ["install", "--save-exact", from.spec]);
    results.push(await check(project, from.version, out));
    report(results[0] as RunResult);
  }
  const target = packageSpec(values.package);
  npm(project, ["install", "--save-exact", target.spec]);
  const last = await check(project, target.version, out);
  results.push(last);
  report(last);

  // The reference of the last version checked is the one kept, published and served.
  const site = join(out, "site");
  await rm(site, { recursive: true, force: true });
  await cp(last.site, site, { recursive: true });

  const summary: Record<string, unknown> = {
    versions: results.map((result) => result.version),
    screenshots: results.map((result) => relative(out, result.screenshot)),
    site: relative(out, site),
  };
  const [before] = results;
  if (values.from && before) {
    const changed = [...last.tokens.keys()].filter(
      (path) => before.computed[path] !== last.computed[path],
    );
    summary.changed = changed.map((path) => ({
      token: path,
      before: before.computed[path],
      after: last.computed[path],
    }));
    console.log(`\nUpdate ${before.version} → ${last.version}`);
    if (changed.length === 0) last.problems.push("the update changed no CSS variable");
    for (const path of changed) {
      console.log(`  ${path}: ${before.computed[path]} → ${last.computed[path]}`);
    }
  }
  await mkdir(out, { recursive: true });
  await writeFile(join(out, "report.json"), `${JSON.stringify(summary, null, 2)}\n`);

  if (results.some((result) => result.problems.length > 0)) {
    console.log("\nThe proof consumer failed.");
    process.exitCode = 1;
  } else {
    console.log("\nThe proof consumer passed.");
  }

  // Keeps the reference of the last version open on a local server, until Ctrl+C.
  if (values.serve) {
    const server = await serve(site);
    const { port } = server.address() as AddressInfo;
    console.log(`\nVisual reference at http://127.0.0.1:${port}/ (Ctrl+C to stop)`);
  }
}

if (import.meta.main) await main();
