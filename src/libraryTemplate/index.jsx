import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';

// Import component showcase pages
import ComponentShowcase from './ComponentShowcase';
import OverviewPage from './OverviewPage';
import InstallationPage from './InstallationPage';

// Shared navigation configuration - Proper component architecture grouping with individual components
const NAVIGATION_ITEMS = [
    {
        category: 'Getting Started',
        icon: 'home',
        items: [
            { name: 'Overview', path: '' },
            { name: 'Installation', path: 'installation' }
        ]
    },
    {
        category: 'Atoms',
        icon: 'atom',
        items: [
            { 
                name: 'Display Components', 
                path: 'atoms/display', 
                isCategory: true,
                subItems: [
                    { name: 'Avatar', path: 'atoms/display/Avatar' },
                    { name: 'Badge', path: 'atoms/display/Badge' },
                    { name: 'Icon', path: 'atoms/display/Icon' },
                    { name: 'Label', path: 'atoms/display/Label' },
                    { name: 'Status', path: 'atoms/display/Status' },
                    { name: 'Tooltip', path: 'atoms/display/Tooltip' }
                ]
            },
            { 
                name: 'Form Components', 
                path: 'atoms/form', 
                isCategory: true,
                subItems: [
                    { name: 'Button', path: 'atoms/form/Button' },
                    { name: 'Input', path: 'atoms/form/Input' },
                    { name: 'Select', path: 'atoms/form/Select' },
                    { name: 'Checkbox', path: 'atoms/form/Checkbox' },
                    { name: 'Radio', path: 'atoms/form/Radio' },
                    { name: 'Switch', path: 'atoms/form/Switch' },
                    { name: 'Textarea', path: 'atoms/form/Textarea' }
                ]
            },
            { 
                name: 'Feedback Components', 
                path: 'atoms/feedback', 
                isCategory: true,
                subItems: [
                    { name: 'Alert', path: 'atoms/feedback/Alert' },
                    { name: 'Modal', path: 'atoms/feedback/Modal' },
                    { name: 'Spinner', path: 'atoms/feedback/Spinner' },
                    { name: 'Toast', path: 'atoms/feedback/Toast' }
                ]
            },
            { 
                name: 'Navigation Components', 
                path: 'atoms/navigation', 
                isCategory: true,
                subItems: [
                    { name: 'Breadcrumb', path: 'atoms/navigation/Breadcrumb' },
                    { name: 'Pagination', path: 'atoms/navigation/Pagination' },
                    { name: 'Tab', path: 'atoms/navigation/Tab' }
                ]
            }
        ]
    },
    {
        category: 'Molecules',
        icon: 'molecule',
        items: [
            { 
                name: 'Data Components', 
                path: 'molecules/data', 
                isCategory: true,
                subItems: [
                    { name: 'SearchBox', path: 'molecules/data/SearchBox' },
                    { name: 'FilterPanel', path: 'molecules/data/FilterPanel' },
                    { name: 'SortControl', path: 'molecules/data/SortControl' },
                    { name: 'BulkActions', path: 'molecules/data/BulkActions' }
                ]
            },
            { 
                name: 'Display Components', 
                path: 'molecules/display', 
                isCategory: true,
                subItems: [
                    { name: 'MetricCard', path: 'molecules/display/MetricCard' },
                    { name: 'ProgressTracker', path: 'molecules/display/ProgressTracker' },
                    { name: 'StatusCard', path: 'molecules/display/StatusCard' },
                    { name: 'SummaryPanel', path: 'molecules/display/SummaryPanel' }
                ]
            },
            { 
                name: 'Form Components', 
                path: 'molecules/forms', 
                isCategory: true,
                subItems: [
                    { name: 'AddressForm', path: 'molecules/forms/AddressForm' },
                    { name: 'ApprovalForm', path: 'molecules/forms/ApprovalForm' },
                    { name: 'ContactForm', path: 'molecules/forms/ContactForm' },
                    { name: 'PaymentForm', path: 'molecules/forms/PaymentForm' }
                ]
            }
        ]
    },
    {
        category: 'Organisms',
        icon: 'organism',
        items: [
            { 
                name: 'Data Grids', 
                path: 'organisms/data-grids', 
                isCategory: true,
                subItems: [
                    { name: 'ComparisonTable', path: 'organisms/data-grids/ComparisonTable' },
                    { name: 'EditableDataGrid', path: 'organisms/data-grids/EditableDataGrid' },
                    { name: 'PivotTable', path: 'organisms/data-grids/PivotTable' }
                ]
            },
            { 
                name: 'Integration', 
                path: 'organisms/integration', 
                isCategory: true,
                subItems: [
                    { name: 'APIConnector', path: 'organisms/integration/APIConnector' },
                    { name: 'ExportManager', path: 'organisms/integration/ExportManager' },
                    { name: 'ImportWizard', path: 'organisms/integration/ImportWizard' }
                ]
            },
            { 
                name: 'Management', 
                path: 'organisms/management', 
                isCategory: true,
                subItems: [
                    { name: 'RoleManager', path: 'organisms/management/RoleManager' },
                    { name: 'SettingsManager', path: 'organisms/management/SettingsManager' },
                    { name: 'UserManager', path: 'organisms/management/UserManager' }
                ]
            },
            { 
                name: 'Workflow', 
                path: 'organisms/workflow', 
                isCategory: true,
                subItems: [
                    { name: 'ApprovalWorkflow', path: 'organisms/workflow/ApprovalWorkflow' },
                    { name: 'StateTransition', path: 'organisms/workflow/StateTransition' },
                    { name: 'WorkflowTracker', path: 'organisms/workflow/WorkflowTracker' }
                ]
            }
        ]
    },
    {
        category: 'Templates',
        icon: 'template',
        items: [
            { 
                name: 'Layouts', 
                path: 'templates/layouts', 
                isCategory: true,
                subItems: [
                    { name: 'DashboardLayout', path: 'templates/layouts/DashboardLayout' },
                    { name: 'FormLayout', path: 'templates/layouts/FormLayout' },
                    { name: 'ListDetailLayout', path: 'templates/layouts/ListDetailLayout' }
                ]
            },
            { 
                name: 'Pages', 
                path: 'templates/pages', 
                isCategory: true,
                subItems: [
                    { name: 'ReportsPage', path: 'templates/pages/ReportsPage' },
                    { name: 'SettingsPage', path: 'templates/pages/SettingsPage' },
                    { name: 'WorkflowPage', path: 'templates/pages/WorkflowPage' }
                ]
            }
        ]
    }
];

