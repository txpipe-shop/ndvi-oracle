import { Histogram } from './';

export default function(
  bins: NdviRasterBins,
  histogram: Histogram,
  totalArea: number
): QuantifiedBin[] {

  const totalSamples = histogram.countSamples();

  return bins.map(bin => {
    const slice = histogram.slice(bin.min, bin.max);
    const sliceSmaples = slice.reduce((total, step) => total + step, 0);
    const area = (sliceSmaples / totalSamples) * totalArea;

    return {
      ...bin,
      pixels: sliceSmaples,
      area
    };
  });
}
