import {
  type ColorValue,
  type DimensionValue,
  referenceTarget,
  resolve,
  SEMANTIC_FILE,
  type TokenSet,
} from "./tokens.ts";

// WCAG 2.2 AA minimums: 1.4.3 for normal and large text, 1.4.11 for borders, indicators and focus.
const WCAG_MINIMUMS: Record<string, number> = { text: 4.5, "large-text": 3, ui: 3 };

// The approved floor for focus and touch, stricter than WCAG 2.2 AA: a focus ring at least 2 px
// thick, as in 2.4.13, and touch targets of 44 px, above the 24 px of 2.5.8.
const MINIMUM_FOCUS_WIDTH_PX = 2;
const MINIMUM_TARGET_SIZE_PX = 44;
const ROOT_FONT_SIZE_PX = 16;

const EXTENSION = "@bubbacore/elvis";

export type ContrastResult = {
  foreground: string;
  background: string;
  kind: string;
  ratio: number;
  minimum: number;
};

function channel(component: number): number {
  return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
}

function luminance(color: ColorValue): number {
  const [r = 0, g = 0, b = 0] = color.components.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: ColorValue, b: ColorValue): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

function semanticColor(set: TokenSet, reference: unknown): ColorValue | string {
  const path = referenceTarget(reference);
  if (path === null) return `${JSON.stringify(reference)} is not a token reference`;
  if (set.tokens.get(path)?.file !== SEMANTIC_FILE) return `{${path}} is not a semantic token`;
  const token = resolve(set, path);
  if (typeof token === "string") return token;
  if (token.type !== "color") return `{${path}} is not a color`;
  const color = token.value as ColorValue;
  if (color.colorSpace !== "srgb" || !color.components.every((c) => typeof c === "number")) {
    return `{${path}} must be an sRGB color with numeric components to check its contrast`;
  }
  return color;
}

// Checks every colour pair declared in the semantic tokens against the WCAG 2.2 AA minimum of its
// kind. A pair file cannot lower a minimum below WCAG.
export function checkContrast(set: TokenSet): { results: ContrastResult[]; problems: string[] } {
  const problems: string[] = [];
  const results: ContrastResult[] = [];
  const contrast = (set.extensions[EXTENSION] as { contrast?: unknown } | undefined)?.contrast as
    | { minimums?: Record<string, unknown>; pairs?: unknown }
    | undefined;
  if (!contrast || !Array.isArray(contrast.pairs) || contrast.pairs.length === 0) {
    return { results, problems: [`${SEMANTIC_FILE}: no contrast pairs declared`] };
  }
  for (const [kind, minimum] of Object.entries(WCAG_MINIMUMS)) {
    const declared = contrast.minimums?.[kind];
    if (typeof declared !== "number" || declared < minimum) {
      problems.push(`contrast minimum for ${kind} must be at least ${minimum}, found ${declared}`);
    }
  }
  for (const pair of contrast.pairs as Record<string, unknown>[]) {
    const kind = String(pair.kind);
    const minimum = WCAG_MINIMUMS[kind];
    const foreground = semanticColor(set, pair.foreground);
    const background = semanticColor(set, pair.background);
    const label = `${pair.foreground} on ${pair.background}`;
    if (minimum === undefined) {
      problems.push(`${label}: unknown kind ${JSON.stringify(pair.kind)}`);
      continue;
    }
    if (typeof foreground === "string" || typeof background === "string") {
      problems.push(`${label}: ${typeof foreground === "string" ? foreground : background}`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    const required = Math.max(minimum, Number(contrast.minimums?.[kind]) || 0);
    results.push({
      foreground: String(pair.foreground),
      background: String(pair.background),
      kind,
      ratio,
      minimum: required,
    });
    if (ratio < required) {
      problems.push(`${label}: contrast ${ratio.toFixed(2)}:1 is below ${required}:1 for ${kind}`);
    }
  }
  return { results, problems };
}

function pixels(set: TokenSet, path: string): number | string {
  const token = resolve(set, path);
  if (typeof token === "string") return token;
  if (token.type !== "dimension") return `{${path}} is not a dimension`;
  const { value, unit } = token.value as DimensionValue;
  return unit === "rem" ? value * ROOT_FONT_SIZE_PX : value;
}

// Checks the focus ring width and the minimum touch target.
export function checkSizes(set: TokenSet): string[] {
  const problems: string[] = [];
  const rules = [
    { path: "focus.width", minimum: MINIMUM_FOCUS_WIDTH_PX, what: "focus ring" },
    { path: "target.min-size", minimum: MINIMUM_TARGET_SIZE_PX, what: "touch target" },
  ];
  for (const rule of rules) {
    const size = pixels(set, rule.path);
    if (typeof size === "string") problems.push(`${rule.what}: ${size}`);
    else if (size < rule.minimum) {
      problems.push(`${rule.what} {${rule.path}} is ${size} px, below ${rule.minimum} px`);
    }
  }
  return problems;
}
