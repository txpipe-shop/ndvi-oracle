import {
  paintScalarGeotiff,
  paintColorGeotiff,
  paintLabelGeotiff,
  readColorBand,
  calculateBins,
  readScalarBand,
  readLabelBand,
  Histogram
} from '../libraries/geotiff-utils';

export interface GeotiffRender {
  dataUrl: string;
  histogram?: Histogram;
  bins?: NdviRasterBins;
  labels?: { value: number; points: number }[];
}

export type GeotiffType = 'grayscale' | 'color' | 'label';

async function renderLabelRaster(
  buffer: ArrayBuffer,
  nodata: number
): Promise<GeotiffRender> {
  const canvas = document.createElement('canvas');
  const band = await readLabelBand(buffer, nodata);

  paintLabelGeotiff(band, canvas);

  return {
    dataUrl: canvas.toDataURL(),
    labels: band.labels
  };
}

async function renderNdviRaster(
  buffer: ArrayBuffer,
  inputDomain: [number, number],
  outputDomain: [number, number],
  nodata: number,
  customBins?: NdviRasterBins | null
): Promise<GeotiffRender> {
  const canvas = document.createElement('canvas');
  const band = await readScalarBand(
    buffer,
    inputDomain,
    outputDomain,
    255,
    nodata
  );

  const finalBins = customBins || calculateBins(band.histogram);

  paintScalarGeotiff(band, canvas, finalBins);

  return {
    dataUrl: canvas.toDataURL(),
    histogram: band.histogram,
    bins: finalBins
  };
}

async function renderColorRaster(buffer: ArrayBuffer) {
  const canvas = document.createElement('canvas');
  const band = await readColorBand(buffer);

  paintColorGeotiff(band, canvas);

  return {
    dataUrl: canvas.toDataURL()
  };
}

export default async function(
  geotiffUrl: string,
  geotiffType: GeotiffType,
  inputDomain: [number, number] | null,
  outputDomain: [number, number] | null,
  nodata: number | null,
  customBins?: NdviRasterBins | null
): Promise<GeotiffRender> {
  const response = await fetch(geotiffUrl);
  const buffer = await response.arrayBuffer();

  switch (geotiffType) {
    case 'grayscale':
      return await renderNdviRaster(
        buffer,
        inputDomain as [number, number],
        outputDomain as [number, number],
        nodata as number,
        customBins
      );
    case 'color':
      return await renderColorRaster(buffer);
    case 'label':
      return await renderLabelRaster(buffer, nodata as number);
    default:
      throw new Error(`cant render geotiff type ${geotiffUrl}`);
  }
}
