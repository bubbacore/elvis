import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import subsetFont from "subset-font";
import {
  EXTENSION,
  FONT_VARIANT_NUMERIC,
  resolve,
  semanticTokens,
  type TokenSet,
} from "./tokens.ts";

// A font whose licence reserves its name gets the names in renames inside the subset, because the
// OFL treats a subset as a Modified Version, which cannot use a Reserved Font Name (OFL FAQ 2.6 to
// 2.8). The copyright notice keeps the original name, as the OFL requires.
type Font = { slug: string; source: string; license: string; renames?: [string, string][] };

// Each font is named by its family primitive, so fonts.css declares the same family the tokens use.
const FONTS: Font[] = [
  {
    slug: "bubba-serif",
    source: "fonts/playfairdisplay/PlayfairDisplay[wght].ttf",
    license: "fonts/playfairdisplay/OFL.txt",
    renames: [
      ["Playfair Display", "Bubba Serif"],
      ["PlayfairDisplay", "BubbaSerif"],
    ],
  },
  {
    slug: "antonio",
    source: "fonts/antonio/Antonio[wght].ttf",
    license: "fonts/antonio/OFL.txt",
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

// Lists the OpenType features of the GSUB table, such as lnum, from its FeatureList.
function layoutFeatures(font: Buffer): Set<string> {
  const features = new Set<string>();
  const tables = font.readUInt16BE(4);
  for (let index = 0; index < tables; index++) {
    const record = 12 + 16 * index;
    if (font.toString("latin1", record, record + 4) !== "GSUB") continue;
    const gsub = font.readUInt32BE(record + 8);
    const list = gsub + font.readUInt16BE(gsub + 6);
    const count = font.readUInt16BE(list);
    for (let feature = 0; feature < count; feature++) {
      const at = list + 2 + 6 * feature;
      features.add(font.toString("latin1", at, at + 4));
    }
  }
  return features;
}

// The OpenType feature behind each font-variant-numeric value a typography level may ask for.
const NUMERIC_FEATURES: Record<string, string> = {
  "lining-nums": "lnum",
  "oldstyle-nums": "onum",
  "proportional-nums": "pnum",
  "tabular-nums": "tnum",
};

// Checks that the latin subset of each family keeps the figures its typography levels ask for,
// such as the lnum of Playfair Display, so the package delivers them.
export async function checkFigures(root: string, set: TokenSet): Promise<string[]> {
  const problems: string[] = [];
  const features = new Map<string, Set<string>>();
  for (const font of FONTS) {
    const source = await readFile(`${root}/${font.source}`);
    const subset = await subsetFont(source, SUBSET_TEXT, { targetFormat: "truetype" });
    features.set(familyName(set, font.slug), layoutFeatures(Buffer.from(subset)));
  }
  for (const token of semanticTokens(set)) {
    const own = token.extensions?.[EXTENSION] as Record<string, unknown> | undefined;
    const figures = own?.[FONT_VARIANT_NUMERIC];
    const feature = typeof figures === "string" ? NUMERIC_FEATURES[figures] : undefined;
    if (feature === undefined) continue;
    const family = (token.value as Record<string, unknown>).fontFamily;
    const resolved = typeof family === "string" ? resolve(set, family.slice(1, -1)) : family;
    if (typeof resolved === "string" || resolved === undefined) {
      problems.push(`${token.path}: the family does not resolve`);
      continue;
    }
    const name = String((resolved as { value: unknown }).value);
    const kept = features.get(name);
    if (kept === undefined) problems.push(`${token.path}: ${name} is not a packaged font`);
    else if (!kept.has(feature)) {
      problems.push(`${token.path}: the subset of ${name} has no ${feature} for ${figures}`);
    }
  }
  return problems;
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

const COPYRIGHT_NAME_ID = 0;

type SfntTable = { tag: string; checksum: number; data: Buffer };

function sfntTables(font: Buffer): SfntTable[] {
  const tables: SfntTable[] = [];
  for (let index = 0; index < font.readUInt16BE(4); index++) {
    const record = 12 + 16 * index;
    const offset = font.readUInt32BE(record + 8);
    tables.push({
      tag: font.toString("latin1", record, record + 4),
      checksum: font.readUInt32BE(record + 4),
      data: font.subarray(offset, offset + font.readUInt32BE(record + 12)),
    });
  }
  return tables;
}

function checksum(data: Buffer): number {
  const padded = Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4)]);
  let sum = 0;
  for (let at = 0; at < padded.length; at += 4) sum = (sum + padded.readUInt32BE(at)) >>> 0;
  return sum;
}

