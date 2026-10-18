// The visual reference of the Elvis: one page built only from the public entries of an installed
// version, with a sample of every semantic token, the contrast pairs, the logo files and a usage
// example. The proof consumer checks it in Chromium, and the Proof consumer workflow publishes it.

export type DtcgToken = { $type: string; $value: unknown; $description?: string };

type ContrastPair = { foreground: string; background: string; kind: string };
export type Contrast = { minimums: Record<string, number>; pairs: ContrastPair[] };

type Color = { colorSpace: string; components: number[]; alpha?: number; hex?: string };

export type ReferenceInput = {
  version: string;
  tokens: Map<string, DtcgToken>;
  contrast: Contrast | null;
  // The package files listed in the manifest, served under ASSETS.
  files: string[];
};

// The folder of the site that holds the package files.
export const ASSETS = "elvis";

const PACKAGE = "@bubbacore/elvis";
const REPOSITORY = "https://github.com/bubbacore/elvis";
const ROOT_FONT_SIZE_PX = 16;

// Section titles for the first segment of a token path. A new group appears under its own name.
const GROUPS: Record<string, string> = {
  color: "Cores",
  font: "Tipografia",
  space: "Espaçamento",
  radius: "Cantos",
  border: "Bordas",
  focus: "Foco",
  target: "Alvo de toque",
};

const KINDS: Record<string, string> = {
  text: "texto",
  "large-text": "texto grande",
  ui: "interface",
};

// The logo drawings, by file name: the form comes first and the variant after it.
const FORMS: [string, string][] = [
  ["wordmark", "Assinatura"],
  ["icon-b-feather", "b com pena"],
  ["icon-feather", "Pena"],
];
const VARIANTS: Record<string, string> = {
  color: "em cor",
  blue: "azul",
  light: "clara",
  negative: "negativa",
  monochrome: "monocromática",
  square: "em caixa quadrada",
};
// The light drawings go on the brand blue, as the usage rules say. The others go on the paper.
const ON_BLUE = new Set(["light", "negative"]);

const TITLE_SAMPLE = "Programação de hoje";
const TEXT_SAMPLE = "Sessões no Cinema do Centro a partir das 14h30, por R$ 18,00.";

