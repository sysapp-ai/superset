import { getNumberFormatter } from '@superset-ui/core';

export default function transformProps(chartProps) {
  const {
    width,
    height,
    queriesData = [],
    formData = {},
    filterState,
    hooks: { setDataMask, onAddFilter } = {},
    emitCrossFilters,
    ownState,
  } = chartProps;

  let table1Data = queriesData[0]?.data || [];
  let table2Data = queriesData[1]?.data || [];

  const {
    metrics,
    metrics2,
    columnConfig,
    columnConfig2,
    showSummary,
    textAlign,
    allowCrossFiltering = false,

    // 🔹 NEW (Query-level sorting)
    querySortColumn,
    querySortOrder = 'ASC',
    querySortColumn2,
    querySortOrder2 = 'ASC',
  } = formData;

  /* ============================================================
   *  DATE / MONTH SORTING (Superset-like)
   * ============================================================ */

  const MONTH_MAP = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };

  function parseMonthYear(value) {
    if (!value || typeof value !== 'string') return null;

    // Matches: Aug 2025 / August 2025
    const match = value.trim().match(/^([a-zA-Z]+)\s+(\d{4})$/);
    if (!match) return null;

    const monthKey = match[1].substring(0, 3).toLowerCase();
    const year = Number(match[2]);

    if (MONTH_MAP[monthKey] === undefined || Number.isNaN(year)) return null;

    return new Date(year, MONTH_MAP[monthKey], 1);
  }

  function parseDateValue(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function sortByDateOrMonth(data, sortCol, order = 'ASC') {
    if (!data?.length || !sortCol) return data;

    return [...data].sort((a, b) => {
      const aRaw = a[sortCol];
      const bRaw = b[sortCol];

      const aDate =
        parseMonthYear(aRaw) ||
        parseDateValue(aRaw);

      const bDate =
        parseMonthYear(bRaw) ||
        parseDateValue(bRaw);

      if (!aDate || !bDate) return 0;

      return order === 'DESC'
        ? bDate - aDate
        : aDate - bDate;
    });
  }

  /* ============================================================
   *  NUMBER FORMATTING
   * ============================================================ */

  const getCurrencySymbol = sym => {
    const map = {
      USD: '$',
      EUR: '€',
      INR: '₹',
      GBP: '£',
      AED: 'د.إ',
      JPY: '¥',
    };
    return map[sym] || sym;
  };

  const formatNumber = (value, cfg = {}) => {
    if (value == null || value === '') return value;

    const num = Number(String(value).replace(/[^0-9.-]/g, ''));
    if (Number.isNaN(num)) return value;

    const {
      d3NumberFormat,
      currencyFormat,
      columnPrefix,
      columnSuffix,
    } = cfg;

    let formatted = '';

    try {
      if (d3NumberFormat === 'SMART_NUMBER' || d3NumberFormat === 'Adaptive formatting') {
        formatted = getNumberFormatter('SMART_NUMBER')(num);
      } else if (d3NumberFormat) {
        formatted = getNumberFormatter(d3NumberFormat)(num);
      } else {
        formatted = num.toString();
      }

      if (currencyFormat?.symbol) {
        const symbol = getCurrencySymbol(currencyFormat.symbol);
        const position = currencyFormat.symbolPosition || 'prefix';
        formatted = position === 'suffix'
          ? `${formatted} ${symbol}`
          : `${symbol} ${formatted}`;
      }

      if (columnPrefix) formatted = `${columnPrefix}${formatted}`;
      if (columnSuffix) formatted = `${formatted}${columnSuffix}`;

      return formatted;
    } catch {
      return value;
    }
  };

  const applyFormatting = (data, config) =>
    Array.isArray(data)
      ? data.map(row => {
          const r = { ...row };
          Object.entries(config || {}).forEach(([col, cfg]) => {
            if (r[col] !== undefined) {
              r[col] = formatNumber(r[col], cfg);
            }
          });
          return r;
        })
      : data;

  /* ============================================================
   *  SUMMARY ROW
   * ============================================================ */

  function createSummaryRow(originalData, config) {
    if (!showSummary || !originalData.length) return null;

    const cols = Object.keys(originalData[0]);
    const summary = {};
    const firstCol = cols[0];

    cols.forEach(col => {
      const nums = originalData
        .map(r => Number(String(r[col]).replace(/[^0-9.-]/g, '')))
        .filter(v => !Number.isNaN(v));

      if (nums.length) {
        const total = nums.reduce((a, b) => a + b, 0);
        summary[col] = formatNumber(total, config?.[col]);
      } else {
        summary[col] = col === firstCol ? 'Summary' : '';
      }
    });

    return summary;
  }

  function labelSummaryRow(summaryRow, data) {
    if (!summaryRow || !data.length) return summaryRow;
    summaryRow[Object.keys(data[0])[0]] = 'Summary';
    return summaryRow;
  }

  /* ============================================================
   *  APPLY QUERY SORT (IMPORTANT PART)
   * ============================================================ */

  table1Data = sortByDateOrMonth(
    table1Data,
    querySortColumn,
    querySortOrder,
  );

  table2Data = sortByDateOrMonth(
    table2Data,
    querySortColumn2,
    querySortOrder2,
  );

  /* ============================================================
   *  FORMAT + SUMMARY
   * ============================================================ */

  const table1Summary = labelSummaryRow(
    createSummaryRow(table1Data, columnConfig),
    table1Data,
  );

  const table2Summary = labelSummaryRow(
    createSummaryRow(table2Data, columnConfig2),
    table2Data,
  );

  table1Data = applyFormatting(table1Data, columnConfig);
  table2Data = applyFormatting(table2Data, columnConfig2);

  const crossFilterState = ownState?.crossFilter || {};

  return {
    width,
    height,
    table1Data,
    table2Data,
    table1Summary,
    table2Summary,
    metrics,
    metrics2,
    showSummary,
    textAlign,
    button1Name: formData.button1Name || 'Table 1',
    button2Name: formData.button2Name || 'Table 2',
    tabFontSize: formData.tabFontSize || '14px',
    filters: filterState?.filters || [],
    emitCrossFilters: allowCrossFiltering || emitCrossFilters,
    setDataMask,
    onChangeFilter: onAddFilter,
    isRawRecords: false,
    crossFilterState,
  };
}