// Writes an sfnt with the same header and tables, padded to four bytes, with new checksums and the
// checkSumAdjustment of head.
function writeSfnt(font: Buffer, tables: SfntTable[]): Buffer {
  const header = Buffer.from(font.subarray(0, 12 + 16 * tables.length));
  const parts: Buffer[] = [];
  let offset = header.length;
  tables.forEach((table, index) => {
    const data = table.tag === "head" ? Buffer.from(table.data) : table.data;
    if (table.tag === "head") data.writeUInt32BE(0, 8);
    const record = 12 + 16 * index;
    header.write(table.tag, record, "latin1");
    header.writeUInt32BE(checksum(data), record + 4);
    header.writeUInt32BE(offset, record + 8);
    header.writeUInt32BE(data.length, record + 12);
    const padding = Buffer.alloc((4 - (data.length % 4)) % 4);
    parts.push(data, padding);
    offset += data.length + padding.length;
  });
  const result = Buffer.concat([header, ...parts]);
  const head = tables.findIndex((table) => table.tag === "head");
  if (head >= 0) {
    const at = result.readUInt32BE(12 + 16 * head + 8) + 8;
    result.writeUInt32BE((0xb1b0afba - checksum(result)) >>> 0, at);
  }
  return result;
}

type NameRecord = {
  platformID: number;
  encodingID: number;
  languageID: number;
  nameID: number;
  text: string;
};

// Unicode and Windows names are UTF-16BE; the others are read as Latin-1.
function decodeName(platformID: number, raw: Buffer): string {
  return platformID === 0 || platformID === 3
    ? Buffer.from(raw).swap16().toString("utf16le")
    : raw.toString("latin1");
}

function encodeName(platformID: number, text: string): Buffer {
  return platformID === 0 || platformID === 3
    ? Buffer.from(text, "utf16le").swap16()
    : Buffer.from(text, "latin1");
}

function readNames(name: Buffer): NameRecord[] {
  const count = name.readUInt16BE(2);
  const strings = name.readUInt16BE(4);
  return Array.from({ length: count }, (_, index) => {
    const at = 6 + 12 * index;
    const [platformID, encodingID, languageID, nameID, length, offset] = [0, 2, 4, 6, 8, 10].map(
      (field) => name.readUInt16BE(at + field),
    ) as [number, number, number, number, number, number];
    const raw = name.subarray(strings + offset, strings + offset + length);
    return { platformID, encodingID, languageID, nameID, text: decodeName(platformID, raw) };
  });
}

// Writes a format 0 name table, with the records in the order they came.
function writeNames(records: NameRecord[]): Buffer {
  const strings = 6 + 12 * records.length;
  const header = Buffer.alloc(strings);
  header.writeUInt16BE(records.length, 2);
  header.writeUInt16BE(strings, 4);
  const data: Buffer[] = [];
  let offset = 0;
  records.forEach((record, index) => {
    const encoded = encodeName(record.platformID, record.text);
    const at = 6 + 12 * index;
    for (const [field, value] of [
      [0, record.platformID],
      [2, record.encodingID],
      [4, record.languageID],
      [6, record.nameID],
      [8, encoded.length],
      [10, offset],
    ] as const) {
      header.writeUInt16BE(value, at + field);
    }
    data.push(encoded);
    offset += encoded.length;
  });
  return Buffer.concat([header, ...data]);
}

// Renames the family in every name record but the copyright notice, such as the family, the full
// name, the PostScript names and the names of the named instances.
function renameFont(font: Buffer, renames: [string, string][]): Buffer {
  const tables = sfntTables(font).map((table) => {
    if (table.tag !== "name") return table;
    const records = readNames(table.data).map((record) =>
      record.nameID === COPYRIGHT_NAME_ID
        ? record
        : {
            ...record,
            text: renames.reduce((text, [from, to]) => text.replaceAll(from, to), record.text),
          },
    );
    return { ...table, data: writeNames(records) };
  });
  return writeSfnt(font, tables);
}

async function subsetWoff2(font: Font, source: Buffer): Promise<Buffer> {
  if (!font.renames) {
    return Buffer.from(await subsetFont(source, SUBSET_TEXT, { targetFormat: "woff2" }));
  }
  const subset = await subsetFont(source, SUBSET_TEXT, { targetFormat: "truetype" });
  const renamed = renameFont(Buffer.from(subset), font.renames);
  return Buffer.from(await subsetFont(renamed, SUBSET_TEXT, { targetFormat: "woff2" }));
}

