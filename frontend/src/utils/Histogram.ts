import { buildLinearRescaler } from '.';

type Domain = [number, number];
type XY = { x: number; y: number };

export default class Histogram {
  readonly data: number[];
  readonly domain: [number, number];
  readonly indexToValue: (index: number) => number;
  readonly valueToIndex: (index: number) => number;

  constructor(data: number[], domain: Domain) {
    this.data = data;
    this.domain = domain;
    this.indexToValue = buildLinearRescaler([0, data.length], domain);
    this.valueToIndex = buildLinearRescaler(domain, [0, data.length]);
  }

  get steps() {
    return this.data.length;
  }

  yieldXY(): XY[] {
    return this.data.map((y, i) => ({ x: this.indexToValue(i), y }));
  }

  trimStart(minSamples: number): Histogram {
    const startIndex = this.data.findIndex(y => y > minSamples);
    const startValue = this.indexToValue(startIndex);
    const newData = this.data.slice(startIndex);
    const newDomain: Domain = [startValue, this.domain[1]];
    return new Histogram(newData, newDomain);
  }

  trimEnd(minSamples: number): Histogram {
    const reversed = this.data.slice().reverse();
    const endGap = reversed.findIndex(y => y > minSamples);
    const endIndex = this.data.length - endGap;
    const endValue = this.indexToValue(endIndex);
    const newData = this.data.slice(0, endIndex);
    const newDomain: Domain = [this.domain[0], endValue];
    return new Histogram(newData, newDomain);
  }

  trim(minSamples: number = 6): Histogram {
    return this.trimStart(minSamples).trimEnd(minSamples);
  }

  slice(startValue: number, endValue: number): number[] {
    const startIndex = this.valueToIndex(startValue);
    const endIndex = this.valueToIndex(endValue);
    return this.data.slice(startIndex, endIndex);
  }

  countSamples(): number {
    return this.data.reduce((total, step) => total + step, 0);
  }
}
