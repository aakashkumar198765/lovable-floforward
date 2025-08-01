import React from 'react';
import { SettingsPage } from '../components';

const SettingsPageRoute: React.FC = () => {
  return (
    <SettingsPage
      title="Application Settings"
      description="Configure your application preferences, security settings, and system options"
      sections={[
        {
          id: 'general',
          title: 'General Settings',
          description: 'Basic application configuration and preferences',
          icon: '⚙️',
          settings: [
            { 
              key: 'app_name', 
              label: 'Application Name', 
              description: 'The name displayed in the application header',
              type: 'text', 
              defaultValue: 'Enterprise Dashboard',
              required: true
            },
            { 
              key: 'app_timezone', 
              label: 'Default Timezone', 
              description: 'Timezone used for displaying dates and times',
              type: 'select',
              defaultValue: 'UTC',
              options: [
                { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
                { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
                { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
                { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
                { value: 'Europe/London', label: 'Greenwich Mean Time' },
                { value: 'Europe/Paris', label: 'Central European Time' },
                { value: 'Asia/Tokyo', label: 'Japan Standard Time' }
              ]
            },
            { 
              key: 'enable_notifications', 
              label: 'Enable Notifications', 
              description: 'Show desktop notifications for important events',
              type: 'boolean', 
              defaultValue: true,
              checkboxLabel: 'Enable desktop notifications'
            },
            { 
              key: 'items_per_page', 
              label: 'Items Per Page', 
              description: 'Default number of items to display in lists',
              type: 'number', 
              defaultValue: 25,
              min: 10,
              max: 100,
              step: 5
            },
            { 
              key: 'app_theme', 
              label: 'Application Theme', 
              description: 'Choose your preferred color scheme',
              type: 'radio',
              defaultValue: 'light',
              options: [
                { value: 'light', label: 'Light Theme' },
                { value: 'dark', label: 'Dark Theme' },
                { value: 'auto', label: 'System Default' }
              ]
            }
          ]
        },
        {
          id: 'security',
          title: 'Security & Privacy',
          description: 'Security settings and privacy controls',
          icon: '🔒',
          settings: [
            { 
              key: 'two_factor', 
              label: 'Two-Factor Authentication', 
              description: 'Add an extra layer of security to your account',
              type: 'boolean', 
              defaultValue: false,
              checkboxLabel: 'Enable two-factor authentication'
            },
            { 
              key: 'session_timeout', 
              label: 'Session Timeout', 
              description: 'Automatically log out after period of inactivity (minutes)',
              type: 'number', 
              defaultValue: 30,
              min: 5,
              max: 480,
              step: 5
            },
            { 
              key: 'password_policy', 
              label: 'Password Policy', 
              description: 'Minimum password complexity requirements',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { value: 'low', label: 'Low - 6 characters minimum' },
                { value: 'medium', label: 'Medium - 8 characters, mixed case' },
                { value: 'high', label: 'High - 12 characters, mixed case, numbers, symbols' }
              ]
            },
            { 
              key: 'audit_logging', 
              label: 'Audit Logging', 
              description: 'Log user actions for compliance and security',
              type: 'boolean', 
              defaultValue: true,
              checkboxLabel: 'Enable audit logging'
            },
            { 
              key: 'data_retention', 
              label: 'Data Retention Period', 
              description: 'How long to keep audit logs and user data (days)',
              type: 'number', 
              defaultValue: 365,
              min: 30,
              max: 2555, // 7 years
              step: 30
            }
          ]
        },
        {
          id: 'notifications',
          title: 'Notification Settings',
          description: 'Configure how and when you receive notifications',
          icon: '🔔',
          settings: [
            { 
              key: 'email_notifications', 
              label: 'Email Notifications', 
              description: 'Receive notifications via email',
              type: 'boolean', 
              defaultValue: true,
              checkboxLabel: 'Enable email notifications'
            },
            { 
              key: 'notification_frequency', 
              label: 'Notification Frequency', 
              description: 'How often to send notification emails',
              type: 'radio',
              defaultValue: 'immediate',
              options: [
                { value: 'immediate', label: 'Immediate' },
                { value: 'hourly', label: 'Hourly Digest' },
                { value: 'daily', label: 'Daily Digest' },
                { value: 'weekly', label: 'Weekly Digest' }
              ]
            },
            { 
              key: 'notification_types', 
              label: 'Notification Types', 
              description: 'Select which types of notifications to receive',
              type: 'select',
              defaultValue: 'all',
              options: [
                { value: 'all', label: 'All Notifications' },
                { value: 'critical', label: 'Critical Only' },
                { value: 'system', label: 'System Notifications Only' },
                { value: 'none', label: 'No Notifications' }
              ]
            }
          ]
        },
        {
          id: 'integration',
          title: 'Integration Settings',
          description: 'Configure external service integrations',
          icon: '🔗',
          badge: 'Beta',
          settings: [
            { 
              key: 'api_key', 
              label: 'API Key', 
              description: 'Your API key for external integrations',
              type: 'text', 
              placeholder: 'Enter your API key...',
              help: 'Keep this key secure and do not share it publicly'
            },
            { 
              key: 'webhook_url', 
              label: 'Webhook URL', 
              description: 'URL to receive webhook notifications',
              type: 'url', 
              placeholder: 'https://your-domain.com/webhook'
            },
            { 
              key: 'integration_config', 
              label: 'Integration Configuration', 
              description: 'Additional configuration for external services',
              type: 'textarea', 
              rows: 4,
              placeholder: 'Enter JSON configuration...'
            },
            { 
              key: 'config_file', 
              label: 'Configuration File', 
              description: 'Upload a configuration file for bulk settings',
              type: 'file', 
              accept: '.json,.yml,.yaml'
            }
          ]
        }
      ]}
      activeSection={0}
      showNavigation={true}
      showSearch={true}
      autoSave={true}
      autoSaveInterval={10000}
      confirmChanges={true}
      layout="sidebar"
      onSectionChange={(sectionIndex, section) => console.log('Section changed:', section.title)}
      onSettingChange={(settingKey, value) => console.log('Setting changed:', settingKey, '=', value)}
      onSave={(data) => {
        console.log('Settings saved:', data);
        alert('Settings saved successfully!');
      }}
      onReset={() => {
        console.log('Settings reset to defaults');
        alert('Settings reset to default values');
      }}
      onExport={(data) => {
        console.log('Settings exported:', data);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settings-export.json';
        a.click();
        URL.revokeObjectURL(url);
      }}
      onImport={(data) => {
        console.log('Settings imported:', data);
        alert('Settings imported successfully!');
      }}
      allowedActions={['edit_settings', 'save_settings', 'export_settings', 'import_settings']}
      commerceState="execution"
    />
  );
};

export default SettingsPageRoute;