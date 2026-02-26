import { getMetricLabel, getNumberFormatter } from '@superset-ui/core';

/* ===============================
   Helpers
================================ */

/**
 * Normalize Superset ColorPicker values
 * Supports string, rgba object, fallback
 */
function formatColor(color, fallback) {
  if (!color) return fallback;
  if (typeof color === 'string') return color;

  const { r, g, b, a = 1 } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ===============================
   Icon Map
================================ */

const ICON_NAME_TO_INDEX = {
  rise: 0,
  user: 1,
  file: 2,
  card: 3,
  bar: 4,
  group: 5,
  filepen: 6,
  outlinecancel: 7,
  cancelpresentation: 8,
  faregcalendarcheck: 9,
  fahandholdingdollar: 10,
  mdcontactphone: 11,
  iospeedometer: 12,
  tbmessagecancel: 13,
  tbcalendarcancel: 14,
  faarrowtrendup: 15,
  faarrowtrenddown: 16,
  facheck: 17,
  facheckcircle: 18,
  hioutlineclipboarddocumentlist: 19,
  imclipboard: 20,
  bsclipboard2x: 21,
  mdpendingactions: 22,
  task: 23,
  sandclockoutline: 24,
  sandclock: 25,
};

/* ===============================
   Formatter
================================ */

function abbreviateNumber(value, precision = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '0';
  }

  const abs = Math.abs(value);

  if (abs >= 1.0e9) {
    return `${(value / 1.0e9).toFixed(precision)}B`;
  }
  if (abs >= 1.0e6) {
    return `${(value / 1.0e6).toFixed(precision)}M`;
  }
  if (abs >= 1.0e3) {
    return `${(value / 1.0e3).toFixed(precision)}K`;
  }

  return value.toFixed(precision);
}

function getFormatter({ formatType, precision, currency, adaptive }) {
  // ---------- ADAPTIVE ----------
  if (adaptive) {
    return value => {
      const formatted = abbreviateNumber(value, precision);

      if (formatType === 'currency') {
        return `${currency}${formatted}`;
      }

      if (formatType === 'percent') {
        const normalized = value > 1 ? value / 100 : value;
        return `${abbreviateNumber(normalized * 100, precision)}%`;
      }

      return formatted;
    };
  }

  // ---------- STANDARD ----------
  if (formatType === 'currency') {
    return value =>
      `${currency}${getNumberFormatter(`,.${precision}f`)(value)}`;
  }

  if (formatType === 'percent') {
    return value => {
      if (value === null || value === undefined) return '0';
      const normalized = value > 1 ? value / 100 : value;
      return getNumberFormatter(`,.${precision}%`)(normalized);
    };
  }

  return getNumberFormatter(`,.${precision}f`);
}

/* ===============================
   transformProps
================================ */

