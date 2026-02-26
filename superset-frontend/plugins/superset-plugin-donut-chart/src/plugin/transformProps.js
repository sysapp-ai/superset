import { t } from '@superset-ui/core';


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
   innerRadius = '60%',
   showLabels = true,
   showLegend = true,
   metric,
   groupby,
   colorScheme = 'supersetColors',
   row_limit = 50,
   decimalPrecision = 0
 } = formData;


 // Safely get data from queries
 const queryData = queriesData?.[0]?.data || [];
  // Get metric and groupby keys safely
 const metricKey = metric?.label || metric || '';
 const groupbyKey = Array.isArray(groupby) ? groupby[0] : groupby || '';


 // Transform data with validation
 const data = queryData
   .slice(0, row_limit) // Apply row limit
   .map(item => ({
     name: String(item[groupbyKey] || t('N/A')),
     value: Number(item[metricKey]) || 0,
   }))
   .filter(item => !isNaN(item.value)); // Filter out invalid numbers


 return {
   width,
   height,
   data,
   boldText,
   headerFontSize,
   headerText,
   innerRadius,
   showLabels,
   showLegend,
   decimalPrecision,
   colorScheme,
 };
}
