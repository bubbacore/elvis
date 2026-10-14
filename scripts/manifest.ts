import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

export const MANIFEST = "manifest.json";

export type Manifest = {
  name: string;
  version: string;
  files: { file: string; sha256: string }[];
};

export function sha256(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

// Lists every file under a folder, with forward slashes and in byte order, so the manifest is the
// same on every system.
export async function listFiles(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(folder, join(entry.parentPath, entry.name)).split(sep).join("/"))
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

export function buildManifest(
  name: string,
  version: string,
  files: { path: string; data: Buffer }[],
): Manifest {
  const sorted = [...files].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  return {
    name,
    version,
    files: sorted.map(({ path, data }) => ({ file: path, sha256: sha256(data) })),
  };
}

// Compares the manifest in a generated folder with the files that are actually there.
export async function checkManifest(
  folder: string,
  name: string,
  version: string,
): Promise<string[]> {
  let manifest: Manifest;
  try {
    manifest = JSON.parse(await readFile(join(folder, MANIFEST), "utf8"));
  } catch {
    return [`${folder}/${MANIFEST} is missing or unreadable; run npm run build first`];
  }
  const problems: string[] = [];
  if (manifest.name !== name) problems.push(`manifest name ${manifest.name} is not ${name}`);
  if (manifest.version !== version)
    problems.push(`manifest version ${manifest.version} is not ${version}`);
  const listed = new Map(manifest.files.map((entry) => [entry.file, entry.sha256]));
  const present = (await listFiles(folder)).filter((file) => file !== MANIFEST);
  for (const file of present) {
    const expected = listed.get(file);
    if (expected === undefined) problems.push(`${file} is not in the manifest`);
    else if (expected !== sha256(await readFile(join(folder, file)))) {
      problems.push(`${file} does not match its SHA-256 in the manifest`);
    }
  }
  for (const file of listed.keys()) {
    if (!present.includes(file)) problems.push(`${file} is in the manifest but was not generated`);
  }
  return problems;
}
