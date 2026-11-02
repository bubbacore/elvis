import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { sha256 } from "./manifest.ts";
import {
  type ColorValue,
  type DimensionValue,
  EXTENSION,
  FONT_VARIANT_NUMERIC,
  PRIMITIVES_FILE,
  referenceTarget,
  resolve,
  SEMANTIC_FILE,
  semanticTokens,
  type Token,
  type TokenSet,
} from "./tokens.ts";

// Generates DESIGN.md in the format of github.com/google-labs-code/design.md, version alpha,
// checked with the pinned @google/design.md CLI. The values come from the resolved semantic tokens
// through the explicit name mapping below, and the text comes from the approved sections of
// usage-rules.md and voice.md, picked by heading. Nothing is written by hand or by an AI model.

export const DESIGN_MD = "DESIGN.md";
const USAGE_RULES = "usage-rules.md";
const VOICE = "voice.md";
// The inputs whose SHA-256 the file records. The file never records its own hash.
const INPUTS = [PRIMITIVES_FILE, SEMANTIC_FILE, USAGE_RULES, VOICE];

// The DESIGN.md token names are part of the public contract, as the Elvis token names are
// (ADR 0015). Renaming or removing one is a breaking change. The format expects `primary` for the
// colour of the main action; every other colour keeps its Elvis path without `color.`.
const COLORS: [string, string][] = [
  ["primary", "color.action.primary"],
  ["action-selected", "color.action.selected"],
  ["action-disabled", "color.action.disabled"],
  ["surface-paper", "color.surface.paper"],
  ["surface-card", "color.surface.card"],
  ["surface-mist", "color.surface.mist"],
  ["surface-no-sessions-day", "color.surface.no-sessions-day"],
  ["surface-logo-frame", "color.surface.logo-frame"],
  ["text-ink", "color.text.ink"],
  ["text-body", "color.text.body"],
  ["text-blue", "color.text.blue"],
  ["text-attention", "color.text.attention"],
  ["text-inverse", "color.text.inverse"],
  ["text-disabled", "color.text.disabled"],
  ["border-field", "color.border.field"],
  ["border-blue", "color.border.blue"],
  ["border-attention", "color.border.attention"],
  ["focus-filter", "color.focus.filter"],
  ["focus-action", "color.focus.action"],
  ["focus-field", "color.focus.field"],
  ["halo-strong", "color.halo.strong"],
  ["halo-medium", "color.halo.medium"],
  ["halo-soft", "color.halo.soft"],
];

// A level with a wide size keeps the base name and gains `-wide`.
const TYPOGRAPHY: [string, string][] = [
  ["display", "typography.display.base"],
  ["display-wide", "typography.display.wide"],
  ["character", "typography.character.base"],
  ["character-wide", "typography.character.wide"],
  ["title-1", "typography.title.1.base"],
  ["title-1-wide", "typography.title.1.wide"],
  ["title-2", "typography.title.2.base"],
  ["title-2-wide", "typography.title.2.wide"],
  ["title-3", "typography.title.3.base"],
  ["title-3-wide", "typography.title.3.wide"],
  ["body", "typography.body"],
  ["body-small", "typography.body-small"],
  ["time", "typography.time"],
  ["control", "typography.control"],
  ["field", "typography.field"],
  ["metadata", "typography.metadata"],
  ["label", "typography.label"],
  ["block-label", "typography.block-label"],
  ["marker", "typography.marker"],
];

const ROUNDED: [string, string][] = [
  ["pill", "radius.pill"],
  ["card", "radius.card"],
  ["highlight", "radius.highlight"],
];

const SPACING: [string, string][] = [
  ["1", "space.1"],
  ["2", "space.2"],
  ["3", "space.3"],
  ["4", "space.4"],
  ["5", "space.5"],
  ["6", "space.6"],
  ["8", "space.8"],
  ["10", "space.10"],
  ["14", "space.14"],
  ["20", "space.20"],
];

// Semantic tokens the format has no field for. They go into the generated text of a section, and
// the typography families and weights are already inside each level.
const IN_TEXT = new Set([
  "font.family.text",
  "font.family.label",
  "font.weight.text.regular",
  "font.weight.text.semibold",
  "font.weight.text.bold",
  "font.weight.label.light",
  "font.weight.label.medium",
  "border.width",
  "focus.width",
  "focus.offset",
  "focus.spread",
  "target.min-size",
  "target.control-height",
  "breakpoint.wide",
  "motion.duration",
  "motion.easing",
]);

