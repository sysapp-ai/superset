export default function transformProps(chartProps) {
 const { width, height, formData, queriesData } = chartProps;
 const {
   headerText,
   showValues,
   barHeight,
   groupby,
   metric,
   showPercentage,
   showCategoryTitles,
   colorScheme,
 } = formData;

 // Validate and normalize input data
 const categoryColumns = Array.isArray(groupby) ? groupby.filter(Boolean) : [groupby].filter(Boolean);
 const metricKey = metric?.label || metric;

 let data = [];
 let categories = [];
 let hasData = false;

 if (queriesData[0]?.data?.length > 0) {
   try {
     data = queriesData[0].data.flatMap(item => {
       return categoryColumns.map(category => ({
         category: String(category),
         name: String(item[category] || 'N/A'),
         value: Number(item[metricKey] || 0),
       }));
     });
    
     categories = [...new Set(categoryColumns)]; // Remove duplicates
     hasData = true;
   } catch (error) {
     console.error('Error processing data:', error);
   }
 }

 // Fallback to sample data if no valid data found
 if (!hasData) {
   data = [
     { category: 'Category 1', name: 'Sample 1', value: 75 },
     { category: 'Category 1', name: 'Sample 2', value: 45 },
     { category: 'Category 2', name: 'Sample A', value: 60 },
     { category: 'Category 2', name: 'Sample B', value: 30 }
   ];
   categories = ['Category 1', 'Category 2'];
 }

 return {
   width,
   height,
   data,
   categories,
   headerText,
   showValues,
   showPercentage: showPercentage !== false,
   showCategoryTitles: showCategoryTitles !== false,
   barHeight: Math.max(5, Math.min(50, barHeight || 20)),
   colorScheme,
 };
}
