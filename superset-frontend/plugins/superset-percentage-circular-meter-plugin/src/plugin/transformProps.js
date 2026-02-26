function formatColor(color) {
  if (!color) return undefined;
  if (typeof color === 'string') return color;
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function transformProps(chartProps) {
  const {
    width,
    height,
    formData,
    queriesData,
  } = chartProps;

  const {
    boldText = true,
    headerFontSize = 'm',
    headerText = '',
    innerRadius = 60,
    metrics = [],
    fillColor,
    backgroundColor,
    textColor,
    rowLimit = 6,
    decimalPrecision = 0,
    chartSize = 200,
    metricNameFontSize = 14,
    metricValueFontSize = 28,
  } = formData;

  const queryData = queriesData?.[0]?.data || [];

  const limitedMetrics = metrics.slice(0, rowLimit);

  const charts = limitedMetrics.map(metric => {
    const key = metric?.label || metric;
    const value = Number(queryData[0]?.[key]) || 0;

    return {
      name: key,
      value,
    };
  });

  return {
    width,
    height,
    charts,
    boldText,
    headerFontSize,
    headerText,
    innerRadius,
    decimalPrecision,
    chartSize,
    metricNameFontSize,
    metricValueFontSize,
    fillColor: formatColor(fillColor),
    backgroundColor: formatColor(backgroundColor),
    textColor: formatColor(textColor),
  };
}
