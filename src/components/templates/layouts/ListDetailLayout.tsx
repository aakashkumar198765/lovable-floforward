import React, { useState, useCallback } from 'react';
import { ListDetailLayoutProps } from '../../../types';
import { Search } from 'lucide-react';

export const ListDetailLayout: React.FC<ListDetailLayoutProps> = ({
  id,
  title = 'List & Detail',
  listTitle = 'Items',
  detailTitle = 'Details',
  items = [],
  selectedItem,
  listWidth = 'w-1/3',
  showSearch = true,
  showFilters = true,
  showBulkActions = true,
  showItemActions = true,
  virtualizedList = false,
  resizable = true,
  size = 'md',
  layout = 'horizontal',
  filters = [],
  bulkActions = [],
  itemActions = [],
  searchPlaceholder = 'Search items...',
  emptyStateMessage = 'No items found',
  loadingState = false,
  onItemSelect,
  onItemAction,
  onBulkAction,
  onSearch,
  onFilter,
  onSort,
  listContent,
  detailContent,
  className = '',
  style = {},
  children,
  allowedActions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentSelectedItem, setCurrentSelectedItem] = useState(selectedItem);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  }, [onSearch]);

  const handleFilter = useCallback((filterKey: string, value: any) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  }, [activeFilters, onFilter]);

  const handleSort = useCallback((field: string) => {
    const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  }, [sortBy, sortDirection, onSort]);

  const handleItemSelect = useCallback((item: any) => {
    setCurrentSelectedItem(item);
    onItemSelect?.(item);
  }, [onItemSelect]);

  const handleItemAction = useCallback((item: any, action: string) => {
    onItemAction?.(item, action);
  }, [onItemAction]);

  const handleBulkSelect = useCallback((itemId: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedItems(selected ? items.map(item => item.id).filter(Boolean) : []);
  }, [items]);

  const handleBulkAction = useCallback((action: string) => {
    onBulkAction?.(selectedItems, action);
    setSelectedItems([]);
  }, [selectedItems, onBulkAction]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const layoutClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const filteredItems = items.filter(item => {
    // Search filter
    const matchesSearch = !searchTerm || 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Active filters
    const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
      if (!value) return true;
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortBy] || '';
    const bValue = b[sortBy] || '';
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const renderSearchAndFilters = () => (
    <div className="p-4 border-b border-gray-200 space-y-4">
      {showSearch && (
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      )}

      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilter(filter.key, e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}

      {showBulkActions && selectedItems.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <span className="text-sm font-medium text-blue-900">
            {selectedItems.length} item(s) selected
          </span>
          <div className="flex space-x-2">
            {bulkActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleBulkAction(action.id)}
                disabled={!allowedActions.includes(action.id)}
                className={`px-3 py-1 text-sm rounded ${
                  action.variant === 'danger' 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedItems([])}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderListHeader = () => (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">{listTitle}</h2>
        <div className="flex items-center space-x-2">
          {showBulkActions && (
            <input
              type="checkbox"
              checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          <span className="text-sm text-gray-600">
            {sortedItems.length} item(s)
          </span>
        </div>
      </div>
    </div>
  );

  const renderListItem = (item: any, index: number) => {
    const isSelected = currentSelectedItem?.id === item.id;
    const isBulkSelected = selectedItems.includes(item.id);

    return (
      <div
        key={item.id || index}
        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'bg-blue-50 border-blue-200' : ''
        }`}
        onClick={() => handleItemSelect(item)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {showBulkActions && (
              <input
                type="checkbox"
                checked={isBulkSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  handleBulkSelect(item.id, e.target.checked);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            )}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {item.name || item.title || item.id}
              </div>
              {item.description && (
                <div className="text-sm text-gray-500">{item.description}</div>
              )}
              {item.status && (
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'active' ? 'bg-green-100 text-green-800' :
                    item.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {showItemActions && itemActions.length > 0 && (
            <div className="flex space-x-1">
              {itemActions.map((action) => (
                <button
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemAction(item, action.id);
                  }}
                  disabled={!allowedActions.includes(action.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListContent = () => {
    if (loadingState) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (sortedItems.length === 0) {
      return (
        <div className="text-center p-8">
          <div className="text-gray-400 text-4xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">{emptyStateMessage}</p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto flex-1">
        {sortedItems.map(renderListItem)}
      </div>
    );
  };

  const renderDetailContent = () => {
    if (!currentSelectedItem) {
      return (
        <div className="flex items-center justify-center h-full text-center p-8">
          <div>
            <div className="text-gray-400 text-4xl mb-4">👆</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select an item</h3>
            <p className="text-gray-600">Choose an item from the list to view its details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{detailTitle}</h2>
          <div className="text-sm text-gray-600">
            {currentSelectedItem.name || currentSelectedItem.title || currentSelectedItem.id}
          </div>
        </div>

        {detailContent || (
          <div className="space-y-4">
            {Object.entries(currentSelectedItem).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={id}
      className={`list-detail-layout ${sizeClasses[size]} ${className}`}
      style={style}
      role="main"
      aria-label="List Detail Layout"
    >
      <div className="h-full bg-white shadow">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className={`flex ${layoutClasses[layout]} h-full`}>
          {/* List Panel */}
          <div className={`${layout === 'horizontal' ? listWidth : 'h-1/2'} border-r border-gray-200 flex flex-col`}>
            {renderSearchAndFilters()}
            {renderListHeader()}
            
            <div className="flex-1 overflow-hidden">
              {listContent || renderListContent()}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 flex flex-col">
            {renderDetailContent()}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListDetailLayout;