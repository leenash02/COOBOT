import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as React from 'react';

export interface IBarChartProps {
  data: object[],
  dataKey1: string,
  dataKey2: string,
  width: number,
  height: number
}

const CustomBarChart: React.SFC<IBarChartProps> = ({ data, dataKey1, dataKey2, width, height }) => {
  return (
    <BarChart width={width} height={height} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" stroke="#37a3b2" />
      <YAxis yAxisId="right" orientation="right" stroke="#ffb98c" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey={dataKey1} fill="#37a3b2" unit="%" />
      <Bar yAxisId="right" dataKey={dataKey2} fill="#ffb98c" unit="%" />
    </BarChart>
  );
};

export default CustomBarChart;
