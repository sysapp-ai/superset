import { buildQueryContext } from '@superset-ui/core';


// This function constructs the query configuration for Superset to execute
export default function buildQuery(formData) {
 // Destructure needed properties from formData
 const {
   cols: groupby,       
   metrics,            
   secondary_metric,   
   trend_metric,        
 } = formData;


 // Combine all metrics into a single array, handling different input formats:
 // 1. Primary metric(s) - could be array or single value
 // 2. Secondary metric (if exists)
 // 3. Trend metric (if exists)
 // Then filter out any falsy values (null/undefined)
 const allMetrics = [
   ...(Array.isArray(metrics) ? metrics : [metrics]),
   ...(Array.isArray(secondary_metric) ? secondary_metric : secondary_metric ? [secondary_metric] : []),    
   ...(trend_metric ? [trend_metric] : []),          
 ].filter(Boolean);  // Remove null/undefined values


 // Deduplicate metrics to avoid querying the same metric multiple times:
 // 1. Create a Set of unique metric identifiers (using label or string value)
 // 2. Map back to original metric objects/strings
 const dedupedMetrics = Array.from(
   new Set( 
     allMetrics.map(m =>
       typeof m === 'string' ? m : m.label || JSON.stringify(m)
     )
   )
 ).map(label => {
   // Find the original metric object that matches this label
   const original = [
     ...(Array.isArray(metrics) ? metrics : [metrics]),
     ...(Array.isArray(secondary_metric) ? secondary_metric : secondary_metric ? [secondary_metric] : []),
     trend_metric,
   ].find(m => (typeof m === 'string' ? m : m.label) === label);
  
   // Return original if found, otherwise return the label string
   return original || label;
 });


 // Build the final query context using Superset's utility function
 return buildQueryContext(formData, baseQueryObject => [
   {
     ...baseQueryObject,  // Spread all existing query properties
     groupby,            // Group by columns (if any)
     metrics: dedupedMetrics,  // Use our deduplicated metrics
   },
 ]);
}