// Subsets each font to latin WOFF2, renamed when its licence reserves the name, copies its licence
// and writes fonts.css with paths relative to the package root.
export async function buildFonts(root: string, set: TokenSet): Promise<FontFile[]> {
  const files: FontFile[] = [];
  const faces: string[] = [];
  for (const font of FONTS) {
    const source = await readFile(`${root}/${font.source}`);
    const path = `fonts/${font.slug}/${font.slug}.woff2`;
    files.push({ path, data: await subsetWoff2(font, source) });
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

// The table tags a WOFF2 directory refers to by index, in the order of the WOFF2 specification.
const WOFF2_TAGS = (
  "cmap head hhea hmtx maxp name OS/2 post cvt_ fpgm glyf loca prep CFF_ VORG EBDT EBLC gasp " +
  "hdmx kern LTSH PCLT VDMX vhea vmtx BASE GDEF GPOS GSUB EBSC JSTF MATH CBDT CBLC COLR CPAL " +
  "SVG_ sbix acnt avar bdat bloc bsln cvar fdsc feat fmtx fvar gvar hsty just lcar mort morx " +
  "opbd prop trak Zapf Silf Glat Gloc Feat Sill"
)
  .split(" ")
  .map((tag) => tag.replace("_", " "));

// Reads the tables of a WOFF2 font: the directory, then the Brotli stream with the tables one
// after the other. Transformed tables, such as glyf, come in their transformed form.
function woff2Tables(font: Buffer): Map<string, Buffer> {
  if (font.toString("latin1", 0, 4) !== "wOF2") throw new Error("not a WOFF2 font");
  let at = 48;
  const base128 = (): number => {
    let value = 0;
    for (let index = 0; index < 5; index++) {
      const byte = font.readUInt8(at++);
      value = value * 128 + (byte & 0x7f);
      if ((byte & 0x80) === 0) return value;
    }
    throw new Error("invalid UIntBase128");
  };
  const directory: { tag: string; length: number }[] = [];
  for (let index = 0; index < font.readUInt16BE(12); index++) {
    const flags = font.readUInt8(at++);
    let tag = WOFF2_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) {
      tag = font.toString("latin1", at, at + 4);
      at += 4;
    }
    const version = flags >> 6;
    const original = base128();
    const transformed = tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
    directory.push({ tag: tag ?? "", length: transformed ? base128() : original });
  }
  const data = brotliDecompressSync(font.subarray(at, at + font.readUInt32BE(20)));
  const tables = new Map<string, Buffer>();
  let offset = 0;
  for (const { tag, length } of directory) {
    tables.set(tag, data.subarray(offset, offset + length));
    offset += length;
  }
  return tables;
}

// The names an OFL licence reserves, from its Reserved Font Name clause.
function reservedNames(license: string): string[] {
  const clause = /Reserved Font Names?([^\n]*)/i.exec(license)?.[1] ?? "";
  return [...clause.matchAll(/"([^"]+)"/g)].map((match) => match[1] as string);
}

const compact = (text: string) => text.toLowerCase().replaceAll(" ", "");

// Checks that no packaged font uses a name its licence reserves: neither in the name table, except
// the copyright notice, which must keep it, nor as the family that fonts.css declares.
export async function checkReservedNames(folder: string): Promise<string[]> {
  const problems: string[] = [];
  const css = await readFile(join(folder, "fonts.css"), "utf8");
  for (const slug of await readdir(join(folder, "fonts"))) {
    const reserved = reservedNames(await readFile(join(folder, "fonts", slug, "OFL.txt"), "utf8"));
    if (reserved.length === 0) continue;
    const path = `fonts/${slug}/${slug}.woff2`;
    const name = woff2Tables(await readFile(join(folder, path))).get("name");
    if (name === undefined) {
      problems.push(`${path} has no name table`);
      continue;
    }
    const face = css.split("@font-face").find((block) => block.includes(`url("${path}")`));
    const family = /font-family: "([^"]+)"/.exec(face ?? "")?.[1] ?? "";
    for (const word of reserved) {
      for (const record of readNames(name)) {
        if (record.nameID !== COPYRIGHT_NAME_ID && compact(record.text).includes(compact(word))) {
          problems.push(
            `${path}: name ${record.nameID} "${record.text}" uses the reserved "${word}"`,
          );
        }
      }
      if (compact(family).includes(compact(word))) {
        problems.push(`fonts.css declares ${path} as "${family}", a reserved name`);
      }
    }
  }
  return problems;
}
