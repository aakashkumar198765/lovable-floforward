import React, { useState, useCallback, useMemo } from 'react';
import { SettingsManagerProps, SettingCategory, Setting } from '../../../types';
import { cn } from '../../../utils/cn';
import Button from '../../atoms/form/Button';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Checkbox from '../../atoms/form/Checkbox';
import Textarea from '../../atoms/form/Textarea';
import FileUpload from '../../atoms/form/FileUpload';
import Tab from '../../atoms/navigation/Tab';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Tooltip from '../../atoms/display/Tooltip';
import Modal from '../../atoms/feedback/Modal';
import Alert from '../../atoms/feedback/Alert';
import Toast from '../../atoms/feedback/Toast';
import LoadingState from '../../atoms/feedback/LoadingState';
import SearchBox from '../../molecules/data/SearchBox';

const SettingsManager: React.FC<SettingsManagerProps> = ({
  id = 'settings-manager',
  title = 'Settings Manager',
  categories = [],
  layout = 'tabs',
  searchable = true,
  exportable = true,
  importable = true,
  size = 'md',
  showResetButton = true,
  showSaveButton = true,
  autoSave = false,
  validation = true,
  className = '',
  style = {},
  onSettingChange,
  onSave,
  onReset,
  onImport,
  onExport,
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [settingValues, setSettingValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    categories.forEach(category => {
      category.settings?.forEach(setting => {
        initialValues[setting.id!] = setting.value ?? setting.defaultValue;
      });
    });
    return initialValues;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [changedSettings, setChangedSettings] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' | 'warning' }>({
    show: false, message: '', type: 'info'
  });

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  }, []);

  // Validate a single setting
  const validateSetting = useCallback((setting: Setting, value: any): string | null => {
    if (!validation || !setting.validation) return null;

    const { required, min, max, pattern, custom } = setting.validation;

    // Required validation
    if (required && (value === null || value === undefined || value === '')) {
      return 'This field is required';
    }

    // Skip other validations if value is empty and not required
    if (!value && !required) return null;

    // Min/Max validation for numbers
    if (setting.type === 'number') {
      const numValue = Number(value);
      if (min !== undefined && numValue < min) {
        return `Value must be at least ${min}`;
      }
      if (max !== undefined && numValue > max) {
        return `Value must be at most ${max}`;
      }
    }

    // Min/Max length validation for strings
    if (setting.type === 'string' && typeof value === 'string') {
      if (min !== undefined && value.length < min) {
        return `Must be at least ${min} characters`;
      }
      if (max !== undefined && value.length > max) {
        return `Must be at most ${max} characters`;
      }
    }

    // Pattern validation
    if (pattern && typeof value === 'string') {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        return 'Invalid format';
      }
    }

    // Custom validation
    if (custom && typeof custom === 'function') {
      return custom(value);
    }

    return null;
  }, [validation]);

  // Handle setting value change
  const handleSettingChange = useCallback((settingId: string, value: any, categoryId: string) => {
    const setting = categories
      .find(cat => cat.id === categoryId)
      ?.settings?.find(s => s.id === settingId);

    if (!setting) return;

    // Validate the new value
    let error: string | null = null;
    if (validation) {
      error = validateSetting(setting, value);
    }

    // Update validation errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[settingId] = error;
      } else {
        delete newErrors[settingId];
      }
      return newErrors;
    });

    // Update setting value
    setSettingValues(prev => ({ ...prev, [settingId]: value }));
    
    // Track changed settings
    setChangedSettings(prev => new Set(prev).add(settingId));

    // Call external handler
    onSettingChange?.(settingId, value, categoryId);

    // Auto-save if enabled and no validation errors
    if (autoSave && !error && Object.keys(validationErrors).length === 0) {
      handleSave();
    }
  }, [categories, validation, validateSetting, settingValues, validationErrors, changedSettings, onSettingChange, autoSave]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!onSave) return;

    // Validate all settings
    const errors: Record<string, string> = {};
    categories.forEach(category => {
      category.settings?.forEach(setting => {
        if (!setting.readonly && !setting.hidden) {
          const error = validateSetting(setting, settingValues[setting.id!]);
          if (error) {
            errors[setting.id!] = error;
          }
        }
      });
    });

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast('Please fix validation errors before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      // Filter only changed settings
      const changedSettingValues: Record<string, any> = {};
      changedSettings.forEach(settingId => {
        changedSettingValues[settingId] = settingValues[settingId];
      });

      await onSave(changedSettingValues);
      
      setChangedSettings(new Set());
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  }, [categories, settingValues, validateSetting, changedSettings, onSave, showToast]);

  // Handle reset
  const handleReset = useCallback((categoryId?: string) => {
    const settingsToReset: Record<string, any> = {};
    const categoriesToReset = categoryId ? [categories.find(c => c.id === categoryId)!] : categories;

    categoriesToReset.forEach(category => {
      category.settings?.forEach(setting => {
        if (!setting.readonly && !setting.hidden) {
          settingsToReset[setting.id!] = setting.defaultValue;
        }
      });
    });

    setSettingValues(prev => ({ ...prev, ...settingsToReset }));
    setValidationErrors({});
    setChangedSettings(new Set());

    onReset?.(categoryId);
    showToast(categoryId ? 'Category reset successfully' : 'All settings reset successfully', 'info');
    setShowResetModal(false);
  }, [categories, onReset, showToast]);

  // Handle import
  const handleImport = useCallback(() => {
    try {
      const importedSettings = JSON.parse(importData);
      
      // Validate imported settings
      const validSettings: Record<string, any> = {};
      Object.entries(importedSettings).forEach(([settingId, value]) => {
        const setting = categories
          .flatMap(cat => cat.settings || [])
          .find(s => s.id === settingId);
        
        if (setting && !setting.readonly && !setting.hidden) {
          const error = validateSetting(setting, value);
          if (!error) {
            validSettings[settingId] = value;
          }
        }
      });

      setSettingValues(prev => ({ ...prev, ...validSettings }));
      setChangedSettings(new Set(Object.keys(validSettings)));
      onImport?.(validSettings);
      showToast(`Imported ${Object.keys(validSettings).length} settings`, 'success');
      
      setShowImportModal(false);
      setImportData('');
    } catch (error) {
      showToast('Invalid import format', 'error');
    }
  }, [importData, categories, validateSetting, onImport, showToast]);

  // Handle export
  const handleExport = useCallback(() => {
    const exportData = { ...settingValues };
      categories.forEach(category => {
        category.settings?.forEach(setting => {
          if (setting.sensitive && setting.id) {
            delete exportData[setting.id];
          }
        });
      });

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onExport?.();
    showToast('Settings exported successfully', 'success');
  }, [settingValues, categories, onExport, showToast]);

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    return categories.map(category => {
      const filteredSettings = category.settings?.filter(setting =>
        setting.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        setting.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return {
        ...category,
        settings: filteredSettings,
      };
    }).filter(category => category.settings && category.settings.length > 0);
  }, [categories, searchQuery]);

  // Render setting input
  const renderSettingInput = useCallback((setting: Setting, categoryId: string) => {
    const value = settingValues[setting.id!];
    const error = validationErrors[setting.id!];
    const hasChanged = changedSettings.has(setting.id!);

    const commonProps = {
      id: setting.id,
      disabled: setting.readonly,
      required: setting.validation?.required,
      errorMessage: error,
      status: error ? 'error' as const : 'default' as const,
      size,
      className: cn(hasChanged && 'ring-1 ring-blue-300'),
    };

    switch (setting.type) {
      case 'boolean':
        return (
          <Checkbox
            {...commonProps}
            checked={Boolean(value)}
            onChange={(checked) => handleSettingChange(setting.id!, checked, categoryId)}
          >
            {setting.name}
          </Checkbox>
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            label={setting.name}
            value={value || ''}
            min={setting.validation?.min}
            max={setting.validation?.max}
            onChange={(e) => handleSettingChange(setting.id!, Number(e.target.value), categoryId)}
            helperText={setting.description}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            label={setting.name}
            value={value || ''}
            options={setting.options || []}
            onChange={(selectedValue) => handleSettingChange(setting.id!, selectedValue, categoryId)}
            helperText={setting.description}
          />
        );

      case 'multiselect':
        return (
          <Select
            {...commonProps}
            multiple
            label={setting.name}
            value={Array.isArray(value) ? value : []}
            options={setting.options || []}
            onChange={(selectedValues) => handleSettingChange(setting.id!, selectedValues, categoryId)}
            helperText={setting.description}
          />
        );

      case 'json':
        return (
          <Textarea
            {...commonProps}
            label={setting.name}
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            rows={6}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleSettingChange(setting.id!, parsed, categoryId);
              } catch {
                handleSettingChange(setting.id!, e.target.value, categoryId);
              }
            }}
            helperText={`${setting.description} (JSON format)`}
          />
        );

      case 'file':
        return (
          <FileUpload
            {...commonProps}
            label={setting.name}
            onFilesChange={(files) => {
              if (files.length > 0) {
                handleSettingChange(setting.id!, files[0], categoryId);
              }
            }}
            helperText={setting.description}
            maxFiles={1}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={setting.sensitive ? 'password' : 'text'}
            label={setting.name}
            value={value || ''}
            pattern={setting.validation?.pattern}
            onChange={(e) => handleSettingChange(setting.id!, e.target.value, categoryId)}
            helperText={setting.description}
            rightIcon={setting.sensitive ? <Icon name="eye-off" /> : undefined}
          />
        );
    }
  }, [settingValues, validationErrors, changedSettings, size, handleSettingChange]);

  // Render category content
  const renderCategoryContent = useCallback((category: SettingCategory) => {
    if (!category.settings?.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Icon name="settings" size="lg" className="mx-auto mb-2 opacity-50" />
          <p>No settings available in this category</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {category.settings
          .filter(setting => !setting.hidden)
          .map(setting => (
            <div key={setting.id} className="space-y-2">
              <div className="flex items-center gap-2">
                {setting.sensitive && (
                  <Tooltip content="This is a sensitive setting">
                    <Icon name="shield" size="xs" className="text-yellow-500" />
                  </Tooltip>
                )}
                {changedSettings.has(setting.id!) && (
                  <Badge variant="warning" size="xs">Modified</Badge>
                )}
              </div>
              {renderSettingInput(setting, category.id!)}
            </div>
          ))}
      </div>
    );
  }, [renderSettingInput, changedSettings]);

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (layout === 'accordion') {
    return (
      <div 
        className={cn(
          'rounded-lg border',
          sizeClasses[size],
          className
        )}
        style={style}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {changedSettings.size > 0 && (
              <Badge variant="warning" className="mt-1">
                {changedSettings.size} changed
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {exportable && <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleExport}>
              Export
            </button>}
            {importable && <button className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setShowImportModal(true)}>
              Import
            </button>}
            {searchable && (
              <SearchBox
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder="Search settings..."
                size="sm"
                className="w-64"
              />
            )}
          </div>
        </div>

        {/* Accordion Categories */}
        <div>
          {filteredCategories.map((category, index) => {
            const isCollapsed = collapsedCategories.has(category.id!);
            
            return (
              <div key={category.id} className={cn(index > 0 && 'border-t')}>
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setCollapsedCategories(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(category.id!)) {
                        newSet.delete(category.id!);
                      } else {
                        newSet.add(category.id!);
                      }
                      return newSet;
                    });
                  }}
                >
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <div className="text-left">
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <Icon name={isCollapsed ? "chevron-right" : "chevron-down"} />
                </button>
                
                {!isCollapsed && (
                  <div className="p-4 pt-0">
                    {renderCategoryContent(category)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {changedSettings.size > 0 && `${changedSettings.size} unsaved changes`}
            </div>
            <div className="flex gap-2">
              {showResetButton && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowResetModal(true)}
                  disabled={changedSettings.size === 0}
                >
                  Reset All
                </Button>
              )}
              {showSaveButton && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={changedSettings.size === 0 || saving}
                  loading={saving}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Tabs layout
  return (
    <div 
      className={cn(
        'rounded-lg border',
        sizeClasses[size],
        className
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 text-sm mt-1">Configure application settings with validation, import/export and category organization.</p>
          {changedSettings.size > 0 && (
            <Badge variant="warning" className="mt-2">
              {changedSettings.size} changed
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
         {exportable && <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleExport}>
            Export
          </button>}
          {importable && <button className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700" onClick={() => setShowImportModal(true)}>
            Import
          </button>}
          {searchable && (
            <SearchBox
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Search settings..."
              size="sm"
              className="w-64"
            />
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <Tab
        items={filteredCategories.map(category => ({
          id: category.id!,
          label: category.name!,
          icon: category.icon,
          content: renderCategoryContent(category),
        }))}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        variant="default"
        size={size}
      />

      {/* Action Bar */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {changedSettings.size > 0 && `${changedSettings.size} unsaved changes`}
          </div>
          <div className="flex gap-2">
            {showResetButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowResetModal(true)}
                disabled={changedSettings.size === 0}
              >
                Reset All
              </Button>
            )}
            {showSaveButton && (
              <LoadingState loading={saving}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={changedSettings.size === 0}
                >
                  Save Changes
                </Button>
              </LoadingState>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Settings"
        size="md"
      >
        <div className="space-y-4">
          <Alert
            variant="warning"
            title="Confirm Reset"
            description="This will reset all settings to their default values. This action cannot be undone."
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleReset()}>
              Reset All Settings
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportData('');
        }}
        title="Import Settings"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Paste your settings JSON data below. Only valid settings will be imported.
          </p>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder="Paste settings JSON here..."
            rows={8}
            className="font-mono text-xs"
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowImportModal(false);
                setImportData('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!importData.trim()}
            >
              Import Settings
            </Button>
          </div>
        </div>
      </Modal>

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
    // </div>
  );
};

export default SettingsManager;