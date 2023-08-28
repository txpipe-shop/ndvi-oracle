import * as React from 'react';

import { quantifyBins, Histogram } from '../utils';

interface Props {
  bins: NdviRasterBins;
  histogram: Histogram;
  totalArea: number;
  fractionDigits?: number;
  suffix?: string;
}

class LegendControl extends React.PureComponent<Props> {
  renderRow(
    index: number,
    bin: QuantifiedBin,
    fractionDigits: number = 2,
    suffix: string | null = null
  ) {
    return (
      <tr key={index}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
          <div
            className="inline-block w-4 h-4 border border-gray-400"
            style={{backgroundColor: bin.color}}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
          {bin.min.toFixed(fractionDigits)}
          {suffix}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
          {bin.max.toFixed(fractionDigits)}
          {suffix}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-800">
          {bin.area.toFixed(0)}
        </td>
      </tr>
    );
  }

  render() {
    const {
      bins,
      histogram,
      totalArea,
      fractionDigits,
      suffix
    } = this.props;

    const quantifiedBins = quantifyBins(bins, histogram, totalArea);

    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Color
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Min
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Max
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
              Area
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {quantifiedBins.map((bin, index) =>
            this.renderRow(index, bin, fractionDigits, suffix)
          )}
        </tbody>
      </table>
    );
  }
}

export default LegendControl;
