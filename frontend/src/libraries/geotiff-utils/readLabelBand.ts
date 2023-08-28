import geotiff from "geotiff";
import buildLabels from "./buildLabels";
import { LabelBandInfo, Domain } from ".";
import tidyupData from "./tidyupData";

export default async function(
  buffer: ArrayBuffer,
  nodata: number = 0
): Promise<LabelBandInfo> {
  const tiff = await geotiff.fromArrayBuffer(buffer);
  const band = await tiff.getImage();
  const [raster] = await band.readRasters();
  const width = band.getWidth();
  const height = band.getHeight();
  const data = tidyupData(Array.from(raster), [1, 10], [1,10], nodata);
  const labels = buildLabels(data);

  return {
    raster: data,
    width,
    height,
    labels
  };
}
