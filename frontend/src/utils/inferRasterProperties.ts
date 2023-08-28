import { GeotiffType } from './renderGeotiffRaster';

interface Config {
  type: GeotiffType;
  inputDomain: [number, number] | null;
  outputDomain: [number, number] | null;
  nodata: number;
}

const DEFAULT_CONFIGS: Record<string, Config> = {
  'raster-ndvi': {
    type: 'grayscale',
    outputDomain: [0, 1],
    inputDomain: [1, 255],
    nodata: 0
  },
  'yield-analysis': {
    type: 'grayscale',
    outputDomain: [0, 2],
    inputDomain: [1, 255],
    nodata: 0
  },
  'raster-dem': {
    type: 'grayscale',
    outputDomain: [100, 300],
    inputDomain: [100, 300],
    nodata: 0
  },
  'raster-slope': {
    type: 'grayscale',
    outputDomain: [0, 1],
    inputDomain: [0, 1],
    nodata: 0
  },
  'raster-truecolor': {
    type: 'color',
    outputDomain: null,
    inputDomain: null,
    nodata: 0
  },
  'raster-falsecolor': {
    type: 'color',
    outputDomain: null,
    inputDomain: null,
    nodata: 0
  }
};

export default function(document: RasterDocument): Config {
  return DEFAULT_CONFIGS[document.kind];
}
