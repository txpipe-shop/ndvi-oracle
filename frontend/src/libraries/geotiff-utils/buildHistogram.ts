import { Raster } from "geotiff";
import Histogram from "./Histogram";
import { Domain, NODATA_TOKEN } from ".";

function calculateInterval(domain: Domain, binCount: number) {
  const delta = domain[1] - domain[0];
  return delta / binCount;
}

function findBinIndex(value: number, domain: Domain, interval: number): number {
  const delta = value - domain[0];
  return Math.floor(delta / interval);
}

export default function buildHistogram(
  raster: number[],
  domain: Domain,
  binCount: number = 255,
): Histogram {
  const interval = calculateInterval(domain, binCount);

  const data = Array.from(Array(binCount + 1), () => 0);

  raster.forEach(value => {
    if (value === NODATA_TOKEN) return;
    const binIdx = findBinIndex(value, domain, interval);
    data[binIdx] += 1;
  });

  return new Histogram(data, domain);
}
