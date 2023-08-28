import { fromArrayBuffer } from "geotiff";
import buildHistogram from "./buildHistogram";
import { ScalarBandInfo, Domain } from ".";
import tidyupData from "./tidyupData";

export default async function(
  buffer: ArrayBuffer,
  inputDomain: Domain = [0, 256],
  outputDomain: Domain = [0, 1],
  binCount: number = 255,
  nodata: number = 0
): Promise<ScalarBandInfo> {
  const tiff = await fromArrayBuffer(buffer);
  const band = await tiff.getImage();
  const [raster] = await band.readRasters();
  const width = band.getWidth();
  const height = band.getHeight();
  const data = tidyupData(Array.from(raster), inputDomain, outputDomain, nodata);
  const histogram = buildHistogram(data, outputDomain, binCount);

  return {
    raster: data,
    width,
    height,
    histogram
  };
}
