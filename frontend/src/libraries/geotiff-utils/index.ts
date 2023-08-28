import Histogram from "./Histogram";
import calculateBins from "./calculateBins";
import buildHistogram from "./buildHistogram";
import readScalarBand from "./readScalarBand";
import readColorBand from "./readColorBand";
import readLabelBand from "./readLabelBand";

export interface Label {
  value: number;
  points: number;
}

export interface LabelBandInfo {
  raster: number[];
  width: number;
  height: number;
  labels: Label[];
}

export interface ScalarBandInfo {
  raster: number[];
  width: number;
  height: number;
  histogram: Histogram;
}

export interface ColorBandInfo {
  raster: Raster[];
  width: number;
  height: number;
}

export interface ColoredBin {
  min: number;
  max: number;
  color: string;
}

export interface HtmlOrNodeCanvas {
  width: number;
  height: number;
  getContext(contextId: "2d"): any;
}

export type Domain = [number, number];

export type Raster = Uint8Array | Uint16Array | Float32Array;

export * from "./paintScalarGeotiff";
export * from "./paintColorGeotiff";
export * from "./paintLabelGeotiff";

export const NODATA_TOKEN = -999;

export { Histogram, calculateBins, buildHistogram, readScalarBand, readColorBand, readLabelBand };
