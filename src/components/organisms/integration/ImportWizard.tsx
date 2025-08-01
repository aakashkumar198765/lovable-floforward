import React, { useState, useCallback, useMemo } from 'react';
import { ImportWizardProps, ImportStep } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import FileUpload from '../../atoms/form/FileUpload';
import Select from '../../atoms/form/Select';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Alert from '../../atoms/feedback/Alert';
import Toast from '../../atoms/feedback/Toast';
import ProgressTracker from '../../molecules/display/ProgressTracker';
import LoadingState from '../../atoms/feedback/LoadingState';

const ImportWizard: React.FC<ImportWizardProps> = ({
  id = 'import-wizard',
  title = 'Data Import Wizard',
  steps = [
    { id: 'upload', name: 'Upload File', type: 'upload', status: 'pending' },
    { id: 'mapping', name: 'Field Mapping', type: 'mapping', status: 'pending' },
    { id: 'validation', name: 'Data Validation', type: 'validation', status: 'pending' },
    { id: 'preview', name: 'Preview', type: 'preview', status: 'pending' },
    { id: 'import', name: 'Import Data', type: 'import', status: 'pending' },
  ],
  supportedFormats = ['csv', 'xlsx', 'json', 'xml'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
  templateDownload = true,
  batchProcessing = true,
  validationRules = [],
  fieldMapping = [],
  size = 'md',
  showProgress = true,
  allowSkipSteps = false,
  commerceState = 'none',
  workflowContext,
  aiConfig,
  schema,
  allowedActions = [],
  userRole,
  auditTrail = { enabled: false, level: 'basic', trackChanges: false, logUserActions: false },
  encryptionLevel = 'none',
  className = '',
  style = {},
  onFileUpload,
  onFieldMapping,
  onValidation,
  onImport,
  onComplete,
  onCancel,
  onUpdate = () => {},
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [mappingConfig, setMappingConfig] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    show: false, message: '', type: 'info'
  });

  // Audit logging utility
  const logAuditEvent = useCallback((action: string, details: any) => {
    if (auditTrail.enabled) {
      console.log(`[AUDIT] ${action}:`, {
        timestamp: new Date().toISOString(),
        user: userRole?.id || 'unknown',
        component: 'ImportWizard',
        action,
        details,
        commerceState,
        workflowContext,
      });
      onUpdate?.({
        type: 'audit',
        action,
        details,
        timestamp: new Date().toISOString(),
      });
    }
  }, [auditTrail, userRole, commerceState, workflowContext, onUpdate]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }, []);

  // Get current step
  const currentStep = useMemo(() => steps[currentStepIndex], [steps, currentStepIndex]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!supportedFormats.includes(fileExtension!)) {
      setErrors([`Unsupported file format. Supported formats: ${supportedFormats.join(', ')}`]);
      return;
    }

    if (file.size > maxFileSize) {
      setErrors([`File size exceeds maximum limit of ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`]);
      return;
    }

    setProcessing(true);
    setErrors([]);
    
    try {
      // Parse file content
      let data: any[] = [];
      
      if (fileExtension === 'csv') {
        const text = await file.text();
        data = parseCSV(text);
      } else if (fileExtension === 'json') {
        const text = await file.text();
        data = JSON.parse(text);
      } else if (fileExtension === 'xlsx') {
        // This would require a library like xlsx
        showToast('Excel files require additional processing', 'info');
        data = []; // Placeholder
      }

      setUploadedFile(file);
      setParsedData(data);
      
      logAuditEvent('file_upload', {
        fileName: file.name,
        fileSize: file.size,
        recordCount: data.length,
      });

      onFileUpload?.(file);
      showToast(`File uploaded successfully. ${data.length} records found.`, 'success');
      
      // Move to next step
      setCurrentStepIndex(1);
      
    } catch (error) {
      console.error('File upload failed:', error);
      setErrors(['Failed to parse file. Please check the file format.']);
      showToast('Failed to upload file', 'error');
    } finally {
      setProcessing(false);
    }
  }, [supportedFormats, maxFileSize, logAuditEvent, onFileUpload, showToast]);

  // Simple CSV parser
  const parseCSV = useCallback((csvText: string) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const record: Record<string, any> = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      return record;
    });
  }, []);

  // Handle field mapping
  const handleFieldMapping = useCallback(() => {
    if (Object.keys(mappingConfig).length === 0) {
      setErrors(['Please configure field mapping before proceeding']);
      return;
    }

    setProcessing(true);
    setErrors([]);

    try {
      // Apply field mapping
      const mappedData = parsedData.map(record => {
        const mappedRecord: Record<string, any> = {};
        Object.entries(mappingConfig).forEach(([sourceField, targetField]) => {
          if (targetField && record[sourceField] !== undefined) {
            // Apply transformer if available
            const mapping = fieldMapping.find(m => m.source === sourceField && m.target === targetField);
            mappedRecord[targetField] = mapping?.transformer ? mapping.transformer(record[sourceField]) : record[sourceField];
          }
        });
        return mappedRecord;
      });

      setParsedData(mappedData);
      
      logAuditEvent('field_mapping', {
        mappingConfig,
        recordCount: mappedData.length,
      });

      onFieldMapping?.(Object.entries(mappingConfig).map(([source, target]) => ({ source, target })));
      showToast('Field mapping applied successfully', 'success');
      
      // Move to validation step
      setCurrentStepIndex(2);
      
    } catch (error) {
      console.error('Field mapping failed:', error);
      setErrors(['Failed to apply field mapping']);
      showToast('Field mapping failed', 'error');
    } finally {
      setProcessing(false);
    }
  }, [mappingConfig, parsedData, fieldMapping, logAuditEvent, onFieldMapping, showToast]);

  // Handle validation
  const handleValidation = useCallback(async () => {
    if (!onValidation) {
      setCurrentStepIndex(3); // Skip to preview
      return;
    }

    setProcessing(true);
    setErrors([]);

    try {
      const results = await onValidation(parsedData);
      setValidationResults(results);
      
      const errorCount = results.filter((r: any) => r.errors?.length > 0).length;
      
      logAuditEvent('data_validation', {
        totalRecords: results.length,
        errorCount,
        validRecords: results.length - errorCount,
      });

      if (errorCount === 0) {
        showToast('All data validated successfully', 'success');
        setCurrentStepIndex(3);
      } else {
        showToast(`Validation completed. ${errorCount} records have errors.`, 'warning');
        setCurrentStepIndex(3); // Still proceed to preview
      }
      
    } catch (error) {
      console.error('Validation failed:', error);
      setErrors(['Data validation failed']);
      showToast('Validation failed', 'error');
    } finally {
      setProcessing(false);
    }
  }, [parsedData, onValidation, logAuditEvent, showToast]);

  // Handle import
  const handleImport = useCallback(async () => {
    if (!onImport) return;

    setProcessing(true);
    setErrors([]);

    try {
      const validData = validationResults.length > 0 
        ? validationResults.filter((r: any) => !r.errors || r.errors.length === 0)
        : parsedData;

      const result = await onImport(validData, {
        batchSize: batchProcessing ? 100 : validData.length,
        skipErrors: true,
        mapping: mappingConfig,
      });

      logAuditEvent('data_import', {
        totalRecords: validData.length,
        importedRecords: result?.imported || validData.length,
        failedRecords: result?.failed || 0,
      });

      showToast(`Import completed. ${result?.imported || validData.length} records imported.`, 'success');
      
      // Complete the wizard
      setCurrentStepIndex(steps.length - 1);
      onComplete?.(result);
      
    } catch (error) {
      console.error('Import failed:', error);
      setErrors(['Data import failed']);
      showToast('Import failed', 'error');
    } finally {
      setProcessing(false);
    }
  }, [parsedData, validationResults, mappingConfig, batchProcessing, onImport, logAuditEvent, showToast, steps.length, onComplete]);

  // Handle step navigation
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    setCurrentStepIndex(stepIndex);
    setErrors([]);
  }, [steps.length]);

  // Handle skip step
  const skipStep = useCallback(() => {
    if (!allowSkipSteps || !currentStep?.optional) return;
    
    logAuditEvent('step_skip', { stepId: currentStep.id, stepName: currentStep.name });
    showToast(`Skipped ${currentStep.name}`, 'info');
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [allowSkipSteps, currentStep, currentStepIndex, steps.length, logAuditEvent, showToast]);

  // Get available source fields
  const sourceFields = useMemo(() => {
    if (!parsedData.length) return [];
    return Object.keys(parsedData[0]).map(key => ({ value: key, label: key }));
  }, [parsedData]);

  // Get available target fields
  const targetFields = useMemo(() => {
    return fieldMapping.map(m => ({ value: m.target!, label: m.target! }));
  }, [fieldMapping]);

  // Component styling based on commerce state
  const getStateStyles = () => {
    switch (commerceState) {
      case 'completion':
        return 'border-green-200 bg-green-50';
      case 'settlement':
        return 'border-blue-200 bg-blue-50';
      case 'execution':
        return 'border-orange-200 bg-orange-50';
      case 'agreement':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep?.type) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Icon name="upload" size="lg" className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Upload Your Data File</h3>
              <p className="text-gray-600 mb-4">
                Supported formats: {supportedFormats.map(f => f.toUpperCase()).join(', ')}
              </p>
            </div>

            <FileUpload
              accept={supportedFormats.map(f => `.${f}`).join(',')}
              maxSize={maxFileSize}
              onFilesChange={handleFileUpload}
              dragAndDrop
              showPreview
              uploadText="Click to upload or drag and drop"
              size={size}
            />

            {templateDownload && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Generate template download
                    showToast('Template download started', 'info');
                  }}
                  iconLeft={<Icon name="download" />}
                >
                  Download Template
                </Button>
              </div>
            )}

            {uploadedFile && (
              <Alert
                variant="success"
                title="File Uploaded"
                description={`${uploadedFile.name} (${parsedData.length} records)`}
              />
            )}
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Configure Field Mapping</h3>
              <p className="text-gray-600 mb-4">
                Map source fields from your file to target fields in the system.
              </p>
            </div>

            <div className="space-y-4">
              {sourceFields.map(field => (
                <div key={field.value} className="grid grid-cols-2 gap-4 items-center">
                  <div className="font-medium">{field.label}</div>
                  <Select
                    value={mappingConfig[field.value] || ''}
                    options={[{ value: '', label: 'Skip this field' }, ...targetFields]}
                    onChange={(value) => setMappingConfig(prev => ({ ...prev, [field.value]: value as string }))}
                    placeholder="Select target field..."
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleFieldMapping}
                disabled={processing || Object.keys(mappingConfig).length === 0}
              >
                Apply Mapping
              </Button>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Data Validation</h3>
              <p className="text-gray-600 mb-4">
                Validating {parsedData.length} records against system rules...
              </p>
            </div>

            <LoadingState loading={processing}>
              {validationResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.filter((r: any) => !r.errors || r.errors.length === 0).length}
                      </div>
                      <div className="text-sm text-green-600">Valid Records</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {validationResults.filter((r: any) => r.errors?.length > 0).length}
                      </div>
                      <div className="text-sm text-red-600">Error Records</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{validationResults.length}</div>
                      <div className="text-sm text-blue-600">Total Records</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => setCurrentStepIndex(3)}>
                      Continue to Preview
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={handleValidation}
                    disabled={processing}
                    loading={processing}
                  >
                    Start Validation
                  </Button>
                </div>
              )}
            </LoadingState>
          </div>
        );

      case 'preview':
        const dataToPreview = validationResults.length > 0 
          ? validationResults.filter((r: any) => !r.errors || r.errors.length === 0).slice(0, 10)
          : parsedData.slice(0, 10);

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Preview Data</h3>
              <p className="text-gray-600 mb-4">
                Review the first 10 records before importing.
              </p>
            </div>

            {dataToPreview.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(dataToPreview[0]).map(key => (
                        <th key={key} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataToPreview.map((record: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(record).map((value: any, cellIndex: number) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900 border-b">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Alert
                variant="warning"
                title="No Data to Preview"
                description="No valid records found for preview."
              />
            )}

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={processing || dataToPreview.length === 0}
                loading={processing}
              >
                Start Import
              </Button>
            </div>
          </div>
        );

      case 'import':
        return (
          <div className="space-y-6 text-center">
            <Icon name="check-circle" size="lg" className="mx-auto text-green-500" />
            <div>
              <h3 className="text-lg font-medium mb-2">Import Complete!</h3>
              <p className="text-gray-600">
                Your data has been successfully imported into the system.
              </p>
            </div>
            <Button variant="primary" onClick={() => onComplete?.({})}>
              Finish
            </Button>
          </div>
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <div 
      className={cn(
        'rounded-lg border',
        getStateStyles(),
        sizeClasses[size],
        className
      )}
      style={style}
      data-commerce-state={commerceState}
    >
      {/* Header */}
      <div className="border-b bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            {allowSkipSteps && currentStep?.optional && (
              <Button variant="ghost" size="sm" onClick={skipStep}>
                Skip Step
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      {showProgress && (
        <div className="border-b bg-gray-50 p-4">
          <ProgressTracker
            steps={steps.map((step, index) => ({
              key: step.id!,
              title: step.name!,
              status: index < currentStepIndex ? 'completed' : 
                     index === currentStepIndex ? 'in_progress' : 'pending',
            }))}
            currentStep={currentStep?.id}
            layout="horizontal"
            size="xs"
            showProgress
          />
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4">
          {errors.map((error, index) => (
            <Alert
              key={index}
              variant="error"
              description={error}
              className="mb-2"
            />
          ))}
        </div>
      )}

      {/* Step Content */}
      <div className="p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => goToStep(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            iconLeft={<Icon name="chevron-left" />}
          >
            Previous
          </Button>
          
          <Badge variant="secondary">
            Step {currentStepIndex + 1} of {steps.length}
          </Badge>
          
          <Button
            variant="primary"
            onClick={() => goToStep(currentStepIndex + 1)}
            disabled={currentStepIndex === steps.length - 1}
            iconRight={<Icon name="chevron-right" />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.type === 'success' ? 'Success' : 
                toast.type === 'error' ? 'Error' : 
                toast.type === 'warning' ? 'Warning' : 'Info'}
          description={toast.message}
          variant={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          position="bottom-right"
        />
      )}
      </div>
  );
};

export default ImportWizard;