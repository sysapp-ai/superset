import React from 'react';
import { styled, useTheme } from '@superset-ui/core';
import { getCategoricalSchemeRegistry } from '@superset-ui/core';

/**
 * ===== Styled Components =====
 */

const Styles = styled.div`
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
`;

const CategorySection = styled.div`
  margin-bottom: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
    padding-bottom: 12px;
  }
`;

const CategoryTitle = styled.h4`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.grayscale.dark1};
  font-weight: 500;
  font-size: 13px;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.grayscale.dark1};
`;

const LabelText = styled.span`
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: ${({ height }) => height}px;
  background: ${({ theme }) => theme.colors.grayscale.light3};
  border-radius: ${({ height }) => height / 2}px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: ${({ percent, color, theme }) =>
    percent > 0 ? color : theme.colors.grayscale.light3};
  border-radius: ${({ height }) => height / 2}px;
  transition: width 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 4px;
`;

const PercentInside = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: #fff;
`;

const PercentOutside = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${({ percent }) => (percent > 0 ? '#666' : '#999')};
`;

const ValueText = styled.span`
  font-size: 11px;
  font-weight: bold;
  color: #444;
`;

const Header = styled.h3`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.colors.grayscale.dark2};
  font-size: 14px;
  font-weight: 600;
`;

/**
 * Format percentages: integers as whole, decimals to 2 places
 */
const formatPercent = value => {
  return Number.isInteger(value) ? `${value}%` : `${value.toFixed(2)}%`;
};

/**
 * Get color scheme from Superset registry
 */
const getColorScheme = (schemeName, count) => {
  const schemeRegistry = getCategoricalSchemeRegistry();
  const scheme =
    schemeRegistry.get(schemeName) || schemeRegistry.get('supersetDefault');
  return scheme.colors.slice(0, count);
};

/**
 * ===== ProgressBars Component =====
 */

export default function ProgressBars({
  data,
  headerText = 'Progress Overview',
  showValues = true,
  showPercentage = true,
  showCategoryTitles = true,
  barHeight = 14,
  categories = [],
  colorScheme = 'supersetDefault',
  width,
  height,
}) {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Styles>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.colors.grayscale.base,
            fontSize: '12px',
          }}
        >
          No data available. Please check your dataset configuration.
        </div>
      </Styles>
    );
  }

  // Find max items to pick enough colors
  const maxNames = Math.max(
    ...categories.map(cat => data.filter(item => item.category === cat).length),
  );

  const colors = getColorScheme(colorScheme, maxNames);

  return (
    <Styles style={{ width, height }}>
      {headerText && <Header>{headerText}</Header>}

      {categories.map((category, catIndex) => {
        const categoryData = data.filter(item => item.category === category);

        return (
          <CategorySection key={`cat-${catIndex}`}>
            {showCategoryTitles && <CategoryTitle>{category}</CategoryTitle>}
            <ProgressContainer>
              {categoryData.map((item, index) => {
                // Treat item.value as percentage
                const percent = item.value;
                const roundedPercent = Math.round(percent);

                return (
                  <ProgressBarWrapper key={`item-${index}`}>
                    {/* Label above */}
                    <ProgressLabel>
                      <LabelText title={item.name}>{item.name}</LabelText>
                    </ProgressLabel>

                    {/* Bar + values */}
                    <BarContainer>
                      <ProgressBar height={barHeight}>
                        <ProgressFill
                          percent={percent}
                          color={colors[index % colors.length]}
                          height={barHeight}
                        >
                          {showPercentage && percent >= 0 && (
                            <PercentInside>{roundedPercent}%</PercentInside>
                          )}
                        </ProgressFill>
                      </ProgressBar>

                      {/* Values and small % outside */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {showValues && (
                          <ValueText>{formatPercent(percent)}</ValueText>
                        )}
                        {showPercentage && percent < 0 && (
                          <PercentOutside percent={percent}>
                            ({roundedPercent}%)
                          </PercentOutside>
                        )}
                      </div>
                    </BarContainer>
                  </ProgressBarWrapper>
                );
              })}
            </ProgressContainer>
          </CategorySection>
        );
      })}
    </Styles>
  );
}
