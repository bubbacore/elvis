import { readFile } from "node:fs/promises";
import subsetFont from "subset-font";
import { resolve, type TokenSet } from "./tokens.ts";

type Font = { slug: string; source: string; license: string };

// Each font is named by its family primitive, so fonts.css declares the same family the tokens use.
const FONTS: Font[] = [
  {
    slug: "noto-serif-display",
    source: "fonts/notoserifdisplay/NotoSerifDisplay[wdth,wght].ttf",
    license: "fonts/notoserifdisplay/OFL.txt",
  },
  {
    slug: "hanken-grotesk",
    source: "fonts/hankengrotesk/HankenGrotesk[wght].ttf",
    license: "fonts/hankengrotesk/OFL.txt",
  },
];

// The Google Fonts latin subset. It covers Portuguese, R$, the digits, "h" and ":" of times, º, ª
// and the usual punctuation, quotes and dashes.
const LATIN_RANGES: [number, number][] = [
  [0x0000, 0x00ff],
  [0x0131, 0x0131],
  [0x0152, 0x0153],
  [0x02bb, 0x02bc],
  [0x02c6, 0x02c6],
  [0x02da, 0x02da],
  [0x02dc, 0x02dc],
  [0x0304, 0x0304],
  [0x0308, 0x0308],
  [0x0329, 0x0329],
  [0x2000, 0x206f],
  [0x20ac, 0x20ac],
  [0x2122, 0x2122],
  [0x2191, 0x2191],
  [0x2193, 0x2193],
  [0x2212, 0x2212],
  [0x2215, 0x2215],
  [0xfeff, 0xfeff],
  [0xfffd, 0xfffd],
];

export type FontFile = { path: string; data: Buffer };

function hex(codePoint: number): string {
  return codePoint.toString(16).toUpperCase().padStart(4, "0");
}

const UNICODE_RANGE = LATIN_RANGES.map(([from, to]) =>
  from === to ? `U+${hex(from)}` : `U+${hex(from)}-${hex(to)}`,
).join(", ");

const SUBSET_TEXT = LATIN_RANGES.flatMap(([from, to]) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)),
).join("");

// Reads the variation axes from the fvar table, so the @font-face ranges follow the font file.
function variationAxes(font: Buffer): Map<string, [number, number]> {
  const axes = new Map<string, [number, number]>();
  const tables = font.readUInt16BE(4);
  for (let index = 0; index < tables; index++) {
    const record = 12 + 16 * index;
    if (font.toString("latin1", record, record + 4) !== "fvar") continue;
    const fvar = font.readUInt32BE(record + 8);
    const axesOffset = fvar + font.readUInt16BE(fvar + 4);
    const count = font.readUInt16BE(fvar + 8);
    const size = font.readUInt16BE(fvar + 10);
    for (let axis = 0; axis < count; axis++) {
      const at = axesOffset + axis * size;
      const tag = font.toString("latin1", at, at + 4);
      axes.set(tag, [font.readInt32BE(at + 4) / 65536, font.readInt32BE(at + 12) / 65536]);
    }
  }
  return axes;
}

function familyName(set: TokenSet, slug: string): string {
  const token = resolve(set, `primitive.font.family.${slug}`);
  if (typeof token === "string") throw new Error(`font ${slug}: ${token}`);
  const value = token.value;
  return Array.isArray(value) ? String(value[0]) : String(value);
}

function range([from, to]: [number, number], unit = ""): string {
  return from === to ? `${from}${unit}` : `${from}${unit} ${to}${unit}`;
}

// Subsets each font to latin WOFF2, copies its licence and writes fonts.css with paths relative to
// the package root.
export async function buildFonts(root: string, set: TokenSet): Promise<FontFile[]> {
  const files: FontFile[] = [];
  const faces: string[] = [];
  for (const font of FONTS) {
    const source = await readFile(`${root}/${font.source}`);
    const woff2 = await subsetFont(source, SUBSET_TEXT, { targetFormat: "woff2" });
    const path = `fonts/${font.slug}/${font.slug}.woff2`;
    files.push({ path, data: Buffer.from(woff2) });
    files.push({
      path: `fonts/${font.slug}/OFL.txt`,
      data: await readFile(`${root}/${font.license}`),
    });

    const axes = variationAxes(source);
    const lines = [
      `  font-family: "${familyName(set, font.slug)}";`,
      `  src: url("${path}") format("woff2");`,
      `  font-style: normal;`,
    ];
    const weight = axes.get("wght");
    if (weight) lines.push(`  font-weight: ${range(weight)};`);
    const width = axes.get("wdth");
    if (width) lines.push(`  font-stretch: ${range(width, "%")};`);
    lines.push("  font-display: swap;", `  unicode-range: ${UNICODE_RANGE};`);
    faces.push(`@font-face {\n${lines.join("\n")}\n}\n`);
  }
  files.push({ path: "fonts.css", data: Buffer.from(faces.join("\n")) });
  return files;
}
