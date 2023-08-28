import Histogram from './Histogram'
import { ColoredBin } from '.'

export type Palette = 'heatmap'

const PALETTES = {
  heatmap: [
    '#ff2400',
    '#ff6c00',
    '#ffb600',
    '#fffe00',
    '#b8ff00',
    '#21a509',
    '#1822ad'
  ]
}

const COLORS_BY_BIN_COUNT: Record<string, number[]> = {
  '2': [0, 5],
  '3': [0, 3, 5],
  '4': [0, 2, 3, 5],
  '5': [0, 2, 3, 4, 5],
  '6': [0, 2, 3, 4, 5, 6],
  '7': [0, 1, 2, 3, 4, 5, 6]
}

export type CalculationMode = 'byscale' | 'byquantity'

function getHistogramQuantitySum(histogram: number[]): number {
  return histogram.reduce(
    (total, step) => {
      step = !isNaN(step) ? step : 0;
      return total + step;
    },
    0
  );
}

function getPaletteColor(
  name: Palette,
  binCount: number,
  binIndex: number
): string {
  const palette = PALETTES[name]
  return palette[COLORS_BY_BIN_COUNT[binCount.toString()][binIndex]]
}

function* yieldBinsByEquivalentScale(
  ndviDomain: [number, number],
  palette: Palette,
  binCount: number
): IterableIterator<ColoredBin> {
  const [globalMin, globalMax] = ndviDomain
  const binDistance = (globalMax - globalMin) / binCount

  for (let i = 0; i < binCount; i++) {
    const color = getPaletteColor(palette, binCount, i)
    const min = globalMin + binDistance * i
    const max = min + binDistance
    yield {
      color,
      min,
      max
    }
  }
}

function* yieldBinsByEquivalentQuantity(
  histogram: number[],
  ndviDomain: [number, number],
  palette: Palette,
  binCount: number
): IterableIterator<ColoredBin> {
  const total = getHistogramQuantitySum(histogram)
  const binQuantity = total / binCount
  const stepDistance = (ndviDomain[1] - ndviDomain[0]) / histogram.length

  let binIndex = 0
  let tempMin = ndviDomain[0]
  let tempMax = ndviDomain[0]
  let tempQuantity = 0

  for (let i = 0; i < histogram.length; i++) {
    tempMax += stepDistance
    tempQuantity += histogram[i]

    if (tempQuantity >= binQuantity) {
      yield {
        min: tempMin,
        max: tempMax,
        color: getPaletteColor(palette, binCount, binIndex)
      }
      binIndex += 1
      tempMin = tempMax
      tempQuantity = 0
    }
  }

  if (binIndex < binCount) {
    yield {
      min: tempMin,
      max: tempMax,
      color: getPaletteColor(palette, binCount, binIndex)
    }
  }
}

export default function(
  histogram: Histogram,
  mode: CalculationMode = 'byquantity',
  palette: Palette = 'heatmap',
  binCount: number = 4
): ColoredBin[] {
  switch (mode) {
    case 'byquantity':
      return Array.from(
        yieldBinsByEquivalentQuantity(
          histogram.data,
          histogram.domain,
          palette,
          binCount
        )
      )
    default:
      return Array.from(
        yieldBinsByEquivalentScale(histogram.domain, palette, binCount)
      )
  }
}
