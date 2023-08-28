import { Domain, NODATA_TOKEN } from ".";
import buildLinearRescaler from "./buildLinearRescaler";

function clampOutsiders(raster: number[], domain: Domain): number[] {
  return raster.map(value => {
    if (value < domain[0]) {
      return domain[0];
    }
    if (value > domain[1]) {
      return domain[1];
    }
    return value;
  });
}

function domainEquals(a: Domain, b: Domain): boolean {
  const [a0, a1] = a;
  const [b0, b1] = b;
  return a0 === b0 && a1 === b1;
}

function dropOutsiders(raster: number[], domain: Domain): number[] {
  return raster.map(value => {
    const isOutsider = value < domain[0] && value > domain[1];
    return isOutsider ? NODATA_TOKEN : value;
  });
}

function replaceNoData(raster: number[], nodata: number): number[] {
  return raster.map(value => {
    return value != nodata ? value : NODATA_TOKEN;
  });
}

function rescaleDomain(raster: number[], inputDomain: Domain, outputDomain: Domain): number[] {
  if (domainEquals(inputDomain, outputDomain)) {
    return raster;
  }
  const rescale = buildLinearRescaler(inputDomain, outputDomain);
  return raster.map(value => {
    if (value === NODATA_TOKEN) return NODATA_TOKEN;
    return rescale(value);
  });
}

export default function(
  raster: number[],
  inputDomain: Domain,
  outputDomain: Domain,
  nodata: number = 0
): number[] {
  let values = raster;
  values = replaceNoData(values, nodata);
  values = rescaleDomain(values, inputDomain, outputDomain);
  values = dropOutsiders(values, outputDomain);
  return values;
}
