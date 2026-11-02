import { readFile } from "node:fs/promises";
import { Resvg } from "@resvg/resvg-js";

// Every vector export is a drawing from logo/ placed in a frame that adds the protection area: 1x on
// every side, where x is the diameter of one pupil of the icon at the scale of the drawing, as in
// materials/brand/proposals/clear-space/measurements.json. The frames are in drawing units.
type Frame = { x: number; y: number; width: number; height: number };

type Family = {
  name: string;
  pupil: number;
  pngWidths: number[];
};

const FAMILIES: Family[] = [
  { name: "icon", pupil: 49.388, pngWidths: [32, 48, 64, 128, 256, 512] },
  { name: "horizontal-lockup", pupil: 26.147, pngWidths: [512, 1024, 2048] },
  { name: "vertical-lockup", pupil: 40.301, pngWidths: [256, 512, 1024] },
  { name: "wordmark", pupil: 26.147, pngWidths: [512, 1024, 2048] },
];

// Each family has its own drawing in logo/ for each ink: #050505 on light backgrounds and white on
// dark ones.
const VARIANTS = ["black", "white"];

// The Bubba in 3D, as approved, for the moments of the character and the link previews.
const CHARACTER = {
  source: "logo/bubba-3d.png",
  pngWidths: [256, 512, 1024],
};

// The character on the blue halo: seven radial spots in the three blues, blurred by 14 px and
// transparent before the edges, with the character at 40% of the frame width. The frame is in CSS
// pixels; each spot is an ellipse with its centre and radii as fractions of the frame, and its
// colour at full, 55% and no strength.
const HALO = {
  width: 480,
  height: 360,
  blur: 14,
  character: 0.4,
  pngWidths: [480, 960],
  spots: [
    { cx: 0.34, cy: 0.34, rx: 0.13, ry: 0.2, rgb: "#7190BC", opacity: [0.3, 0.12] },
    { cx: 0.67, cy: 0.64, rx: 0.15, ry: 0.1, rgb: "#7190BC", opacity: [0.26, 0.1] },
    { cx: 0.6, cy: 0.3, rx: 0.24, ry: 0.14, rgb: "#A5BBDB", opacity: [0.5, 0.2] },
    { cx: 0.27, cy: 0.58, rx: 0.17, ry: 0.27, rgb: "#A5BBDB", opacity: [0.42, 0.16] },
    { cx: 0.5, cy: 0.52, rx: 0.3, ry: 0.22, rgb: "#C9D6E9", opacity: [0.7, 0.3] },
    { cx: 0.73, cy: 0.46, rx: 0.14, ry: 0.22, rgb: "#C9D6E9", opacity: [0.62, 0.24] },
    { cx: 0.44, cy: 0.72, rx: 0.26, ry: 0.12, rgb: "#A5BBDB", opacity: [0.34, 0.12] },
  ],
};

// The favicon is the vector icon from logo/, as approved, centred in a square. The SVG is
// transparent and turns the ink white when the browser uses a dark theme; the PNGs and the ICO keep
// the #050505 ink, without a plate.
const FAVICON = {
  source: "logo/icon-black.svg",
  dark: "#FFFFFF",
  pngWidths: [16, 32, 48],
};

// The shortcut icon keeps the full icon in #050505, 126 px wide, centred on a 180 px plate.
const APPLE_TOUCH = { size: 180, iconWidth: 126, plate: "#F7F7F7", source: "logo/icon-black.svg" };

export type ExportFile = { path: string; kind: "svg" | "png" | "ico"; data: Buffer };

const SVG_OPEN = /^<svg [^>]*>/;
const VIEW_BOX = /viewBox="([^"]+)"/;

function formatNumber(value: number): string {
  return String(Number(value.toFixed(4)));
}

function parseDrawing(svg: string, source: string): { body: string; viewBox: Frame } {
  const open = svg.match(SVG_OPEN);
  if (!open || !svg.endsWith("</svg>\n")) {
    throw new Error(`${source}: expected a single <svg> element followed by a newline`);
  }
  const box = open[0].match(VIEW_BOX)?.[1]?.split(/\s+/).map(Number);
  if (box?.length !== 4 || box.some(Number.isNaN)) {
    throw new Error(`${source}: expected a viewBox with four numbers`);
  }
  const [x, y, width, height] = box as [number, number, number, number];
  return { body: svg.slice(open[0].length, -"</svg>\n".length), viewBox: { x, y, width, height } };
}

function withProtection(box: Frame, pupil: number): Frame {
  return {
    x: box.x - pupil,
    y: box.y - pupil,
    width: box.width + 2 * pupil,
    height: box.height + 2 * pupil,
  };
}

function svgDocument(frame: Frame, body: string, viewBox = frame): string {
  const width = formatNumber(frame.width);
  const height = formatNumber(frame.height);
  const box = [viewBox.x, viewBox.y, viewBox.width, viewBox.height].map(formatNumber).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${box}" fill="none">${body}</svg>\n`;
}

