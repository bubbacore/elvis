import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { OUTPUT, packageInfo, ROOT } from "./build.ts";
import { checkManifest, MANIFEST, sha256 } from "./manifest.ts";

// Trusted publishing needs npm 11.5.1 or later.
const MINIMUM_NPM = [11, 5, 1];

// The dist-tags this script publishes to, with the versions each one accepts.
const TAGS: Record<string, RegExp> = {
  latest: /^\d+\.\d+\.\d+$/,
  proof: /^0\.0\.0-proof\.\d+$/,
};

// npm may take a few minutes to serve a new version after accepting it.
const REGISTRY_ATTEMPTS = 40;
const REGISTRY_WAIT_MS = 15000;

function run(command: string, args: string[]): string {
  return execFileSync(command, args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function npmIsRecentEnough(): void {
  const version = run("npm", ["--version"]);
  const parts = version.split(".").map(Number);
  for (const [index, minimum] of MINIMUM_NPM.entries()) {
    const part = parts[index] ?? 0;
    if (part > minimum) return;
    if (part < minimum) throw new Error(`npm ${version} is older than ${MINIMUM_NPM.join(".")}`);
  }
}

// Returns the registry metadata of one version, or null when it is not published.
function registryVersion(
  spec: string,
): { integrity: string; distTags: Record<string, string> } | null {
  try {
    // npm prints nothing for a version that does not exist in a published package.
    const output = run("npm", [
      "view",
      spec,
      "dist.integrity",
      "dist-tags",
      "--json",
      "--prefer-online",
    ]);
    if (output === "") return null;
    const view = JSON.parse(output);
    return { integrity: view["dist.integrity"], distTags: view["dist-tags"] };
  } catch (error) {
    if (String((error as { stderr?: string }).stderr).includes("E404")) return null;
    throw error;
  }
}

async function waitForRegistry(
  spec: string,
  check: (published: ReturnType<typeof registryVersion>) => string | null,
): Promise<void> {
  let problem: string | null = null;
  for (let attempt = 1; attempt <= REGISTRY_ATTEMPTS; attempt++) {
    problem = check(registryVersion(spec));
    if (problem === null) return;
    console.log(`Waiting for the registry (${attempt}/${REGISTRY_ATTEMPTS}): ${problem}`);
    await new Promise((done) => setTimeout(done, REGISTRY_WAIT_MS));
  }
  throw new Error(`${spec}: ${problem}`);
}

// Publishes the generated package to npm with one dist-tag and, for a release, attaches the same
// tarball and manifest to the GitHub release. A rerun publishes nothing new: it accepts a version
// already on npm only when the tarball is identical, and it fails on any partial publication.
async function publish(): Promise<void> {
  const { values } = parseArgs({
    options: { tag: { type: "string" }, release: { type: "string" } },
  });
  const tag = values.tag ?? "";
  const { name, version } = await packageInfo();
  const accepted = TAGS[tag];
  if (!accepted) throw new Error(`unknown dist-tag ${JSON.stringify(tag)}`);
  if (!accepted.test(version)) throw new Error(`${version} cannot be published as ${tag}`);
  if (tag === "latest" && values.release !== `v${version}`) {
    throw new Error(`the latest version ${version} must come from the release v${version}`);
  }
  npmIsRecentEnough();

  const problems = await checkManifest(OUTPUT, name, version);
  if (problems.length > 0) throw new Error(`dist/ is not ready:\n${problems.join("\n")}`);

  const [packed] = JSON.parse(run("npm", ["pack", "--json", "--pack-destination", tmpdir()]));
  const tarball = join(tmpdir(), packed.filename);
  const integrity = `sha512-${createHash("sha512")
    .update(await readFile(tarball))
    .digest("base64")}`;
  const spec = `${name}@${version}`;

  const existing = registryVersion(spec);
  if (existing === null) {
    run("npm", ["publish", tarball, "--tag", tag, "--access", "public"]);
    console.log(`Published ${spec} with the dist-tag ${tag}.`);
  } else if (existing.integrity !== integrity) {
    throw new Error(`${spec} is already on npm with different contents`);
  } else {
    console.log(`${spec} is already on npm with the same contents.`);
  }

  await waitForRegistry(spec, (published) => {
    if (published === null) return "the version is not visible yet";
    if (published.integrity !== integrity) return "the published tarball differs from this build";
    if (published.distTags[tag] !== version) return `the dist-tag ${tag} does not point to it`;
    if (tag !== "latest" && published.distTags.latest === version) return "it took the latest tag";
    return null;
  });
  console.log(`npm serves ${spec} as ${tag}, identical to this build and its manifest.`);

  if (values.release) {
    const manifest = join(OUTPUT, MANIFEST);
    run("gh", ["release", "upload", values.release, tarball, manifest, "--clobber"]);
    const { assets } = JSON.parse(
      run("gh", ["release", "view", values.release, "--json", "assets"]),
    );
    for (const file of [tarball, manifest]) {
      const asset = (assets as { name: string; digest?: string }[]).find(
        (candidate) => candidate.name === file.split("/").at(-1),
      );
      const expected = `sha256:${sha256(await readFile(file))}`;
      if (asset?.digest !== expected) {
        throw new Error(`the release asset ${file} does not match ${expected}`);
      }
    }
    console.log(`Attached the tarball and the manifest to the release ${values.release}.`);
  }
}

if (import.meta.main) await publish();
