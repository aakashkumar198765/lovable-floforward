import React from 'react';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    <span className="block sm:hidden">Components Library</span>
                    <span className="hidden sm:block">Re-usable Components Library</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
                    A comprehensive React component library built with enterprise features, 
                    TypeScript, and Tailwind CSS. Following atomic design principles with 
                    advanced business process integration.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                    <Link 
                        to="installation"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Get Started
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link 
                        to="atoms/display"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        View Components
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 sm:px-0">
                <StatsCard 
                    title="Atoms" 
                    count="31" 
                    description="Basic building blocks"
                    gradient="from-blue-50 to-blue-100"
                    color="blue"
                />
                <StatsCard 
                    title="Molecules" 
                    count="12" 
                    description="Component combinations"
                    gradient="from-green-50 to-green-100"
                    color="green"
                />
                <StatsCard 
                    title="Organisms" 
                    count="12" 
                    description="Complex components"
                    gradient="from-purple-50 to-purple-100"
                    color="purple"
                />
                <StatsCard 
                    title="Templates" 
                    count="6" 
                    description="Layout patterns"
                    gradient="from-orange-50 to-orange-100"
                    color="orange"
                />
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
                <FeatureCard 
                    icon={<EnterpriseIcon />}
                    title="Enterprise Ready" 
                    description="Built-in RBAC, audit trails, and commerce state awareness for business applications"
                    features={[
                        "Role-based access control",
                        "Comprehensive audit logging", 
                        "Commerce workflow states",
                        "Data encryption support"
                    ]}
                />
                <FeatureCard 
                    icon={<DeveloperIcon />}
                    title="Developer Experience" 
                    description="TypeScript support with comprehensive documentation and interactive examples"
                    features={[
                        "Full TypeScript support",
                        "Extensive prop types",
                        "Interactive code examples", 
                        "Copy-to-clipboard snippets"
                    ]}
                />
                <FeatureCard 
                    icon={<DesignIcon />}
                    title="Design System" 
                    description="Consistent design language following atomic design principles"
                    features={[
                        "Atomic design methodology",
                        "Consistent spacing & typography",
                        "Accessible by default",
                        "Dark mode support"
                    ]}
                />
                <FeatureCard 
                    icon={<WorkflowIcon />}
                    title="Business Processes" 
                    description="Built-in support for complex business workflows and state management"
                    features={[
                        "Approval workflows",
                        "State transitions",
                        "Process tracking",
                        "Integration APIs"
                    ]}
                />
            </div>

            {/* Installation Guide */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 mx-4 sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Installation Guide</h2>
                
                {/* Prerequisites */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-blue-800 font-medium mb-2">Required Dependencies:</p>
                                <ul className="text-blue-700 text-sm space-y-1">
                                    <li>• React 18+ and React DOM</li>
                                    <li>• React Router DOM for navigation</li>
                                    <li>• Tailwind CSS for styling</li>
                                    <li>• clsx and tailwind-merge for className utilities</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <QuickStartStep 
                        step="1"
                        title="Install Dependencies"
                        description="Add required packages to your project"
                        code="npm install react react-dom react-router-dom clsx tailwind-merge"
                        copyable={true}
                    />
                    <QuickStartStep 
                        step="2"
                        title="Setup Tailwind CSS"
                        description="Configure Tailwind for styling"
                        code="npm install -D tailwindcss postcss autoprefixer"
                        copyable={true}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickStartStep 
                        step="3"
                        title="Import Components"
                        description="Import components you need"
                        code="import { Button, Input, Modal } from './components'"
                        copyable={true}
                    />
                    <QuickStartStep 
                        step="4"
                        title="Start Building"
                        description="Use components in your application"
                        code={`<Button variant="primary" size="lg">
  Get Started
</Button>`}
                        copyable={true}
                    />
                </div>

                {/* Configuration */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Tailwind Configuration</h4>
                    <p className="text-gray-600 text-sm mb-3">Add this to your tailwind.config.js to include all necessary utilities:</p>
                    <CodeBlock
                        code={`module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
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
                        language="javascript"
                    />
                </div>
            </div>

            {/* Component Categories */}
            <div className="mb-8 sm:mb-12 px-4 sm:px-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                    Explore Component Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <CategoryCard 
                        title="Atoms"
                        description="Building blocks like buttons, inputs, and icons"
                        count="31 components"
                        link="atoms/form"
                        // icon="🧱"
                        color="blue"
                    />
                    <CategoryCard 
                        title="Molecules"
                        description="Component combinations for common patterns"
                        count="12 components"
                        link="molecules/display"
                        // icon="🧪"
                        color="green"
                    />
                    <CategoryCard 
                        title="Organisms"
                        description="Complex components with rich functionality"
                        count="12 components"
                        link="organisms/data-grids"
                        // icon="🦠"
                        color="purple"
                    />
                    <CategoryCard 
                        title="Templates"
                        description="Complete page layouts and patterns"
                        count="6 components"
                        link="templates/layouts"
                        // icon="🏗️"
                        color="orange"
                    />
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatsCard = ({ title, count, description, gradient, color }) => {
    const colorClasses = {
        blue: 'text-blue-900 dark:text-blue-100 border-blue-100 dark:border-blue-700',
        green: 'text-green-900 dark:text-green-100 border-green-100 dark:border-green-700',
        purple: 'text-purple-900 dark:text-purple-100 border-purple-100 dark:border-purple-700',
        orange: 'text-orange-900 dark:text-orange-100 border-orange-100 dark:border-orange-700'
    };
    const darkGradients = {
        'from-blue-50 to-blue-100': 'dark:from-blue-900/20 dark:to-blue-800/30',
        'from-green-50 to-green-100': 'dark:from-green-900/20 dark:to-green-800/30',
        'from-purple-50 to-purple-100': 'dark:from-purple-900/20 dark:to-purple-800/30',
        'from-orange-50 to-orange-100': 'dark:from-orange-900/20 dark:to-orange-800/30'
    };

    return (
        <div className={`bg-gradient-to-r ${gradient} ${darkGradients[gradient]} p-4 sm:p-6 rounded-lg border-2 ${colorClasses[color]} hover:shadow-md transition-shadow`}>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{count}</div>
            <div className="text-sm sm:text-lg font-medium mb-1">{title}</div>
            <div className="text-xs sm:text-sm opacity-75">{description}</div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, features }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4">
            <div className="mr-3 p-2 bg-blue-50 rounded-lg">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
    </div>
);

const QuickStartStep = ({ step, title, description, code, copyable = false }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold mb-4">
                {step}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="relative bg-gray-100 rounded-md p-3 font-mono text-sm text-left overflow-x-auto">
                <pre className="whitespace-pre-wrap">{code}</pre>
                {copyable && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-200 transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

const CodeBlock = ({ code, language = 'javascript' }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="relative bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-700 transition-colors"
                title="Copy to clipboard"
            >
                {copied ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
            <pre className="text-gray-100 whitespace-pre-wrap pr-8">{code}</pre>
        </div>
    );
};

const CategoryCard = ({ title, description, count, link, icon, color }) => {
    const colorClasses = {
        blue: 'hover:border-blue-300 hover:shadow-blue-100',
        green: 'hover:border-green-300 hover:shadow-green-100',
        purple: 'hover:border-purple-300 hover:shadow-purple-100',
        orange: 'hover:border-orange-300 hover:shadow-orange-100'
    };

    return (
        <Link 
            to={link}
            replace={true}
            className={`block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md ${colorClasses[color]} transition-all group`}
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{description}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{count}</div>
        </Link>
    );
};

// Icon Components
const EnterpriseIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

const DeveloperIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const DesignIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 3v18M17 3v18" />
    </svg>
);

const WorkflowIcon = () => (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default OverviewPage;