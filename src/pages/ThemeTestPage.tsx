import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Badge, Alert, ThemeToggle } from '../components';

const ThemeTestPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-work-sans">
            Theme Testing Page
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current theme: {theme}
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Button Components
            </h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="tertiary">Tertiary</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Badge Components
            </h2>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge color="primary" variant="default">Default</Badge>
                <Badge color="primary" variant="outlined">Outlined</Badge>
                <Badge color="primary" variant="filled">Filled</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge color="success">Success</Badge>
                <Badge color="warning">Warning</Badge>
                <Badge color="error">Error</Badge>
                <Badge color="gray">Gray</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge color="primary" removable>Removable</Badge>
                <Badge color="success" variant="outlined" removable>Remove Me</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Components */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Alert Components
          </h2>
          
          <Alert 
            variant="info" 
            title="Information Alert"
            description="This is an informational message that adapts to the current theme."
            dismissible
          />
          
          <Alert 
            variant="success" 
            title="Success Alert"
            description="This is a success message with dark theme support."
            dismissible
          />
          
          <Alert 
            variant="warning" 
            title="Warning Alert"
            description="This is a warning message that changes colors based on theme."
            dismissible
          />
          
          <Alert 
            variant="error" 
            title="Error Alert"
            description="This is an error message with proper dark theme styling."
            dismissible
          />
        </div>

        {/* Theme Information */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Theme Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-400">Current Theme:</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{theme}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">HTML Class:</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {document.documentElement.className || 'light'}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Prefers Dark:</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'Yes' : 'No'}
              </div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-400">Stored Theme:</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {localStorage.getItem('reusable-components-theme') || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;