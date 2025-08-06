import React, { useState, useCallback, useMemo } from 'react';
import { PivotTableProps } from '../../../types';
import { cn } from '../../../utils/utils';
import Button from '../../atoms/form/Button';
import Select from '../../atoms/form/Select';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Tooltip from '../../atoms/display/Tooltip';
import Modal from '../../atoms/feedback/Modal';
import Toast from '../../atoms/feedback/Toast';
import LoadingState from '../../atoms/feedback/LoadingState';
import { Label } from '../../atoms';

const PivotTable: React.FC<PivotTableProps> = ({
  id = 'pivot-table',
  data = [],
  rows = [],
  columns = [],
  values = [],
  filters = {},
  sorting,
  expandable = true,
  exportable = true,
  configurable = true,
  size = 'md',
  showTotals = true,
  showSubtotals = true,
  className = '',
  style = {},
  onCellClick,
  onDrillDown,
  onExport,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configMode, setConfigMode] = useState(false);
  const [localRows, setLocalRows] = useState<string[]>(rows);
  const [localColumns, setLocalColumns] = useState<string[]>(columns);
  const [localValues, setLocalValues] = useState<typeof values>(values);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false, message: '', type: 'info'
  });

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // Get all unique values for a field
  const getUniqueValues = useCallback((field: string) => {
    return Array.from(new Set(data.map(row => row[field])))
      .filter(value => value != null)
      .sort();
  }, [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;
    
    return data.filter(row => {
      return Object.entries(filters).every(([field, filterValue]) => {
        if (Array.isArray(filterValue)) {
          return filterValue.includes(row[field]);
        }
        return row[field] === filterValue;
      });
    });
  }, [data, filters]);

  // Create pivot structure
  const pivotStructure = useMemo(() => {
    if (!filteredData.length || !localRows.length || !localColumns.length || !localValues.length) {
      return { rows: [], columns: [], cells: {} };
    }

    setLoading(true);

    // Get unique row combinations
    const rowCombinations = new Map<string, any>();
    const columnCombinations = new Map<string, any>();
    
    filteredData.forEach(row => {
      // Create row key
      const rowKey = localRows.map(field => row[field]).join('|');
      if (!rowCombinations.has(rowKey)) {
        rowCombinations.set(rowKey, localRows.reduce((acc, field) => ({ ...acc, [field]: row[field] }), {}));
      }

      // Create column key
      const columnKey = localColumns.map(field => row[field]).join('|');
      if (!columnCombinations.has(columnKey)) {
        columnCombinations.set(columnKey, localColumns.reduce((acc, field) => ({ ...acc, [field]: row[field] }), {}));
      }
    });

    // Calculate cell values
    const cells: Record<string, Record<string, any>> = {};
    
    Array.from(rowCombinations.keys()).forEach(rowKey => {
      cells[rowKey] = {};
      
      Array.from(columnCombinations.keys()).forEach(columnKey => {
        const cellData = filteredData.filter(row => {
          const currentRowKey = localRows.map(field => row[field]).join('|');
          const currentColumnKey = localColumns.map(field => row[field]).join('|');
          return currentRowKey === rowKey && currentColumnKey === columnKey;
        });

        const cellValues: Record<string, any> = {};
        
        localValues.forEach(valueConfig => {
          const fieldValues = cellData.map(row => Number(row[valueConfig.field!]) || 0);
          
          switch (valueConfig.aggregation) {
            case 'sum':
              cellValues[valueConfig.field!] = fieldValues.reduce((sum, val) => sum + val, 0);
              break;
            case 'avg':
              cellValues[valueConfig.field!] = fieldValues.length > 0 
                ? fieldValues.reduce((sum, val) => sum + val, 0) / fieldValues.length 
                : 0;
              break;
            case 'count':
              cellValues[valueConfig.field!] = fieldValues.length;
              break;
            case 'min':
              cellValues[valueConfig.field!] = fieldValues.length > 0 ? Math.min(...fieldValues) : 0;
              break;
            case 'max':
              cellValues[valueConfig.field!] = fieldValues.length > 0 ? Math.max(...fieldValues) : 0;
              break;
            default:
              cellValues[valueConfig.field!] = fieldValues.reduce((sum, val) => sum + val, 0);
          }
        });

        cells[rowKey][columnKey] = cellValues;
      });
    });

    setLoading(false);

    return {
      rows: Array.from(rowCombinations.entries()).map(([key, data]) => ({ key, data })),
      columns: Array.from(columnCombinations.entries()).map(([key, data]) => ({ key, data })),
      cells,
    };
  }, [filteredData, localRows, localColumns, localValues]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!showTotals || !pivotStructure.rows.length) return {};

    const rowTotals: Record<string, Record<string, number>> = {};
    const columnTotals: Record<string, Record<string, number>> = {};
    const grandTotals: Record<string, number> = {};

    // Initialize totals
    localValues.forEach(valueConfig => {
      grandTotals[valueConfig.field!] = 0;
      
      pivotStructure.rows.forEach(row => {
        if (!rowTotals[row.key]) rowTotals[row.key] = {};
        rowTotals[row.key][valueConfig.field!] = 0;
      });

      pivotStructure.columns.forEach(column => {
        if (!columnTotals[column.key]) columnTotals[column.key] = {};
        columnTotals[column.key][valueConfig.field!] = 0;
      });
    });

    // Calculate totals
    pivotStructure.rows.forEach(row => {
      pivotStructure.columns.forEach(column => {
        const cellData = pivotStructure.cells[row.key]?.[column.key];
        if (cellData) {
          localValues.forEach(valueConfig => {
            const value = cellData[valueConfig.field!] || 0;
            rowTotals[row.key][valueConfig.field!] += value;
            columnTotals[column.key][valueConfig.field!] += value;
            grandTotals[valueConfig.field!] += value;
          });
        }
      });
    });

    return { rowTotals, columnTotals, grandTotals };
  }, [pivotStructure, localValues, showTotals]);

  // Handle cell click
  const handleCellClick = useCallback((cellValue: any, rowData: any, columnData: any) => {
    onCellClick?.(cellValue, rowData, columnData);
  }, [onCellClick]);

  // Handle drill down
  const handleDrillDown = useCallback((field: string, value: any) => {
    onDrillDown?.(field, value);
    showToast(`Drilling down on ${field}: ${value}`, 'info');
  }, [onDrillDown, showToast]);

  // Handle export
  const handleExport = useCallback((format: string) => {
    onExport?.(format);
    setShowExportModal(false);
    showToast(`Pivot table exported as ${format.toUpperCase()}`, 'success');
  }, [localRows, localColumns, pivotStructure.cells, onExport, showToast]);

  // Format cell value
  const formatCellValue = useCallback((value: any, valueConfig: any) => {
    if (valueConfig.formatter) {
      return valueConfig.formatter(value);
    }
    
    if (typeof value === 'number') {
      if (valueConfig.aggregation === 'avg') {
        return value.toFixed(2);
      }
      return value.toLocaleString();
    }
    
    return String(value);
  }, []);

  // Toggle group expansion
  const toggleGroupExpansion = useCallback((groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  }, []);

  // Get available fields from data
  const availableFields = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).map(field => ({
      value: field,
      label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()
    }));
  }, [data]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div 
      className={cn(
        'bg-gray-50',
        className
      )}
      style={style}
    >
      <div className={cn(
        'bg-white rounded-lg border shadow-sm',
        sizeClasses[size]
      )}>
      {/* Header */}
      <div className="flex items-center justify-between m-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pivot Analysis</h2>
          <p className="text-gray-600 text-sm mt-1">Interactive pivot table with configurable rows, columns and aggregation functions for data analysis.</p>
          <div className="flex items-center gap-2 mt-2">
            {localRows.length > 0 && (
              <Badge variant="primary" size="sm">
                Rows: {localRows.length}
              </Badge>
            )}
            {localColumns.length > 0 && (
              <Badge variant="secondary" size="sm">
                Cols: {localColumns.length}
              </Badge>
            )}
            {localValues.length > 0 && (
              <Badge variant="success" size="sm">
                Values: {localValues.length}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {exportable && <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            Export
          </Button>}
          {configurable && <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfigMode(!configMode)}
            iconLeft={<Icon name="settings" />}
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Configure
          </Button>}
        </div>
      </div>

      {/* Configuration Panel */}
      {configMode && (
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2">
                Row Fields
              </Label>
              <Select
                multiple
                value={localRows}
                options={availableFields}
                placeholder="Select row fields..."
                onChange={(values) => setLocalRows(values as string[])}
                size="sm"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">
                Column Fields
              </Label>
              <Select
                multiple
                value={localColumns}
                options={availableFields}
                placeholder="Select column fields..."
                onChange={(values) => setLocalColumns(values as string[])}
                size="sm"
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">
                Value Fields
              </Label>
              <div className="space-y-2">
                {localValues.map((valueConfig, index) => (
                  <div key={index} className="flex gap-2">
                    <Select
                      value={valueConfig.field}
                      options={availableFields.filter(f => 
                        data.some(row => typeof row[f.value] === 'number')
                      )}
                      placeholder="Field..."
                      onChange={(field) => {
                        const newValues = [...localValues];
                        newValues[index] = { ...valueConfig, field: field as string };
                        setLocalValues(newValues);
                      }}
                      size="sm"
                      className="flex-1"
                    />
                    <Select
                      value={valueConfig.aggregation}
                      options={[
                        { value: 'sum', label: 'Sum' },
                        { value: 'avg', label: 'Average' },
                        { value: 'count', label: 'Count' },
                        { value: 'min', label: 'Min' },
                        { value: 'max', label: 'Max' },
                      ]}
                      onChange={(aggregation) => {
                        const newValues = [...localValues];
                        newValues[index] = { ...valueConfig, aggregation: aggregation as any };
                        setLocalValues(newValues);
                      }}
                      size="sm"
                      className="w-24"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newValues = localValues.filter((_, i) => i !== index);
                        setLocalValues(newValues);
                      }}
                      iconLeft={<Icon name="trash" size="xs" />}
                    />
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLocalValues([...localValues, { field: '', aggregation: 'sum' }])}
                  iconLeft={<Icon name="plus" size="xs" />}
                  fullWidth
                >
                  Add Value Field
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      <LoadingState loading={loading}>
        {/* Pivot Table */}
        <div className="overflow-x-auto m-6">
          {pivotStructure.rows.length > 0 && pivotStructure.columns.length > 0 ? (
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {/* Row headers */}
                  {localRows.map((rowField, index) => (
                    <th
                      key={`row-${rowField}`}
                      className="px-6 py-4 text-left text-sm font-medium text-gray-900 border-r border-gray-200"
                    >
                      {rowField.charAt(0).toUpperCase() + rowField.slice(1)}
                    </th>
                  ))}
                  
                  {/* Column headers */}
                  {pivotStructure.columns.map(column => (
                    <th
                      key={column.key}
                      className="px-4 py-4 text-center text-sm font-medium text-gray-900 border-r border-gray-200"
                    >
                      <div className="min-w-0">
                        {localColumns.map((colField, index) => (
                          <div key={index} className="text-xs truncate">
                            {column.data[colField]}
                          </div>
                        ))}
                      </div>
                    </th>
                  ))}
                  
                  {/* Total column header */}
                  {showTotals && (
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-gray-200">
                      Total
                    </th>
                  )}
                </tr>
              </thead>
              
              <tbody>
                {pivotStructure.rows.map((row, index) => (
                  <tr key={row.key} className={cn(
                    'border-b border-gray-200 hover:bg-gray-50 transition-colors',
                    index % 2 === 0 && 'bg-white',
                    index % 2 === 1 && 'bg-gray-50'
                  )}>
                    {/* Row data */}
                    {localRows.map(rowField => (
                      <td
                        key={`${row.key}-${rowField}`}
                        className="px-6 py-4 border-r border-gray-200 font-medium cursor-pointer hover:bg-blue-50 text-sm"
                        onClick={() => handleDrillDown(rowField, row.data[rowField])}
                      >
                        {row.data[rowField]}
                      </td>
                    ))}
                    
                    {/* Cell data */}
                    {pivotStructure.columns.map(column => {
                      const cellData = pivotStructure.cells[row.key]?.[column.key];
                      
                      return (
                        <td
                          key={`${row.key}-${column.key}`}
                          className="px-4 py-4 text-center border-r border-gray-200 cursor-pointer hover:bg-blue-50 text-sm"
                          onClick={() => handleCellClick(cellData, row.data, column.data)}
                        >
                          {cellData ? (
                            <div className="space-y-1">
                              {localValues.map(valueConfig => (
                                <Tooltip
                                  key={valueConfig.field}
                                  content={`${valueConfig.aggregation?.toUpperCase()} of ${valueConfig.field}`}
                                >
                                  <div className="text-xs">
                                    {formatCellValue(cellData[valueConfig.field!], valueConfig)}
                                  </div>
                                </Tooltip>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    })}
                    
                    {/* Row total */}
                    {showTotals && totals.rowTotals?.[row.key] && (
                      <td className="px-6 py-4 text-center font-semibold bg-gray-100">
                        <div className="space-y-1">
                          {localValues.map(valueConfig => (
                            <div key={valueConfig.field} className="text-xs">
                              {formatCellValue(totals.rowTotals[row.key][valueConfig.field!], valueConfig)}
                            </div>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                
                {/* Column totals row */}
                {showTotals && (
                  <tr className="bg-gray-100 font-semibold">
                    {localRows.map((_, index) => (
                      <td
                        key={`total-row-${index}`}
                        className={cn(
                          "px-6 py-4 border-r border-gray-200 text-sm",
                          index === 0 && "text-left"
                        )}
                      >
                        {index === 0 ? 'Total' : ''}
                      </td>
                    ))}
                    
                    {pivotStructure.columns.map(column => (
                      <td
                        key={`total-${column.key}`}
                        className="px-4 py-4 text-center border-r border-gray-200 text-sm"
                      >
                        {totals.columnTotals?.[column.key] && (
                          <div className="space-y-1">
                            {localValues.map(valueConfig => (
                              <div key={valueConfig.field} className="text-xs">
                                {formatCellValue(totals.columnTotals[column.key][valueConfig.field!], valueConfig)}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    ))}
                    
                    {/* Grand total */}
                    <td className="px-6 py-4 text-center bg-gray-200">
                      <div className="space-y-1">
                        {localValues.map(valueConfig => (
                          <div key={valueConfig.field} className="text-xs font-bold">
                            {formatCellValue(totals.grandTotals?.[valueConfig.field!] || 0, valueConfig)}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Icon name="table" size="lg" className="mx-auto mb-4 opacity-50" />
              <p className="mb-2">No pivot data to display</p>
              <p className="text-sm">Configure row, column, and value fields to generate the pivot table</p>
            </div>
          )}
        </div>
      </LoadingState>

      {/* Summary Stats */}
      {pivotStructure.rows.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Rows:</span>
              <span className="ml-2 font-semibold">{pivotStructure.rows.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Columns:</span>
              <span className="ml-2 font-semibold">{pivotStructure.columns.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Data Points:</span>
              <span className="ml-2 font-semibold">
                {Object.values(pivotStructure.cells).reduce((sum, row) => sum + Object.keys(row).length, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Source Records:</span>
              <span className="ml-2 font-semibold">{filteredData.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Pivot Table"
        size="md"
      >
        <div className="space-y-4">
          <p>Choose export format:</p>
          <div className="grid grid-cols-2 gap-2">
            {['csv', 'excel', 'json', 'pdf'].map(format => (
              <Button
                key={format}
                variant="secondary"
                onClick={() => handleExport(format)}
                fullWidth
              >
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
          description={toast.message}
          variant={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          position="bottom-right"
        />
      )}
      </div>
    </div>
  );
};

export default PivotTable;