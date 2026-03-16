import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { styled } from '@superset-ui/core';

const Styles = styled('div')(({ theme, height, width }) => ({
  padding: theme.gridUnit * 4,
  height,
  width,
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  position: 'relative',
}));

export default function SupersetPercentageCircularMeterPlugin(props) {
  const {
    charts = [],
    height = 300,
    width = '100%',
    headerText,
    headerFontSize = 'm',
    boldText = true,
    innerRadius = 60,
    decimalPrecision = 0,
    fillColor = '#003f8c',
    backgroundColor = '#e6ebf2',
    textColor = 'rgba(0,0,0,0.85)',
    chartSize = 200,
    metricNameFontSize = 14,
    metricValueFontSize,
  } = props;

  const fontSizeMap = {
    xs: '12px',
    s: '14px',
    m: '16px',
    l: '18px',
    xl: '20px',
  };

  // If user sets font size → use it
  // Otherwise fallback to auto scale
  const autoValueSize = Math.max(16, chartSize * 0.18);
  const valueFontSize = metricValueFontSize || autoValueSize;

  const COLORS = [fillColor, backgroundColor];

  if (!charts.length) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No data</div>;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];

      if (data?.name === 'remaining') return null;

      return (
        <div
          style={{
            background: '#ffffff',
            padding: '6px 10px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '12px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{data.name}</div>
          <div>{data.value.toFixed(decimalPrecision)}%</div>
        </div>
      );
    }

    return null;
  };

  return (
    <Styles height={height} width={width}>
      {headerText && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: fontSizeMap[headerFontSize],
            fontWeight: boldText ? 'bold' : 'normal',
            color: textColor,
            marginBottom: '15px',
          }}
        >
          {headerText}
        </div>
      )}

      {charts.map((item, index) => {
        const percent = Number(item.value) || 0;

        const chartData = [
          { name: item.name, value: percent },
          { name: 'remaining', value: 100 - percent },
        ];

        return (
          <div
            key={index}
            style={{
              width: `${chartSize}px`,
              height: `${chartSize}px`,
              position: 'relative',
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={`${innerRadius}%`}
                  outerRadius="100%"
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i]} />
                  ))}
                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                  position={{ y: -10 }}
                  wrapperStyle={{ zIndex: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Value + Name */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: `${valueFontSize}px`,
                  fontWeight: 'bold',
                  color: textColor,
                }}
              >
                {percent.toFixed(decimalPrecision)}%
              </div>
              <div
                style={{
                  fontSize: `${metricNameFontSize}px`,
                  color: textColor,
                }}
              >
                {item.name}
              </div>
            </div>
          </div>
        );
      })}
    </Styles>
  );
}