export function variable(path: string): string {
  return `--bubba-${path.replaceAll(".", "-")}`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function decimal(value: number, digits?: number): string {
  return (digits === undefined ? String(value) : value.toFixed(digits)).replace(".", ",");
}

function hex(color: Color): string {
  const fallback = color.components
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
  return (color.hex ?? `#${fallback}`).toUpperCase();
}

function channel(component: number): number {
  return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
}

function luminance(color: Color): number {
  const [r = 0, g = 0, b = 0] = color.components.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: Color, b: Color): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

// The contrast pairs travel in tokens.json from 0.3.0 on. Earlier versions have none.
export function readContrast(tree: Record<string, unknown>): Contrast | null {
  const extensions = tree.$extensions as Record<string, unknown> | undefined;
  const contrast = (extensions?.[PACKAGE] as { contrast?: Contrast } | undefined)?.contrast;
  return contrast && Array.isArray(contrast.pairs) ? contrast : null;
}

function valueText(path: string, token: DtcgToken): string {
  const value = token.$value;
  switch (token.$type) {
    case "color":
      return hex(value as Color);
    case "dimension": {
      const { value: size, unit } = value as { value: number; unit: string };
      return unit === "rem" ? `${size}rem, ${size * ROOT_FONT_SIZE_PX}px` : `${size}${unit}`;
    }
    case "fontFamily":
      return (Array.isArray(value) ? value : [value]).join(", ");
    case "number":
      return path.startsWith("font.width.") ? `${value}%` : String(value);
    default:
      return String(value);
  }
}

// The family, weight, width and base size that a font token belongs to, such as title in
// font.size.title.md. The base size is the md of the family, or its first size, so a sample never
// goes below the scale of its family.
function typeface(tokens: Map<string, DtcgToken>, family: string | undefined): string[] {
  if (family === undefined || !tokens.has(`font.family.${family}`)) return [];
  const style = [`font-family: var(${variable(`font.family.${family}`)})`];
  const sizes = [...tokens.keys()].filter((path) => path.startsWith(`font.size.${family}.`));
  const size = sizes.find((path) => path.endsWith(".md")) ?? sizes[0];
  if (size !== undefined) style.push(`font-size: var(${variable(size)})`);
  if (tokens.has(`font.weight.${family}`)) {
    style.push(`font-weight: var(${variable(`font.weight.${family}`)})`);
  }
  if (tokens.has(`font.width.${family}`)) {
    style.push(`font-stretch: var(${variable(`font.width.${family}`)})`);
  }
  return style;
}

function styled(style: string[], text: string): string {
  return `<p class="type" style="${style.join("; ")}">${text}</p>`;
}

// One sample per $type. The path only refines it, so a new token of a known type shows up with no
// change here. An unknown type has no sample, and the proof reports the token.
function sample(path: string, token: DtcgToken, tokens: Map<string, DtcgToken>): string | null {
  const value = `var(${variable(path)})`;
  const [group, kind, family] = path.split(".");
  switch (token.$type) {
    case "color":
      return `<div class="swatch" style="background: ${value}"></div>`;
    case "fontFamily":
      return styled(
        [...typeface(tokens, path.split(".").at(-1)), `font-family: ${value}`],
        `${TITLE_SAMPLE}<br>Aa Bb Cc 0123456789`,
      );
    case "fontWeight":
      return styled(
        [...typeface(tokens, family), `font-weight: ${value}`],
        "Sessão das 19h00 · R$ 22,00",
      );
    case "number":
      return group === "font" && kind === "width"
        ? styled([...typeface(tokens, family), `font-stretch: ${value}`], TITLE_SAMPLE)
        : `<p class="type">${escapeHtml(String(token.$value))}</p>`;
    case "dimension":
      if (group === "font" && kind === "size") {
        const text = family === "title" ? TITLE_SAMPLE : TEXT_SAMPLE;
        return styled([...typeface(tokens, family), `font-size: ${value}`], text);
      }
      if (group === "radius") return `<div class="radius" style="border-radius: ${value}"></div>`;
      if (group === "target") {
        return `<div class="target" style="width: ${value}; height: ${value}"></div>`;
      }
      return `<div class="bar" style="width: ${value}"></div>`;
    default:
      return null;
  }
}

function copyButton(path: string): string {
  const name = variable(path);
  return `<button class="copy" type="button" data-copy="var(${name})" title="Copiar var(${name})">${name}</button>`;
}

function tokenCard(path: string, token: DtcgToken, tokens: Map<string, DtcgToken>): string {
  const shown = sample(path, token, tokens);
  if (shown === null) return "";
  const description = token.$description
    ? `<p class="description">${escapeHtml(token.$description)}</p>`
    : "";
  return `<article class="token" data-token="${escapeHtml(path)}">
  <div class="sample sample-${escapeHtml(token.$type)}">${shown}</div>
  <div class="meta">
    <h3>${escapeHtml(path)}</h3>
    <p class="value">${escapeHtml(valueText(path, token))}</p>
    ${copyButton(path)}
    ${description}
  </div>
</article>`;
}

function referencePath(reference: string): string | null {
  return /^\{([^{}]+)\}$/.exec(reference)?.[1] ?? null;
}

function contrastSection(
  contrast: Contrast,
  tokens: Map<string, DtcgToken>,
  problems: string[],
): string {
  const cards = contrast.pairs.map((pair) => {
    const label = `${pair.foreground} on ${pair.background}`;
    const foreground = referencePath(pair.foreground);
    const background = referencePath(pair.background);
    const front = foreground === null ? undefined : tokens.get(foreground);
    const back = background === null ? undefined : tokens.get(background);
    const minimum = contrast.minimums[pair.kind];
    if (foreground === null || background === null || !front || !back) {
      problems.push(`contrast pair ${label} does not cite two semantic tokens`);
      return "";
    }
    if (front.$type !== "color" || back.$type !== "color" || minimum === undefined) {
      problems.push(`contrast pair ${label} needs two colors and a known kind`);
      return "";
    }
    const ratio = contrastRatio(front.$value as Color, back.$value as Color);
    const passes = ratio >= minimum;
    if (!passes) {
      problems.push(`${label}: contrast ${ratio.toFixed(2)}:1 is below ${minimum}:1`);
    }
    const demo =
      pair.kind === "ui"
        ? `<span class="pair-ui" style="border-color: var(${variable(foreground)})"></span>`
        : `<span class="pair-${escapeHtml(pair.kind)}">Aa Sessão das 19h00</span>`;
    return `<article class="token" data-pair="${escapeHtml(`${foreground} ${background}`)}">
  <div class="pair" style="background: var(${variable(background)}); color: var(${variable(foreground)})">${demo}</div>
  <div class="meta">
    <h3>${escapeHtml(foreground)}<br><span class="muted">sobre</span> ${escapeHtml(background)}</h3>
    <p class="value">${decimal(ratio, 2)}:1, mínimo de ${decimal(minimum)}:1 para ${KINDS[pair.kind] ?? escapeHtml(pair.kind)}</p>
    <p class="verdict ${passes ? "" : "fails"}">${passes ? "Passa no WCAG 2.2 AA" : "Não passa no WCAG 2.2 AA"}</p>
  </div>
</article>`;
  });
  return `<section id="contraste">
<h2>Contraste</h2>
<p class="intro">Os pares de cor que precisam de contraste, declarados no <code>tokens.json</code>, com a razão calculada a partir das cores do pacote.</p>
<div class="grid">
${cards.join("\n")}
</div>
</section>`;
}

function drawing(file: string): { form: string; variant: string } | null {
  const name =
    file
      .split("/")
      .at(-1)
      ?.replace(/\.svg$/, "") ?? "";
  for (const [form] of FORMS) {
    if (name === form) return { form, variant: "" };
    if (name.startsWith(`${form}-`)) return { form, variant: name.slice(form.length + 1) };
  }
  return null;
}

function drawingName(form: string, variant: string): string {
  const title = FORMS.find(([name]) => name === form)?.[1] ?? form;
  return variant === "" ? title : `${title} ${VARIANTS[variant] ?? variant}`;
}

function download(file: string, label: string): string {
  return `<a href="${ASSETS}/${escapeHtml(file)}" download>${escapeHtml(label)}</a>`;
}

function drawingCard(file: string, files: string[]): string {
  const found = drawing(file);
  if (found === null) return "";
  const { form, variant } = found;
  const onBlue = ON_BLUE.has(variant);
  const stem =
    file
      .split("/")
      .at(-1)
      ?.replace(/\.svg$/, "") ?? "";
  // Only the exports have PNG versions, named after the SVG with the size at the end.
  const exported = file.startsWith("exports/svg/");
  const pngs = files
    .filter((other) => exported && new RegExp(`^exports/png/${stem}-\\d+\\.png$`).test(other))
    .map((other) => ({ file: other, size: Number(/-(\d+)\.png$/.exec(other)?.[1] ?? 0) }))
    .sort((a, b) => a.size - b.size);
  const links = [
    download(file, "SVG"),
    ...pngs.map((png) => download(png.file, `PNG ${png.size}`)),
  ];
  const name = drawingName(form, variant);
  return `<figure class="drawing">
  <div class="art ${onBlue ? "on-blue" : ""}"><img class="${form === "wordmark" ? "art-wide" : "art-square"}" src="${ASSETS}/${escapeHtml(file)}" alt="${escapeHtml(name)}"></div>
  <figcaption>
    <strong>${escapeHtml(name)}</strong>
    <span class="muted">${onBlue ? "Sobre o azul da marca" : "Sobre o papel"} · <code>${escapeHtml(file)}</code></span>
    <span class="downloads">${links.join(" ")}</span>
  </figcaption>
</figure>`;
}

function logoSection(files: string[]): string {
  const exported = files.filter((file) => /^exports\/svg\/[^/]+\.svg$/.test(file));
  const drawings = files.filter((file) => /^logo\/[^/]+\.svg$/.test(file));
  const favicons = files.filter((file) => file.startsWith("exports/favicon/"));
  const icons = favicons.map(
    (file) => `<figure class="drawing favicon">
  <div class="art"><img src="${ASSETS}/${escapeHtml(file)}" alt=""></div>
  <figcaption><code>${escapeHtml(file.split("/").at(-1) ?? file)}</code><span class="downloads">${download(file, "Baixar")}</span></figcaption>
</figure>`,
  );
  return `<section id="logo">
<h2>Logo</h2>
<p class="intro">A assinatura e os ícones com a área de proteção, cada versão sobre o fundo que as regras de uso indicam. Use os arquivos como estão.</p>
<div class="grid">
${exported.map((file) => drawingCard(file, files)).join("\n")}
</div>
<h3 class="subtitle">Desenhos sem área de proteção</h3>
<div class="grid">
${drawings.map((file) => drawingCard(file, files)).join("\n")}
</div>
<h3 class="subtitle">Favicons e atalho</h3>
<div class="grid grid-small">
${icons.join("\n")}
</div>
</section>`;
}

function filesSection(files: string[]): string {
  const others = [
    ...files.filter((file) => !file.startsWith("exports/") && !file.startsWith("logo/")),
    "manifest.json",
  ];
  const items = others.map(
    (file) =>
      `<li>${download(file, file)} <span class="muted">${PACKAGE}/${escapeHtml(file)}</span></li>`,
  );
  return `<section id="arquivos">
<h2>Arquivos do pacote</h2>
<p class="intro">Os demais arquivos desta versão, como o pacote os entrega.</p>
<ul class="files">
${items.join("\n")}
</ul>
</section>`;
}

const FOCUS_TOKENS = ["focus.width", "focus.offset", "color.focus.feather-red"];

function focusDemo(tokens: Map<string, DtcgToken>): string {
  if (!FOCUS_TOKENS.every((path) => tokens.has(path))) return "";
  return `<div class="focus-demo">
  <span class="control focused">Controle com foco</span>
  <span class="control action focused">Ação com foco</span>
</div>`;
}

const EXAMPLE = `<section id="exemplo">
<h2>Exemplo de uso</h2>
<p class="intro">Os tokens combinados numa programação de cinema.</p>
<div class="example">
  <h3>Cinema de prova</h3>
  <div class="film">
    <img src="${ASSETS}/exports/svg/icon-b-feather-color.svg" alt="">
    <div>
      <h4>Filme de prova</h4>
      <p class="muted">Dublado · 2D · 14 anos</p>
      <ul>
        <li class="past"><span class="time">14h30</span><span class="price">R$ 18,00</span></li>
        <li><span class="time">19h00</span><span class="price">R$ 22,00</span></li>
        <li><span class="time">21h45</span><span class="price">R$ 22,00</span></li>
      </ul>
    </div>
  </div>
</div>
</section>`;

const STYLE = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bubba-color-surface-paper);
    color: var(--bubba-color-text-ink);
    font-family: var(--bubba-font-family-text), sans-serif;
    font-size: var(--bubba-font-size-text-md);
    font-weight: var(--bubba-font-weight-text-regular);
    line-height: 1.5;
  }
  header, main, footer { max-width: 1120px; margin: 0 auto; padding: 0 var(--bubba-space-4); }
  @media (min-width: 720px) { header, main, footer { padding: 0 var(--bubba-space-10); } }
  h1, h2, .example h3, .example h4 {
    margin: 0;
    font-family: var(--bubba-font-family-title), serif;
    font-weight: var(--bubba-font-weight-title);
    font-stretch: var(--bubba-font-width-title);
    line-height: 1.1;
  }
  h1 { margin-top: var(--bubba-space-6); font-size: var(--bubba-font-size-title-xl); }
  h2 { margin: var(--bubba-space-12) 0 var(--bubba-space-3); font-size: var(--bubba-font-size-title-md); }
  h3 { margin: 0; font-size: var(--bubba-font-size-text-md); font-weight: var(--bubba-font-weight-text-bold); overflow-wrap: anywhere; }
  h3.subtitle { margin: var(--bubba-space-8) 0 var(--bubba-space-4); font-size: var(--bubba-font-size-text-lg); }
  a { color: var(--bubba-color-text-brand-blue); }
  code { font-family: ui-monospace, monospace; font-size: 0.9em; }
  :focus-visible {
    outline: var(--bubba-focus-width) solid var(--bubba-color-focus-feather-red);
    outline-offset: var(--bubba-focus-offset);
  }
  .muted { color: var(--bubba-color-text-ink-muted); font-weight: var(--bubba-font-weight-text-regular); }
  .wordmark { display: block; width: 160px; height: auto; margin-top: var(--bubba-space-8); }
  .lead { max-width: 64ch; margin: var(--bubba-space-4) 0 0; font-size: var(--bubba-font-size-text-lg); }
  .intro { max-width: 64ch; margin: 0 0 var(--bubba-space-5); color: var(--bubba-color-text-ink-muted); }
  .links, nav ul { display: flex; flex-wrap: wrap; gap: var(--bubba-space-2) var(--bubba-space-4); margin: var(--bubba-space-5) 0 0; padding: 0; list-style: none; }
  nav { margin-top: var(--bubba-space-5); padding-top: var(--bubba-space-4); border-top: var(--bubba-border-width) solid var(--bubba-color-border-divider); }
  nav ul { margin: 0; }
  nav a, .links a { display: inline-flex; align-items: center; min-height: var(--bubba-target-min-size); }
  .grid { display: grid; gap: var(--bubba-space-4); grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); }
  .grid-small { grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr)); }
  #tipografia .grid { grid-template-columns: 1fr; }
  .token, .drawing {
    display: flex;
    flex-direction: column;
    margin: 0;
    overflow: hidden;
    border: var(--bubba-border-width) solid var(--bubba-color-border-divider);
    border-radius: var(--bubba-radius-control);
  }
  .sample { display: flex; align-items: center; min-height: 96px; padding: var(--bubba-space-4); border-bottom: var(--bubba-border-width) solid var(--bubba-color-border-divider); overflow: hidden; }
  .sample-color { padding: 0; }
  .swatch { width: 100%; height: 112px; }
  .type { margin: 0; line-height: 1.2; overflow-wrap: anywhere; }
  .bar { height: var(--bubba-space-3); min-width: 1px; background: var(--bubba-color-action-brand-blue); }
  .radius { width: 96px; height: 64px; background: var(--bubba-color-surface-support); border: var(--bubba-border-width) solid var(--bubba-color-border-control); }
  .target { background: var(--bubba-color-surface-support); border: var(--bubba-border-width) dashed var(--bubba-color-border-control); }
  .meta { display: grid; gap: var(--bubba-space-2); align-content: start; padding: var(--bubba-space-4); }
  .value { margin: 0; color: var(--bubba-color-text-ink-muted); font-variant-numeric: tabular-nums; }
  .description { margin: 0; color: var(--bubba-color-text-ink-muted); font-size: var(--bubba-font-size-text-sm); }
  .copy {
    justify-self: start;
    min-height: var(--bubba-target-min-size);
    padding: 0 var(--bubba-space-3);
    font-family: ui-monospace, monospace;
    font-size: var(--bubba-font-size-text-sm);
    color: var(--bubba-color-text-brand-blue);
    text-align: left;
    overflow-wrap: anywhere;
    cursor: pointer;
    background: var(--bubba-color-surface-support);
    border: var(--bubba-border-width) solid var(--bubba-color-border-control);
    border-radius: var(--bubba-radius-control);
  }
  .pair { display: flex; align-items: center; justify-content: center; min-height: 96px; padding: var(--bubba-space-4); font-weight: var(--bubba-font-weight-text-bold); }
  .pair-text { font-size: var(--bubba-font-size-text-md); }
  .pair-large-text { font-size: var(--bubba-font-size-title-sm); }
  .pair-ui { width: var(--bubba-target-min-size); height: var(--bubba-target-min-size); border: 2px solid; border-radius: var(--bubba-radius-control); }
  .verdict { margin: 0; font-weight: var(--bubba-font-weight-text-bold); }
  .verdict.fails { color: var(--bubba-color-alert-feather-red); }
  .focus-demo { display: flex; flex-wrap: wrap; gap: var(--bubba-space-6); margin-top: var(--bubba-space-6); padding: var(--bubba-space-4); }
  .control {
    display: inline-flex;
    align-items: center;
    min-height: var(--bubba-target-min-size);
    padding: 0 var(--bubba-space-4);
    background: var(--bubba-color-surface-support);
    border: var(--bubba-border-width) solid var(--bubba-color-border-control);
    border-radius: var(--bubba-radius-control);
  }
  .control.action { color: var(--bubba-color-text-on-brand-blue); background: var(--bubba-color-action-brand-blue); border-color: var(--bubba-color-action-brand-blue); }
  .focused { outline: var(--bubba-focus-width) solid var(--bubba-color-focus-feather-red); outline-offset: var(--bubba-focus-offset); }
  .art { display: flex; align-items: center; justify-content: center; min-height: 160px; padding: var(--bubba-space-6); background: var(--bubba-color-surface-paper); border-bottom: var(--bubba-border-width) solid var(--bubba-color-border-divider); }
  .art.on-blue { background: var(--bubba-color-surface-brand-blue); }
  .art-wide { width: min(100%, 240px); height: auto; }
  .art-square { width: 96px; height: 96px; }
  .favicon .art { min-height: 112px; }
  .favicon img { max-width: 64px; max-height: 64px; }
  figcaption { display: grid; gap: var(--bubba-space-1); padding: var(--bubba-space-4); overflow-wrap: anywhere; }
  .downloads { display: flex; flex-wrap: wrap; gap: 0 var(--bubba-space-3); }
  .downloads a, .files a { display: inline-flex; align-items: center; min-height: var(--bubba-target-min-size); }
  .files { margin: 0; padding: 0; list-style: none; }
  .files li { display: flex; flex-wrap: wrap; align-items: center; gap: 0 var(--bubba-space-3); border-bottom: var(--bubba-border-width) solid var(--bubba-color-border-divider); }
  .example { max-width: 480px; padding: var(--bubba-space-4); border: var(--bubba-border-width) solid var(--bubba-color-border-divider); border-radius: var(--bubba-radius-control); font-variant-numeric: tabular-nums; }
  .example h3 { margin-bottom: var(--bubba-space-5); font-size: var(--bubba-font-size-title-sm); }
  .film { display: flex; gap: var(--bubba-space-3); align-items: flex-start; }
  .film img { width: 48px; height: 48px; }
  .example h4 { margin: 0 0 var(--bubba-space-2); font-size: var(--bubba-font-size-title-xs); }
  .film p { margin: 0; font-size: var(--bubba-font-size-text-sm); }
  .film ul { display: flex; flex-wrap: wrap; gap: var(--bubba-space-2); margin: var(--bubba-space-3) 0 0; padding: 0; list-style: none; }
  .film li {
    display: flex;
    gap: var(--bubba-space-2);
    align-items: center;
    min-height: var(--bubba-target-min-size);
    padding: 0 var(--bubba-space-3);
    background: var(--bubba-color-surface-support);
    border: var(--bubba-border-width) solid var(--bubba-color-border-divider);
    border-radius: var(--bubba-radius-control);
  }
  .film li.past { background: var(--bubba-color-surface-past); }
  .time { font-weight: var(--bubba-font-weight-text-bold); }
  .price { color: var(--bubba-color-text-brand-blue); font-weight: var(--bubba-font-weight-text-bold); }
  footer { margin-top: var(--bubba-space-16); padding-bottom: var(--bubba-space-8); color: var(--bubba-color-text-ink-muted); font-size: var(--bubba-font-size-text-sm); }
  .toast {
    position: fixed;
    bottom: var(--bubba-space-4);
    left: 50%;
    max-width: calc(100% - 2 * var(--bubba-space-4));
    margin: 0;
    padding: var(--bubba-space-3) var(--bubba-space-4);
    color: var(--bubba-color-surface-paper);
    background: var(--bubba-color-text-ink);
    border-radius: var(--bubba-radius-control);
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  .toast.shown { opacity: 1; }
`;

// Copies the var() of a token with one click, with no library.
const SCRIPT = `
  const status = document.getElementById("copy-status");
  let timer;
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-copy]");
    if (!button) return;
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = text + " copiado.";
    } catch {
      status.textContent = "Não foi possível copiar. Use " + text + ".";
    }
    status.classList.add("shown");
    clearTimeout(timer);
    timer = setTimeout(() => status.classList.remove("shown"), 2400);
  });
