import { t } from '@superset-ui/core';
import { sharedControls } from '@superset-ui/chart-controls';

// ==================================================
// Helper: Table Section (with per-table query sorting)
// ==================================================
function tableSection(label, suffix = '') {
  const isSecond = suffix === '_2';

  return {
    label: t(label),
    expanded: true,
    controlSetRows: [
      // -----------------------------
      // Tab name
      // -----------------------------
      [
        {
          name: `button${isSecond ? '2' : '1'}Name`,
          config: {
            type: 'TextControl',
            label: t('Tab Name'),
            default: t(isSecond ? 'Table 2' : 'Table 1'),
          },
        },
      ],

      // -----------------------------
      // Query controls
      // -----------------------------
      [
        {
          name: `metrics${suffix}`,
          config: sharedControls.metrics,
        },
      ],
      [
        {
          name: `groupby${suffix}`,
          config: sharedControls.groupby,
        },
      ],
      [
        {
          name: `adhoc_filters${suffix}`,
          config: sharedControls.adhoc_filters,
        },
      ],
      [
        {
          name: `row_limit${suffix}`,
          config: sharedControls.row_limit,
        },
      ],
      [
        {
          name: `limit${suffix}`,
          config: sharedControls.limit,
        },
      ],

      // ==================================================
      // QUERY SORTING (PER TABLE)
      // ==================================================
      [
         {
          name: `query_sort_column${suffix}`,
          config: {
            type: 'SelectControl',
            label: t('Sort Column'),
            description: t('Query-level sorting (Month / Date supported)'),
            mapStateToProps: state => {
              const cols =
                state?.datasource?.columns?.map(c => c.column_name) || [];

              return {
                choices: cols.map(col => [col, col]),
              };
            },
            renderTrigger: true,
          },
        },
      ],
      [
        {
          name: `query_sort_order${suffix}`,
          config: {
            type: 'SelectControl',
            label: t('Sort Order'),
            default: 'ASC',
            choices: [
              ['ASC', t('Ascending')],
              ['DESC', t('Descending')],
            ],
            renderTrigger: true,
          },
        },
      ],

      // -----------------------------
      // Column formatting
      // -----------------------------
      [
        {
          name: isSecond ? 'column_config_2' : 'column_config',
          config: {
            type: 'ColumnConfigControl',
            label: t('Customize number format'),
            width: 400,
            height: 320,
            renderTrigger: true,
            shouldMapStateToProps() {
              return true;
            },
            mapStateToProps(explore, _, chart) {
              const respIndex = isSecond ? 1 : 0;
              const {
                colnames = [],
                coltypes = [],
              } = chart?.queriesResponse?.[respIndex] ?? {};

              return {
                columnsPropsObject: { colnames, coltypes },
              };
            },
          },
        },
      ],
    ],
  };
}

// ==================================================
// Control Panel
// ==================================================
const controlPanel = {
  controlPanelSections: [
    tableSection('Table 1 Settings', ''),
    tableSection('Table 2 Settings', '_2'),

    // -----------------------------
    // Display Settings (global)
    // -----------------------------
    {
      label: t('Display Settings'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'textAlign',
            config: {
              type: 'SelectControl',
              label: t('Text Align'),
              default: 'left',
              choices: [
                ['left', t('Left')],
                ['center', t('Center')],
                ['right', t('Right')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'tabFontSize',
            config: {
              type: 'SelectControl',
              label: t('Tab Font Size'),
              default: '14px',
              renderTrigger: true,
              choices: [
                ['9px', 'Very Small'],
                ['10px', 'Small'],
                ['14px', 'Medium'],
                ['18px', 'Large'],
                ['22px', 'Extra Large'],
              ],
            },
          },
        ],
        [
          {
            name: 'showSummary',
            config: {
              type: 'CheckboxControl',
              label: t('Show Summary Row'),
              default: true,
              renderTrigger: true,
            },
          },
        ],
      ],
    },
  ],
};

export default controlPanel;
