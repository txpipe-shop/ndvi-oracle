import * as chroma from 'chroma-js';

const NO_COLOR = chroma.hex('#aaa');

interface ClampValues {
  minValue: number | null;
  minColor: string | null;
  maxValue: number | null;
  maxColor: string | null;
}

function getBinsClamps(bins: NdviRasterBins): ClampValues {
  const initial: ClampValues = {
    minValue: null,
    minColor: null,
    maxValue: null,
    maxColor: null
  };

  return bins.reduce(
    (total, bin) => {
      if (!total.minValue || bin.min < total.minValue) {
        total.minValue = bin.min;
        total.minColor = bin.color;
      }
      if (!total.maxValue || bin.max > total.maxValue) {
        total.maxValue = bin.max;
        total.maxColor = bin.color;
      }
      return total;
    },
    initial
  );
}

export default function(bins: NdviRasterBins): (value: number) => chroma.Color {
  return value => {
    const bin = bins.find(b => value >= b.min && value < b.max);

    if (bin) {
      return chroma.hex(bin.color);
    }

    const clamps = getBinsClamps(bins);

    if (clamps.minValue && value <= clamps.minValue) {
      return chroma.hex(clamps.minColor as string);
    }

    if (clamps.maxValue && value >= clamps.maxValue) {
      return chroma.hex(clamps.maxColor as string);
    }

    return NO_COLOR;
  };
}