function renderPng(svg: string, width: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

function pngImage(png: Buffer, frame: Frame): string {
  const box = [frame.x, frame.y, frame.width, frame.height].map(formatNumber);
  return `<image x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" href="data:image/png;base64,${png.toString("base64")}"/>`;
}

function haloDocument(character: Buffer): string {
  const { width, height } = HALO;
  const gradients = HALO.spots.map((spot, index) => {
    const [strong, middle] = spot.opacity;
    const move = `translate(${formatNumber(spot.cx * width)} ${formatNumber(spot.cy * height)})`;
    const scale = `scale(${formatNumber(spot.rx * width)} ${formatNumber(spot.ry * height)})`;
    return `<radialGradient id="spot-${index}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="${move} ${scale}"><stop offset="0" stop-color="${spot.rgb}" stop-opacity="${strong}"/><stop offset="0.55" stop-color="${spot.rgb}" stop-opacity="${middle}"/><stop offset="1" stop-color="${spot.rgb}" stop-opacity="0"/></radialGradient>`;
  });
  // The first spot is painted last, on top, as in a CSS background list.
  const spots = HALO.spots
    .map((_, index) => `<rect width="${width}" height="${height}" fill="url(#spot-${index})"/>`)
    .reverse();
  const side = width * HALO.character;
  const place = { x: (width - side) / 2, y: (height - side) / 2, width: side, height: side };
  return svgDocument(
    { x: 0, y: 0, width, height },
    `<defs>${gradients.join("")}<filter id="blur" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${HALO.blur}"/></filter></defs><g filter="url(#blur)">${spots.join("")}</g>${pngImage(character, place)}`,
  );
}

function squareFrame(box: Frame): Frame {
  const side = Math.max(box.width, box.height);
  return {
    x: box.x - (side - box.width) / 2,
    y: box.y - (side - box.height) / 2,
    width: side,
    height: side,
  };
}

function faviconDocument(icon: { body: string; viewBox: Frame }, dark: boolean): string {
  const style = dark
    ? `<style>@media (prefers-color-scheme: dark) { path { fill: ${FAVICON.dark} } }</style>`
    : "";
  const square = squareFrame(icon.viewBox);
  return svgDocument(square, `${style}${icon.body}`);
}

function appleTouchDocument(icon: { body: string; viewBox: Frame }): string {
  const { size, iconWidth, plate } = APPLE_TOUCH;
  const height = (iconWidth * icon.viewBox.height) / icon.viewBox.width;
  const place = [(size - iconWidth) / 2, (size - height) / 2, iconWidth, height].map(formatNumber);
  const box = [icon.viewBox.x, icon.viewBox.y, icon.viewBox.width, icon.viewBox.height]
    .map(formatNumber)
    .join(" ");
  return svgDocument(
    { x: 0, y: 0, width: size, height: size },
    `<rect width="${size}" height="${size}" fill="${plate}"/><svg x="${place[0]}" y="${place[1]}" width="${place[2]}" height="${place[3]}" viewBox="${box}">${icon.body}</svg>`,
  );
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
  const read = async (source: string) =>
    parseDrawing(await readFile(`${root}/${source}`, "utf8"), source);

  for (const family of FAMILIES) {
    for (const variant of VARIANTS) {
      const { body, viewBox } = await read(`logo/${family.name}-${variant}.svg`);
      const svg = svgDocument(withProtection(viewBox, family.pupil), body);
      const name = `${family.name}-${variant}`;
      files.push({ path: `exports/svg/${name}.svg`, kind: "svg", data: Buffer.from(svg) });
      for (const width of family.pngWidths) {
        const data = renderPng(svg, width);
        files.push({ path: `exports/png/${name}-${width}.png`, kind: "png", data });
      }
    }
  }

  const character = await readFile(`${root}/${CHARACTER.source}`);
  const square = { x: 0, y: 0, width: 1, height: 1 };
  const characterSvg = svgDocument(square, pngImage(character, square));
  for (const width of CHARACTER.pngWidths) {
    const data = renderPng(characterSvg, width);
    files.push({ path: `exports/png/bubba-3d-${width}.png`, kind: "png", data });
  }
  const halo = haloDocument(character);
  for (const width of HALO.pngWidths) {
    const data = renderPng(halo, width);
    files.push({ path: `exports/png/bubba-3d-halo-${width}.png`, kind: "png", data });
  }

  const icon = await read(FAVICON.source);
  files.push({
    path: "exports/favicon/favicon.svg",
    kind: "svg",
    data: Buffer.from(faviconDocument(icon, true)),
  });
  // The PNGs come from the same document without the dark-theme style, so they keep the ink.
  const light = faviconDocument(icon, false);
  const faviconPngs = FAVICON.pngWidths.map((width) => ({ width, data: renderPng(light, width) }));
  for (const png of faviconPngs) {
    files.push({ path: `exports/favicon/favicon-${png.width}.png`, kind: "png", data: png.data });
  }
  files.push({ path: "exports/favicon/favicon.ico", kind: "ico", data: icoFile(faviconPngs) });
  files.push({
    path: "exports/favicon/apple-touch-icon.png",
    kind: "png",
    data: renderPng(appleTouchDocument(await read(APPLE_TOUCH.source)), APPLE_TOUCH.size),
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
