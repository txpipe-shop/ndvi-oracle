import { ScalarBandInfo, HtmlOrNodeCanvas, NODATA_TOKEN, LabelBandInfo } from ".";
import chroma from "chroma-js";

type RGBA = [number, number, number, number];

const EMPTY_COLOR: RGBA = [0, 0, 0, 0];

function computeColor(label: number): RGBA {
  if (label === NODATA_TOKEN) return EMPTY_COLOR;
  const [r, g, b] = PALETTE[label].rgb();
  return [r, g, b, 255];
}

const PALETTE = [
  chroma.hex("#E4B875"),
  chroma.hex("#903F1D"),
  chroma.hex("#D8DBE2"),
  chroma.hex("#A9BCD0"),
  chroma.hex("#5B5C62"),
  chroma.hex("#E55934"),
  chroma.hex("#BA1825")
];

export async function paintLabelGeotiff(
  band: LabelBandInfo,
  canvas: HtmlOrNodeCanvas
): Promise<void> {
  canvas.width = band.width;
  canvas.height = band.height;

  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(band.width, band.height);
  const data = imageData.data;

  let o = 0;
  for (let i = 0; i < band.raster.length; i += 1) {
    const label = band.raster[i];
    const color = computeColor(label);

    const [r, g, b, a] = color;
    data[o] = r;
    data[o + 1] = g;
    data[o + 2] = b;
    data[o + 3] = a;
    o += 4;
  }

  ctx.putImageData(imageData, 0, 0);
}
