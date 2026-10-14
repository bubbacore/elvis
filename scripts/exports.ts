import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

// Every export is a drawing from logo/ placed in its approved frame, which already includes the
// protection area from usage-rules.md. The frames are in drawing units, as in the viewBox.
type Frame = { x: number; y: number; width: number; height: number };

type Family = {
  name: string;
  source: string;
  frame: Frame;
  pngWidths: number[];
};

const FAMILIES: Family[] = [
  {
    name: "wordmark",
    source: "logo/wordmark.svg",
    frame: { x: -19.2, y: -19.2, width: 317.4, height: 129.4 },
    pngWidths: [512, 1024, 2048],
  },
  {
    name: "icon-b-feather",
    source: "logo/icon-b-feather.svg",
    frame: { x: -21.17, y: -10.52, width: 116, height: 116 },
    pngWidths: [32, 48, 64, 128, 256, 512],
  },
  {
    name: "icon-feather",
    source: "logo/icon-feather.svg",
    frame: { x: -10.69, y: -33.16, width: 96, height: 96 },
    pngWidths: [32, 48, 64, 128, 256, 512],
  },
];

// The one-colour versions repaint every path with the fill of logo/*-monochrome.svg (blue) or
// logo/*-negative.svg (light). The colour version keeps the drawing's own fills.
const VARIANTS: { name: string; fill: string | null }[] = [
  { name: "color", fill: null },
  { name: "blue", fill: "#011D97" },
  { name: "light", fill: "#F7F7F2" },
];

// The favicon is the b with feather on a rounded light plate, so it reads on any browser tab.
const FAVICON = {
  family: "icon-b-feather",
  plate: "#F7F7F2",
  radius: 16,
  pngWidths: [16, 32, 48, 192, 512],
  icoWidths: [16, 32, 48],
  appleTouchWidth: 180,
};

export type ExportFile = { path: string; kind: "svg" | "png" | "ico"; data: Buffer };

const SVG_OPEN = /^<svg [^>]*>/;

function formatNumber(value: number): string {
  return String(Number(value.toFixed(4)));
}

function drawingBody(svg: string, source: string): string {
  const open = svg.match(SVG_OPEN);
  if (!open || !svg.endsWith("</svg>\n")) {
    throw new Error(`${source}: expected a single <svg> element followed by a newline`);
  }
  return svg.slice(open[0].length, -"</svg>\n".length);
}

function svgDocument(frame: Frame, body: string, viewBox = frame): string {
  const width = formatNumber(frame.width);
  const height = formatNumber(frame.height);
  const box = [viewBox.x, viewBox.y, viewBox.width, viewBox.height].map(formatNumber).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${box}" fill="none">${body}</svg>\n`;
}

function repaint(body: string, fill: string | null): string {
  return fill === null ? body : body.replace(/fill="#[0-9A-Fa-f]{6}"/g, `fill="${fill}"`);
}

function renderPng(svg: string, width: number, background?: string): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { loadSystemFonts: false },
    ...(background ? { background } : {}),
  });
  return resvg.render().asPng();
}

// An ICO file that embeds each PNG as is, which every current browser reads.
function icoFile(pngs: { width: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((png, index) => {
    const entry = 6 + 16 * index;
    header.writeUInt8(png.width >= 256 ? 0 : png.width, entry);
    header.writeUInt8(png.width >= 256 ? 0 : png.width, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(png.data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.data.length;
  });
  return Buffer.concat([header, ...pngs.map((png) => png.data)]);
}

// Renders every export from the drawings in logo/, with the paths the package publishes.
export async function renderExports(root: string): Promise<ExportFile[]> {
  const files: ExportFile[] = [];
  const bodies = new Map<string, string>();

  for (const family of FAMILIES) {
    const body = drawingBody(await readFile(`${root}/${family.source}`, "utf8"), family.source);
    bodies.set(family.name, body);
    for (const variant of VARIANTS) {
      const svg = svgDocument(family.frame, repaint(body, variant.fill));
      const name = `${family.name}-${variant.name}`;
      files.push({ path: `exports/svg/${name}.svg`, kind: "svg", data: Buffer.from(svg) });
      for (const width of family.pngWidths) {
        const data = renderPng(svg, width);
        files.push({ path: `exports/png/${name}-${width}.png`, kind: "png", data });
      }
    }
  }

  const icon = FAMILIES.find((family) => family.name === FAVICON.family);
  const iconBody = bodies.get(FAVICON.family);
  if (!icon || iconBody === undefined) throw new Error(`unknown favicon family ${FAVICON.family}`);
  const plate = { x: 0, y: 0, width: icon.frame.width, height: icon.frame.height };
  const move = `${formatNumber(-icon.frame.x)} ${formatNumber(-icon.frame.y)}`;
  const favicon = svgDocument(
    plate,
    `<rect x="0" y="0" width="${formatNumber(plate.width)}" height="${formatNumber(plate.height)}" rx="${FAVICON.radius}" fill="${FAVICON.plate}" /><g transform="translate(${move})">${iconBody}</g>`,
  );
  files.push({ path: "exports/favicon/favicon.svg", kind: "svg", data: Buffer.from(favicon) });

  const faviconPngs = FAVICON.pngWidths.map((width) => ({
    width,
    data: renderPng(favicon, width),
  }));
  for (const png of faviconPngs) {
    files.push({ path: `exports/favicon/favicon-${png.width}.png`, kind: "png", data: png.data });
  }
  const icoPngs = faviconPngs.filter((png) => FAVICON.icoWidths.includes(png.width));
  files.push({ path: "exports/favicon/favicon.ico", kind: "ico", data: icoFile(icoPngs) });
  files.push({
    path: "exports/favicon/apple-touch-icon.png",
    kind: "png",
    data: renderPng(favicon, FAVICON.appleTouchWidth, FAVICON.plate),
  });

  return files;
}

// Reads the PNG images embedded in an ICO file, keyed by width.
export function icoImages(ico: Buffer): Map<number, Buffer> {
  const images = new Map<number, Buffer>();
  const count = ico.readUInt16LE(4);
  for (let index = 0; index < count; index++) {
    const entry = 6 + 16 * index;
    const width = ico.readUInt8(entry) || 256;
    const size = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    images.set(width, ico.subarray(offset, offset + size));
  }
  return images;
}
