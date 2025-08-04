import React, { useState, useCallback } from 'react';
import { SettingsPageProps } from '../../../types';
import { Search } from 'lucide-react';

export const SettingsPage: React.FC<SettingsPageProps> = ({
  id,
  title = 'Settings',
  description = 'Manage your application settings and preferences',
  sections = [],
  activeSection = 0,
  showNavigation = true,
  showSearch = true,
  autoSave = false,
  autoSaveInterval = 30000,
  confirmChanges = true,
  size = 'md',
  layout = 'sidebar',
  onSectionChange,
  onSettingChange,
  onSave,
  onReset,
  onExport,
  onImport,
  className = '',
  style = {},
  children,
  allowedActions = [],
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [searchTerm, setSearchTerm] = useState('');
  const [settingsData, setSettingsData] = useState<Record<string, any>>({});
  const [changedSettings, setChangedSettings] = useState<Set<string>>(new Set());
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Auto-save functionality
  React.useEffect(() => {
    if (!autoSave || changedSettings.size === 0) return;

    const interval = setInterval(() => {
      if (changedSettings.size > 0) {
        setIsAutoSaving(true);
        onSave?.(settingsData);
        setTimeout(() => setIsAutoSaving(false), 1000);
        setChangedSettings(new Set());
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, changedSettings.size, settingsData, onSave]);

  const handleSectionChange = useCallback((sectionIndex: number) => {
    setCurrentSection(sectionIndex);
    onSectionChange?.(sectionIndex, sections[sectionIndex]);
  }, [sections, onSectionChange]);

  const handleSettingChange = useCallback((settingKey: string, value: any) => {
    setSettingsData(prev => ({ ...prev, [settingKey]: value }));
    setChangedSettings(prev => new Set(prev).add(settingKey));
    onSettingChange?.(settingKey, value);
  }, [onSettingChange]);

  const handleSave = useCallback(() => {
    onSave?.(settingsData);
    setChangedSettings(new Set());
  }, [settingsData, onSave]);

  const handleReset = useCallback(() => {
    if (confirmChanges && changedSettings.size > 0) {
      if (window.confirm('Are you sure you want to reset all changes?')) {
        setSettingsData({});
        setChangedSettings(new Set());
        onReset?.();
      }
    } else {
      setSettingsData({});
      setChangedSettings(new Set());
      onReset?.();
    }
  }, [confirmChanges, changedSettings.size, onReset]);

  const handleExport = useCallback(() => {
    onExport?.(settingsData);
  }, [settingsData, onExport]);

  const handleImport = useCallback((importedData: any) => {
    setSettingsData(importedData);
    onImport?.(importedData);
  }, [onImport]);

  const sizeClasses = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl'
  };

  const filteredSections = sections.filter(section => {
    if (!searchTerm) return true;
    return (
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.settings?.some(setting => 
        setting.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const renderSearchBar = () => {
    if (!showSearch) return null;

    return (
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    );
  };

  const renderNavigationSidebar = () => {
    if (!showNavigation || layout !== 'sidebar') return null;

    return (
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          <nav className="space-y-2">
            {filteredSections.map((section, index) => {
              const originalIndex = sections.findIndex(s => s.id === section.id);
              const isActive = currentSection === originalIndex;
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(originalIndex)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {section.icon && <span>{section.icon}</span>}
                    <span>{section.title}</span>
                  </div>
                  {section.badge && (
                    <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      {section.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  const renderNavigationTabs = () => {
    if (!showNavigation || layout !== 'tabs') return null;

    return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {filteredSections.map((section, index) => {
            const originalIndex = sections.findIndex(s => s.id === section.id);
            const isActive = currentSection === originalIndex;
            
            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(originalIndex)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {section.icon && <span>{section.icon}</span>}
                  <span>{section.title}</span>
                  {section.badge && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      {section.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  const renderSettingField = (setting: any) => {
    const value = settingsData[setting.key] ?? setting.defaultValue;
    const hasChanged = changedSettings.has(setting.key);

    const baseClasses = "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500";
    const changedClasses = hasChanged ? "border-blue-300 bg-blue-50" : "";

    switch (setting.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <input
            type={setting.type}
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.placeholder}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            placeholder={setting.placeholder}
            rows={setting.rows || 3}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.key, Number(e.target.value))}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          >
            {setting.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
              disabled={setting.disabled || !allowedActions.includes('edit_settings')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {setting.checkboxLabel || 'Enable'}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {setting.options?.map((option: any) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={setting.key}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                  disabled={setting.disabled || !allowedActions.includes('edit_settings')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleSettingChange(setting.key, file);
              }
            }}
            accept={setting.accept}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleSettingChange(setting.key, e.target.value)}
            disabled={setting.disabled || !allowedActions.includes('edit_settings')}
            className={`${baseClasses} ${changedClasses}`}
          />
        );
    }
  };

  const renderCurrentSection = () => {
    const section = sections[currentSection];
    if (!section) return null;

    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
          {section.description && (
            <p className="mt-2 text-sm text-gray-600">{section.description}</p>
          )}
        </div>

        <div className="space-y-6">
          {section.settings?.map((setting) => (
            <div key={setting.key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {setting.label}
                {setting.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {setting.description && (
                <p className="text-sm text-gray-500">{setting.description}</p>
              )}
              
              {renderSettingField(setting)}
              
              {setting.help && (
                <p className="text-xs text-gray-500">{setting.help}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActions = () => (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <div className="flex items-center space-x-4">
        {autoSave && (
          <div className="flex items-center space-x-2">
            {isAutoSaving ? (
              <span className="text-sm text-blue-600">Auto-saving...</span>
            ) : (
              <span className="text-sm text-gray-500">
                {changedSettings.size > 0 ? `${changedSettings.size} unsaved changes` : 'All changes saved'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        {allowedActions.includes('export_settings') && (
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            📤 Export
          </button>
        )}
        
        {allowedActions.includes('import_settings') && (
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = (e: any) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    try {
                      const data = JSON.parse(e.target?.result as string);
                      handleImport(data);
                    } catch (error) {
                      alert('Invalid file format');
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            📥 Import
          </button>
        )}

        {changedSettings.size > 0 && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
        )}

        {allowedActions.includes('save_settings') && (
          <button
            onClick={handleSave}
            disabled={changedSettings.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className={`settings-page ${className}`}
      style={style}
      role="main"
      aria-label="Settings Page"
    >
      <div className="py-8">
        <div className={`mx-auto px-6 ${sizeClasses[size]}`}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>

          {renderSearchBar()}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {layout === 'sidebar' ? (
              <div className="flex">
                {renderNavigationSidebar()}
                <div className="flex-1 p-6">
                  {renderCurrentSection()}
                  {children}
                  {renderActions()}
                </div>
              </div>
            ) : (
              <div className="p-6">
                {renderNavigationTabs()}
                {renderCurrentSection()}
                {children}
                {renderActions()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;