import { t } from '@superset-ui/core';

// This function transforms raw chart properties into a format the visualization component can use
export default function transformProps(chartProps) {
  const { width, height, formData, queriesData } = chartProps;

  const {
    headerFontSize = 60,
    subheaderFontSize = 20,
    showTrend = true,
    showSecondary = true,
    secondaryMetric,
    trendMetric,
    numberFormat = ',d',
    trendNumberFormat = ',.2f',
    showTrendIndicator = true,
    useColor = false,
    abbreviate = false,
    showPrimaryMetricName = true,
  } = formData;

  const data = queriesData[0]?.data || [];
  const current = data[0] || {};
  const previous = data[1] || {};

  let primaryMetricKey;

  if (formData.metrics && formData.metrics.length > 0) {
    primaryMetricKey =
      typeof formData.metrics[0] === 'string'
        ? formData.metrics[0]
        : formData.metrics[0]?.label;
  } else {
    primaryMetricKey = Object.keys(current)[0] || '';
  }

  // ===== Handle Secondary Metrics =====
  const secondaryMetricKeys = Array.isArray(secondaryMetric)
    ? secondaryMetric.map(m => (typeof m === 'string' ? m : m.label))
    : secondaryMetric
    ? [
        typeof secondaryMetric === 'string'
          ? secondaryMetric
          : secondaryMetric.label,
      ]
    : [];

  const availableKeys = Object.keys(current);
  const secondaryValues = secondaryMetricKeys.map(origKey => {
    let matchedKey =
      availableKeys.find(k => k === origKey) ||
      availableKeys.find(k => k.toLowerCase() === origKey.toLowerCase()) ||
      availableKeys.find(k => k.includes(origKey));

    let rawValue = matchedKey ? current[matchedKey] : null;

    let parsedValue;
    if (typeof rawValue === 'string' && rawValue.includes('%')) {
      parsedValue = rawValue.trim();
    } else if (!isNaN(Number(rawValue))) {
      parsedValue = Number(rawValue);
    } else {
      parsedValue = rawValue;
    }

    return {
      key: matchedKey || origKey,
      value: parsedValue,
    };
  });

  // ===== Trend Metric Handling =====
  let trendMetricKey =
    trendMetric &&
    (typeof trendMetric === 'string' ? trendMetric : trendMetric.label);

  let percentageChange = null;
  let trendRawValue = null;

  if (trendMetricKey && current[trendMetricKey] !== undefined) {
    percentageChange = Number(current[trendMetricKey]);
    trendRawValue = percentageChange;
  }

  // ===== Return Transformed Props =====
  return {
    width,
    height,
    currentValue: Number(current[primaryMetricKey]) || 0,
    secondaryValues,
    percentageChange,
    trendRawValue,
    secondaryLabel: '',
    trendLabel: trendMetricKey || '',
    headerFontSize,
    secondaryMetric,
    subheaderFontSize,
    showTrend,
    showSecondary,
    numberFormat,
    trendNumberFormat,
    showTrendIndicator,
    trendTooltip: '',
    useColor,
    abbreviate,
    showPrimaryMetricName,
    primaryMetricName: primaryMetricKey,
  };
}
