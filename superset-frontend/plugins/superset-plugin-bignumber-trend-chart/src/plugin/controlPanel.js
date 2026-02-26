import { t, validateNonEmpty } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';


export default {
 controlPanelSections: [ 
   // ===================== QUERY SECTION =====================
   {
     label: t('Query'), 
     expanded: true,   
     controlSetRows: [  
       // Primary Metric
       [
         {
           name: 'metrics',
           config: {
             ...sharedControls.metrics,  // Reuse standard metric selector
             label: t('Primary Metric'),
             description: t('The main metric to display as the big number'),
             validators: [validateNonEmpty],  // Must have a value
             multi: false,  // Only one metric allowed
           },
         },
       ],
       // Secondary Metric
       [
         {
           name: 'secondary_metric',
           config: {
             ...sharedControls.metrics,
             label: t('Secondary Metric'),
             description: t('A secondary metric to display below the big number (optional)'),
             multi: true, // Allow multiple selections
             default: null, 
             clearable: true, 
             validators: [],  // No validation required (optional field)
           },
         },
       ],
       // Trend Metric
       [
         {
           name: 'trend_metric',
           config: {
             ...sharedControls.metrics,
             label: t('Trend Metric'),
             description: t('Metric to use for trend % calculation (optional, otherwise uses primary metric)'),
             multi: false,
             default: null,
             clearable: true,
             validators: [],
           },
         },
       ],
       // Standard Superset filters
       ['adhoc_filters'],  // Reusable filter component
       ['row_limit'],     // Reusable row limit component
     ],
   },


   // ===================== CHART OPTIONS SECTION =====================
   {
     label: t('Chart Options'),
     expanded: true,
     controlSetRows: [
       // Header Font Size Slider
       [
         {
           name: 'header_font_size',
           config: {
             type: 'SliderControl',
             label: t('Header Font Size'),
             description: t('Font size for the main value'),
             default: 60, 
             min: 20,     
             max: 120,    
             step: 2,    
             renderTrigger: true, 
           },
         },
       ],
       // Subheader Font Size Slider
       [
         {
           name: 'subheader_font_size',
           config: {
             type: 'SliderControl',
             label: t('Subheader Font Size'),
             description: t('Font size for comparison and labels'),
             default: 20,
             min: 10,
             max: 40,
             step: 1,
             renderTrigger: true,
           },
         },
       ],
       // Toggle: Show Primary Metric Name
       [
         {
           name: 'show_primary_metric_name',
           config: {
             type: 'CheckboxControl', 
             label: t('Show Primary Metric Name'),
             default: true, 
             renderTrigger: true,
             description: t('Whether to display the primary metric name above the big number'),
           },
         },
       ],
       // Toggle: Show Secondary Metric
       [
         {
           name: 'show_secondary',
           config: {
             type: 'CheckboxControl',
             label: t('Show Secondary Metric'),
             default: true,
             renderTrigger: true,
             description: t('Whether to display the secondary metric below the big number'),
           },
         },
       ],
       // Toggle: Show Trend
       [
         {
           name: 'show_trend',
           config: {
             type: 'CheckboxControl',
             label: t('Show Trend'),
             default: true,
             renderTrigger: true,
             description: t('Whether to display the trend (percentage change or value)'),
           },
         },
       ],
       // Number Format Input
       [
         {
           name: 'number_format',
           config: {
             ...sharedControls.y_axis_format, 
             label: t('Number Format'),
             description: t('D3 format syntax: https://github.com/d3/d3-format'),
             default: ',d', 
             renderTrigger: true,
           },
         },
       ],
               // Number Format for Trend Metric
        [
          {
            name: 'trend_number_format',
            config: {
              ...sharedControls.y_axis_format,
              label: t('Trend Number Format'),
              description: t('D3 format for trend metric or percentage change'),
              default: ',.2f',
              renderTrigger: true,
            },
          },
        ],
       // Toggle: Show Trend Indicator (▲/▼)
       [
         {
           name: 'show_trend_indicator',
           config: {
             type: 'CheckboxControl',
             label: t('Show Trend Indicator'),
             default: true,
             renderTrigger: true,
             description: t('Show arrow indicator for positive/negative change'),
           },
         },
       ],
       // Toggle: Colorize by Trend
       [
         {
           name: 'use_color',
           config: {
             type: 'CheckboxControl',
             label: t('Color Big Number by Trend'),
             default: true,
             renderTrigger: true,
             description: t('Color the big number based on increase/decrease/zero'),
           },
         },
       ],
     ],
   },
 ],
};


