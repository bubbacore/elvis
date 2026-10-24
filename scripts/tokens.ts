import { readFile } from "node:fs/promises";

export const PRIMITIVES_FILE = "tokens/primitives.tokens.json";
export const SEMANTIC_FILE = "tokens/semantic.tokens.json";

// The token types the Elvis uses. A new type needs its value check below before it can be used.
const TYPES = ["color", "dimension", "fontFamily", "fontWeight", "number", "typography"] as const;
type TokenType = (typeof TYPES)[number];
type SimpleType = Exclude<TokenType, "typography">;

// The properties of a DTCG typography token and the type of each one.
export const TYPOGRAPHY: Record<string, SimpleType> = {
  fontFamily: "fontFamily",
  fontSize: "dimension",
  fontWeight: "fontWeight",
  letterSpacing: "dimension",
  lineHeight: "number",
};
// The width of a typography level, which DTCG does not cover, goes in the Elvis extension.
export const EXTENSION = "@bubbacore/elvis";
export const FONT_WIDTH = "fontWidth";

const COLOR_SPACES = new Set([
  "srgb",
  "srgb-linear",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "xyz-d50",
  "xyz-d65",
  "lab",
  "lch",
  "oklab",
  "oklch",
  "hsl",
  "hwb",
]);
const DIMENSION_UNITS = new Set(["px", "rem"]);
const FONT_WEIGHT_KEYWORDS = new Set([
  "thin",
  "hairline",
  "extra-light",
  "ultra-light",
  "light",
  "normal",
  "regular",
  "book",
  "medium",
  "semi-bold",
  "demi-bold",
  "bold",
  "extra-bold",
  "ultra-bold",
  "black",
  "heavy",
  "extra-black",
  "ultra-black",
]);
const TOKEN_PROPERTIES = new Set(["$value", "$type", "$description", "$extensions", "$deprecated"]);
const GROUP_PROPERTIES = new Set(["$type", "$description", "$extensions", "$deprecated"]);
const REFERENCE = /^\{([^{}]+)\}$/;

export type Token = {
  path: string;
  file: string;
  type: TokenType;
  value: unknown;
  description?: string;
  extensions?: Record<string, unknown>;
};

export type ColorValue = { colorSpace: string; components: number[]; hex?: string };
export type DimensionValue = { value: number; unit: string };

