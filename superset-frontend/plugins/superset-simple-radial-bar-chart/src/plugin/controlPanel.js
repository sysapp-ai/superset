import { t } from '@superset-ui/core';

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metric'],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        [
          {
            name: 'showLegend',
            config: {
              type: 'CheckboxControl',
              label: t('Show Legend'),
              description: t('Whether to display the legend on the chart'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'decimalPrecision',
            config: {
              type: 'TextControl',
              label: t('Decimal Precision'),
              description: t('Number of decimal places to show in tooltips'),
              default: 2,
              isInt: true,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};
