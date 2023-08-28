import * as React from 'react';

import {
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

import { buildColorScale } from '../utils';
import Histogram from '../utils/Histogram';

interface Props {
  bins: NdviRasterBins;
  histogram: Histogram;
  width: string | number;
  height: string | number;
}

export default class HistogramChart extends React.Component<Props> {
  render() {
    const { histogram, bins, width, height } = this.props;
    const data = histogram.yieldXY();
    const colors = buildColorScale(bins);

    return (
      <ResponsiveContainer width={width} height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="y">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                strokeWidth={0}
                fill={colors(entry.x).hex()}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