export type TokenSet = {
  tokens: Map<string, Token>;
  extensions: Record<string, unknown>;
  problems: string[];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isReference(value: unknown): boolean {
  return typeof value === "string" && REFERENCE.test(value);
}

// The parts of a composite token, each with its own type: the properties of the value and the
// font width in the extension. A simple token has none.
export function parts(token: Pick<Token, "type" | "value" | "extensions">): {
  name: string;
  type: SimpleType;
  value: unknown;
}[] {
  if (token.type !== "typography" || !isObject(token.value)) return [];
  const value = token.value;
  const found = Object.entries(TYPOGRAPHY).map(([name, type]) => ({
    name,
    type,
    value: value[name],
  }));
  const own = token.extensions?.[EXTENSION];
  if (isObject(own) && FONT_WIDTH in own) {
    found.push({ name: FONT_WIDTH, type: "number", value: own[FONT_WIDTH] });
  }
  return found;
}

function checkValue(type: TokenType, value: unknown): string | null {
  switch (type) {
    case "typography": {
      if (!isObject(value)) return "a typography value is an object";
      const names = Object.keys(TYPOGRAPHY);
      for (const key of Object.keys(value)) {
        if (!names.includes(key)) return `typography cannot contain ${key}`;
      }
      for (const [name, partType] of Object.entries(TYPOGRAPHY)) {
        if (!(name in value)) return `typography needs ${name}`;
        if (isReference(value[name])) continue;
        const problem = checkValue(partType, value[name]);
        if (problem) return `${name}: ${problem}`;
      }
      return null;
    }
    case "color": {
      if (!isObject(value)) return "a color is an object with colorSpace and components";
      const { colorSpace, components, alpha, hex } = value;
      if (typeof colorSpace !== "string" || !COLOR_SPACES.has(colorSpace)) {
        return `unknown colorSpace ${JSON.stringify(colorSpace)}`;
      }
      if (
        !Array.isArray(components) ||
        components.length !== 3 ||
        !components.every((c) => c === "none" || typeof c === "number")
      ) {
        return "components must be three numbers or none";
      }
      if (alpha !== undefined && !(typeof alpha === "number" && alpha >= 0 && alpha <= 1)) {
        return "alpha must be a number from 0 to 1";
      }
      if (hex !== undefined) {
        if (typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) {
          return "hex must have six hexadecimal digits";
        }
        if (colorSpace === "srgb" && components.every((c) => typeof c === "number")) {
          const expected = `#${components
            .map((c) =>
              Math.round(c * 255)
                .toString(16)
                .padStart(2, "0"),
            )
            .join("")}`;
          if (expected !== hex.toLowerCase())
            return `hex ${hex} does not match components (${expected})`;
        }
      }
      return null;
    }
    case "dimension":
      if (!isObject(value) || typeof value.value !== "number" || typeof value.unit !== "string") {
        return "a dimension is an object with a numeric value and a unit";
      }
      return DIMENSION_UNITS.has(value.unit) ? null : `unit must be px or rem, not ${value.unit}`;
    case "fontFamily":
      if (typeof value === "string" && value.length > 0) return null;
      if (Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === "string")) {
        return null;
      }
      return "a fontFamily is a name or a list of names";
    case "fontWeight":
      if (typeof value === "number" && value >= 1 && value <= 1000) return null;
      if (typeof value === "string" && FONT_WEIGHT_KEYWORDS.has(value)) return null;
      return "a fontWeight is a number from 1 to 1000 or a weight keyword";
    case "number":
      return typeof value === "number" && Number.isFinite(value) ? null : "a number is expected";
  }
}

function collect(
  node: Record<string, unknown>,
  file: string,
  path: string[],
  inheritedType: string | undefined,
  set: TokenSet,
): void {
  const where = `${file}: ${path.join(".") || "(root)"}`;
  const isToken = "$value" in node;
  const allowed = isToken ? TOKEN_PROPERTIES : GROUP_PROPERTIES;
  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) {
      if (!allowed.has(key)) {
        set.problems.push(`${where}: property ${key} is not allowed here`);
      }
      continue;
    }
    if (isToken) {
      set.problems.push(`${where}: a token cannot contain ${key}`);
      continue;
    }
    if (/[{}.]/.test(key)) set.problems.push(`${where}: name ${key} cannot contain {, } or .`);
    const child = node[key];
    if (!isObject(child)) {
      set.problems.push(`${where}.${key}: expected a token or a group`);
      continue;
    }
    const groupType = typeof node.$type === "string" ? node.$type : inheritedType;
    collect(child, file, [...path, key], groupType, set);
  }
  if (!isToken) return;

  const type = typeof node.$type === "string" ? node.$type : inheritedType;
  if (type === undefined || !(TYPES as readonly string[]).includes(type)) {
    set.problems.push(`${where}: unsupported or missing $type ${JSON.stringify(type)}`);
    return;
  }
  if (node.$description !== undefined && typeof node.$description !== "string") {
    set.problems.push(`${where}: $description must be text`);
  }
  const value = node.$value;
  if (!isReference(value)) {
    const problem = checkValue(type as TokenType, value);
    if (problem) set.problems.push(`${where}: ${problem}`);
  }
  const own = isObject(node.$extensions) ? node.$extensions[EXTENSION] : undefined;
  if (own !== undefined) {
    if (type !== "typography" || !isObject(own) || Object.keys(own).some((k) => k !== FONT_WIDTH)) {
      set.problems.push(`${where}: only a typography token takes ${FONT_WIDTH} in ${EXTENSION}`);
    } else if (!isReference(own[FONT_WIDTH])) {
      const problem = checkValue("number", own[FONT_WIDTH]);
      if (problem) set.problems.push(`${where}: ${FONT_WIDTH}: ${problem}`);
    }
  }
  const key = path.join(".");
  if (set.tokens.has(key)) set.problems.push(`${where}: token defined twice`);
  set.tokens.set(key, {
    path: key,
    file,
    type: type as TokenType,
    value,
    ...(typeof node.$description === "string" ? { description: node.$description } : {}),
    ...(isObject(node.$extensions) ? { extensions: node.$extensions } : {}),
  });
}