const LibraryTemplate = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Initialize theme from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) {
                return JSON.parse(saved);
            }
            // Check system preference
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // Apply dark mode class to document and save preference
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Save to localStorage
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    return (
        // <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                {/* Header */}
                <Header 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen}
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />
                
                <div className="flex">
                    {/* Mobile Overlay */}
                    {sidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-20 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                    
                    {/* Desktop Sidebar - Always visible on desktop */}
                    <div className="hidden lg:block">
                        <DesktopSidebar />
                    </div>
                    
                    {/* Mobile Sidebar */}
                    <Sidebar isOpen={sidebarOpen} />
                    
                    {/* Main Content */}
                    <MainContent sidebarOpen={sidebarOpen} />
                </div>
            </div>
        // </Router>
    );
};

// Header Component
const Header = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-2 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm transition-colors duration-200 h-16">
            <div className="flex items-center space-x-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-all duration-200"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Library Name */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        <span className="hidden sm:inline">Re-usable Components Library</span>
                        <span className="sm:hidden">Component Library</span>
                    </h1>
                </div>
            </div>
            
            {/* Theme Toggle */}
            <div className="flex items-center">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
};

// Desktop Sidebar Component - Always visible on desktop
const DesktopSidebar = () => {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = React.useState({
        'Getting Started': true,
        'Atoms': false,
        'Molecules': false,
        'Organisms': false,
        'Templates': false
    });

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    
    const navigationItems = NAVIGATION_ITEMS;

    // Icon component for consistent icon rendering
    const Icon = ({ name, size = "w-4 h-4" }) => {
        const icons = {
            home: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            atom: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 2c-1.5 0-3 4.5-3 10s1.5 10 3 10 3-4.5 3-10S13.5 2 12 2z"/><path d="M2 12c0 1.5 4.5 3 10 3s10-1.5 10-3-4.5-3-10-3S2 10.5 2 12z"/><path d="M2 12c0-1.5 4.5-3 10-3s10 1.5 10 3-4.5 3-10 3S2 13.5 2 12z"/></svg>,
            molecule: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
            organism: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
            template: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
        };
        return icons[name] || <div className={size}></div>;
    };

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
            <nav className="px-3 py-4 space-y-1">
                {navigationItems.map((section) => (
                    <div key={section.category} className="mb-6">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(section.category)}
                            className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                {/* <Icon name={section.icon} size="w-4 h-4" /> */}
                                <span>{section.category}</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                    expandedCategories[section.category] ? 'rotate-90' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Category Items */}
                        {expandedCategories[section.category] && (
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => (
                                    <div key={item.path}>
                                        {/* Main category link */}
                                        <NavLink
                                            to={`/${item.path.replace(/^\/+/, '')}`}
                                            className={({ isActive }) => {
                                                const isOverviewActive = item.path === '' && (isActive || location.pathname === '/');
                                                const active = isActive || location.pathname.includes(item.path) || isOverviewActive;
                                                return `flex items-center px-6 py-2 text-sm transition-colors rounded-lg ${
                                                    active
                                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`;
                                            }}
                                        >
                                            <span className="truncate font-medium">{item.name}</span>
                                        </NavLink>
                                        
                                        {/* Sub-items for individual components */}
                                        {item.subItems && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.path}
                                                        to={`/${subItem.path.replace(/^\/+/, '')}`}
                                                        className={({ isActive }) => {
                                                            const active = isActive || location.pathname.includes(subItem.path);
                                                            console.log("active", active, isActive, location.pathname, subItem.path);
                                                            return `flex items-center px-4 py-1.5 text-xs transition-colors rounded-md ${
                                                                active
                                                                    ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300'
                                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                                            }`;
                                                        }}
                                                    >
                                                        <span className="truncate">{subItem.name}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

// Sidebar Component
const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = React.useState({
        'Getting Started': true,
        'Atoms': false,
        'Molecules': false,
        'Organisms': false,
        'Templates': false
    });

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    
    const navigationItems = NAVIGATION_ITEMS;

    // Icon component for consistent icon rendering
    const Icon = ({ name, size = "w-4 h-4" }) => {
        const icons = {
            home: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
            atom: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><path d="M12 2c-1.5 0-3 4.5-3 10s1.5 10 3 10 3-4.5 3-10S13.5 2 12 2z"/><path d="M2 12c0 1.5 4.5 3 10 3s10-1.5 10-3-4.5-3-10-3S2 10.5 2 12z"/><path d="M2 12c0-1.5 4.5-3 10-3s10 1.5 10 3-4.5 3-10 3S2 13.5 2 12z"/></svg>,
            molecule: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
            organism: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
            template: <svg className={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
        };
        return icons[name] || <div className={size}></div>;
    };

    return (
        <aside className={`bg-white dark:bg-gray-800 transition-all duration-300 ${
            isOpen ? 'w-64' : 'w-0 lg:w-0'
        } min-h-screen fixed lg:sticky top-16 z-30 lg:z-auto ${
            isOpen ? 'block' : 'hidden lg:hidden'
        } overflow-y-auto overflow-x-hidden border-r border-gray-200 dark:border-gray-700`}>
            <nav className="px-3 py-4 space-y-1">
                {navigationItems.map((section) => (
                    <div key={section.category} className="mb-6">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(section.category)}
                            className="w-full flex items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <Icon name={section.icon} size="w-4 h-4" />
                                <span>{section.category}</span>
                            </div>
                            <svg 
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                    expandedCategories[section.category] ? 'rotate-90' : ''
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Category Items */}
                        {expandedCategories[section.category] && (
                            <div className="mt-2 space-y-1">
                                {section.items.map((item) => (
                                    <div key={item.path}>
                                        {/* Main category link */}
                                        <NavLink
                                            to={`/${item.path.replace(/^\/+/, '')}`}
                                            className={({ isActive }) => {
                                                const isOverviewActive = item.path === '' && (isActive || location.pathname === '/');
                                                const active = isActive || location.pathname.includes(item.path) || isOverviewActive;
                                                return `flex items-center px-6 py-2 text-sm transition-colors rounded-lg ${
                                                    active
                                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                }`;
                                            }}
                                        >
                                            <span className="truncate font-medium">{item.name}</span>
                                        </NavLink>
                                        
                                        {/* Sub-items for individual components */}
                                        {item.subItems && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.path}
                                                        to={`/${subItem.path.replace(/^\/+/, '')}`}
                                                        className={({ isActive }) => {
                                                            const active = isActive || location.pathname.includes(subItem.path);
                                                            return `flex items-center px-4 py-1.5 text-xs transition-colors rounded-md ${
                                                                active
                                                                    ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300'
                                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                                            }`;
                                                        }}
                                                    >
                                                        <span className="truncate">{subItem.name}</span>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main Content Component
const MainContent = ({ sidebarOpen }) => {
    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] overflow-x-hidden">
            <div className="px-4 py-6 lg:px-6 lg:py-8 max-w-full w-full overflow-x-auto">
                <ScrollToTop />
                <Routes>
                    <Route index element={<OverviewPage />} />
                    <Route path="installation" element={<InstallationPage />} />
                    
                    {/* Atoms Routes */}
                    <Route path="atoms/display" element={<ComponentShowcase category="atoms" subcategory="display" />} />
                    <Route path="atoms/display/:component" element={<ComponentShowcase category="atoms" subcategory="display" />} />
                    <Route path="atoms/form" element={<ComponentShowcase category="atoms" subcategory="form" />} />
                    <Route path="atoms/form/:component" element={<ComponentShowcase category="atoms" subcategory="form" />} />
                    <Route path="atoms/feedback" element={<ComponentShowcase category="atoms" subcategory="feedback" />} />
                    <Route path="atoms/feedback/:component" element={<ComponentShowcase category="atoms" subcategory="feedback" />} />
                    <Route path="atoms/navigation" element={<ComponentShowcase category="atoms" subcategory="navigation" />} />
                    <Route path="atoms/navigation/:component" element={<ComponentShowcase category="atoms" subcategory="navigation" />} />
                    
                    {/* Molecules Routes */}
                    <Route path="molecules/data" element={<ComponentShowcase category="molecules" subcategory="data" />} />
                    <Route path="molecules/data/:component" element={<ComponentShowcase category="molecules" subcategory="data" />} />
                    <Route path="molecules/display" element={<ComponentShowcase category="molecules" subcategory="display" />} />
                    <Route path="molecules/display/:component" element={<ComponentShowcase category="molecules" subcategory="display" />} />
                    <Route path="molecules/forms" element={<ComponentShowcase category="molecules" subcategory="forms" />} />
                    <Route path="molecules/forms/:component" element={<ComponentShowcase category="molecules" subcategory="forms" />} />
                    
                    {/* Organisms Routes */}
                    <Route path="organisms/data-grids" element={<ComponentShowcase category="organisms" subcategory="data-grids" />} />
                    <Route path="organisms/data-grids/:component" element={<ComponentShowcase category="organisms" subcategory="data-grids" />} />
                    <Route path="organisms/integration" element={<ComponentShowcase category="organisms" subcategory="integration" />} />
                    <Route path="organisms/integration/:component" element={<ComponentShowcase category="organisms" subcategory="integration" />} />
                    <Route path="organisms/management" element={<ComponentShowcase category="organisms" subcategory="management" />} />
                    <Route path="organisms/management/:component" element={<ComponentShowcase category="organisms" subcategory="management" />} />
                    <Route path="organisms/workflow" element={<ComponentShowcase category="organisms" subcategory="workflow" />} />
                    <Route path="organisms/workflow/:component" element={<ComponentShowcase category="organisms" subcategory="workflow" />} />
                    
                    {/* Templates Routes */}
                    <Route path="templates/layouts" element={<ComponentShowcase category="templates" subcategory="layouts" />} />
                    <Route path="templates/layouts/:component" element={<ComponentShowcase category="templates" subcategory="layouts" />} />
                    <Route path="templates/pages" element={<ComponentShowcase category="templates" subcategory="pages" />} />
                    <Route path="templates/pages/:component" element={<ComponentShowcase category="templates" subcategory="pages" />} />
                </Routes>
            </div>
        </main>
    );
};

export default LibraryTemplate;