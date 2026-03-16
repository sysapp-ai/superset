import React from 'react';
import PropTypes from 'prop-types';
import { t, getNumberFormatter } from '@superset-ui/core';

// ===== Helper: Shorten large numbers (e.g., 1,000,000 → 1.00M) =====
const abbreviateNumber = value => {
  if (value === null || value === undefined || !Number.isFinite(value)) return value;
  const abs = Math.abs(value);
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toString();
};

// ===== Helper: Format value using abbreviation or D3 format =====
const formatValue = (value, { numberFormat, trendNumberFormat, abbreviate, isTrend = false }) => {
  if (value === null || value === undefined || value === 'N/A') return 'N/A';

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Already formatted? Return as-is
    if (/[a-zA-Z%]/.test(trimmed)) {
      return trimmed;
    }

    // Try to parse numeric-like string
    const parsed = parseFloat(trimmed);
    if (!isNaN(parsed)) {
      value = parsed;
    } else {
      return 'N/A';
    }
  }

  // Handle numeric values
  if (!Number.isFinite(value)) return 'N/A';

  const activeFormat = isTrend && trendNumberFormat ? trendNumberFormat : numberFormat;

  if (abbreviate) {
    return abbreviateNumber(value);
  }

  try {
    const formatter = getNumberFormatter(activeFormat || ',.2f');
    return formatter(value);
  } catch {
    return value.toLocaleString();
  }
};


// ===== Helper: Return color for trend based on value =====
const getChangeColor = (change, useColor) => {
  if (!useColor) return undefined;
  if (change === null) return '#999999';
  if (!Number.isFinite(change)) return '#FF9800';
  return change > 0 ? '#28a745' : change < 0 ? '#dc3545' : '#6c757d';
};

// ===== Helper: Return arrow indicator (▲/▼) =====
const getTrendIndicator = change => {
  if (change === null) return '';
  if (!Number.isFinite(change)) return '∞';
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '';
};

// ===== Main React Component =====
const BigNumberTrend = ({
  currentValue,
  secondaryValues,
  percentageChange,
  trendRawValue,
  trendLabel,
  headerFontSize,
  subheaderFontSize,
  showTrend,
  showSecondary,
  numberFormat,
  trendNumberFormat,
  showTrendIndicator,
  trendTooltip,
  useColor,
  abbreviate,
  showPrimaryMetricName,
  primaryMetricName,
}) => {
  let trendText, trendIcon, trendColor;

  if (percentageChange !== null) {
    trendIcon = getTrendIndicator(percentageChange);
    trendColor = getChangeColor(percentageChange, useColor);

    trendText = Number.isFinite(percentageChange)
  ? formatValue(percentageChange, {
      trendNumberFormat,
      numberFormat,
      abbreviate,
      isTrend: true,
    })
  : t('Infinite change');
  } else if (trendRawValue !== null) {
    trendIcon = getTrendIndicator(0);
    trendColor = getChangeColor(0, useColor);
    trendText = formatValue(trendRawValue, {
      trendNumberFormat,
      numberFormat,
      abbreviate,
      isTrend: true,
    });
  } else {
    trendIcon = '';
    trendColor = getChangeColor(null, useColor);
    trendText = '';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
        backgroundColor: 'white',
        borderRadius: '12px',
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* ===== Primary Metric Name ===== */}
      {showPrimaryMetricName && primaryMetricName && (
        <div
          style={{
            fontSize: `${subheaderFontSize * 0.9}px`,
            marginBottom: '6px',
            fontWeight: 1000,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={primaryMetricName}
        >
          {primaryMetricName}
        </div>
      )}

      {/* ===== Primary Big Number ===== */}
      <div
        style={{
          fontSize: `${headerFontSize}px`,
          fontWeight: '700',
          marginBottom: showSecondary || showTrend ? '12px' : '0',
          lineHeight: 1.1,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={formatValue(currentValue, { numberFormat, abbreviate })}
      >
        {formatValue(currentValue, { numberFormat, abbreviate })}
      </div>

      {/* ===== Secondary Metrics ===== */}
      {showSecondary && secondaryValues && secondaryValues.length > 0 &&
        secondaryValues.map(({ key, value }) => (
          <div
            key={key}
            style={{
              fontSize: `${subheaderFontSize * 0.95}px`,
              color: '#666',
              marginBottom: showTrend ? '8px' : 0,
              fontWeight: 500,
            }}
            title={key}
          >
            {formatValue(value, { numberFormat, abbreviate })}
            <span style={{ marginLeft: 6, fontWeight: 'bold', color: '#aaa' }}>
              {key}
            </span>
          </div>
        ))}

      {/* ===== Trend Metric / % Change ===== */}
      {showTrend && (
        <div
          style={{
            color: trendColor,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: `${subheaderFontSize * 0.9}px`,
          }}
          title={trendTooltip}
        >
          {showTrendIndicator && <span>{trendIcon}</span>}
          <span>{trendText}</span>
          {trendLabel && (
            <span style={{ marginLeft: 6, fontStyle: 'italic', color: '#aaa' }}>
              {trendLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ===== Prop Types =====
BigNumberTrend.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  currentValue: PropTypes.number.isRequired,
  secondaryValues: PropTypes.array,
  percentageChange: PropTypes.number,
  trendRawValue: PropTypes.number,
  trendLabel: PropTypes.string,
  headerFontSize: PropTypes.number,
  subheaderFontSize: PropTypes.number,
  showTrend: PropTypes.bool,
  showSecondary: PropTypes.bool,
  numberFormat: PropTypes.string,
  trendNumberFormat: PropTypes.string,
  showTrendIndicator: PropTypes.bool,
  trendTooltip: PropTypes.string,
  useColor: PropTypes.bool,
  abbreviate: PropTypes.bool,
  showPrimaryMetricName: PropTypes.bool,
  primaryMetricName: PropTypes.string,
};

// ===== Default Props =====
BigNumberTrend.defaultProps = {
  secondaryValues: [],
  percentageChange: null,
  trendRawValue: null,
  trendLabel: '',
  headerFontSize: 60,
  subheaderFontSize: 20,
  showTrend: true,
  showSecondary: false,
  numberFormat: ',.2f',
  trendNumberFormat: ',.2f',
  showTrendIndicator: true,
  trendTooltip: '',
  useColor: false,
  abbreviate: false,
  showPrimaryMetricName: false,
  primaryMetricName: '',
};

export default BigNumberTrend;
