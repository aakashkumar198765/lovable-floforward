import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Code, Home, ChevronRight } from 'lucide-react';

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
                    <Menu className="h-5 w-5" />
                </button>

                {/* Library Name */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/")}>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
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
                        <Sun className="h-5 w-5" />
                    ) : (
                        <Moon className="h-5 w-5" />
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
                                {/* Category icons could be added here if needed */}
                                <span>{section.category}</span>
                            </div>
                            <ChevronRight 
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                    expandedCategories[section.category] ? 'rotate-90' : ''
                                }`} 
                            />
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
                                {/* Category icon would go here */}
                                <span>{section.category}</span>
                            </div>
                            <ChevronRight 
                                className={`w-4 h-4 text-gray-400 transition-transform ${
                                    expandedCategories[section.category] ? 'rotate-90' : ''
                                }`} 
                            />
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