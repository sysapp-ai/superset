import { t, validateNonEmpty } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';

const config = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            // Multiple Metrics instead of single
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              label: t('Metrics'),
              description: t('Select multiple metrics to visualize'),
              required: true,
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
              default: 10,
              description: t('Number of rows to fetch'),
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'header_text',
            config: {
              type: 'TextControl',
              default: '',
              renderTrigger: true,
              label: t('Header Text'),
            },
          },
          {
            name: 'bold_text',
            config: {
              type: 'CheckboxControl',
              label: t('Bold Header'),
              renderTrigger: true,
              default: true,
            },
          },
          {
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
            },
          },
          {
            name: 'inner_radius',
            config: {
              type: 'SliderControl',
              label: t('Inner Radius'),
              min: 0,
              max: 90,
              default: 60,
              step: 5,
              renderTrigger: true,
            },
          },
          {
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
            },
          },
        ],
        [
          {
            name: 'fill_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Fill Color'),
              default: { r: 0, g: 63, b: 140, a: 1 },
              renderTrigger: true,
            },
          },
          {
            name: 'background_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Bg Color'),
              default: { r: 230, g: 235, b: 242, a: 1 },
              renderTrigger: true,
            },
          },
          {
            name: 'text_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Text Color'),
              default: 'rgba(0, 0, 0, 0.85)',
              renderTrigger: true,
            },
          },
        ],
        [
         {
            name: 'chart_size',
            config: {
              type: 'SliderControl',
              label: t('Chart Size'),
              default: 200,
              min: 100,
              max: 400,
              step: 10,
              renderTrigger: true,
              description: t('Controls the size of each circular meter'),
            },
          },
        ],
        [
          {
            name: 'metric_name_font_size',
            config: {
              type: 'SliderControl',
              label: t('Metric Name Font Size'),
              min: 8,
              max: 40,
              default: 14,
              step: 1,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'metric_value_font_size',
            config: {
              type: 'SliderControl',
              label: t('Metric Value Font Size'),
              min: 10,
              max: 80,
              default: 28,
              step: 1,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default config;
