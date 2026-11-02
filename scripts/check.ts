import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { checkContrast, checkSizes } from "./accessibility.ts";
import { OUTPUT, packageInfo, ROOT } from "./build.ts";
import { DESIGN_MD, lintDesignMd, renderDesignMd, unexpectedFindings } from "./design-md.ts";
import { type ExportFile, icoImages, renderExports } from "./exports.ts";
import { checkFigures, checkReservedNames } from "./fonts.ts";
import { checkApproved, checkManifest, listFiles } from "./manifest.ts";
import { loadTokens, type TokenSet } from "./tokens.ts";

// Compares two PNG images pixel by pixel, without tolerance.
function samePixels(approved: Buffer, generated: Buffer): string | null {
  const a = PNG.sync.read(approved);
  const b = PNG.sync.read(generated);
  if (a.width !== b.width || a.height !== b.height) {
    return `size ${b.width}×${b.height} differs from the approved ${a.width}×${a.height}`;
  }
  const differing = pixelmatch(a.data, b.data, null, a.width, a.height, {
    threshold: 0,
    includeAA: true,
  });
  return differing === 0 ? null : `${differing} pixels differ from the approved file`;
}

function compareExport(file: ExportFile, approved: Buffer): string | null {
  switch (file.kind) {
    case "svg":
      return approved.equals(file.data) ? null : "bytes differ from the approved file";
    case "png":
      return samePixels(approved, file.data);
    case "ico": {
      const expected = icoImages(approved);
      const generated = icoImages(file.data);
      const widths = [...expected.keys()].join(", ");
      if (widths !== [...generated.keys()].join(", ")) return `sizes differ from ${widths}`;
      for (const [width, png] of expected) {
        const problem = samePixels(png, generated.get(width) as Buffer);
        if (problem) return `${width} px image: ${problem}`;
      }
      return null;
    }
  }
}

// Regenerates the exports from logo/ and compares them with the approved files in exports/.
async function checkExports(): Promise<string[]> {
  const problems: string[] = [];
  const generated = await renderExports(ROOT);
  const approved = new Set(
    (await listFiles(join(ROOT, "exports"))).map((file) => `exports/${file}`),
  );
  for (const file of generated) {
    if (!approved.delete(file.path)) {
      problems.push(`${file.path}: generated, but there is no approved file`);
      continue;
    }
    const problem = compareExport(file, await readFile(join(ROOT, file.path)));
    if (problem) problems.push(`${file.path}: ${problem}`);
  }
  for (const path of approved) problems.push(`${path}: approved, but no longer generated`);
  return problems;
}

// The DESIGN.md in the repository root must be the one the build generated into dist/. The CI also
// compares it with git after the build, so an outdated file fails.
async function checkDesignMd(): Promise<{ root: string[]; lint: string[] }> {
  let generated: Buffer;
  try {
    generated = await readFile(join(OUTPUT, DESIGN_MD));
  } catch {
    const missing = [`dist/${DESIGN_MD} is missing; run npm run build first`];
    return { root: missing, lint: missing };
  }
  let root: Buffer | null = null;
  try {
    root = await readFile(join(ROOT, DESIGN_MD));
  } catch {}
  return {
    root:
      root === null
        ? [`${DESIGN_MD} is missing at the root; run npm run build and commit it`]
        : root.equals(generated)
          ? []
          : [`${DESIGN_MD} at the root differs from dist/${DESIGN_MD}; run npm run build`],
    lint: unexpectedFindings(await lintDesignMd(generated.toString("utf8"))),
  };
}

// Proves the lint check fails on a contrast warning: the same DESIGN.md with one component whose
// text and background, both Elvis colours, stay below the 4.5:1 of WCAG AA.
async function checkContrastFails(tokens: TokenSet, version: string): Promise<string[]> {
  const probe = await renderDesignMd(ROOT, tokens, {
    version,
    components: {
      "contrast-probe": {
        backgroundColor: "{colors.surface-card}",
        textColor: "{colors.text-disabled}",
      },
    },
  });
  const problems = unexpectedFindings(await lintDesignMd(probe));
  return problems.some((problem) => problem.startsWith("warning contrast-ratio"))
    ? []
    : ["a component below 4.5:1 did not fail the DESIGN.md lint check"];
}

async function check(): Promise<void> {
  const tokens = await loadTokens(ROOT);
  const contrast = checkContrast(tokens);
  const { name, version } = await packageInfo();
  const designMd = await checkDesignMd();
  const sections: [string, string[]][] = [
    ["Tokens in DTCG with resolved references", tokens.problems],
    ["Contrast by WCAG 2.2 AA", contrast.problems],
    ["Focus ring and touch target", checkSizes(tokens)],
    ["Figures of the typography levels in the font subsets", await checkFigures(ROOT, tokens)],
    ["Reserved font names out of the packaged fonts", await checkReservedNames(OUTPUT)],
    [
      "Logo and exports match the root manifest.json",
      await checkApproved(ROOT, ["logo", "exports"]),
    ],
    ["Exports regenerated from logo/", await checkExports()],
    ["Manifest of dist/", await checkManifest(OUTPUT, name, version)],
    ["DESIGN.md at the root matches dist/DESIGN.md", designMd.root],
    ["DESIGN.md lint with only the expected warnings", designMd.lint],
    ["DESIGN.md lint check fails on a contrast warning", await checkContrastFails(tokens, version)],
  ];

  for (const result of contrast.results) {
    const verdict = result.ratio >= result.minimum ? "ok" : "FAIL";
    console.log(
      `  ${verdict.padEnd(4)} ${result.ratio.toFixed(2).padStart(5)}:1 ≥ ${String(result.minimum).padStart(3)}:1  ${result.kind.padEnd(10)} ${result.foreground} on ${result.background}`,
    );
  }
  let failed = false;
  for (const [title, problems] of sections) {
    console.log(`${problems.length === 0 ? "✓" : "✗"} ${title}`);
    for (const problem of problems) console.log(`    ${problem}`);
    failed ||= problems.length > 0;
  }
  if (failed) process.exitCode = 1;
}

await check();