// Follows references until a literal value, or returns why it could not.
export function resolve(set: TokenSet, path: string, seen: string[] = []): Token | string {
  const token = set.tokens.get(path);
  if (!token) return `{${path}} does not exist`;
  if (seen.includes(path)) return `circular reference ${[...seen, path].join(" → ")}`;
  const match = typeof token.value === "string" ? token.value.match(REFERENCE) : null;
  if (!match?.[1]) return token;
  const target = resolve(set, match[1], [...seen, path]);
  if (typeof target === "string") return target;
  if (target.type !== token.type) {
    return `{${path}} is ${token.type} but references {${match[1]}}, which is ${target.type}`;
  }
  return target;
}

export function referenceTarget(value: unknown): string | null {
  return typeof value === "string" ? (value.match(REFERENCE)?.[1] ?? null) : null;
}

// Loads both token files and checks them against the DTCG format and the Elvis layering: the
// primitives hold raw values, and every semantic token references a primitive.
export async function loadTokens(root: string): Promise<TokenSet> {
  const set: TokenSet = { tokens: new Map(), extensions: {}, problems: [] };
  for (const file of [PRIMITIVES_FILE, SEMANTIC_FILE]) {
    const document: unknown = JSON.parse(await readFile(`${root}/${file}`, "utf8"));
    if (!isObject(document)) {
      set.problems.push(`${file}: expected a JSON object`);
      continue;
    }
    collect(document, file, [], undefined, set);
    if (file === SEMANTIC_FILE && isObject(document.$extensions)) {
      set.extensions = document.$extensions;
    }
  }

  for (const token of set.tokens.values()) {
    const composite = parts(token);
    if (composite.length > 0) {
      checkComposite(set, token, composite);
      continue;
    }
    const target = referenceTarget(token.value);
    if (token.file === PRIMITIVES_FILE && target !== null) {
      set.problems.push(
        `${token.file}: ${token.path} is a primitive and cannot reference {${target}}`,
      );
    }
    if (token.file === SEMANTIC_FILE) {
      if (target === null) {
        set.problems.push(`${token.file}: ${token.path} must reference a primitive`);
      } else if (set.tokens.has(target) && set.tokens.get(target)?.file !== PRIMITIVES_FILE) {
        set.problems.push(`${token.file}: ${token.path} references {${target}}, not a primitive`);
      }
    }
    const resolved = resolve(set, token.path);
    if (typeof resolved === "string")
      set.problems.push(`${token.file}: ${token.path}: ${resolved}`);
  }
  return set;
}

// A composite token follows the same layering, part by part: in the primitives every part is a raw
// value, and in the semantic tokens every part references a primitive of the part's type.
function checkComposite(set: TokenSet, token: Token, composite: ReturnType<typeof parts>): void {
  for (const part of composite) {
    const where = `${token.file}: ${token.path}.${part.name}`;
    const target = referenceTarget(part.value);
    if (token.file === PRIMITIVES_FILE) {
      if (target !== null)
        set.problems.push(`${where} is a primitive and cannot reference {${target}}`);
      continue;
    }
    if (target === null) {
      set.problems.push(`${where} must reference a primitive`);
      continue;
    }
    if (set.tokens.has(target) && set.tokens.get(target)?.file !== PRIMITIVES_FILE) {
      set.problems.push(`${where} references {${target}}, not a primitive`);
    }
    const resolved = resolve(set, target);
    if (typeof resolved === "string") set.problems.push(`${where}: ${resolved}`);
    else if (resolved.type !== part.type) {
      set.problems.push(`${where} must be ${part.type}, but {${target}} is ${resolved.type}`);
    }
  }
}

export function semanticTokens(set: TokenSet): Token[] {
  return [...set.tokens.values()].filter((token) => token.file === SEMANTIC_FILE);
}
