import geotiff from "geotiff";
import buildColorScale from "./buildColorScale";
import buildLinearRescaler from "./buildLinearRescaler";
import calculateBins from "./calculateBins";
import buildHistogram from "./buildHistogram";
import { ScalarBandInfo, ColoredBin, HtmlOrNodeCanvas, NODATA_TOKEN } from ".";

type RGBA = [number, number, number, number];
type ColorScale = (intensity: number) => chroma.Color;

const EMPTY_COLOR: RGBA = [0,0,0,0];

function computeColor(intensityValue: number, colorScale: ColorScale): RGBA {
  if (intensityValue === NODATA_TOKEN) return EMPTY_COLOR;
  const [r, g, b] = colorScale(intensityValue).rgb();
  return [r, g, b, 255];
}

export async function paintScalarGeotiff(
  band: ScalarBandInfo,
  canvas: HtmlOrNodeCanvas,
  bins?: ColoredBin[]
): Promise<void> {
  canvas.width = band.width;
  canvas.height = band.height;

  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(band.width, band.height);
  const data = imageData.data;

  bins = bins || calculateBins(band.histogram);
  const colors = buildColorScale(bins);
  
  let o = 0;
  for (let i = 0; i < band.raster.length; i += 1) {
    let intensity = band.raster[i];
    const [r, g, b, a] = computeColor(intensity, colors);
    
    data[o] = r;
    data[o + 1] = g;
    data[o + 2] = b;
    data[o + 3] = a;
    o += 4;
  }

  ctx.putImageData(imageData, 0, 0);
}
