import React, { useState, useMemo, useCallback } from 'react';
import { ExportManagerProps } from '../../../types';

export const ExportManager: React.FC<ExportManagerProps> = ({
  id,
  title = 'Export Manager',
  data = [],
  formats = [
    { key: 'csv', label: 'CSV', extension: 'csv', mimeType: 'text/csv', description: 'Comma-separated values', icon: '📄' },
    { key: 'excel', label: 'Excel', extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Microsoft Excel file', icon: '📊' },
    { key: 'json', label: 'JSON', extension: 'json', mimeType: 'application/json', description: 'JavaScript Object Notation', icon: '🔧' },
    { key: 'pdf', label: 'PDF', extension: 'pdf', mimeType: 'application/pdf', description: 'Portable Document Format', icon: '📋' }
  ],
  templates = [],
  fields = [],
  filters = {},
  scheduling,
  size = 'md',
  showPreview = true,
  showProgress = true,
  batchSize = 1000,
  onExport,
  onSchedule,
  onTemplateCreate,
  onTemplateUpdate,
  className = '',
  style = {},
  allowedActions = [],
}) => {
  const [selectedFormat, setSelectedFormat] = useState(formats[0]?.key || '');
  const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.key!).filter(Boolean));
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Get data - either directly passed or from function
  const exportData = useMemo(async () => {
    if (typeof data === 'function') {
      return await data();
    }
    return data;
  }, [data]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    if (!Array.isArray(exportData)) return [];
    
    return exportData.filter(item => {
      return Object.entries(localFilters).every(([key, value]) => {
        if (!value) return true;
        if (Array.isArray(value)) {
          return value.includes(item[key]);
        }
        return item[key] === value;
      });
    });
  }, [exportData, localFilters]);

  // Filter fields based on selection
  const exportFields = useMemo(() => {
    return fields.filter(field => selectedFields.includes(field.key!));
  }, [fields, selectedFields]);

  const handleExport = useCallback(async () => {
    if (!onExport) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const options = {
        format: selectedFormat,
        fields: exportFields,
        filters: localFilters,
        template: selectedTemplate,
        batchSize,
      };

      // Simulate progress for large exports
      const dataToExport = Array.isArray(filteredData) ? filteredData : await filteredData;
      const total = dataToExport.length;
      
      if (total > batchSize) {
        for (let i = 0; i < total; i += batchSize) {
          const batch = dataToExport.slice(i, i + batchSize);
          const progress = Math.min(((i + batch.length) / total) * 100, 100);
          setExportProgress(progress);
          
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      await onExport(selectedFormat, options);
      setExportProgress(100);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  }, [selectedFormat, exportFields, localFilters, selectedTemplate, batchSize, filteredData, onExport]);

  const handlePreview = useCallback(async () => {
    const dataToPreview = Array.isArray(filteredData) ? filteredData : await filteredData;
    setPreviewData(dataToPreview.slice(0, 10)); // Preview first 10 rows
    setShowPreviewModal(true);
  }, [filteredData]);

  const handleTemplateCreate = useCallback(() => {
    if (!newTemplateName.trim() || !onTemplateCreate) return;

    const template = {
      id: Date.now().toString(),
      name: newTemplateName,
      format: selectedFormat,
      fields: selectedFields,
      filters: localFilters,
    };

    onTemplateCreate(template);
    setNewTemplateName('');
    setShowTemplateModal(false);
  }, [newTemplateName, selectedFormat, selectedFields, localFilters, onTemplateCreate]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setSelectedFormat(template.format || selectedFormat);
    setSelectedFields(template.fields || selectedFields);
    setLocalFilters(template.filters || {});
    setSelectedTemplate(templateId);
  }, [templates, selectedFormat, selectedFields]);

  const getFormatIcon = (formatKey: string) => {
    const format = formats.find(f => f.key === formatKey);
    return format?.icon || '📄';
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderFormatSelection = () => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {formats.map((format) => (
          <div
            key={format.key}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedFormat === format.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => setSelectedFormat(format.key!)}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{format.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{format.label}</h4>
                <p className="text-sm text-gray-600">{format.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFieldSelection = () => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Fields</h3>
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">{selectedFields.length} of {fields.length} fields selected</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFields(fields.map(f => f.key!).filter(Boolean))}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedFields([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fields.map((field) => (
            <label key={field.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.key!)}
                onChange={(e) => {
                  setSelectedFields(prev => 
                    e.target.checked 
                      ? [...prev, field.key!]
                      : prev.filter(k => k !== field.key)
                  );
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{field.label}</span>
              {field.required && <span className="text-red-500">*</span>}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Templates</h3>
        {allowedActions.includes('create_templates') && (
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save as Template
          </button>
        )}
      </div>
      
      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => handleTemplateSelect(template.id!)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600">
                    {getFormatIcon(template.format!)} {template.format?.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {template.fields?.length || 0} fields
                  </p>
                </div>
                {allowedActions.includes('edit_templates') && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit template functionality
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✏️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No saved templates yet</p>
        </div>
      )}
    </div>
  );

  const renderFilters = () => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(localFilters).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                value={value as string || ''}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Filter by ${key}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => {
    if (!showPreview) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
          <button
            onClick={handlePreview}
            className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            👁️ Preview Data
          </button>
        </div>
        
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total records: {Array.isArray(filteredData) ? filteredData.length : 'Loading...'}</span>
            <span>Selected fields: {selectedFields.length}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderScheduling = () => {
    if (!scheduling?.enabled) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Scheduling</h3>
          {allowedActions.includes('schedule_exports') && (
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              📅 Schedule Export
            </button>
          )}
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-700">
            Schedule automatic exports to run at specified intervals.
          </p>
        </div>
      </div>
    );
  };

  const renderProgress = () => {
    if (!showProgress || !isExporting) return null;

    return (
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Exporting...</span>
            <span className="text-sm text-blue-700">{Math.round(exportProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderActions = () => (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Ready to export {Array.isArray(filteredData) ? filteredData.length : '...'} records
      </div>
      
      <div className="flex space-x-3">
        {showPreview && (
          <button
            onClick={handlePreview}
            disabled={isExporting}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Preview
          </button>
        )}
        
        <button
          onClick={handleExport}
          disabled={isExporting || !selectedFormat || selectedFields.length === 0}
          className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : `Export as ${selectedFormat?.toUpperCase()}`}
        </button>
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className={`export-manager ${sizeClasses[size]} ${className}`}
      style={style}
      role="region"
      aria-label="Export Manager"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {renderProgress()}
      {renderFormatSelection()}
      {renderTemplates()}
      {renderFieldSelection()}
      {renderFilters()}
      {renderPreview()}
      {renderScheduling()}
      {renderActions()}

      {/* Template Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">Save Export Template</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTemplateCreate}
                disabled={!newTemplateName.trim()}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Data Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {exportFields.map(field => (
                      <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      {exportFields.map(field => (
                        <td key={field.key} className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div className="truncate" title={String(field.formatter ? field.formatter(row[field.key!]) : row[field.key!])}>
                            {field.formatter ? field.formatter(row[field.key!]) : row[field.key!]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Showing first 10 rows of {Array.isArray(filteredData) ? filteredData.length : 0} total records
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportManager;