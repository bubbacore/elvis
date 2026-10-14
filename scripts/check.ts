import { readFile } from "node:fs/promises";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { checkContrast, checkSizes } from "./accessibility.ts";
import { OUTPUT, packageInfo, ROOT } from "./build.ts";
import { type ExportFile, icoImages, renderExports } from "./exports.ts";
import { checkManifest, listFiles } from "./manifest.ts";
import { loadTokens } from "./tokens.ts";

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

async function check(): Promise<void> {
  const tokens = await loadTokens(ROOT);
  const contrast = checkContrast(tokens);
  const { name, version } = await packageInfo();
  const sections: [string, string[]][] = [
    ["Tokens in DTCG with resolved references", tokens.problems],
    ["Contrast by WCAG 2.2 AA", contrast.problems],
    ["Focus ring and touch target", checkSizes(tokens)],
    ["Exports regenerated from logo/", await checkExports()],
    ["Manifest of dist/", await checkManifest(OUTPUT, name, version)],
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
