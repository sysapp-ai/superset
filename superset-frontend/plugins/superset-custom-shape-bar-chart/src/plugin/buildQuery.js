import { buildQueryContext } from '@superset-ui/core';

export default function buildQuery(formData) {
  // Accept either a multi-metric control ("metrics") or the legacy single "metric"
  const metrics = formData.metrics || (formData.metric ? [formData.metric] : []);

  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      groupby: formData.cols || formData.groupby || [],
      metrics,
    },
  ]);
}
