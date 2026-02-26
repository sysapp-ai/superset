import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from 'recharts';
import { styled, useTheme } from '@superset-ui/core';

// Styles
const Styles = styled.div`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.grayscale.light5 || '#ffffff'};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
`;

// Shapes
const RectangleBar = ({ fill, x, y, width, height }) => (
  <rect x={x} y={y} width={width} height={height} fill={fill} />
);

const RoundedBar = ({ fill, x, y, width, height }) => (
  <rect
    x={x}
    y={y}
    width={width}
    height={height}
    rx={Math.min(width / 3, 10)}
    ry={Math.min(width / 3, 10)}
    fill={fill}
  />
);

const TriangleBar = ({ fill, x, y, width, height }) => {
  const path = `
    M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2},${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width},${y + height}
    Z
  `;
  return <path d={path} fill={fill} />;
};

const DiamondBar = ({ fill, x, y, width, height }) => {
  const path = `
    M${x + width / 2},${y}
    L${x + width},${y + height / 2}
    L${x + width / 2},${y + height}
    L${x},${y + height / 2}
    Z
  `;
  return <path d={path} fill={fill} />;
};

const getBarShape = shape => {
  switch (shape) {
    case 'triangle':
      return TriangleBar;
    case 'rounded':
      return RoundedBar;
    case 'diamond':
      return DiamondBar;
    default:
      return RectangleBar;
  }
};

// Tooltip
const CustomTooltip = ({ active, payload, label, decimalPrecision }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #eee',
        padding: 8,
        borderRadius: 6,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 5 }} />
        {label}
      </div>

      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginTop: 6,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              background: p.stroke,
            }}
          />
          <div style={{ fontSize: 13 }}>
            {p.name}:{' '}
            <strong>
              {Number(p.value).toLocaleString(undefined, {
                minimumFractionDigits: decimalPrecision,
                maximumFractionDigits: decimalPrecision,
              })}
            </strong>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- BRIGHT GRADIENT COLOR HELPER ---
const lightenColor = (hex, amount = 40) => {
  try {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');

    const num = parseInt(c, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0xff) + amount;
    let b = (num & 0xff) + amount;

    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);

    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return hex;
  }
};

// ------------------------------------

export default function CustomShapeBarChart({
  data,
  width,
  height,
  metrics,
  decimalPrecision,
  showLegend,
  barShape,
  colors,
  showValues,
  labelColors,
}) {
  const theme = useTheme();
  const metricList = Array.isArray(metrics) ? metrics : [];
  const BarShape = getBarShape(barShape);

  const formatValue = useMemo(
    () => v => {
      if (v === 0) return '0';
      if (v === null || v === undefined || Number.isNaN(Number(v))) return 'N/A';
      return Number(v).toLocaleString(undefined, {
        minimumFractionDigits: decimalPrecision,
        maximumFractionDigits: decimalPrecision,
      });
    },
    [decimalPrecision],
  );

  if (!metricList.length) {
    return (
      <Styles height={height} width={width}>
        <div style={{ color: theme.colors.grayscale.base || '#666' }}>
          No metrics selected or available.
        </div>
      </Styles>
    );
  }

  return (
    <Styles height={height} width={width}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} />
          <YAxis
            tick={{ fontSize: 12, fill: '#666' }}
            tickFormatter={v => formatValue(v)}
          />

          <Tooltip
            content={<CustomTooltip decimalPrecision={decimalPrecision} />}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />

          {showLegend && <Legend verticalAlign="top" height={36} />}

          {/* Brighter Gradients */}
          <defs>
            {metricList.map((m, i) => {
              const base =
                labelColors?.[m] ||
                colors?.[i] ||
                theme.colors.primary.base;

              const bright1 = lightenColor(base, 20);
              const bright2 = lightenColor(base, 60);

              return (
                <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={bright1} stopOpacity={1} />
                  <stop offset="100%" stopColor={bright2} stopOpacity={1} />
                </linearGradient>
              );
            })}
          </defs>

          {/* Bars */}
          {metricList.map((m, idx) => {
            const metricColor =
              labelColors?.[m] ||
              colors?.[idx] ||
              theme.colors.primary.base;

            return (
              <Bar
                key={m}
                dataKey={m}
                name={m}
                shape={<BarShape />}
                fill={`url(#grad-${idx})`}
                stroke={metricColor}
                strokeWidth={1}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-in-out"
              >
                {showValues && (
                <LabelList
                  dataKey={m}
                  position="top"
                  formatter={formatValue}
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    fill: theme.colors.grayscale.dark2,
                  }}
                />
              )}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Styles>
  );
}

CustomShapeBarChart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  metrics: PropTypes.array,
  decimalPrecision: PropTypes.number,
  showLegend: PropTypes.bool,
  barShape: PropTypes.string,
  colors: PropTypes.array,
};

CustomShapeBarChart.defaultProps = {
  data: [],
  width: 800,
  height: 400,
  metrics: [],
  decimalPrecision: 0,
  showLegend: true,
  barShape: 'rectangle',
  colors: [],
};
