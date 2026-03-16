import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from 'recharts';
import { styled, useTheme } from '@superset-ui/core';


const ChartWrapper = styled.div`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${({ theme }) => theme.typography?.fontFamily || 'sans-serif'};
`;

const TooltipContainer = styled.div`
  background: ${({ theme }) => theme.colors?.grayscale?.light4 || '#fff'};
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors?.grayscale?.light2 || '#ccc'};
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 140px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
`;

const ColorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ color }) => color};
`;


const SimpleRadialBarChart = ({
  data,
  height,
  width,
  showLegend,
  decimalPrecision,
  barSize,
  backgroundColor,
  labelFontSize,
  labelFontWeight,
  startAngle,
  endAngle,
}) => {
  const theme = useTheme();

  const formatValue = useMemo(
    () => value => {
      if (value === 0) return '0';
      if (value == null || isNaN(value)) return 'N/A';
      return value.toLocaleString(undefined, {
        minimumFractionDigits: decimalPrecision,
        maximumFractionDigits: decimalPrecision,
      });
    },
    [decimalPrecision]
  );

  const legendStyle = useMemo(
    () => ({
      top: '50%',
      right: 0,
      transform: 'translate(0, -50%)',
      lineHeight: '24px',
      fontSize: 14,
      color: theme.colors?.grayscale?.dark2 || '#333',
    }),
    [theme]
  );

  return (
    <ChartWrapper height={height} width={width}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="80%"
          barSize={barSize}
          data={data}
          startAngle={startAngle}
          endAngle={endAngle}
        >
          <RadialBar
            minAngle={15}
            background={{ fill: backgroundColor }}
            clockWise
            dataKey="value"
          >
            <LabelList
              dataKey="value"
              position="insideStart"
              fill="#fff"
              fontSize={labelFontSize}
              fontWeight={labelFontWeight}
              formatter={formatValue}
            />
          </RadialBar>

          <Tooltip
            wrapperStyle={{ outline: 'none' }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const { name = 'N/A', metricName = 'Value', value = 0, fill } =
                payload[0]?.payload || {};
              return (
                <TooltipContainer>
                  <TooltipRow>
                    <ColorDot color={fill || theme.colors?.primary?.base || '#1890ff'} />
                    <span style={{ fontWeight: 600 }}>{name}</span>
                  </TooltipRow>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ fontWeight: 500 }}>{metricName}: </span>
                    <strong>{formatValue(value)}</strong>
                  </div>
                </TooltipContainer>
              );
            }}
          />

          {showLegend && (
            <Legend
              iconType="circle"
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={legendStyle}
            />
          )}
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};


SimpleRadialBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number,
      metricName: PropTypes.string,
      fill: PropTypes.string,
    })
  ).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  showLegend: PropTypes.bool,
  decimalPrecision: PropTypes.number,
  barSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  labelFontSize: PropTypes.number,
  labelFontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  startAngle: PropTypes.number,
  endAngle: PropTypes.number,
};

SimpleRadialBarChart.defaultProps = {
  showLegend: true,
  decimalPrecision: 0,
  barSize: 18,
  backgroundColor: '#eee',
  labelFontSize: 12,
  labelFontWeight: 600,
  startAngle: 90,
  endAngle: -270,
};

export default SimpleRadialBarChart;