// The OpenType feature behind each font-variant-numeric value, for the fontFeature field.
const FEATURES: Record<string, string> = {
  "lining-nums": "lnum",
  "oldstyle-nums": "onum",
  "proportional-nums": "pnum",
  "tabular-nums": "tnum",
};

// Lint findings the check accepts. The base accepts only orphaned tokens; contrast-ratio never
// enters, because every required pair already passes the Elvis contrast check.
export const EXPECTED_WARNINGS = new Set(["orphaned-tokens"]);
const CLI = join(import.meta.dirname, "..", "node_modules", ".bin", "design.md");

type Component = Record<string, string>;

function token(set: TokenSet, path: string): Token {
  const resolved = resolve(set, path);
  if (typeof resolved === "string") throw new Error(`${DESIGN_MD}: ${resolved}`);
  return resolved;
}

function hex(set: TokenSet, path: string): string {
  const value = token(set, path).value as ColorValue;
  if (!value.hex) throw new Error(`${DESIGN_MD}: ${path} has no hex value`);
  return value.hex.toUpperCase();
}

function dimension(value: DimensionValue): string {
  return `${value.value}${value.unit}`;
}

function size(set: TokenSet, path: string): string {
  return dimension(token(set, path).value as DimensionValue);
}

// A dimension in the text, written as the guidelines write it, such as "24 px".
function spoken(set: TokenSet, path: string): string {
  const { value, unit } = token(set, path).value as DimensionValue;
  return `${value} ${unit}`;
}

// Resolves each part of a typography level and adds its figures as an OpenType feature.
function level(set: TokenSet, path: string): Record<string, string | number> {
  const source = set.tokens.get(path);
  if (source?.type !== "typography") throw new Error(`${DESIGN_MD}: ${path} is missing`);
  const part = (name: string) => {
    const target = referenceTarget((source.value as Record<string, unknown>)[name]);
    if (target === null) throw new Error(`${DESIGN_MD}: ${path}.${name} is not a reference`);
    return token(set, target).value;
  };
  const result: Record<string, string | number> = {
    fontFamily: part("fontFamily") as string,
    fontSize: dimension(part("fontSize") as DimensionValue),
    fontWeight: part("fontWeight") as number,
    lineHeight: part("lineHeight") as number,
    letterSpacing: dimension(part("letterSpacing") as DimensionValue),
  };
  const own = source.extensions?.[EXTENSION] as Record<string, unknown> | undefined;
  const numeric = own?.[FONT_VARIANT_NUMERIC];
  if (typeof numeric === "string" && numeric !== "normal") {
    const feature = FEATURES[numeric];
    if (!feature) throw new Error(`${DESIGN_MD}: ${path} has figures ${numeric} with no feature`);
    result.fontFeature = `"${feature}"`;
  }
  return result;
}

// Every semantic token goes either into the front matter, through the mapping, or into the text.
// A new token fails the build until the mapping decides where it goes.
function checkCoverage(set: TokenSet): void {
  const mapped = new Set(
    [...COLORS, ...TYPOGRAPHY, ...ROUNDED, ...SPACING].map(([, path]) => path),
  );
  const missing = semanticTokens(set)
    .map((semantic) => semantic.path)
    .filter((path) => !mapped.has(path) && !IN_TEXT.has(path));
  if (missing.length > 0) {
    throw new Error(`${DESIGN_MD}: map these semantic tokens first: ${missing.join(", ")}`);
  }
}

// Writes a YAML scalar: numbers, dimensions and plain names as they are, a value with double
// quotes, such as a font feature, in single quotes, and anything else in double quotes.
function scalar(value: string | number): string {
  if (typeof value === "number") return String(value);
  if (/^-?\d+(\.\d+)?(px|em|rem)$/.test(value) || /^[A-Za-z][A-Za-z0-9 -]*$/.test(value)) {
    return value;
  }
  if (value.includes('"') && !value.includes("'")) return `'${value}'`;
  return JSON.stringify(value);
}

