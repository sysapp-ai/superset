import { t, validateNonEmpty } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';


const config = {
 controlPanelSections: [
   {
     // First section: Query controls (defines how the data is fetched)
     label: t('Query'),
     expanded: true,
     controlSetRows: [
       [
         {
           // Groupby: lets the user pick categories/dimensions
           name: 'groupby',
           config: {
             ...sharedControls.groupby,
             label: t('Categories'),
             description: t('Categories to group by (max 6 for best visual results)'),
             required: true,
             validators: [],
           },
         },
       ],
       [
         {
           // Metric: single numeric value to aggregate
           name: 'metric',
           config: {
             ...sharedControls.metric,
             label: t('Metric'),
             description: t('Numeric value to visualize'),
             required: true,
             validators: [validateNonEmpty],
           },
         },
       ],
       // Ad-hoc filters to filter dataset dynamically
       ['adhoc_filters'],
       [
         {
           // Row limit: restrict number of categories
           name: 'row_limit',
           config: {
             ...sharedControls.row_limit,
             default: 6,
             description: t('Maximum number of categories to display (recommended ≤ 6)'),
           },
         },
       ],
     ],
   },
   {
     // Second section: Chart customization options
     label: t('Chart Options'),
     expanded: true,
     controlSetRows: [
       [
         {
           // Header text above the chart
           name: 'header_text',
           config: {
             type: 'TextControl',
             default: '',
             renderTrigger: true,
             label: t('Header Text'),
             description: t('Text to display above the chart'),
           },
         },
         {
           // Bold header toggle
           name: 'bold_text',
           config: {
             type: 'CheckboxControl',
             label: t('Bold Header'),
             renderTrigger: true,
             default: true,
             description: t('Make header text bold'),
           },
         },
         {
           // Header font size dropdown
           name: 'header_font_size',
           config: {
             type: 'SelectControl',
             label: t('Header Font Size'),
             default: 'm',
             renderTrigger: true,
             choices: [
               ['xs', 'x-small'],
               ['s', 'small'],
               ['m', 'medium'],
               ['l', 'large'],
               ['xl', 'x-large'],
             ],
             description: t('Size of the header text'),
           },
         },
         {
           // Donut inner radius control
           name: 'inner_radius',
           config: {
             type: 'SliderControl',
             label: t('Inner Radius'),
             description: t('Size of the donut hole (0–90%)'),
             min: 0,
             max: 90,
             default: 60,
             step: 5,
             renderTrigger: true,
           },
         },
         {
           // Decimal precision for numbers & percentages
           name: 'decimal_precision',
           config: {
             type: 'SelectControl',
             label: t('Decimal Precision'),
             default: 0,
             renderTrigger: true,
             choices: [
               [0, '0'],
               [1, '0.0'],
               [2, '0.00'],
               [3, '0.000'],
             ],
             description: t('Number of decimal places to display for values and percentages'),
           },
         },
         {
           // Show/hide percentage labels on slices
           name: 'show_labels',
           config: {
             type: 'CheckboxControl',
             label: t('Show Labels'),
             renderTrigger: true,
             default: true,
             description: t('Show percentage labels on chart segments'),
           },
         },
         {
           // Show/hide chart legend
           name: 'show_legend',
           config: {
             type: 'CheckboxControl',
             label: t('Show Legend'),
             renderTrigger: true,
             default: true,
             description: t('Show chart legend'),
           },
         },
       ],
     ],
   },
 ],
};


export default config;
