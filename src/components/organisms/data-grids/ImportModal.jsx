import React, { useState } from 'react';
import Button from '../../atoms/form/Button';
import FileUpload from '../../atoms/form/FileUpload';
import Badge from '../../atoms/display/Badge';
import Modal from '../../atoms/feedback/Modal';

/**
 * ImportModal - Generic Import Modal Component
 * 
 * This component displays an import modal with file upload functionality,
 * template download, and import template headers display.
 * 
 * Key Features:
 * - Drag and drop file upload
 * - Template download functionality
 * - Template headers display
 * - Generic import functionality
 * - Professional, clean design
 * - API-ready structure
 */
const ImportModal = ({
  // Modal Props
  isOpen = false,
  onClose,
  title = "Upload Data",
  
  // Import Data
  onImport,
  onDownloadTemplate,
  
  // Loading and Error States
  loading = false,
  error = null,
  
  // Customization
  size = "5xl",
  
  // File Upload Options
  acceptedFileTypes = ".xlsx,.xls",
  maxFileSize = 10 * 1024 * 1024, // 10MB
  
  // Template Configuration
  templateHeaders = [],
  
  // Labels (for customization)
  uploadAreaLabel = "Drop your file here",
  uploadAreaSubtext = "or click to browse files",
  supportedFilesText = "Supports .xlsx, .xls files up to 10MB",
  templateSectionTitle = "Import Template Headers",
  downloadTemplateLabel = "Download Template",
  importButtonLabel = "Import",
  cancelButtonLabel = "Cancel",
  
  // Tips
  showTips = true,
  tipText = "Ensure your file contains all Import Template Headers and follows the required schema.",
  templateUsageText = "Download the template, fill in your data in the blank rows below the headers, then upload the completed file."
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // Default template headers if none provided
  const defaultTemplateHeaders = [
    { key: 'recordId', label: 'Record ID', required: true },
    { key: 'title', label: 'Title', required: true },
    { key: 'description', label: 'Description', required: false },
    { key: 'status', label: 'Status', required: true },
    { key: 'type', label: 'Type', required: true },
    { key: 'category', label: 'Category', required: false },
    { key: 'priority', label: 'Priority', required: false },
    { key: 'assignedTo', label: 'Assigned To', required: false },
    { key: 'dueDate', label: 'Due Date', required: false },
    { key: 'startDate', label: 'Start Date', required: false },
    { key: 'endDate', label: 'End Date', required: false },
    { key: 'tags', label: 'Tags', required: false },
    { key: 'notes', label: 'Notes', required: false },
    { key: 'estimatedHours', label: 'Estimated Hours', required: false },
    { key: 'actualHours', label: 'Actual Hours', required: false },
    { key: 'budget', label: 'Budget', required: false }
  ];

  const displayHeaders = templateHeaders.length > 0 ? templateHeaders : defaultTemplateHeaders;

  // Handle file selection
  const handleFilesChange = (files) => {
    setSelectedFiles(files);
    setUploadError('');
  };

  // Handle file upload error
  const handleFileError = (error) => {
    setUploadError(error);
  };

  // Handle import action
  const handleImport = () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select a file to import');
      return;
    }
    
    if (onImport && typeof onImport === 'function') {
      onImport({
        files: selectedFiles,
        fileName: selectedFiles[0]?.name,
        fileSize: selectedFiles[0]?.size
      });
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    if (onDownloadTemplate && typeof onDownloadTemplate === 'function') {
      onDownloadTemplate({
        headers: displayHeaders,
        format: 'xlsx'
      });
    }
  };

  // Handle cancel/close
  const handleCancel = () => {
    // Reset form
    setSelectedFiles([]);
    setUploadError('');
    
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      size={size}
    >
      <div className="space-y-6 min-h-[650px]">
        {/* Error State */}
        {(error || uploadError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error || uploadError}</p>
          </div>
        )}

        {/* File Upload Section */}
        <div className="space-y-4">
          <FileUpload
            accept={acceptedFileTypes}
            maxSize={maxFileSize}
            multiple={false}
            dragAndDrop={true}
            showPreview={true}
            uploadText={uploadAreaLabel}
            files={selectedFiles}
            onFilesChange={handleFilesChange}
            disabled={loading}
            helperText={supportedFilesText}
            className="border-2 border-dashed border-gray-300 rounded-lg"
          />
        </div>

        {/* Template Headers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {templateSectionTitle}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              disabled={loading}
              iconLeft={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              }
            >
              {downloadTemplateLabel}
            </Button>
          </div>
          
          {/* Template Headers Grid */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {displayHeaders.map((header, index) => (
                <div key={header.key || index} className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    • {header.label || header}
                  </span>
                  {header.required && (
                    <Badge variant="danger" size="xs">
                      *
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {showTips && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  💡 Tip: {tipText}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  📝 Template Usage: {templateUsageText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Import Summary */}
        {selectedFiles.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
              File Ready for Import
            </h4>
            <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <p>• File: {selectedFiles[0]?.name}</p>
              <p>• Size: {(selectedFiles[0]?.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>• Type: {selectedFiles[0]?.type || 'Excel file'}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            onClick={handleImport}
            disabled={loading || selectedFiles.length === 0}
            loading={loading}
          >
            {loading ? 'Importing...' : importButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;