`;

export function renderReference(input: ReferenceInput): { html: string; problems: string[] } {
  const { version, tokens, contrast, files } = input;
  const problems: string[] = [];
  const groups = new Map<string, [string, DtcgToken][]>();
  for (const [path, token] of tokens) {
    const group = path.split(".")[0] ?? path;
    groups.set(group, [...(groups.get(group) ?? []), [path, token]]);
  }

  const sections: { id: string; title: string; html: string }[] = [];
  for (const [group, entries] of groups) {
    const title = GROUPS[group] ?? group;
    const id = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
    const cards = entries.map(([path, token]) => tokenCard(path, token, tokens)).join("\n");
    sections.push({
      id,
      title,
      html: `<section id="${id}">
<h2>${escapeHtml(title)}</h2>
<div class="grid">
${cards}
</div>
${group === "focus" ? focusDemo(tokens) : ""}
</section>`,
    });
    if (group === "color" && contrast) {
      sections.push({
        id: "contraste",
        title: "Contraste",
        html: contrastSection(contrast, tokens, problems),
      });
    }
  }
  sections.push(
    { id: "logo", title: "Logo", html: logoSection(files) },
    { id: "exemplo", title: "Exemplo de uso", html: EXAMPLE },
    { id: "arquivos", title: "Arquivos do pacote", html: filesSection(files) },
  );

  const wordmark = files.includes("exports/svg/wordmark-color.svg")
    ? `<img class="wordmark" src="${ASSETS}/exports/svg/wordmark-color.svg" alt="bubba">`
    : "";
  const tag = `${REPOSITORY}/blob/v${version}`;
  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Referência visual do Elvis ${escapeHtml(version)}</title>
<meta name="description" content="Os valores-base e a marca do Bubba no ${PACKAGE} ${escapeHtml(version)}.">
<link rel="icon" href="${ASSETS}/exports/favicon/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${ASSETS}/fonts.css">
<link rel="stylesheet" href="${ASSETS}/tokens.css">
<style>${STYLE}</style>
</head>
<body>
<header>
${wordmark}
<h1>Referência visual</h1>
<p class="lead">Os valores-base e a marca do Bubba no <code>${PACKAGE}</code> ${escapeHtml(version)}. Cada amostra usa só as entradas públicas do pacote. Clique numa variável para copiar o <code>var()</code> pronto para o CSS.</p>
<ul class="links">
<li><a href="${REPOSITORY}/releases/tag/v${escapeHtml(version)}">Release ${escapeHtml(version)}</a></li>
<li><a href="${tag}/usage-rules.md">Regras de uso</a></li>
<li><a href="${tag}/voice.md">Guia de voz</a></li>
<li><a href="https://www.npmjs.com/package/${PACKAGE}/v/${escapeHtml(version)}">Pacote no npm</a></li>
</ul>
<nav aria-label="Seções">
<ul>
${sections.map((section) => `<li><a href="#${section.id}">${escapeHtml(section.title)}</a></li>`).join("\n")}
</ul>
</nav>
</header>
<main>
${sections.map((section) => section.html).join("\n")}
</main>
<footer>
<p>Gerada a partir do pacote ${PACKAGE}@${escapeHtml(version)}. O layout e os componentes de cada canal ficam no próprio canal.</p>
</footer>
<p id="copy-status" class="toast" role="status" aria-live="polite"></p>
<script>${SCRIPT}</script>
</body>
</html>
`;
  return { html, problems };
}
