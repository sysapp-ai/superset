import { buildQueryContext } from '@superset-ui/core';

export default function buildQuery(formData) {
  const { cols: groupby } = formData;
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      groupby,
    },
  ]);
}
