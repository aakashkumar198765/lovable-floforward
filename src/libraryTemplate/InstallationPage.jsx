import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InstallationPage = () => {
    const [copiedCode, setCopiedCode] = useState('');

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Installation & Setup</h1>
                <p className="text-lg text-gray-600">
                    Get started with the Re-usable Components Library in your React project.
                </p>
            </div>

            {/* Installation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Installation</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Using npm</h3>
                        <CodeBlock 
                            code="npm install @company/reusable-components"
                            language="bash"
                            onCopy={() => copyToClipboard('npm install @company/reusable-components', 'npm')}
                            copied={copiedCode === 'npm'}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Using yarn</h3>
                        <CodeBlock 
                            code="yarn add @company/reusable-components"
                            language="bash"
                            onCopy={() => copyToClipboard('yarn add @company/reusable-components', 'yarn')}
                            copied={copiedCode === 'yarn'}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Start */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Import</h3>
                        <p className="text-gray-600 mb-3">Import individual components as needed:</p>
                        <CodeBlock 
                            code={`import { Button, Input, Modal } from '@company/reusable-components';

function App() {
  return (
    <div>
      <Button variant="primary">Get Started</Button>
      <Input placeholder="Enter your name" />
    </div>
  );
}`}
                            language="jsx"
                            onCopy={() => copyToClipboard(`import { Button, Input, Modal } from '@company/reusable-components';

function App() {
  return (
    <div>
      <Button variant="primary">Get Started</Button>
      <Input placeholder="Enter your name" />
    </div>
  );
}`, 'basic-import')}
                            copied={copiedCode === 'basic-import'}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Category Imports</h3>
                        <p className="text-gray-600 mb-3">Import by category for better organization:</p>
                        <CodeBlock 
                            code={`import * as Atoms from '@company/reusable-components/atoms';
import * as Molecules from '@company/reusable-components/molecules';

function Dashboard() {
  return (
    <div>
      <Atoms.Button variant="primary">Save</Atoms.Button>
      <Molecules.SearchBox placeholder="Search items..." />
    </div>
  );
}`}
                            language="jsx"
                            onCopy={() => copyToClipboard(`import * as Atoms from '@company/reusable-components/atoms';
import * as Molecules from '@company/reusable-components/molecules';

function Dashboard() {
  return (
    <div>
      <Atoms.Button variant="primary">Save</Atoms.Button>
      <Molecules.SearchBox placeholder="Search items..." />
    </div>
  );
}`, 'category-import')}
                            copied={copiedCode === 'category-import'}
                        />
                    </div>
                </div>
            </div>

            {/* CSS Setup */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">CSS Configuration</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Tailwind CSS Setup</h3>
                        <p className="text-gray-600 mb-3">
                            Our components use Tailwind CSS. Add our theme configuration to your <code className="bg-gray-100 px-2 py-1 rounded text-sm">tailwind.config.js</code>:
                        </p>
                        <CodeBlock 
                            code={`module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      spacing: {
        '1': '0.25rem', // 4px
        '2': '0.5rem',  // 8px
        '3': '0.75rem', // 12px
        '4': '1rem',    // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem',  // 24px
        '8': '2rem',    // 32px
        '10': '2.5rem', // 40px
        '12': '3rem',   // 48px
        '16': '4rem',   // 64px
        '20': '5rem',   // 80px
      },
      borderRadius: {
        'sm': '0.125rem', // 2px
        'md': '0.375rem', // 6px
        'lg': '0.5rem',   // 8px
        'xl': '0.75rem',  // 12px
        '2xl': '1rem',    // 16px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}`}
                            language="js"
                            onCopy={() => copyToClipboard(`module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@company/reusable-components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Add other custom colors as needed
      },
      fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
      }
    }
  },
  plugins: []
}`, 'tailwind-config')}
                            copied={copiedCode === 'tailwind-config'}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Import Styles</h3>
                        <p className="text-gray-600 mb-3">Import our base styles in your main CSS file:</p>
                        <CodeBlock 
                            code={`@import '@company/reusable-components/dist/styles.css';

/* Your custom styles */`}
                            language="css"
                            onCopy={() => copyToClipboard(`@import '@company/reusable-components/dist/styles.css';

/* Your custom styles */`, 'import-styles')}
                            copied={copiedCode === 'import-styles'}
                        />
                    </div>
                </div>
            </div>

            {/* TypeScript Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">TypeScript Support</h2>
                
                <div className="space-y-4">
                    <p className="text-gray-600">
                        The library is built with TypeScript and includes comprehensive type definitions. 
                        Types are automatically included when you install the package.
                    </p>
                    
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Type-safe Usage</h3>
                        <CodeBlock 
                            code={`import { Button, ButtonProps } from '@company/reusable-components';

interface MyComponentProps {
  onSubmit: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ onSubmit }) => {
  return (
    <Button 
      variant="primary" 
      size="lg"
      onClick={onSubmit}
    >
      Submit
    </Button>
  );
};`}
                            language="tsx"
                            onCopy={() => copyToClipboard(`import { Button, ButtonProps } from '@company/reusable-components';

interface MyComponentProps {
  onSubmit: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ onSubmit }) => {
  return (
    <Button 
      variant="primary" 
      size="lg"
      onClick={onSubmit}
    >
      Submit
    </Button>
  );
};`, 'typescript-usage')}
                            copied={copiedCode === 'typescript-usage'}
                        />
                    </div>
                </div>
            </div>

            {/* Enterprise Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Enterprise Features</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Commerce State Integration</h3>
                        <p className="text-gray-600 mb-3">Enable commerce state awareness for business workflows:</p>
                        <CodeBlock 
                            code={`<Button 
  variant="primary"
  commerceState="execution"
  allowedActions={['submit', 'edit']}
  userRole="manager"
>
  Process Order
</Button>`}
                            language="jsx"
                            onCopy={() => copyToClipboard(`<Button 
  variant="primary"
  commerceState="execution"
  allowedActions={['submit', 'edit']}
  userRole="manager"
>
  Process Order
</Button>`, 'commerce-state')}
                            copied={copiedCode === 'commerce-state'}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Audit Trail Configuration</h3>
                        <p className="text-gray-600 mb-3">Enable comprehensive audit logging:</p>
                        <CodeBlock 
                            code={`<Input 
  label="User Email"
  auditTrail={{
    enabled: true,
    level: 'detailed',
    trackChanges: true,
    logUserActions: true
  }}
  encryptionLevel="high"
/>`}
                            language="jsx"
                            onCopy={() => copyToClipboard(`<Input 
  label="User Email"
  auditTrail={{
    enabled: true,
    level: 'detailed',
    trackChanges: true,
    logUserActions: true
  }}
  encryptionLevel="high"
/>`, 'audit-trail')}
                            copied={copiedCode === 'audit-trail'}
                        />
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Next Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Explore Components</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Browse our comprehensive component library to see what's available.
                        </p>
                        <Link 
                            to="/atoms/display" 
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                            View Components →
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Join Community</h3>
                        <p className="text-gray-600 text-sm mb-3">
                            Get help, share feedback, and stay updated with our community.
                        </p>
                        <button 
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm text-left"
                        >
                            Join Discord →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Code Block Component
const CodeBlock = ({ code, language, onCopy, copied }) => {
    return (
        <div className="relative">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                    <span className="text-xs text-gray-400 font-medium">{language}</span>
                    <button
                        onClick={onCopy}
                        className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
                    >
                        {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                    <code className="text-sm text-gray-100 font-mono">
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default InstallationPage;