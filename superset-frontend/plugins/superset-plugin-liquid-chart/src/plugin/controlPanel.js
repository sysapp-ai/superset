import { t } from '@superset-ui/core';

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['adhoc_filters'], 
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'waveColor',
            config: {
              type: 'ColorPickerControl',
              label: t('Wave Color'),
              default: '#3fa7ff',
              description: t('Color of the moving liquid waves.'),
            },
          },
          {
            name: 'fillColor',
            config: {
              type: 'ColorPickerControl',
              label: t('Fill Color'),
              default: '#e5eeff',
              description: t('Base color of the liquid fill area.'),
            },
          },
          {
            name: 'outlineColor',
            config: {
              type: 'ColorPickerControl',
              label: t('Outline Color'),
              default: '#3fa7ff',
              description: t('Outline color of the liquid circle.'),
            },
          },
        ],
        [
          {
            name: 'shape',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Shape'),
              choices: [
                ['circle', 'Circle'],
                ['rect', 'Rectangle'],
                ['roundRect', 'Round Rectangle'],
                ['triangle', 'Triangle'],
                ['diamond', 'Diamond'],
                ['pin', 'Pin'],
                ['arrow', 'Arrow'],
              ],
              default: 'circle',
              description: t('Shape of the liquid container.'),
            },
          },
        ],
        [
          {
            name: 'precision',
            config: {
              type: 'SelectControl',
              label: t('Decimal Precision'),
              default: 2,
              choices: [
                [0, '0'],
                [1, '1'],
                [2, '2'],
                [3, '3'],
                [4, '4'],
              ],
              description: t('Number of decimal places to show in the center label.'),
            },
          },
        ],
      ],
    },
  ],
};
