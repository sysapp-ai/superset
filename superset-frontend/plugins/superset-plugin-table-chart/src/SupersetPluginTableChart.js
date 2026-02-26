import React, { useState, useMemo } from 'react';

export default function SupersetPluginTableChart({
  width,
  height,
  table1Data,
  table2Data,
  table1Summary,
  table2Summary,
  showSummary = true,
  textAlign = 'left',
  button1Name = 'Table 1',
  button2Name = 'Table 2',
  tabFontSize = '14px',
  filters = [],
  emitCrossFilters = false,
  setDataMask,
  onChangeFilter,
  isRawRecords = false,
}) {
  const [activeTable, setActiveTable] = useState('table1');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRow, setSelectedRow] = useState(null);

  const currentData = activeTable === 'table1' ? table1Data : table2Data;
  const summaryRow = activeTable === 'table1' ? table1Summary : table2Summary;

  const columns = currentData.length > 0 ? Object.keys(currentData[0]) : [];

  // Cross-filtering handler
  const handleRowClick = (row, rowIndex) => {
    if (!emitCrossFilters || !setDataMask) return;

    const isSelected = selectedRow === rowIndex;

    if (isSelected) {
      // Clear filter
      setSelectedRow(null);
      setDataMask({
        extraFormData: { filters: [] },
        filterState: { value: null, selectedStatus: false },
      });
      return;
    }

    setSelectedRow(rowIndex);

    // Use first column as filter column (or specify a preferred one)
    const mainColumn = columns[0];
    const val = row[mainColumn];

    // Apply filter correctly
    setDataMask({
      extraFormData: {
        filters: [
          {
            col: mainColumn,
            op: 'IN',
            val: [val],
          },
        ],
      },
      filterState: {
        value: [val],
        selectedStatus: true,
      },
    });

    if (onChangeFilter) {
      onChangeFilter([{ col: mainColumn, op: 'IN', val: [val] }]);
    }
  };


  // Clear all filters when switching tabs
  const handleTabChange = (tabKey) => {
    setActiveTable(tabKey);
    setSelectedRow(null);

    // Clear cross-filtering when switching tabs
    if (emitCrossFilters && setDataMask) {
      setDataMask({
        crossFilter: {
          selected: [],
          currentValue: null,
          data: {},
        },
      });
    }
  };

  const handleSort = col => {
    if (sortColumn === col) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  // Sorted data
  const sortedData = useMemo(() => {
    if (!sortColumn) return currentData;

    return [...currentData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      // Try numeric comparison first
      const numA = parseFloat(aVal?.toString().replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(bVal?.toString().replace(/[^0-9.-]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      // Otherwise string compare
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [currentData, sortColumn, sortDirection]);

  return (
    <div style={{
      width,
      height,
      background: '#fff',
      padding: '12px',
      borderRadius: '8px',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
    }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #ddd', marginBottom: '12px' }}>
        {[{ key: 'table1', label: button1Name }, { key: 'table2', label: button2Name }].map(tab => (
          <div
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderBottom: activeTable === tab.key ? '2px solid #1677ff' : '2px solid transparent',
              color: activeTable === tab.key ? '#1677ff' : '#555',
              fontWeight: activeTable === tab.key ? '600' : '500',
              transition: 'all 0.2s ease-in-out',
              fontSize: tabFontSize,
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} onClick={() => handleSort(col)} style={{
                border: '1px solid #ddd', padding: '6px 8px', background: '#f5f5f5', textAlign: textAlign || 'left',
                cursor: 'pointer', userSelect: 'none'
              }}>
                {col} {sortColumn === col && (sortDirection === 'asc' ? '▲' : '▼')}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, i) => (
            <tr
              key={i}
              onClick={() => handleRowClick(row, i)}
              style={{
                cursor: emitCrossFilters ? 'pointer' : 'default',
                background: selectedRow === i ? '#e6f7ff' : 'transparent',
                border: selectedRow === i ? '2px solid #1890ff' : '1px solid #ddd',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (emitCrossFilters) {
                  e.currentTarget.style.background = selectedRow === i ? '#d4f0ff' : '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (emitCrossFilters) {
                  e.currentTarget.style.background = selectedRow === i ? '#e6f7ff' : 'transparent';
                }
              }}
            >
              {columns.map(col => (
                <td key={col} style={{
                  border: '1px solid #ddd',
                  padding: '6px 8px',
                  textAlign: textAlign || 'left',
                }}>
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}

          {showSummary && summaryRow && (
            <tr style={{ background: '#d9e8ff', fontWeight: '600' }}>
              {columns.map(col => (
                <td key={col} style={{
                  border: '1px solid #ccc',
                  textAlign: textAlign || 'left',
                  padding: '6px 8px',
                  color: '#003366'
                }}>
                  {summaryRow[col]}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