function frontMatter(set: TokenSet, components?: Record<string, Component>): string {
  const lines = [
    "---",
    "version: alpha",
    "name: Bubba",
    `description: ${scalar("Marca e valores-base do Bubba, gerados do pacote @bubbacore/elvis.")}`,
    "colors:",
    ...COLORS.map(([name, path]) => `  ${name}: ${scalar(hex(set, path))}`),
    "typography:",
    ...TYPOGRAPHY.flatMap(([name, path]) => [
      `  ${name}:`,
      ...Object.entries(level(set, path)).map(([key, value]) => `    ${key}: ${scalar(value)}`),
    ]),
    "rounded:",
    ...ROUNDED.map(([name, path]) => `  ${name}: ${size(set, path)}`),
    "spacing:",
    ...SPACING.map(([name, path]) => `  ${JSON.stringify(name)}: ${size(set, path)}`),
  ];
  if (components) {
    lines.push("components:");
    for (const [name, properties] of Object.entries(components)) {
      lines.push(`  ${name}:`);
      for (const [key, value] of Object.entries(properties))
        lines.push(`    ${key}: ${scalar(value)}`);
    }
  } else {
    lines.push(
      "omitted:",
      "  - section: components",
      `    reason: ${scalar("Os componentes ficam em cada canal, conforme a ADR 0018 do Bubba.")}`,
    );
  }
  lines.push("---");
  return lines.join("\n");
}

