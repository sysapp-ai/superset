import { buildQueryContext } from '@superset-ui/core';

export default function buildQuery(formData) {
  const metrics = formData.metrics || [];

  if (metrics.length > 6) {
    throw new Error('Icon Chart supports a maximum of 6 metrics only.');
  }

  return buildQueryContext(formData, baseQueryObject => [
    {
      metrics,
      ...baseQueryObject,
    },
  ]);
}
