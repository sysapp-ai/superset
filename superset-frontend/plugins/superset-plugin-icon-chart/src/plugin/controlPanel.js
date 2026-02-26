import { t, validateNonEmpty } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';


const validateMaxSixMetrics = metrics => {
  if (metrics && metrics.length > 6) {
    return t('You can select a maximum of 6 metrics only.');
  }
  return false;
};

const ICON_CHOICES = [
  ['rise', t('Rise')],
  ['user', t('User')],
  ['file', t('File')],
  ['card', t('Credit Card')],
  ['bar', t('Bar Chart')],
  ['group', t('Group')],
  ['filepen', t('File Pen')],
  ['outlinecancel', t('Outline Cancel')],
  ['cancelpresentation', t('Cancel Presentation')],
  ['faregcalendarcheck', t('Calendar Check')],
  ['fahandholdingdollar', t('Hand Holding Dollar')],
  ['mdcontactphone', t('Contact Phone')],
  ['iospeedometer', t('Speedometer')],
  ['tbmessagecancel', t('Message Cancel')],
  ['tbcalendarcancel', t('Calendar Cancel')],
  ['faarrowtrendup', t('Arrow Trend Up')],
  ['faarrowtrenddown', t('Arrow Trend Down')],
  ['facheck', t('Check')],
  ['facheckcircle', t('Check Circle')],
  ['hioutlineclipboarddocumentlist', t('Document List')],
  ['imclipboard', t('Clipboard Check')],
  ['bsclipboard2x', t('Clipboard Cancel')],
  ['mdpendingactions', t('Clipboard Pending')],
  ['task', t('Task')],
  ['sandclockoutline', t('Sand Clock Outline')],
  ['sandclock', t('Sand Clock')],
];

const FORMAT_CHOICES = [
  ['number', t('Number')],
  ['currency', t('Currency')],
  ['percent', t('Percent')],
];


function metricFormattingControls(idx) {
  return [
    /* ---------- ICON ---------- */

    [
      {
        name: `show_icon_${idx}`,
        config: {
          type: 'CheckboxControl',
          label: t('Show Icon'),
          default: true,
        },
      },
    ],

    [
      {
        name: `icon_choice_${idx}`,
        config: {
          type: 'SelectControl',
          label: t('Icon'),
          default: 'rise',
          choices: ICON_CHOICES,
          renderTrigger: true,
        },
      },
    ],

    [
      {
        name: `icon_size_${idx}`,
        config: {
          type: 'TextControl',
          label: t('Icon Size (px)'),
          default: 22,
          description: t('Size of the icon in pixels'),
        },
      },
    ],

    [
      {
        name: `icon_color_${idx}`,
        config: {
          type: 'ColorPickerControl',
          label: t('Icon Color'),
          default: '#08979c',
        },
      },
    ],

    [
      {
        name: `icon_bg_start_${idx}`,
        config: {
          type: 'ColorPickerControl',
          label: t('Icon Background Start'),
          default: '#e6fffb',
        },
      },
    ],

    [
      {
        name: `icon_bg_end_${idx}`,
        config: {
          type: 'ColorPickerControl',
          label: t('Icon Background End'),
          default: '#f6ffed',
        },
      },
    ],

    [
      {
        name: `show_label_${idx}`,
        config: {
          type: 'CheckboxControl',
          label: t('Show Metric Name'),
          default: true,
          description: t('Show or hide the metric label'),
        },
      },
    ],

    /* ---------- LABEL ---------- */

    [
      {
        name: `label_font_size_${idx}`,
        config: {
          type: 'TextControl',
          label: t('Metric Name Font Size (px)'),
          default: 12,
          description: t('Font size of the metric label'),
        },
      },
    ],

     /* ---------- VALUE ---------- */
    [
      {
        name: `value_font_size_${idx}`,
        config: {
          type: 'TextControl',
          label: t('Metric Value Font Size (px)'),
          default: 24,
          description: t('Font size of the metric value'),
        },
      },
    ],

    /* ---------- VALUE FORMAT ---------- */
    [
      {
        name: `adaptive_format_${idx}`,
        config: {
          type: 'CheckboxControl',
          label: t('Adaptive Format (K / M / B)'),
          default: false,
          description: t('Automatically abbreviate large numbers'),
        },
      },
    ],

    [
      {
        name: `format_type_${idx}`,
        config: {
          type: 'SelectControl',
          label: t(`Metric ${idx} Format`),
          default: 'number',
          choices: FORMAT_CHOICES,
        },
      },
    ],

    [
      {
        name: `decimal_precision_${idx}`,
        config: {
          type: 'TextControl',
          label: t(`Decimal Precision`),
          default: 0,
        },
      },
    ],

    [
      {
        name: `currency_symbol_${idx}`,
        config: {
          type: 'TextControl',
          label: t(`Currency Symbol`),
          default: '$',
        },
      },
    ],
  ];
}


const config = {
  controlPanelSections: [

    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              label: t('Metrics'),
              description: t('Select up to 6 metrics'),
              validators: [
                validateNonEmpty,
                validateMaxSixMetrics,
              ],
            },
          },
        ],
        [
          {
            name: 'adhoc_filters',
            config: {
              ...sharedControls.adhoc_filters,
              label: t('Filters'),
              description: t('Add filters to refine the chart data'),
            },
          },
        ],
      ],
    },

    ...[1, 2, 3, 4, 5, 6].map(i => ({
      label: t(`Metric ${i}`),
      expanded: i === 1,
      controlSetRows: metricFormattingControls(i),
    })),
  ],
};

export default config;
