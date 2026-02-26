import { buildQueryContext } from '@superset-ui/core';

export default function buildQuery(formData) {
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      metrics: formData.metrics,
      groupby: formData.groupby,
      adhoc_filters: formData.adhoc_filters,
      row_limit: formData.limit
        ? parseInt(formData.limit, 10)
        : formData.row_limit,
    },
    {
      ...baseQueryObject,
      metrics: formData.metrics_2,
      groupby: formData.groupby_2,
      adhoc_filters: formData.adhoc_filters_2,
      row_limit: formData.limit_2
        ? parseInt(formData.limit_2, 10)
        : formData.row_limit_2,
    },
  ]);
}
