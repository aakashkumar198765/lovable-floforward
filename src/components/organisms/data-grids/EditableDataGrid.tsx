import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { EditableDataGridProps, DataGridColumn, DataGridData } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Checkbox from '../../atoms/form/Checkbox';
import DatePicker from '../../atoms/form/DatePicker';
import Icon from '../../atoms/display/Icon';
import Spinner from '../../atoms/feedback/Spinner';
import Modal from '../../atoms/feedback/Modal';
import Toast from '../../atoms/feedback/Toast';
import Pagination from '../../atoms/navigation/Pagination';
import BulkActions from '../../molecules/data/BulkActions';
import FilterPanel from '../../molecules/data/FilterPanel';
import SortControl from '../../molecules/data/SortControl';

const EditableDataGrid: React.FC<EditableDataGridProps> = ({
  id = 'editable-data-grid',
  columns = [],
  data = [],
  loading = false,
  pagination,
  selection,
  editable = false,
  expandable,
  virtualization,
  size = 'md',
  bordered = true,
  striped = false,
  sticky = false,
  resizable = false,
  sortable = true,
  filterable = true,
  exportable = true,
  allowedActions = [],
  className = '',
  style = {},
  onRowClick,
  onRowDoubleClick,
  onCellEdit,
  onRowAdd,
  onRowDelete,
  onExport,
  onSort,
  onFilter,
}) => {
  const [internalData, setInternalData] = useState<DataGridData[]>(data);
  const [editingCell, setEditingCell] = useState<{ rowId: string | number; columnKey: string } | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [selectedRows, setSelectedRows] = useState<string[]>(selection?.selectedRowKeys || []);
  const [expandedRows, setExpandedRows] = useState<string[]>(expandable?.expandedRowKeys || []);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false, message: '', type: 'info'
  });

  // Update internal data when prop changes
  useEffect(() => {
    setInternalData(data);
  }, [data]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // Handle cell editing
  const handleCellClick = useCallback((rowId: string | number, columnKey: string, currentValue: any) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.editable || !editable) return;

    if (!allowedActions.includes('edit_completed')) {
      showToast('Cannot edit completed records', 'error');
      return;
    }

    setEditingCell({ rowId, columnKey });
    setEditValue(currentValue);
  }, [columns, editable, allowedActions, showToast]);

  const handleCellSave = useCallback(async () => {
    if (!editingCell) return;

    const column = columns.find(col => col.key === editingCell.columnKey);
    const validationError = column?.validator?.(editValue);

    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    const updatedData = internalData.map(row => {
      if (row.id === editingCell.rowId) {
        const oldValue = row[editingCell.columnKey];
        const newRow = { ...row, [editingCell.columnKey]: editValue };

        onCellEdit?.(editValue, newRow, column!);
        return newRow;
      }
      return row;
    });

    setInternalData(updatedData);
    setEditingCell(null);
    setEditValue('');
    showToast('Cell updated successfully', 'success');
  }, [editingCell, editValue, columns, internalData, onCellEdit, showToast]);

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, [editingCell]);

  // Handle row operations
  const handleRowAdd = useCallback(() => {
    const newRow: DataGridData = {
      id: `new_${Date.now()}`,
      ...columns.reduce((acc, col) => ({ ...acc, [col.dataIndex || col.key!]: '' }), {})
    };

    setInternalData(prev => [...prev, newRow]);
    onRowAdd?.();
    showToast('New row added', 'success');
  }, [columns, allowedActions, onRowAdd, showToast]);

  const handleRowDelete = useCallback((rowId: string) => {
    const rowToDelete = internalData.find(row => row.id === rowId);
    setInternalData(prev => prev.filter(row => row.id !== rowId));
    setSelectedRows(prev => prev.filter(id => id !== rowId));
    
    onRowDelete?.(rowToDelete!);
    setShowDeleteConfirm(null);
    showToast('Row deleted successfully', 'success');
  }, [internalData, allowedActions, onRowDelete, showToast]);

  // Handle selection
  const handleRowSelection = useCallback((rowId: string, checked: boolean) => {
    const newSelectedRows = checked 
      ? [...selectedRows, rowId]
      : selectedRows.filter(id => id !== rowId);
    
    setSelectedRows(newSelectedRows);
    selection?.onSelectionChange?.(newSelectedRows, internalData.filter(row => newSelectedRows.includes(String(row.id))));
  }, [selectedRows, internalData, selection]);

  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelectedRows = checked ? internalData.map(row => String(row.id)) : [];
    setSelectedRows(newSelectedRows);
    selection?.onSelectionChange?.(newSelectedRows, checked ? internalData : []);
  }, [internalData, selection]);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    if (!sortable) return;
    
    const direction = sortConfig?.key === columnKey && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: columnKey, direction });
    onSort?.(columnKey, direction);
  }, [sortable, sortConfig, onSort]);

  // Handle filtering
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [onFilter]);

  // Handle export
  const handleExport = useCallback((format: string) => {
    onExport?.(format);
    setShowExportModal(false);
    showToast(`Data exported as ${format.toUpperCase()}`, 'success');
  }, [internalData, onExport, showToast]);

  // Render cell content
  const renderCellContent = useCallback((value: any, record: DataGridData, column: DataGridColumn, isEditing: boolean) => {
    if (isEditing) {
      const commonProps = {
        value: editValue,
        onChange: (e: any) => setEditValue(e.target?.value || e),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') handleCellSave();
          if (e.key === 'Escape') handleCellCancel();
        },
        size: 'sm' as const,
        autoFocus: true,
      };

      switch (column.editor) {
        case 'select':
          return <Select {...commonProps} {...column.editorProps} />;
        case 'datepicker':
          return <DatePicker {...commonProps} {...column.editorProps} />;
        case 'checkbox':
          return <Checkbox checked={editValue} onChange={(checked) => setEditValue(checked)} />;
        default:
          return <Input {...commonProps} {...column.editorProps} />;
      }
    }

    if (column.render) {
      return column.render(value, record, internalData.indexOf(record));
    }

    return value?.toString() || '';
  }, [editValue, handleCellSave, handleCellCancel, internalData]);

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    let result = [...internalData];

    Object.entries(filters).forEach(([key, filterValue]) => {
      if (filterValue && filterValue !== '') {
        result = result.filter(row => {
          const cellValue = row[key];
          if (typeof filterValue === 'string') {
            return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
          }
          return cellValue === filterValue;
        });
      }
    });

    return result;
  }, [internalData, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Generate bulk actions
  const bulkActions = useMemo(() => {
    const actions = [];
    
    if (allowedActions.includes('bulk_delete')) {
      actions.push({
        key: 'delete',
        label: 'Delete Selected',
        icon: <Icon name="trash" />,
        variant: 'danger' as const,
        confirmRequired: true,
        confirmTitle: 'Delete Selected Rows',
        confirmMessage: `Are you sure you want to delete ${selectedRows.length} row(s)?`,
      });
    }

    if (allowedActions.includes('bulk_edit')) {
      actions.push({
        key: 'edit',
        label: 'Bulk Edit',
        icon: <Icon name="edit" />,
        variant: 'secondary' as const,
      });
    }

    return actions;
  }, [allowedActions, selectedRows.length]);

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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Management</h2>
        <p className="text-gray-600 text-sm mb-4">Track and manage data records with detailed information and real-time updates.</p>
        
        {/* Toolbar */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            {editable && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleRowAdd}
                iconLeft={<Icon name="plus" />}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Add Record
              </Button>
            )}
            
            {filterable && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                iconLeft={<Icon name="filter" />}
                disabled={loading}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Filters
              </Button>
            )}
            
            {exportable && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowExportModal(true)}
                iconLeft={<Icon name="download" />}
                disabled={loading}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Export
              </Button>
            )}
          </div>

          {selectedRows.length > 0 && (
            <BulkActions
              actions={bulkActions}
              selectedItems={selectedRows}
              onAction={(actionKey) => {
                if (actionKey === 'delete') {
                  selectedRows.forEach(rowId => handleRowDelete(rowId));
                }
              }}
              size="sm"
            />
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && filterable && (
        <FilterPanel
          filters={columns
            ?.filter(col => col.filterable)
            ?.map(col => ({
              key: col.key!,
              label: col.title!,
              type: 'text',
            })) || []}
          onChange={handleFilterChange}
          size="sm"
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75">
          <Spinner size="lg" />
        </div>
      )}

      {/* Data Grid */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {selection?.type && (
                <th className="w-12 px-4 py-2">
                  {selection.type === 'checkbox' && (
                    <Checkbox
                      checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                      indeterminate={selectedRows.length > 0 && selectedRows.length < sortedData.length}
                      onChange={(checked) => handleSelectAll(checked)}
                      size="sm"
                    />
                  )}
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-left text-sm font-medium text-gray-900',
                    column.sortable && sortable && 'cursor-pointer hover:bg-gray-100'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key!)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.title}</span>
                    {column.sortable && sortable && (
                      <Icon 
                        name={
                          sortConfig?.key === column.key 
                            ? (sortConfig?.direction === 'asc' ? 'chevron-up' : 'chevron-down')
                            : 'chevron-up-down'
                        }
                        size="sm" 
                      />
                    )}
                  </div>
                </th>
              ))}
              
              {(editable || allowedActions.includes('row_actions')) && (
                <th className="w-32 px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {sortedData.map((record, index) => (
              <tr
                key={record.id}
                className={cn(
                  'border-b border-gray-200 hover:bg-gray-50 transition-colors',
                  selectedRows.includes(String(record.id)) && 'bg-blue-50',
                  index % 2 === 0 && 'bg-white',
                  index % 2 === 1 && 'bg-gray-50'
                )}
                onClick={() => onRowClick?.(record, internalData.indexOf(record))}
                onDoubleClick={() => onRowDoubleClick?.(record, internalData.indexOf(record))}
              >
                {selection?.type && (
                  <td className="px-4 py-2">
                    {selection.type === 'checkbox' && (
                      <Checkbox
                        checked={selectedRows.includes(String(record.id))}
                        onChange={(checked) => handleRowSelection(String(record.id), checked)}
                        size="sm"
                      />
                    )}
                    {selection.type === 'radio' && (
                      <input
                        type="radio"
                        name={`${id}-selection`}
                        checked={selectedRows.includes(String(record.id))}
                        onChange={() => handleRowSelection(String(record.id), true)}
                      />
                    )}
                  </td>
                )}
                
                {columns.map((column) => {
                  const isEditing = editingCell?.rowId === record.id && editingCell?.columnKey === column.key;
                  const value = record[column.dataIndex || column.key!];
                  
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        'px-6 py-4 text-sm text-gray-900',
                        column.editable && editable && 'cursor-pointer hover:bg-blue-50'
                      )}
                      onClick={() => handleCellClick(record.id!, column.key!, value)}
                    >
                      {renderCellContent(value, record, column, isEditing)}
                    </td>
                  );
                })}
                
                {(editable || allowedActions.includes('row_actions')) && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {editable && allowedActions.includes('edit_rows') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle row edit
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs px-3 py-1"
                        >
                          Edit
                        </Button>
                      )}
                      
                      {allowedActions.includes('delete_rows') && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(String(record.id));
                          }}
                          className="text-gray-700 border-gray-300 hover:bg-gray-50 text-xs px-3 py-1"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="border-t border-gray-200 bg-white p-6">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            showSizeChanger={pagination.showSizeChanger}
            showQuickJumper={pagination.showQuickJumper}
            onChange={pagination.onChange || (() => console.log('Page changed'))}
            onShowSizeChange={pagination.onShowSizeChange}
            size="sm"
          />
        </div>
      )}

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Data"
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this row? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => showDeleteConfirm && handleRowDelete(showDeleteConfirm)}
            >
              Delete
            </Button>
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

export default EditableDataGrid;