// Returns the section under a heading path, such as ["Regras gerais", "Língua"], with its
// subsections, moved so that the picked heading becomes a level 3 heading. A missing heading fails
// the build, so renaming a section of the guidelines is a decision about this file too.
export function pick(markdown: string, file: string, path: string[]): string {
  const lines = markdown.split("\n");
  const trail: string[] = [];
  let fenced = false;
  let start = -1;
  let depth = 0;
  let end = lines.length;
  for (const [index, line] of lines.entries()) {
    if (line.startsWith("```")) fenced = !fenced;
    const heading = fenced ? null : line.match(/^(#{1,6}) (.+)$/);
    if (!heading?.[1] || !heading[2]) continue;
    const headingDepth = heading[1].length;
    if (start >= 0 && headingDepth <= depth) {
      end = index;
      break;
    }
    trail.length = headingDepth - 1;
    trail[headingDepth - 1] = heading[2].trim();
    const own = trail.slice(-path.length);
    if (start < 0 && own.length === path.length && own.every((name, i) => name === path[i])) {
      start = index;
      depth = headingDepth;
    }
  }
  if (start < 0) throw new Error(`${DESIGN_MD}: ${file} has no section ${path.join(" › ")}`);
  const shift = 3 - depth;
  return lines
    .slice(start, end)
    .map((line) => {
      const heading = line.match(/^(#{1,6}) /);
      if (!heading?.[1]) return line;
      return `${"#".repeat(heading[1].length + shift)}${line.slice(heading[1].length)}`;
    })
    .join("\n")
    .trim();
}

function sentence(parts: string[]): string {
  return parts.join(" ");
}

export type DesignMdOptions = {
  version: string;
  // Only the self-test of the lint check passes components, to prove a contrast warning fails.
  components?: Record<string, Component>;
};

export async function renderDesignMd(
  root: string,
  set: TokenSet,
  options: DesignMdOptions,
): Promise<string> {
  checkCoverage(set);
  const inputs = new Map<string, string>();
  for (const file of INPUTS) inputs.set(file, await readFile(join(root, file), "utf8"));
  const usage = (...path: string[]) => pick(inputs.get(USAGE_RULES) as string, USAGE_RULES, path);
  const voice = (...path: string[]) => pick(inputs.get(VOICE) as string, VOICE, path);

  const text = token(set, "font.family.text").value as string;
  const label = token(set, "font.family.label").value as string;
  const easing = (token(set, "motion.easing").value as number[]).join(", ");
  const duration = spoken(set, "motion.duration");

  const colorList = COLORS.map(([name, path]) => {
    const description = set.tokens.get(path)?.description ?? "";
    return `- **${name}** (\`${path}\`, \`${hex(set, path)}\`): ${description}`;
  });
  const typographyList = TYPOGRAPHY.map(([name, path]) => {
    const value = level(set, path);
    const description = set.tokens.get(path)?.description ?? "";
    return `- **${name}** (\`${path}\`): ${value.fontFamily} ${value.fontWeight}, ${value.fontSize}. ${description}`;
  });

  const provenance = [
    "<!--",
    `Gerado por scripts/design-md.ts no @bubbacore/elvis. Não edite este arquivo: mude as entradas e rode npm run build.`,
    `Release do Elvis: ${options.version} x-release-please-version`,
    "Formato: DESIGN.md alpha, conferido com o @google/design.md fixado no repositório.",
    "SHA-256 das entradas:",
    ...INPUTS.map((file) => `- ${file}: ${sha256(Buffer.from(inputs.get(file) as string))}`),
    "-->",
  ];

  const sections = [
    frontMatter(set, options.components),
    "",
    "# Bubba",
    "",
    ...provenance,
    "",
    "## Overview",
    "",
    "Marca e valores-base do Bubba, um site público e gratuito com a programação dos cinemas. O layout, a elevação e os componentes ficam em cada canal.",
    "",
    usage("Direção visual"),
    "",
    voice("Personalidade"),
    "",
    "## Colors",
    "",
    "Estas são todas as cores da marca. Cada nome do DESIGN.md corresponde a um token semântico do Elvis, com o papel descrito no próprio token:",
    "",
    ...colorList,
    "",
    usage("Cores"),
    "",
    "## Typography",
    "",
    sentence([
      `Sem o \`fonts.css\` do pacote, use a Playfair Display no lugar da ${text}, que tem o mesmo desenho, e a ${label} do Google Fonts, que não é a Anton.`,
      `Os níveis em ${text} levam \`fontFeature: "lnum"\`, os algarismos alinhados, aplicados também com \`font-variant-numeric: lining-nums\`.`,
      `Os níveis terminados em \`-wide\` substituem o nível de mesmo nome a partir de ${spoken(set, "breakpoint.wide")} de largura, e os demais não mudam.`,
    ]),
    "",
    ...typographyList,
    "",
    usage("Tipografia"),
    "",
    "## Layout",
    "",
    sentence([
      "A escala `spacing` reproduz os tokens `space` do Elvis, e só os valores dela separam os elementos.",
      `Todo alvo de toque tem pelo menos ${spoken(set, "target.min-size")} de lado, e os controles principais no celular têm ${spoken(set, "target.control-height")} de altura.`,
      `A tela larga começa em ${spoken(set, "breakpoint.wide")}.`,
    ]),
    "",
    usage("Espaço, formas e toque"),
    "",
    "## Shapes",
    "",
    sentence([
      `Os cantos ficam em \`rounded\`: ${spoken(set, "radius.pill")} nas pílulas, ${spoken(set, "radius.card")} nos cartões e ${spoken(set, "radius.highlight")} nos destaques.`,
      `As bordas dos campos e dos horários e o sublinhado dos links têm ${spoken(set, "border.width")}.`,
      `O foco desenha um contorno externo de ${spoken(set, "focus.width")}, afastado ${spoken(set, "focus.offset")} do controle; campos e horários usam uma sombra externa sólida de ${spoken(set, "focus.spread")}, sem afastamento nem desfoque.`,
      `As transições duram ${duration}, com \`cubic-bezier(${easing})\`.`,
    ]),
    "",
    usage("Foco e movimento"),
    "",
    "## Do's and Don'ts",
    "",
    usage("Usos indevidos"),
    "",
    voice("Regras gerais", "Caixa e pontuação"),
    "",
    voice("Regras gerais", "Números, datas e preços"),
    "",
    "## Logo",
    "",
    usage("Formas e hierarquia"),
    "",
    usage("Área de segurança"),
    "",
    usage("Tamanhos na tela"),
    "",
    usage("Versões por fundo"),
    "",
    usage("Personagem"),
    "",
    "## Voice",
    "",
    voice("Princípios"),
    "",
    voice("Regras gerais", "Língua"),
    "",
    voice("Regras gerais", "Termos do domínio"),
    "",
    voice("Tons por situação"),
    "",
  ];
  return sections.join("\n");
}

export type LintFinding = { severity: string; path?: string; message: string; rule?: string };

// Runs the pinned CLI and reads its JSON report. The CLI exits with 0 even with warnings, and a
// YAML error comes as a warning without a rule, so the exit code is never enough.
export async function lintDesignMd(content: string): Promise<LintFinding[]> {
  const folder = await mkdtemp(join(tmpdir(), "elvis-design-md-"));
  try {
    const file = join(folder, DESIGN_MD);
    await writeFile(file, content);
    const { stdout } = await promisify(execFile)(CLI, ["lint", "--format", "json", file]);
    return (JSON.parse(stdout) as { findings: LintFinding[] }).findings;
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
}

// Every error and every warning outside the expected list fails, filtered by the rule field.
export function unexpectedFindings(findings: LintFinding[]): string[] {
  return findings
    .filter(
      (finding) =>
        finding.severity === "error" ||
        (finding.severity === "warning" && !EXPECTED_WARNINGS.has(finding.rule ?? "")),
    )
    .map(
      (finding) =>
        `${finding.severity} ${finding.rule ?? "(no rule)"}${finding.path ? ` at ${finding.path}` : ""}: ${finding.message}`,
    );
}
