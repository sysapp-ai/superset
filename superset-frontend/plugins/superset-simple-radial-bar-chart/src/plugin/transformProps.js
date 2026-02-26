import { getCategoricalSchemeRegistry } from '@superset-ui/core';

export default function transformProps(chartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { colorScheme, groupby, metric, decimalPrecision, showLegend } = formData;

  const schemeRegistry = getCategoricalSchemeRegistry();
  const colors =
    schemeRegistry.get(colorScheme)?.colors || [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#8884d8',
      '#82ca9d',
    ];

  const metricKey =
    typeof metric === 'object'
      ? metric.label || metric.sqlExpression || metric.metric_name
      : typeof metric === 'string'
      ? metric
      : Object.keys(queriesData?.[0]?.data?.[0] || {})[1];

  const metricLabel =
    typeof metric === 'object' ? metric.label || metric.metric_name : metricKey;

  const data = (queriesData?.[0]?.data || []).map((d, i) => ({
    name: d[groupby?.[0]] || `Item ${i + 1}`,
    value: Number(d[metricKey]) || 0,
    fill: colors[i % colors.length],
    metricName: metricLabel,
  }));

  return {
    width,
    height,
    data,
    decimalPrecision: Number(decimalPrecision) || 0,
    showLegend: !!showLegend,
  };
}
