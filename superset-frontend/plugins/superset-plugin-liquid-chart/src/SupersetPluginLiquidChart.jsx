import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-liquidfill';

export default function SupersetPluginLiquidChart(props) {
  const { width, height, value, rawValue, waveColor, fillColor, outlineColor, shape, precision } = props;
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, null, { renderer: 'svg' });
    }

    const option = {
      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: outlineColor,
        borderWidth: 1,
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        formatter: () => {
          return `
            <div style="text-align:left;">
              <b>Value:</b> ${rawValue.toFixed(precision)}% <br />
              <b>Float:</b> ${value}
            </div>
          `;
        },
      },

      series: [
        {
          type: 'liquidFill',
          data: [value],
          radius: '90%',
          shape,
          color: [waveColor],

          backgroundStyle: { color: fillColor },

          outline: {
            borderDistance: 2,
            itemStyle: {
              borderWidth: 3,
              borderColor: outlineColor,
            },
          },

          label: {
            show: true,
            formatter: `${rawValue.toFixed(precision)}%`,
            fontSize: 20,
            fontWeight: 'bold',
            color: outlineColor,
          },

          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
      ],
    };

    chartInstance.current.setOption(option, true);
    chartInstance.current.resize();
  }, [value, rawValue, waveColor, fillColor, outlineColor, shape, precision]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return <div ref={chartRef} style={{ width, height }} />;
}
