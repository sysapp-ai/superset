import { t } from '@superset-ui/core';

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['groupby'],
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
            name: 'decimal_precision',
            config: {
              type: 'TextControl',
              label: t('Decimal precision'),
              default: 0,
            },
          },
        ],

        [
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Show Legend'),
              default: true,
            },
          },
        ],

        [
          {
            name: 'bar_shape',
            config: {
              type: 'SelectControl',
              label: t('Bar Shape'),
              choices: [
                ['rectangle', 'Rectangle'],
                ['triangle', 'Triangle'],
                ['rounded', 'Rounded'],
                ['diamond', 'Diamond'],
              ],
              default: 'rectangle',
            },
          },
        ],

        [
          {
            name: 'show_values',
            config: {
              type: 'CheckboxControl',
              label: t('Show Values on Bars'),
              default: true,
            },
          },
        ],

      ],
    },
  ],
};