export default function transformProps(chartProps) {
  const {
    queriesData = [],
    formData,
    rawFormData,
  } = chartProps;

  const metrics = formData.metrics || [];
  const row = queriesData?.[0]?.data?.[0] || {};

  /* ===============================
     Per-Metric Controls
  ================================ */

  const iconChoices = [
    rawFormData?.icon_choice_1 || 'rise',
    rawFormData?.icon_choice_2 || 'rise',
    rawFormData?.icon_choice_3 || 'rise',
    rawFormData?.icon_choice_4 || 'rise',
    rawFormData?.icon_choice_5 || 'rise',
    rawFormData?.icon_choice_6 || 'rise',
  ];

  const showIconFlags = [
    rawFormData?.show_icon_1 ?? true,
    rawFormData?.show_icon_2 ?? true,
    rawFormData?.show_icon_3 ?? true,
    rawFormData?.show_icon_4 ?? true,
    rawFormData?.show_icon_5 ?? true,
    rawFormData?.show_icon_6 ?? true,
  ];

  const showLabelFlags = [
    rawFormData?.show_label_1 ?? true,
    rawFormData?.show_label_2 ?? true,
    rawFormData?.show_label_3 ?? true,
    rawFormData?.show_label_4 ?? true,
    rawFormData?.show_label_5 ?? true,
    rawFormData?.show_label_6 ?? true,
  ];


  /* ===============================
     Icon Sizes (NEW)
  ================================ */

  const iconSizes = [
    Number(rawFormData?.icon_size_1 ?? 28),
    Number(rawFormData?.icon_size_2 ?? 28),
    Number(rawFormData?.icon_size_3 ?? 28),
    Number(rawFormData?.icon_size_4 ?? 28),
    Number(rawFormData?.icon_size_5 ?? 28),
    Number(rawFormData?.icon_size_6 ?? 28),
  ];

  /* ===============================
     Label Font Sizes (NEW)
  ================================ */

  const labelFontSizes = [
    Number(rawFormData?.label_font_size_1 ?? 14),
    Number(rawFormData?.label_font_size_2 ?? 14),
    Number(rawFormData?.label_font_size_3 ?? 14),
    Number(rawFormData?.label_font_size_4 ?? 14),
    Number(rawFormData?.label_font_size_5 ?? 14),
    Number(rawFormData?.label_font_size_6 ?? 14),
  ];

  /* ===============================
   Value Font Sizes (NEW)
  ================================ */

  const valueFontSizes = [
    Number(rawFormData?.value_font_size_1 ?? 24),
    Number(rawFormData?.value_font_size_2 ?? 24),
    Number(rawFormData?.value_font_size_3 ?? 24),
    Number(rawFormData?.value_font_size_4 ?? 24),
    Number(rawFormData?.value_font_size_5 ?? 24),
    Number(rawFormData?.value_font_size_6 ?? 24),
  ];


  /* ===============================
     Icon Colors
  ================================ */

  const iconColors = [
    formatColor(rawFormData?.icon_color_1, '#08979c'),
    formatColor(rawFormData?.icon_color_2, '#08979c'),
    formatColor(rawFormData?.icon_color_3, '#08979c'),
    formatColor(rawFormData?.icon_color_4, '#08979c'),
    formatColor(rawFormData?.icon_color_5, '#08979c'),
    formatColor(rawFormData?.icon_color_6, '#08979c'),
  ];

  /* ===============================
     Icon Background Gradients
  ================================ */

  const iconBgStartColors = [
    formatColor(rawFormData?.icon_bg_start_1, '#e6fffb'),
    formatColor(rawFormData?.icon_bg_start_2, '#e6fffb'),
    formatColor(rawFormData?.icon_bg_start_3, '#e6fffb'),
    formatColor(rawFormData?.icon_bg_start_4, '#e6fffb'),
    formatColor(rawFormData?.icon_bg_start_5, '#e6fffb'),
    formatColor(rawFormData?.icon_bg_start_6, '#e6fffb'),
  ];

  const iconBgEndColors = [
    formatColor(rawFormData?.icon_bg_end_1, '#f6ffed'),
    formatColor(rawFormData?.icon_bg_end_2, '#f6ffed'),
    formatColor(rawFormData?.icon_bg_end_3, '#f6ffed'),
    formatColor(rawFormData?.icon_bg_end_4, '#f6ffed'),
    formatColor(rawFormData?.icon_bg_end_5, '#f6ffed'),
    formatColor(rawFormData?.icon_bg_end_6, '#f6ffed'),
  ];

  /* ===============================
     Build Chart Data
  ================================ */

  const data = metrics.map((metric, idx) => {
    const label = getMetricLabel(metric);
    const value = row[label];

    const formatter = getFormatter({
      formatType: rawFormData?.[`format_type_${idx + 1}`] || 'number',
      precision: Number(rawFormData?.[`decimal_precision_${idx + 1}`] ?? 0),
      currency: rawFormData?.[`currency_symbol_${idx + 1}`] || '$',
      adaptive: rawFormData?.[`adaptive_format_${idx + 1}`] ?? false,
    });

    return {
      key: label,
      label,
      value,
      formattedValue:
        value !== null && value !== undefined ? formatter(value) : '0',

      showLabel: showLabelFlags[idx],

      iconIndex:
        ICON_NAME_TO_INDEX[iconChoices[idx]] ??
        ICON_NAME_TO_INDEX.rise,

      showIcon: showIconFlags[idx],

      iconSize: iconSizes[idx],
      labelFontSize: labelFontSizes[idx],
      valueFontSize: valueFontSizes[idx],

      iconColor: iconColors[idx],

      iconBgStart: iconBgStartColors[idx],
      iconBgEnd: iconBgEndColors[idx],
    };
  });

  return { data };
}
