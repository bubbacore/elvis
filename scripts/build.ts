import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { renderExports } from "./exports.ts";
import { buildFonts } from "./fonts.ts";
import { buildManifest, listFiles, MANIFEST } from "./manifest.ts";
import { buildTokenOutputs } from "./style-dictionary.ts";
import { loadTokens } from "./tokens.ts";

export const ROOT = join(import.meta.dirname, "..");
export const OUTPUT = join(ROOT, "dist");

// Guidelines the package distributes as they are, besides every drawing in logo/.
const COPIED = ["usage-rules.md", "voice.md"];

export async function packageInfo(): Promise<{ name: string; version: string }> {
  const { name, version } = JSON.parse(await readFile(join(ROOT, "package.json"), "utf8"));
  return { name, version };
}

// Generates every output of the package into dist/, which is rebuilt from scratch each time.
async function build(): Promise<void> {
  const tokens = await loadTokens(ROOT);
  if (tokens.problems.length > 0) {
    throw new Error(`the tokens are invalid; run npm run check:\n${tokens.problems.join("\n")}`);
  }
  const files: { path: string; data: Buffer }[] = [
    ...(await buildTokenOutputs(ROOT)),
    ...(await buildFonts(ROOT, tokens)),
    ...(await renderExports(ROOT)),
  ];
  const logo = (await listFiles(join(ROOT, "logo"))).map((file) => `logo/${file}`);
  for (const path of [...COPIED, ...logo])
    files.push({ path, data: await readFile(join(ROOT, path)) });

  await rm(OUTPUT, { recursive: true, force: true });
  for (const file of files) {
    await mkdir(dirname(join(OUTPUT, file.path)), { recursive: true });
    await writeFile(join(OUTPUT, file.path), file.data);
  }
  const { name, version } = await packageInfo();
  const manifest = buildManifest(name, version, files);
  await writeFile(join(OUTPUT, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated ${files.length + 1} files in dist/ for ${name}@${version}.`);
}

if (import.meta.main) await build();
