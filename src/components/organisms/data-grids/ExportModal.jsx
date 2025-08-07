import React, { useState } from 'react';
import Button from '../../atoms/form/Button';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Badge from '../../atoms/display/Badge';
import Modal from '../../atoms/feedback/Modal';

/**
 * ExportModal - Generic Export Modal Component
 * 
 * This component displays an export modal with date range selection,
 * document number filtering, and export functionality.
 * 
 * Key Features:
 * - Date range selection (From Date, To Date)
 * - Document number filtering
 * - Generic export functionality
 * - Professional, clean design
 * - API-ready structure
 */
const ExportModal = ({
  // Modal Props
  isOpen = false,
  onClose,
  title = "Export Data",
  
  // Export Data
  onExport,
  
  // Loading and Error States
  loading = false,
  error = null,
  
  // Customization
  size = "4xl",
  
  // Export Configuration
  exportFields = [],
  defaultFilters = {},
  
  // Labels (for customization)
  exportButtonLabel = "Export",
  cancelButtonLabel = "Cancel"
}) => {
  const [filters, setFilters] = useState(defaultFilters || {});
  
  // Default export fields if none provided
  const defaultExportFields = [
    {
      key: 'dateRange',
      type: 'dateRange',
      label: 'Date Range',
      fromLabel: 'From Date',
      toLabel: 'To Date',
      required: false
    },
    {
      key: 'recordId',
      type: 'text',
      label: 'Record ID Filter',
      placeholder: 'Enter record ID to filter',
      required: false
    },
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' }
      ],
      required: false
    },
    {
      key: 'type',
      type: 'select',
      label: 'Type',
      options: [
        { value: '', label: 'All Types' },
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
        { value: 'type3', label: 'Type 3' }
      ],
      required: false
    }
  ];
  
  const displayFields = exportFields.length > 0 ? exportFields : defaultExportFields;

  // Handle filter changes
  const handleFilterChange = (fieldKey, value) => {
    setFilters(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };
  
  // Handle date range changes
  const handleDateRangeChange = (fieldKey, dateType, value) => {
    setFilters(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [dateType]: value
      }
    }));
  };

  // Handle export action
  const handleExport = () => {
    if (onExport && typeof onExport === 'function') {
      onExport({
        filters,
        exportData: {
          timestamp: new Date().toISOString(),
          appliedFilters: filters
        }
      });
    }
  };

  // Handle cancel/close
  const handleCancel = () => {
    // Reset form
    setFilters(defaultFilters || {});
    
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      size={size}
    >
      <div className="space-y-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Dynamic Export Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayFields.map((field) => {
            if (field.type === 'dateRange') {
              return (
                <div key={field.key} className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={field.fromLabel || 'From Date'}
                      type="date"
                      value={filters[field.key]?.from || ''}
                      onChange={(e) => handleDateRangeChange(field.key, 'from', e.target.value)}
                      max={getTodayDate()}
                      disabled={loading}
                      required={field.required}
                    />
                    
                    <Input
                      label={field.toLabel || 'To Date'}
                      type="date"
                      value={filters[field.key]?.to || ''}
                      onChange={(e) => handleDateRangeChange(field.key, 'to', e.target.value)}
                      max={getTodayDate()}
                      min={filters[field.key]?.from}
                      disabled={loading}
                      required={field.required}
                    />
                  </div>
                </div>
              );
            }
            
            if (field.type === 'select') {
              return (
                <div key={field.key} className="w-full">
                  <Select
                    label={field.label}
                    value={filters[field.key] || ''}
                    onChange={(e) => handleFilterChange(field.key, e.target.value)}
                    options={field.options || []}
                    disabled={loading}
                    required={field.required}
                    placeholder={`Select ${field.label}`}
                    className="w-full"
                  />
                </div>
              );
            }
            
            // Default to text input
            return (
              <div key={field.key} className="w-full">
                <Input
                  label={field.label}
                  type={field.type || 'text'}
                  value={filters[field.key] || ''}
                  onChange={(e) => handleFilterChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={loading}
                  required={field.required}
                  className="w-full"
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelButtonLabel}
          </Button>
          
          <Button
            variant="primary" 
            size="sm"
            onClick={handleExport}
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Exporting...' : exportButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;