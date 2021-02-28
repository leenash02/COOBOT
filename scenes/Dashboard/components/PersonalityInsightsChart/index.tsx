import React, { useEffect, useRef } from 'react';
import image from '../../../../images/machine-learning.png';
import PersonalitySunburstChart from '../../../../lib/sunburst/charts/v3-d3v4';


export default function PersonalityInsightsChart({ data }) {
  const chartRef = useRef(null);
  useEffect(() => {
    const chart = new PersonalitySunburstChart({
      element: chartRef.current,
      version: 'v3'
    });

    chart.show(data, image, null);
  }, [data]);

  return (<div ref={chartRef} />);
}