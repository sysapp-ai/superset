import { getCategoricalSchemeRegistry } from '@superset-ui/core';

export default function transformProps(chartProps) {
  const { width, height, formData, queriesData } = chartProps;

  const labelColors =
  formData?.labelColors ||   // Superset native
  chartProps?.labelColors || // fallback (rare)
  {};

  const {
    colorScheme,
    groupby,
    decimalPrecision,
    barShape,
    showLegend,
    showValues,
  } = formData;

  // normalize metrics: prefer formData.metrics, then formData.metric, else empty array
  const rawMetrics = formData.metrics && formData.metrics.length
    ? formData.metrics
    : formData.metric
    ? [formData.metric]
    : [];

  // Resolve metric key string from metric config (saved metric or adhoc)
  const resolveMetricKey = (m) => {
    if (!m) return null;
    if (typeof m === 'string') return m;
    // metric object may have different properties depending on control type
    return m.label || m.metric_name || m.sqlExpression || m.sql || null;
  };

  // If no metrics in formData, try to infer from queriesData (take all numeric columns except groupby)
  const rows = queriesData?.[0]?.data || [];
  let metricKeys = rawMetrics.map(resolveMetricKey).filter(Boolean);

  if (metricKeys.length === 0 && rows.length > 0) {
    const sample = rows[0];
    const dim = (groupby && groupby[0]) || Object.keys(sample)[0];
    metricKeys = Object.keys(sample).filter((k) => k !== dim);
    // If there is still nothing (unlikely), leave metricKeys empty
  }

  // Colors using scheme registry
  const schemeRegistry = getCategoricalSchemeRegistry();
  const colors =
    schemeRegistry.get(colorScheme)?.colors || [
      '#0088FE',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
      '#AA46BE',
      '#FF6384',
      '#333333',
    ];

  // Build wide-format data: { name: <dimension>, metric1: value, metric2: value, ... }
  const dimension = (groupby && groupby[0]) || Object.keys(rows?.[0] || {})[0] || 'name';
  const data = rows.map((row, i) => {
    const obj = { name: row[dimension] ?? `Item ${i + 1}` };
    metricKeys.forEach((mk) => {
      // try a few fallbacks for getting the value
      const v =
        row[mk] !== undefined
          ? row[mk]
          : // sometimes keys come with metric label/alias inside object:
            Object.prototype.hasOwnProperty.call(row, mk)
          ? row[mk]
          : null;
      obj[mk] = v !== null && v !== undefined && !Number.isNaN(Number(v)) ? Number(v) : 0;
    });
    return obj;
  });

  return {
    width,
    height,
    data,
    metrics: metricKeys,
    colors,
    labelColors,
    decimalPrecision: Number(decimalPrecision) || 0,
    barShape: barShape || 'rectangle',
    showLegend: Boolean(showLegend),
    showValues: Boolean(showValues),
  };
}
