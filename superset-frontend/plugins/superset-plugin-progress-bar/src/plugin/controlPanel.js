import { t, validateNonEmpty } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';

const config = {
  controlPanelSections: [
    {
      // First section: Query-related options
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            // Group by one or more columns (categories)
            name: 'groupby',
            config: {
              ...sharedControls.groupby, // use Superset’s built-in groupby config
              label: t('Category Columns'),
              description: t('Columns containing category names'),
              required: true,
              multi: true,
              default: [],
              validators: [validateNonEmpty],
            },
          },
        ],
        [
          {
             // Select the metric column for values
            name: 'metric',
            config: {
              ...sharedControls.metric,
              label: t('Value Column'),
              description: t('Column with numeric values'),
              validators: [validateNonEmpty],
              required: true,
              default: null,
            },
          },
        ],
        [
          {
             // Minimum value for progress bar scale
            name: 'minValue',
            config: {
              type: 'TextControl',
              label: t('Minimum Value'),
              description: t('Minimum value for the scale (default 0)'),
              default: '0',
              renderTrigger: true,
            },
          },
          {
            // Maximum value for progress bar scale
            name: 'maxValue',
            config: {
              type: 'TextControl',
              label: t('Maximum Value'),
              description: t('Maximum value for the scale (default 100)'),
              default: '100',
              renderTrigger: true,
            },
          },
        ],
         // Standard Superset filters + row limit
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      // Second section: Visual/chart customization options
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            // Header text above the chart
            name: 'headerText',
            config: {
              type: 'TextControl',
              default: 'Progress Bars',
              renderTrigger: true,
              label: t('Header Text'),
            },
          },
        ],
        // --- Now each checkbox is in its own row ---
        [
          {
            // Toggle category titles visibility
            name: 'showCategoryTitles',
            config: {
              type: 'CheckboxControl',
              label: t('Show Category Titles'),
              default: true,
              renderTrigger: true,
              description: t('Show section headers for each category'),
            },
          },
        ],
        [
          {
            // Toggle raw values visibility
            name: 'showValues',
            config: {
              type: 'CheckboxControl',
              label: t('Show Values'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            // Toggle raw values visibility
            name: 'showPercentage',
            config: {
              type: 'CheckboxControl',
              label: t('Show Percentage on Bars'),
              default: true,
              renderTrigger: true,
              description: t('Show values inside the progress bars'),
            },
          },
        ],
        // --- Bar height slider ---
        [
          {
            // Slider to adjust bar height (px)
            name: 'barHeight',
            config: {
              type: 'SliderControl',
              label: t('Bar Height (pixels)'),
              min: 5,
              max: 50,
              step: 1,
              default: 20,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
