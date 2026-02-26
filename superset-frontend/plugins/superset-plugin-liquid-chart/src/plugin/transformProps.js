function formatColor(color) {
  if (!color) return undefined;
  if (typeof color === 'string') return color;
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function transformProps(chartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { metric, waveColor, outlineColor, fillColor, shape, precision } = formData;
  const data = queriesData[0].data || [];

  const rawValue = data[0]?.[metric.label || metric] ?? 0;

  const normalizedValue = rawValue > 1 ? rawValue / 100 : rawValue;

  return {
    width,
    height,
    value: normalizedValue,
    rawValue,
    waveColor: formatColor(waveColor),
    outlineColor: formatColor(outlineColor),
    fillColor: formatColor(fillColor),
    shape,
    precision: precision ?? 2,
  };
}
