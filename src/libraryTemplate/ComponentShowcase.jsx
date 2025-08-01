import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// Import all components for showcasing
import * as Atoms from '../components/atoms';
import * as Molecules from '../components/molecules';
import * as Organisms from '../components/organisms';
import * as Templates from '../components/templates';

// Import Breadcrumb component for navigation
const { Breadcrumb } = Atoms;

// Generate breadcrumb items based on current navigation context
const generateBreadcrumbItems = (category, subcategory, selectedComponentName) => {
    const items = [
        { id: 'home', label: 'Components', href: '/' }
    ];

    if (category) {
        const categoryLabels = {
            atoms: 'Atoms',
            molecules: 'Molecules',
            organisms: 'Organisms',
            templates: 'Templates'
        };
        items.push({
            id: category,
            label: categoryLabels[category] || category,
            href: `/${category}`
        });
    }

    if (subcategory) {
        const subcategoryLabels = {
            display: 'Display Components',
            form: 'Form Components',
            feedback: 'Feedback Components',
            navigation: 'Navigation Components',
            data: 'Data Components',
            forms: 'Form Components',
            'data-grids': 'Data Grids',
            integration: 'Integration Components',
            management: 'Management Components',
            workflow: 'Workflow Components',
            layouts: 'Layout Templates',
            pages: 'Page Templates'
        };
        items.push({
            id: subcategory,
            label: subcategoryLabels[subcategory] || subcategory,
            href: `/${category}/${subcategory}`
        });
    }

    if (selectedComponentName) {
        items.push({
            id: selectedComponentName,
            label: selectedComponentName,
            href: `/${category}/${subcategory}/${selectedComponentName}`,
            active: true
        });
    }

    return items;
};

const ComponentShowcase = ({ category, subcategory }) => {
    const { component: selectedComponentName } = useParams();
    const [copiedCode, setCopiedCode] = useState('');

    // Component data mapping with enhanced variations
    const componentData = {
        atoms: {
            display: [
                { 
                    name: 'Avatar', 
                    component: Atoms.Avatar, 
                    description: 'User profile pictures with fallbacks and status indicators',
                    variations: [
                        { name: 'Default', props: { name: 'John Doe', size: 'md' } },
                        { name: 'With Image', props: { src: 'https://i.pravatar.cc/150?img=1', name: 'John Doe', size: 'md' } },
                        { name: 'Small Size', props: { name: 'John Doe', size: 'sm' } },
                        { name: 'Large Size', props: { name: 'John Doe', size: 'lg' } },
                        { name: 'With Status', props: { name: 'John Doe', size: 'md', status: 'online' } }
                    ]
                },
                { 
                    name: 'Badge', 
                    component: Atoms.Badge, 
                    description: 'Status and info badges with multiple variants',
                    variations: [
                        { name: 'Primary', props: { color: 'primary', variant: 'default', children: 'Primary' } },
                        { name: 'Success', props: { color: 'success', variant: 'outlined', children: 'Success' } },
                        { name: 'Warning', props: { color: 'warning', variant: 'filled', children: 'Warning' } },
                        { name: 'Danger', props: { color: 'danger', variant: 'filled', children: 'Danger' } },
                        { name: 'Info', props: { color: 'info', variant: 'outlined', children: 'Info' } }
                    ]
                },
                { 
                    name: 'Icon', 
                    component: Atoms.Icon, 
                    description: 'Comprehensive SVG icon library',
                    variations: [
                        { name: 'Check', props: { name: 'check', size: 'md' } },
                        { name: 'Search', props: { name: 'search', size: 'md' } },
                        { name: 'User', props: { name: 'user', size: 'md' } },
                        { name: 'Settings', props: { name: 'settings', size: 'md' } },
                        { name: 'Large Size', props: { name: 'star', size: 'lg' } }
                    ]
                },
                { 
                    name: 'Label', 
                    component: Atoms.Label, 
                    description: 'Form labels with required/optional indicators',
                    variations: [
                        { name: 'Basic', props: { children: 'Basic Label' } },
                        { name: 'Required', props: { children: 'Required Label', required: true } },
                        { name: 'Optional', props: { children: 'Optional Label', optional: true } },
                        { name: 'With Help Text', props: { children: 'Label with Help', helpText: 'This is helpful information' } }
                    ]
                },
                { 
                    name: 'Status', 
                    component: Atoms.Status, 
                    description: 'Status indicators with animations and trends',
                    variations: [
                        { name: 'Active', props: { status: 'active', variant: 'dot', showLabel: true } },
                        { name: 'Inactive', props: { status: 'inactive', variant: 'dot', showLabel: true } },
                        { name: 'Pending', props: { status: 'pending', variant: 'dot', showLabel: true } },
                        { name: 'Error', props: { status: 'error', variant: 'dot', showLabel: true } },
                        { name: 'Badge Style', props: { status: 'active', variant: 'badge' } }
                    ]
                },
                { 
                    name: 'Tooltip', 
                    component: Atoms.Tooltip, 
                    description: 'Interactive tooltips with smart positioning',
                    variations: [
                        { name: 'Top', props: { content: 'Tooltip content', position: 'top', children: <span>Hover me (top)</span> } },
                        { name: 'Bottom', props: { content: 'Tooltip content', position: 'bottom', children: <span>Hover me (bottom)</span> } },
                        { name: 'Left', props: { content: 'Tooltip content', position: 'left', children: <span>Hover me (left)</span> } },
                        { name: 'Right', props: { content: 'Tooltip content', position: 'right', children: <span>Hover me (right)</span> } }
                    ]
                }
            ],
            form: [
                { 
                    name: 'Button', 
                    component: Atoms.Button, 
                    description: 'Interactive buttons with multiple variants and states',
                    variations: [
                        { name: 'Primary', props: { variant: 'primary', children: 'Primary Button' } },
                        { name: 'Secondary', props: { variant: 'secondary', children: 'Secondary Button' } },
                        { name: 'Outline', props: { variant: 'outline', children: 'Outline Button' } },
                        { name: 'Ghost', props: { variant: 'ghost', children: 'Ghost Button' } },
                        { name: 'Large Size', props: { variant: 'primary', size: 'lg', children: 'Large Button' } },
                        { name: 'Small Size', props: { variant: 'primary', size: 'sm', children: 'Small Button' } },
                        { name: 'Disabled', props: { variant: 'primary', disabled: true, children: 'Disabled Button' } },
                        { name: 'Loading', props: { variant: 'primary', loading: true, children: 'Loading...' } }
                    ],
                    thirdPartyLibraries: []
                },
                { 
                    name: 'Input', 
                    component: Atoms.Input, 
                    description: 'Text inputs with validation and commerce state handling',
                    variations: [
                        { name: 'Basic', props: { placeholder: 'Enter text...', label: 'Basic Input' } },
                        { name: 'Required', props: { placeholder: 'Required field...', label: 'Required Input', required: true } },
                        { name: 'With Error', props: { placeholder: 'Invalid input...', label: 'Input with Error', errorMessage: 'This field is required', status: 'error' } },
                        { name: 'With Helper Text', props: { placeholder: 'Enter email...', label: 'Email Input', helperText: 'We will never share your email address' } },
                        { name: 'Disabled', props: { placeholder: 'Disabled...', label: 'Disabled Input', disabled: true } },
                        { name: 'Password', props: { type: 'password', placeholder: 'Enter password...', label: 'Password Input' } },
                        { name: 'Number Input', props: { type: 'number', placeholder: 'Enter amount...', label: 'Amount', min: 0, max: 1000 } },
                        { name: 'Email Input', props: { type: 'email', placeholder: 'user@example.com', label: 'Email Address' } }
                    ]
                },
                { 
                    name: 'Select', 
                    component: Atoms.Select, 
                    description: 'Dropdown selection with search and multi-select',
                    variations: [
                        { name: 'Basic', props: { label: 'Country', options: [{ value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }, { value: 'uk', label: 'United Kingdom' }], placeholder: 'Select a country' } },
                        { name: 'With Search', props: { label: 'City', options: [{ value: 'ny', label: 'New York' }, { value: 'la', label: 'Los Angeles' }, { value: 'ch', label: 'Chicago' }], searchable: true, placeholder: 'Search and select' } },
                        { name: 'Required', props: { label: 'Required Selection', options: [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }], required: true } },
                        { name: 'Disabled', props: { label: 'Disabled Select', options: [{ value: '1', label: 'Option 1' }], disabled: true } }
                    ]
                },
                { 
                    name: 'Checkbox', 
                    component: Atoms.Checkbox, 
                    description: 'Checkboxes with indeterminate state support',
                    variations: [
                        { name: 'Basic', props: { children: 'Accept terms and conditions' } },
                        { name: 'Checked', props: { children: 'Pre-checked option', defaultChecked: true } },
                        { name: 'Indeterminate', props: { children: 'Partially selected', indeterminate: true } },
                        { name: 'Disabled', props: { children: 'Disabled checkbox', disabled: true } },
                        { name: 'With Description', props: { children: 'Marketing emails', description: 'Receive promotional emails and updates' } }
                    ]
                },
                { 
                    name: 'Radio', 
                    component: Atoms.Radio, 
                    description: 'Radio button groups for single selection',
                    variations: [
                        { 
                            name: 'Basic', 
                            props: { 
                                name: 'size-basic', 
                                label: 'Select Size',
                                options: [
                                    { value: 'small', label: 'Small' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'large', label: 'Large' }
                                ]
                            } 
                        },
                        { 
                            name: 'With Default', 
                            props: { 
                                name: 'priority-default', 
                                label: 'Priority Level',
                                defaultValue: 'medium',
                                options: [
                                    { value: 'low', label: 'Low Priority' },
                                    { value: 'medium', label: 'Medium Priority' },
                                    { value: 'high', label: 'High Priority' }
                                ]
                            } 
                        },
                        { 
                            name: 'Horizontal', 
                            props: { 
                                name: 'orientation-demo', 
                                label: 'Choose Option',
                                orientation: 'horizontal',
                                options: [
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                    { value: 'maybe', label: 'Maybe' }
                                ]
                            } 
                        },
                        { 
                            name: 'With Descriptions', 
                            props: { 
                                name: 'plan-type', 
                                label: 'Select Plan',
                                options: [
                                    { value: 'basic', label: 'Basic Plan', description: 'Essential features for getting started' },
                                    { value: 'pro', label: 'Pro Plan', description: 'Advanced features for professionals' },
                                    { value: 'enterprise', label: 'Enterprise Plan', description: 'Full features for large teams' }
                                ]
                            } 
                        }
                    ]
                },
                { 
                    name: 'Switch', 
                    component: Atoms.Switch, 
                    description: 'Toggle switches with multiple states',
                    variations: [
                        { name: 'Basic', props: { children: 'Enable notifications' } },
                        { name: 'Checked', props: { children: 'Dark mode', defaultChecked: true } },
                        { name: 'Disabled', props: { children: 'Premium feature', disabled: true } },
                        { name: 'Small Size', props: { children: 'Compact toggle', size: 'sm' } },
                        { name: 'Large Size', props: { children: 'Large toggle', size: 'lg' } }
                    ]
                },
                { 
                    name: 'Textarea', 
                    component: Atoms.Textarea, 
                    description: 'Multi-line text inputs with auto-resize',
                    variations: [
                        { name: 'Basic', props: { label: 'Message', placeholder: 'Enter your message...', rows: 4 } },
                        { name: 'Required', props: { label: 'Required Field', placeholder: 'This field is required...', required: true, rows: 3 } },
                        { name: 'With Error', props: { label: 'Feedback', placeholder: 'Invalid input...', errorMessage: 'Message is too short', status: 'error', rows: 3 } },
                        { name: 'With Helper Text', props: { label: 'Bio', placeholder: 'Tell us about yourself...', helperText: 'Share a bit about your background and interests', rows: 4 } },
                        { name: 'Character Limit', props: { label: 'Description', placeholder: 'Enter description...', maxLength: 200, rows: 4 } },
                        { name: 'Disabled', props: { label: 'Disabled Field', placeholder: 'Cannot edit...', disabled: true, rows: 3 } },
                        { name: 'Small Size', props: { label: 'Small Textarea', placeholder: 'Compact input...', size: 'sm', rows: 2 } },
                        { name: 'Large Size', props: { label: 'Large Textarea', placeholder: 'Spacious input...', size: 'lg', rows: 6 } }
                    ]
                }
            ],
            feedback: [
                { 
                    name: 'Alert', 
                    component: Atoms.Alert, 
                    description: 'System alerts with multiple variants, actions, and dismissible options',
                    variations: [
                        { 
                            name: 'Info Alert', 
                            props: { 
                                variant: 'info', 
                                title: 'Information',
                                children: 'This is an informational alert message providing helpful context or updates to the user.' 
                            } 
                        },
                        { 
                            name: 'Success Alert', 
                            props: { 
                                variant: 'success', 
                                title: 'Success!',
                                children: 'Your operation has been completed successfully. All changes have been saved.',
                                showIcon: true
                            } 
                        },
                        { 
                            name: 'Warning Alert', 
                            props: { 
                                variant: 'warning', 
                                title: 'Warning',
                                children: 'Please review this warning message carefully. Some actions may require your attention.',
                                showIcon: true,
                                bordered: true
                            } 
                        },
                        { 
                            name: 'Error Alert', 
                            props: { 
                                variant: 'error', 
                                title: 'Error Occurred',
                                children: 'An error occurred while processing your request. Please try again or contact support.',
                                showIcon: true,
                                severity: 'high'
                            } 
                        },
                        { 
                            name: 'Dismissible Alert', 
                            props: { 
                                variant: 'info', 
                                title: 'Dismissible Notice',
                                children: 'This alert can be dismissed by clicking the close button.',
                                dismissible: true,
                                showIcon: true,
                                onDismiss: () => console.log('Alert dismissed')
                            } 
                        },
                        { 
                            name: 'Alert with Actions', 
                            props: { 
                                variant: 'warning', 
                                title: 'Confirm Action',
                                children: 'Are you sure you want to proceed with this action? This cannot be undone.',
                                showIcon: true,
                                actions: (
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700" onClick={() => console.log('Confirmed')}>
                                            Confirm
                                        </button>
                                        <button className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-400 dark:hover:bg-gray-500" onClick={() => console.log('Cancelled')}>
                                            Cancel
                                        </button>
                                    </div>
                                )
                            } 
                        },
                        { 
                            name: 'Banner Alert', 
                            props: { 
                                variant: 'info', 
                                title: 'System Maintenance',
                                description: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.',
                                banner: true,
                                showIcon: true,
                                actions: (
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => console.log('Learn more')}>
                                        Learn More →
                                    </button>
                                )
                            } 
                        },
                        { 
                            name: 'Compact Alert', 
                            props: { 
                                variant: 'success', 
                                children: 'Settings saved successfully!',
                                size: 'sm',
                                showIcon: true,
                                dismissible: true
                            } 
                        },
                        { 
                            name: 'Critical Alert', 
                            props: { 
                                variant: 'error', 
                                title: 'Critical System Error',
                                description: 'A critical error has occurred that requires immediate attention. System operations may be affected.',
                                severity: 'critical',
                                showIcon: true,
                                bordered: true,
                                actions: (
                                    <div className="flex space-x-2 mt-2">
                                        <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700" onClick={() => console.log('Contact Support')}>
                                            Contact Support
                                        </button>
                                        <button className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => console.log('View Details')}>
                                            View Details
                                        </button>
                                    </div>
                                )
                            } 
                        }
                    ]
                },
                { 
                    name: 'Modal', 
                    component: Atoms.Modal, 
                    description: 'Dialog modals with backdrop and size variants',
                    variations: [
                        { name: 'Basic', props: { isOpen: true, title: 'Basic Modal', children: 'This is a basic modal with some content.', onClose: () => {} } },
                        { name: 'Small Size', props: { isOpen: true, title: 'Small Modal', size: 'sm', children: 'Compact modal content.', onClose: () => {} } },
                        { name: 'Large Size', props: { isOpen: true, title: 'Large Modal', size: 'lg', children: 'This is a large modal with more space for content.', onClose: () => {} } },
                        // { name: 'With Footer', props: { isOpen: true, title: 'Modal with Footer', children: 'Modal content here.', footer: { primary: 'Save', secondary: 'Cancel' }, onClose: () => {} } },
                        { name: 'No Close Button', props: { isOpen: true, title: 'Important Notice', children: 'This modal requires user action.', showCloseButton: false, onClose: () => {} } }
                    ]
                },
                { 
                    name: 'Spinner', 
                    component: Atoms.Spinner, 
                    description: 'Loading spinners with multiple sizes and colors',
                    variations: [
                        { name: 'Small', props: { size: 'sm' } },
                        { name: 'Medium', props: { size: 'md' } },
                        { name: 'Large', props: { size: 'lg' } },
                        { name: 'Primary Color', props: { size: 'md', color: 'primary' } },
                        { name: 'Success Color', props: { size: 'md', color: 'success' } }
                    ]
                },
                { 
                    name: 'Toast', 
                    component: Atoms.Toast, 
                    description: 'Notification toasts with positioning',
                    variations: [
                        { name: 'Success', props: { variant: 'success', description: 'Changes saved successfully!', visible: true } },
                        { name: 'Error', props: { variant: 'error', description: 'Failed to save changes.', visible: true } },
                        { name: 'Warning', props: { variant: 'warning', description: 'Please review your input.', visible: true } },
                        { name: 'Info', props: { variant: 'info', description: 'New feature available!', visible: true } },
                        { name: 'With Action', props: { variant: 'info', description: 'Update available', action: { label: 'Update', onClick: () => {} }, visible: true } },
                        { 
                            name: 'Interactive Demo', 
                            props: { 
                                variant: 'success', 
                                description: 'This is a live toast demonstration!', 
                                visible: true,
                                duration: 4000,
                                position: 'top-right',
                                action: { 
                                    label: 'Dismiss', 
                                    onClick: () => console.log('Toast dismissed') 
                                }
                            } 
                        }
                    ]
                }
            ],
            navigation: [
                { 
                    name: 'Breadcrumb', 
                    component: Atoms.Breadcrumb, 
                    description: 'Hierarchical navigation breadcrumbs with various display options',
                    variations: [
                        { 
                            name: 'Basic Navigation', 
                            props: { 
                                items: [
                                    { id: 'home', label: 'Home', href: '/' },
                                    { id: 'products', label: 'Products', href: '/products' },
                                    { id: 'category', label: 'Electronics', href: '/products/electronics' },
                                    { id: 'current', label: 'Smartphones', current: true }
                                ],
                                onClick: (item) => console.log(`Navigated to: ${item.label}`)
                            } 
                        },
                        { 
                            name: 'With Icons', 
                            props: { 
                                items: [
                                    { id: 'home', label: 'Home', href: '/', icon: <span>🏠</span> },
                                    { id: 'workspace', label: 'My Workspace', href: '/workspace', icon: <span>💼</span> },
                                    { id: 'project', label: 'Project Alpha', href: '/workspace/project-alpha', icon: <span>📁</span> },
                                    { id: 'current', label: 'Settings', current: true, icon: <span>⚙️</span> }
                                ],
                                onClick: (item) => console.log(`Clicked: ${item.label}`)
                            } 
                        },
                        { 
                            name: 'E-commerce Path', 
                            props: { 
                                items: [
                                    { id: 'home', label: 'Store', href: '/' },
                                    { id: 'category', label: 'Clothing', href: '/clothing' },
                                    { id: 'subcategory', label: 'Men\'s Shirts', href: '/clothing/mens-shirts' },
                                    { id: 'brand', label: 'Premium Brand', href: '/clothing/mens-shirts/premium-brand' },
                                    { id: 'current', label: 'Classic White Shirt', current: true }
                                ],
                                showHome: true,
                                homeIcon: <span>🏪</span>
                            } 
                        },
                        { 
                            name: 'Admin Dashboard Path', 
                            props: { 
                                items: [
                                    { id: 'dashboard', label: 'Dashboard', href: '/admin' },
                                    { id: 'users', label: 'User Management', href: '/admin/users' },
                                    { id: 'roles', label: 'Roles & Permissions', href: '/admin/users/roles' },
                                    { id: 'edit', label: 'Edit Role', href: '/admin/users/roles/edit' },
                                    { id: 'current', label: 'Administrator', current: true }
                                ]
                            } 
                        },
                        { 
                            name: 'Deep Nested Path', 
                            props: { 
                                items: [
                                    { id: 'root', label: 'System', href: '/system' },
                                    { id: 'config', label: 'Configuration', href: '/system/config' },
                                    { id: 'database', label: 'Database', href: '/system/config/database' },
                                    { id: 'connections', label: 'Connections', href: '/system/config/database/connections' },
                                    { id: 'mysql', label: 'MySQL Settings', href: '/system/config/database/connections/mysql' },
                                    { id: 'current', label: 'Performance Tuning', current: true }
                                ],
                                maxItems: 4,
                                collapsible: true
                            } 
                        },
                        { 
                            name: 'With Badges', 
                            props: { 
                                items: [
                                    { id: 'inbox', label: 'Inbox', href: '/inbox', badge: 12 },
                                    { id: 'important', label: 'Important', href: '/inbox/important', badge: 3 },
                                    { id: 'current', label: 'High Priority', current: true, badge: 'NEW' }
                                ]
                            } 
                        },
                        { 
                            name: 'File System Path', 
                            props: { 
                                items: [
                                    { id: 'root', label: 'Documents', href: '/documents', icon: <span>📁</span> },
                                    { id: 'projects', label: 'Projects', href: '/documents/projects', icon: <span>📁</span> },
                                    { id: 'web', label: 'Web Development', href: '/documents/projects/web', icon: <span>📁</span> },
                                    { id: 'react', label: 'React Components', href: '/documents/projects/web/react', icon: <span>📁</span> },
                                    { id: 'current', label: 'Button.tsx', current: true, icon: <span>📄</span> }
                                ],
                                separator: <span className="text-gray-400 dark:text-gray-500">/</span>
                            } 
                        },
                        { 
                            name: 'Custom Separator', 
                            props: { 
                                items: [
                                    { id: 'blog', label: 'Blog', href: '/blog' },
                                    { id: 'category', label: 'Technology', href: '/blog/technology' },
                                    { id: 'subcategory', label: 'Web Development', href: '/blog/technology/web-development' },
                                    { id: 'current', label: 'React Best Practices', current: true }
                                ],
                                separator: <span className="text-blue-500 mx-2">→</span>
                            } 
                        }
                    ]
                },
                { 
                    name: 'Pagination', 
                    component: Atoms.Pagination, 
                    description: 'Page navigation with size controls and data information',
                    variations: [
                        { 
                            name: 'Basic', 
                            props: { 
                                current: 3, 
                                total: 250, 
                                pageSize: 10, 
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`) 
                            } 
                        },
                        { 
                            name: 'With Total Info', 
                            props: { 
                                current: 2, 
                                total: 156, 
                                pageSize: 20, 
                                showTotal: true,
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`) 
                            } 
                        },
                        { 
                            name: 'With Size Changer', 
                            props: { 
                                current: 1, 
                                total: 500, 
                                pageSize: 25, 
                                showSizeChanger: true,
                                pageSizeOptions: [10, 25, 50, 100],
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`),
                                onShowSizeChange: (page, size) => console.log(`Page: ${page}, New Size: ${size}`)
                            } 
                        },
                        { 
                            name: 'With Quick Jumper', 
                            props: { 
                                current: 5, 
                                total: 1000, 
                                pageSize: 20, 
                                showQuickJumper: true,
                                showTotal: true,
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`) 
                            } 
                        },
                        { 
                            name: 'Simple Mode', 
                            props: { 
                                current: 4, 
                                total: 80, 
                                pageSize: 10, 
                                simple: true,
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`) 
                            } 
                        },
                        { 
                            name: 'Small Size', 
                            props: { 
                                current: 2, 
                                total: 120, 
                                pageSize: 15, 
                                size: 'sm',
                                showTotal: true,
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`) 
                            } 
                        },
                        { 
                            name: 'Large Size Full Featured', 
                            props: { 
                                current: 7, 
                                total: 2500, 
                                pageSize: 50, 
                                size: 'lg',
                                showTotal: true,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showFirstLastJumpers: true,
                                pageSizeOptions: [25, 50, 100, 200],
                                formatTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} results`,
                                onChange: (page, pageSize) => console.log(`Page: ${page}, Size: ${pageSize}`),
                                onShowSizeChange: (page, size) => console.log(`Page: ${page}, New Size: ${size}`)
                            } 
                        }
                    ]
                },
                { 
                    name: 'Tab', 
                    component: Atoms.Tab, 
                    description: 'Tab navigation with content switching and various layouts',
                    variations: [
                        { 
                            name: 'Basic Tabs', 
                            props: { 
                                items: [
                                    { id: 'overview', label: 'Overview', content: <div className="p-4 text-gray-700 dark:text-gray-300">Overview content showing general information and summary data.</div> },
                                    { id: 'details', label: 'Details', content: <div className="p-4 text-gray-700 dark:text-gray-300">Detailed information including specifications and extended descriptions.</div> },
                                    { id: 'settings', label: 'Settings', content: <div className="p-4 text-gray-700 dark:text-gray-300">Configuration options and preferences panel.</div> }
                                ],
                                defaultActiveTab: 'overview',
                                onChange: (tabId) => console.log(`Active tab: ${tabId}`)
                            }
                        },
                        { 
                            name: 'Pills Variant', 
                            props: { 
                                items: [
                                    { id: 'dashboard', label: 'Dashboard', content: <div className="p-4 text-gray-700 dark:text-gray-300">Dashboard with key metrics and charts.</div> },
                                    { id: 'analytics', label: 'Analytics', content: <div className="p-4 text-gray-700 dark:text-gray-300">Advanced analytics and reporting tools.</div> },
                                    { id: 'reports', label: 'Reports', content: <div className="p-4 text-gray-700 dark:text-gray-300">Generated reports and export options.</div> }
                                ],
                                variant: 'pills',
                                defaultActiveTab: 'dashboard'
                            }
                        },
                        { 
                            name: 'With Icons & Badges', 
                            props: { 
                                items: [
                                    { 
                                        id: 'inbox', 
                                        label: 'Inbox', 
                                        icon: <span>📧</span>,
                                        badge: 5,
                                        content: <div className="p-4 text-gray-700 dark:text-gray-300">Email inbox with 5 new messages.</div>
                                    },
                                    { 
                                        id: 'tasks', 
                                        label: 'Tasks', 
                                        icon: <span>✓</span>,
                                        badge: 12,
                                        content: <div className="p-4 text-gray-700 dark:text-gray-300">Task management with 12 pending items.</div>
                                    },
                                    { 
                                        id: 'notifications', 
                                        label: 'Notifications', 
                                        icon: <span>🔔</span>,
                                        badge: 3,
                                        content: <div className="p-4 text-gray-700 dark:text-gray-300">System notifications and alerts.</div>
                                    }
                                ],
                                defaultActiveTab: 'inbox'
                            }
                        },
                        { 
                            name: 'Vertical Orientation', 
                            props: { 
                                items: [
                                    { id: 'profile', label: 'Profile', content: <div className="p-4 text-gray-700 dark:text-gray-300">User profile information and avatar settings.</div> },
                                    { id: 'security', label: 'Security', content: <div className="p-4 text-gray-700 dark:text-gray-300">Password management and security settings.</div> },
                                    { id: 'preferences', label: 'Preferences', content: <div className="p-4 text-gray-700 dark:text-gray-300">Application preferences and theme settings.</div> }
                                ],
                                orientation: 'vertical',
                                defaultActiveTab: 'profile'
                            }
                        },
                        { 
                            name: 'Closable Tabs', 
                            props: { 
                                items: [
                                    { id: 'file1', label: 'Document.txt', closable: true, content: <div className="p-4 text-gray-700 dark:text-gray-300">Content of Document.txt file.</div> },
                                    { id: 'file2', label: 'Spreadsheet.xlsx', closable: true, content: <div className="p-4 text-gray-700 dark:text-gray-300">Excel spreadsheet data and calculations.</div> },
                                    { id: 'file3', label: 'Presentation.pptx', closable: true, content: <div className="p-4 text-gray-700 dark:text-gray-300">PowerPoint presentation slides.</div> }
                                ],
                                closable: true,
                                defaultActiveTab: 'file1',
                                onClose: (tabId) => console.log(`Closed tab: ${tabId}`)
                            }
                        },
                        { 
                            name: 'Underline Style', 
                            props: { 
                                items: [
                                    { id: 'code', label: 'Code', content: <div className="p-4 text-gray-700 dark:text-gray-300"><pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded">{`function hello() {
  console.log('Hello World!');
}`}</pre></div> },
                                    { id: 'preview', label: 'Preview', content: <div className="p-4 text-gray-700 dark:text-gray-300">Live preview of the component output.</div> },
                                    { id: 'docs', label: 'Documentation', content: <div className="p-4 text-gray-700 dark:text-gray-300">API documentation and usage examples.</div> }
                                ],
                                variant: 'underline',
                                defaultActiveTab: 'code'
                            }
                        },
                        { 
                            name: 'Full Width', 
                            props: { 
                                items: [
                                    { id: 'all', label: 'All Products', content: <div className="p-4 text-gray-700 dark:text-gray-300">Complete product catalog with all available items.</div> },
                                    { id: 'featured', label: 'Featured', content: <div className="p-4 text-gray-700 dark:text-gray-300">Highlighted and promoted products.</div> },
                                    { id: 'sale', label: 'On Sale', content: <div className="p-4 text-gray-700 dark:text-gray-300">Discounted products and special offers.</div> }
                                ],
                                fullWidth: true,
                                centered: true,
                                defaultActiveTab: 'all'
                            }
                        }
                    ]
                }
            ]
        },
        molecules: {
            data: [
                { 
                    name: 'SearchBox', 
                    component: Molecules.SearchBox, 
                    description: 'Search interface with debouncing',
                    variations: [
                        { name: 'Basic', props: { placeholder: 'Search products...' } },
                        { name: 'With Clear Button', props: { placeholder: 'Search...', showClearButton: true } },
                        { name: 'With Search Button', props: { placeholder: 'Enter search term...', showSearchButton: true } }
                    ]
                },
                { 
                    name: 'FilterPanel', 
                    component: Molecules.FilterPanel, 
                    description: 'Advanced filtering interface',
                    variations: [
                        { name: 'Basic', props: { filters: [{ label: 'Status', type: 'select', options: ['Active', 'Inactive'] }, { label: 'Date', type: 'daterange' }] } },
                        { name: 'With Search', props: { filters: [{ label: 'Category', type: 'multiselect', options: ['Electronics', 'Clothing', 'Books'] }], showSearch: true } }
                    ]
                },
                { 
                    name: 'SortControl', 
                    component: Molecules.SortControl, 
                    description: 'Sorting controls with direction indicators',
                    variations: [
                        { name: 'Basic', props: { options: [{ label: 'Name', value: 'name' }, { label: 'Date', value: 'date' }, { label: 'Price', value: 'price' }] } },
                        { name: 'With Current Sort', props: { options: [{ label: 'Name', value: 'name' }, { label: 'Date', value: 'date' }], currentSort: 'name', direction: 'asc' } }
                    ]
                }
            ],
            display: [
                { 
                    name: 'MetricCard', 
                    component: Molecules.MetricCard, 
                    description: 'Data visualization cards with trends',
                    variations: [
                        { name: 'Basic', props: { title: 'Total Sales', value: '$24,500', trend: '+12%', trendDirection: 'up' } },
                        { name: 'Negative Trend', props: { title: 'Active Users', value: '1,234', trend: '-5%', trendDirection: 'down' } },
                        { name: 'With Chart', props: { title: 'Revenue', value: '$45,780', trend: '+8%', showChart: true, chartData: [10, 15, 12, 18, 20] } },
                        { name: 'Large Size', props: { title: 'Conversion Rate', value: '3.4%', trend: '+2.1%', size: 'lg' } }
                    ]
                },
                { 
                    name: 'StatusCard', 
                    component: Molecules.StatusCard, 
                    description: 'Status information display cards',
                    variations: [
                        { name: 'Success', props: { title: 'System Status', status: 'operational', description: 'All systems running smoothly', variant: 'success' } },
                        { name: 'Warning', props: { title: 'Maintenance', status: 'scheduled', description: 'Maintenance window in 2 hours', variant: 'warning' } },
                        { name: 'Error', props: { title: 'Service Alert', status: 'down', description: 'Payment service temporarily unavailable', variant: 'error' } }
                    ]
                }
            ],
            forms: [
                { 
                    name: 'ContactForm', 
                    component: Molecules.ContactForm, 
                    description: 'Comprehensive contact information form',
                    variations: [
                        { name: 'Basic', props: { title: 'Contact Information', showJobInfo: false } },
                        { name: 'With Company', props: { title: 'Business Contact', showJobInfo: true, showCompany: true } },
                        { name: 'Complete Form', props: { title: 'Complete Contact Info', showJobInfo: true, showMultiplePhones: true } }
                    ]
                },
                { 
                    name: 'AddressForm', 
                    component: Molecules.AddressForm, 
                    description: 'Complete address input form with validation',
                    variations: [
                        { name: 'Basic', props: { title: 'Shipping Address', addressType: 'shipping' } },
                        { name: 'With Company', props: { title: 'Business Address', showCompany: true, addressType: 'business' } },
                        { name: 'Billing Address', props: { title: 'Billing Address', addressType: 'billing', showDefaultCheckbox: true } }
                    ]
                }
            ]
        },
        organisms: {
            'data-grids': [
                { 
                    name: 'EditableDataGrid', 
                    component: Organisms.EditableDataGrid, 
                    description: 'Full-featured data grid with editing, sorting, and filtering capabilities',
                    variations: [
                        { 
                            name: 'Basic', 
                            props: { 
                                columns: [
                                    { key: 'name', title: 'Name', dataIndex: 'name', editable: true, sortable: true },
                                    { key: 'email', title: 'Email', dataIndex: 'email', editable: true, filterable: true },
                                    { key: 'status', title: 'Status', dataIndex: 'status', editable: true }
                                ],
                                data: [
                                    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
                                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
                                    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', status: 'Active' }
                                ],
                                pagination: { current: 1, pageSize: 10, total: 3 },
                                onCellEdit: () => {},
                                onRowAdd: () => {},
                                onRowDelete: () => {},
                                className: 'w-full overflow-x-auto'
                            }
                        },
                        { 
                            name: 'With Actions', 
                            props: { 
                                columns: [
                                    { key: 'product', title: 'Product', dataIndex: 'product', sortable: true },
                                    { key: 'price', title: 'Price', dataIndex: 'price', sortable: true },
                                    { key: 'stock', title: 'Stock', dataIndex: 'stock', editable: true }
                                ],
                                data: [
                                    { id: 1, product: 'Laptop', price: 999.99, stock: 15 },
                                    { id: 2, product: 'Mouse', price: 29.99, stock: 50 },
                                    { id: 3, product: 'Keyboard', price: 79.99, stock: 25 }
                                ],
                                editable: true,
                                pagination: { current: 1, pageSize: 10, total: 3 },
                                onCellEdit: () => {},
                                onRowAdd: () => {},
                                onRowDelete: () => {},
                                className: 'w-full overflow-x-auto'
                            }
                        }
                    ],
                    thirdPartyLibraries: ['react-table', 'date-fns']
                },
                { 
                    name: 'ComparisonTable', 
                    component: Organisms.ComparisonTable, 
                    description: 'Side-by-side data comparison tables with highlighting',
                    variations: [
                        { 
                            name: 'Product Comparison', 
                            props: { 
                                items: [
                                    { 
                                        id: 'basic', 
                                        name: 'Basic Plan', 
                                        data: { price: '$9/month', users: '10', storage: '100GB', support: 'Email' },
                                        metadata: { recommended: false }
                                    },
                                    { 
                                        id: 'pro', 
                                        name: 'Pro Plan', 
                                        data: { price: '$29/month', users: '50', storage: '500GB', support: 'Priority' },
                                        metadata: { recommended: true }
                                    },
                                    { 
                                        id: 'enterprise', 
                                        name: 'Enterprise', 
                                        data: { price: '$99/month', users: 'Unlimited', storage: '2TB', support: '24/7' },
                                        metadata: { recommended: false }
                                    }
                                ],
                                criteria: [
                                    { key: 'price', label: 'Price', type: 'text', weight: 0.3 },
                                    { key: 'users', label: 'Users', type: 'text', weight: 0.25 },
                                    { key: 'storage', label: 'Storage', type: 'text', weight: 0.25 },
                                    { key: 'support', label: 'Support', type: 'text', weight: 0.2 }
                                ],
                                highlightBest: true,
                                showScores: true,
                                onItemSelect: () => {},
                                onCompare: () => {},
                                className: 'w-full overflow-x-auto'
                            }
                        },
                        { 
                            name: 'Feature Matrix', 
                            props: { 
                                items: [
                                    { 
                                        id: 'solution-a', 
                                        name: 'Solution A', 
                                        data: { 
                                            performance: 'High', 
                                            scalability: 'Excellent', 
                                            cost: 'Medium', 
                                            support: 'Business Hours',
                                            integration: 'REST API'
                                        }
                                    },
                                    { 
                                        id: 'solution-b', 
                                        name: 'Solution B', 
                                        data: { 
                                            performance: 'Very High', 
                                            scalability: 'Good', 
                                            cost: 'High', 
                                            support: '24/7',
                                            integration: 'GraphQL + REST'
                                        }
                                    }
                                ],
                                criteria: [
                                    { key: 'performance', label: 'Performance', type: 'text', weight: 0.25 },
                                    { key: 'scalability', label: 'Scalability', type: 'text', weight: 0.2 },
                                    { key: 'cost', label: 'Cost', type: 'text', weight: 0.2 },
                                    { key: 'support', label: 'Support', type: 'text', weight: 0.15 },
                                    { key: 'integration', label: 'Integration', type: 'text', weight: 0.2 }
                                ],
                                layout: 'horizontal',
                                highlightBest: false,
                                onItemSelect: () => {},
                                className: 'w-full overflow-x-auto'
                            }
                        }
                    ]
                },
                { 
                    name: 'PivotTable', 
                    component: Organisms.PivotTable, 
                    description: 'Interactive pivot table for data analysis and aggregation',
                    variations: [
                        { 
                            name: 'Sales Analysis', 
                            props: { 
                                data: [
                                    { region: 'North', product: 'Laptops', quarter: 'Q1', sales: 120000, units: 240 },
                                    { region: 'North', product: 'Laptops', quarter: 'Q2', sales: 135000, units: 270 },
                                    { region: 'North', product: 'Tablets', quarter: 'Q1', sales: 80000, units: 200 },
                                    { region: 'North', product: 'Tablets', quarter: 'Q2', sales: 95000, units: 238 },
                                    { region: 'South', product: 'Laptops', quarter: 'Q1', sales: 90000, units: 180 },
                                    { region: 'South', product: 'Laptops', quarter: 'Q2', sales: 105000, units: 210 },
                                    { region: 'South', product: 'Tablets', quarter: 'Q1', sales: 65000, units: 163 },
                                    { region: 'South', product: 'Tablets', quarter: 'Q2', sales: 72000, units: 180 }
                                ],
                                rows: ['region', 'product'],
                                columns: ['quarter'],
                                values: [
                                    { field: 'sales', aggregation: 'sum', formatter: (value) => `$${value.toLocaleString()}` },
                                    { field: 'units', aggregation: 'sum', formatter: (value) => value.toLocaleString() }
                                ],
                                showTotals: true,
                                showSubtotals: true,
                                expandable: true,
                                onCellClick: () => {},
                                onDrillDown: () => {}
                            }
                        },
                        { 
                            name: 'Employee Performance', 
                            props: { 
                                data: [
                                    { department: 'Sales', role: 'Manager', month: 'Jan', performance: 95, hours: 160 },
                                    { department: 'Sales', role: 'Manager', month: 'Feb', performance: 88, hours: 155 },
                                    { department: 'Sales', role: 'Associate', month: 'Jan', performance: 82, hours: 165 },
                                    { department: 'Sales', role: 'Associate', month: 'Feb', performance: 87, hours: 162 },
                                    { department: 'Marketing', role: 'Manager', month: 'Jan', performance: 91, hours: 158 },
                                    { department: 'Marketing', role: 'Manager', month: 'Feb', performance: 94, hours: 160 },
                                    { department: 'Marketing', role: 'Associate', month: 'Jan', performance: 79, hours: 170 },
                                    { department: 'Marketing', role: 'Associate', month: 'Feb', performance: 83, hours: 168 }
                                ],
                                rows: ['department'],
                                columns: ['role', 'month'],
                                values: [
                                    { field: 'performance', aggregation: 'avg', formatter: (value) => `${Math.round(value)}%` },
                                    { field: 'hours', aggregation: 'avg', formatter: (value) => `${Math.round(value)}h` }
                                ],
                                showTotals: true,
                                expandable: false,
                                onCellClick: () => {},
                                className: 'w-full overflow-x-auto'
                            }
                        }
                    ]
                }
            ],
            integration: [
                { 
                    name: 'ExportManager', 
                    component: Organisms.ExportManager, 
                    description: 'Data export with multiple formats and scheduling',
                    variations: [
                        { 
                            name: 'Basic Export', 
                            props: { 
                                formats: ['CSV', 'PDF', 'Excel'],
                                onExport: () => {},
                                data: { records: 1234, lastUpdated: '2024-01-15' }
                            }
                        },
                        { 
                            name: 'Scheduled Export', 
                            props: { 
                                formats: ['CSV', 'JSON'],
                                allowScheduling: true,
                                scheduleOptions: ['Daily', 'Weekly', 'Monthly'],
                                onExport: () => {},
                                onSchedule: () => {}
                            }
                        }
                    ]
                }
            ],
            management: [
                { 
                    name: 'UserManager', 
                    component: Organisms.UserManager, 
                    description: 'Complete user management interface with roles and permissions',
                    variations: [
                        { 
                            name: 'Basic User List', 
                            props: { 
                                title: 'User Management',
                                users: [
                                    { 
                                        id: '1', 
                                        username: 'admin_user', 
                                        email: 'admin@company.com', 
                                        firstName: 'Admin', 
                                        lastName: 'User',
                                        avatar: '/images/admin.jpg',
                                        status: 'active',
                                        role: 'Administrator',
                                        lastLogin: '2024-01-20T10:30:00Z'
                                    },
                                    { 
                                        id: '2', 
                                        username: 'john_editor', 
                                        email: 'john@company.com', 
                                        firstName: 'John', 
                                        lastName: 'Editor',
                                        status: 'active',
                                        role: 'Editor',
                                        lastLogin: '2024-01-19T14:15:00Z'
                                    },
                                    { 
                                        id: '3', 
                                        username: 'jane_viewer', 
                                        email: 'jane@company.com', 
                                        firstName: 'Jane', 
                                        lastName: 'Viewer',
                                        status: 'inactive',
                                        role: 'Viewer',
                                        lastLogin: '2024-01-15T09:00:00Z'
                                    }
                                ],
                                onEdit: () => {},
                                onDelete: () => {},
                                onInvite: () => {},
                                onStatusChange: () => {}
                            }
                        },
                        { 
                            name: 'With Bulk Actions', 
                            props: { 
                                title: 'Team Management',
                                users: [
                                    { 
                                        id: '1', 
                                        username: 'user_one', 
                                        email: 'user1@company.com', 
                                        firstName: 'User', 
                                        lastName: 'One',
                                        status: 'active',
                                        role: 'Editor'
                                    },
                                    { 
                                        id: '2', 
                                        username: 'user_two', 
                                        email: 'user2@company.com', 
                                        firstName: 'User', 
                                        lastName: 'Two',
                                        status: 'pending',
                                        role: 'Viewer'
                                    }
                                ],
                                allowBulkActions: true,
                                bulkActions: [
                                    { label: 'Activate', action: 'activate' },
                                    { label: 'Deactivate', action: 'deactivate' },
                                    { label: 'Delete', action: 'delete' }
                                ],
                                onBulkAction: () => {}
                            }
                        }
                    ],
                    thirdPartyLibraries: ['react-table']
                }
            ],
            workflow: [
                { 
                    name: 'ApprovalWorkflow', 
                    component: Organisms.ApprovalWorkflow, 
                    description: 'Multi-step approval processes with state management',
                    variations: [
                        { 
                            name: 'Purchase Order Approval', 
                            props: { 
                                id: 'PO-2024-001',
                                title: 'Purchase Order - Office Supplies',
                                currentStep: 'finance-approval',
                                steps: [
                                    { 
                                        id: 'manager-review',
                                        name: 'Manager Review', 
                                        description: 'Initial manager approval required',
                                        type: 'approval',
                                        status: 'completed', 
                                        assignees: ['john.manager'],
                                        completedBy: 'john.manager',
                                        completedAt: '2024-01-20T10:30:00Z'
                                    },
                                    { 
                                        id: 'finance-approval',
                                        name: 'Finance Approval', 
                                        description: 'Finance team must approve budget',
                                        type: 'approval',
                                        status: 'in_progress', 
                                        assignees: ['jane.finance'],
                                        dueDate: '2024-01-25T17:00:00Z'
                                    },
                                    { 
                                        id: 'final-approval',
                                        name: 'Final Approval', 
                                        description: 'Executive approval for large purchases',
                                        type: 'approval',
                                        status: 'pending', 
                                        assignees: ['ceo']
                                    }
                                ],
                                requestData: {
                                    amount: '$2,450.00',
                                    vendor: 'Office Supplies Inc',
                                    category: 'Office Equipment'
                                },
                                approvers: [
                                    { id: 'john.manager', name: 'John Manager', role: 'Manager', level: 1 },
                                    { id: 'jane.finance', name: 'Jane Finance', role: 'Finance Director', level: 2 },
                                    { id: 'ceo', name: 'CEO', role: 'Chief Executive', level: 3 }
                                ],
                                onApprove: () => {},
                                onReject: () => {},
                                onComment: () => {}
                            }
                        },
                        { 
                            name: 'Leave Request', 
                            props: { 
                                id: 'LEAVE-2024-015',
                                title: 'Annual Leave Request',
                                currentStep: 'completed',
                                steps: [
                                    { 
                                        id: 'supervisor-approval',
                                        name: 'Supervisor Approval', 
                                        description: 'Direct supervisor must approve leave',
                                        type: 'approval',
                                        status: 'completed', 
                                        assignees: ['team.lead'],
                                        completedBy: 'team.lead',
                                        completedAt: '2024-01-18T14:30:00Z'
                                    },
                                    { 
                                        id: 'hr-review',
                                        name: 'HR Review', 
                                        description: 'HR reviews leave balance and policy',
                                        type: 'approval',
                                        status: 'completed', 
                                        assignees: ['hr.manager'],
                                        completedBy: 'hr.manager',
                                        completedAt: '2024-01-19T09:15:00Z'
                                    }
                                ],
                                requestData: {
                                    requestedDays: 5,
                                    dateRange: 'Feb 15-19, 2024',
                                    leaveType: 'Annual Leave'
                                },
                                approvers: [
                                    { id: 'team.lead', name: 'Team Lead', role: 'Team Leader', level: 1 },
                                    { id: 'hr.manager', name: 'HR Manager', role: 'HR Manager', level: 2 }
                                ],
                                readonly: true
                            }
                        }
                    ]
                }
            ]
        },
        templates: {
            layouts: [
                { 
                    name: 'DashboardLayout', 
                    component: Templates.DashboardLayout, 
                    description: 'Complete dashboard layout with sidebar, header, and responsive content areas',
                    variations: [
                        { 
                            name: 'With Sidebar', 
                            props: { 
                                sidebar: { title: 'Dashboard', menuItems: ['Overview', 'Analytics', 'Settings'] },
                                header: { title: 'Welcome Back', user: 'John Doe' },
                                children: 'Main dashboard content goes here...'
                            }
                        },
                        { 
                            name: 'Collapsed Sidebar', 
                            props: { 
                                sidebar: { title: 'App', menuItems: ['Home', 'Reports'], collapsed: true },
                                header: { title: 'Analytics Dashboard' },
                                children: 'Analytics content with charts and metrics...'
                            }
                        }
                    ]
                },
                { 
                    name: 'FormLayout', 
                    component: Templates.FormLayout, 
                    description: 'Optimized layout for form pages with validation and progress indicators',
                    variations: [
                        { 
                            name: 'Single Column', 
                            props: { 
                                title: 'User Registration',
                                steps: ['Personal Info', 'Account Details', 'Preferences'],
                                currentStep: 0,
                                children: 'Form fields would be rendered here...'
                            }
                        },
                        { 
                            name: 'Multi-step', 
                            props: { 
                                title: 'Project Setup',
                                steps: ['Basic Info', 'Team Members', 'Configuration', 'Review'],
                                currentStep: 2,
                                showProgress: true,
                                children: 'Step 3: Configuration form content...'
                            }
                        }
                    ]
                }
            ],
            pages: [
                { 
                    name: 'SettingsPage', 
                    component: Templates.SettingsPage, 
                    description: 'Complete settings page template with tabbed navigation and form sections',
                    variations: [
                        { 
                            name: 'User Settings', 
                            props: { 
                                title: 'Account Settings',
                                tabs: [
                                    { label: 'Profile', content: 'Profile settings form...' },
                                    { label: 'Security', content: 'Security settings form...' },
                                    { label: 'Notifications', content: 'Notification preferences...' }
                                ],
                                onSave: () => {},
                                onReset: () => {}
                            }
                        },
                        { 
                            name: 'Application Settings', 
                            props: { 
                                title: 'Application Settings',
                                tabs: [
                                    { label: 'General', content: 'General application settings...' },
                                    { label: 'Integrations', content: 'Third-party integrations...' },
                                    { label: 'Advanced', content: 'Advanced configuration options...' }
                                ],
                                showSaveButton: true,
                                showResetButton: true
                            }
                        }
                    ]
                },
                { 
                    name: 'ReportsPage', 
                    component: Templates.ReportsPage, 
                    description: 'Reporting interface template with filters, charts, and export functionality',
                    variations: [
                        { 
                            name: 'Sales Reports', 
                            props: { 
                                title: 'Sales Analytics',
                                dateRange: { start: '2024-01-01', end: '2024-01-31' },
                                filters: ['Region', 'Product Category', 'Sales Rep'],
                                charts: [
                                    { type: 'line', title: 'Sales Trend', data: [100, 120, 140, 160, 180] },
                                    { type: 'pie', title: 'Sales by Region', data: [40, 30, 20, 10] }
                                ],
                                exportFormats: ['PDF', 'Excel', 'CSV']
                            }
                        },
                        { 
                            name: 'User Activity', 
                            props: { 
                                title: 'User Activity Report',
                                period: 'Last 30 days',
                                metrics: [
                                    { label: 'Total Users', value: '12,345', trend: '+5%' },
                                    { label: 'Active Sessions', value: '8,901', trend: '+12%' },
                                    { label: 'Page Views', value: '45,678', trend: '-2%' }
                                ],
                                showRealTime: true
                            }
                        }
                    ]
                }
            ]
        }
    };

    const currentComponents = componentData[category]?.[subcategory] || [];

    const categoryDisplayNames = {
        atoms: 'Atoms',
        molecules: 'Molecules', 
        organisms: 'Organisms',
        templates: 'Templates'
    };

    const subcategoryDisplayNames = {
        display: 'Display',
        form: 'Form',
        feedback: 'Feedback',
        navigation: 'Navigation',
        data: 'Data',
        forms: 'Forms',
        'data-grids': 'Data Grids',
        integration: 'Integration',
        management: 'Management',
        workflow: 'Workflow',
        layouts: 'Layouts',
        pages: 'Pages'
    };

    const copyToClipboard = async (code, id) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(id);
            setTimeout(() => setCopiedCode(''), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Find specific component if one is selected
    const findComponent = (name) => {
        for (const components of Object.values(currentComponents)) {
            const component = Array.isArray(components) ? components.find(c => c.name.toLowerCase() === name.toLowerCase()) : null;
            if (component) return component;
        }
        return currentComponents.find(c => c.name.toLowerCase() === name.toLowerCase());
    };

    const specificComponent = selectedComponentName ? findComponent(selectedComponentName) : null;

    // If showing a specific component, render its detailed view
    if (selectedComponentName && specificComponent) {
        return <ComponentDetailPage 
            component={specificComponent} 
            category={category} 
            subcategory={subcategory}
            copyToClipboard={copyToClipboard}
            copiedCode={copiedCode}
        />;
    }

    // Otherwise, show the category overview
    return (
        <div className="max-w-none">
            {/* Header - Clean minimal style */}
            <div className="mb-8">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb 
                        items={generateBreadcrumbItems(category, subcategory, selectedComponentName)} 
                        showHome={true}
                        homeIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v4H9V9z" />
                        </svg>}
                        className="text-sm"
                        commerceState=''
                    />
                </div>
                
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {subcategoryDisplayNames[subcategory]}
                </h1>
                
                {/* Description */}
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    {getSubcategoryDescription(category, subcategory)}
                </p>
            </div>

            {/* Components Grid - Enhanced responsive layout with overflow handling */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden">
                {currentComponents.map((comp, index) => (
                    <ComponentCard
                        key={comp.name}
                        component={comp}
                        category={category}
                        subcategory={subcategory}
                        onCopyCode={(code) => copyToClipboard(code, comp.name)}
                        copiedCode={copiedCode}
                    />
                ))}
            </div>

            {/* Empty State */}
            {currentComponents.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Components Coming Soon</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        We're working on adding components to this category.
                    </p>
                </div>
            )}
        </div>
    );
};

// Component Card
const ComponentCard = ({ component, category, subcategory, onCopyCode, copiedCode }) => {
    
    const getBasicUsageCode = (componentName) => {
        // Use the first variation's props as the basic usage example
        const firstVariation = component.variations?.[0];
        if (firstVariation) {
            return generateCodeSnippet(componentName, firstVariation.props);
        }
        
        // Fallback to hardcoded examples if no variations
        const usageCodes = {
            Button: `<Button variant="primary">Click me</Button>`,
            Input: `<Input label="Name" placeholder="Enter your name" />`,
            Select: `<Select label="Country" options={countries} />`,
            Checkbox: `<Checkbox>Accept terms</Checkbox>`,
            Radio: `<Radio name="option" value="1">Option 1</Radio>`,
            Switch: `<Switch>Enable notifications</Switch>`,
            Textarea: `<Textarea label="Message" rows={4} />`,
            Alert: `<Alert variant="info">Information message</Alert>`,
            Modal: `<Modal isOpen={true} title="Dialog">Content</Modal>`,
            Badge: `<Badge variant="success">Active</Badge>`,
            Avatar: `<Avatar src="/user.jpg" name="John Doe" />`,
            Icon: `<Icon name="star" size="md" />`,
            Toast: `<Toast message="Success!" type="success" />`,
        };
        return usageCodes[componentName] || `<${componentName} />`;
    };

    // Enhanced code snippet generation that matches actual rendered preview
    const generateCodeSnippet = (componentName, props) => {
        const formatPropValue = (value, indent = 0) => {
            const spaces = '  '.repeat(indent);
            
            if (typeof value === 'string') {
                return `"${value}"`;
            } else if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            } else if (typeof value === 'number') {
                return value.toString();
            } else if (typeof value === 'function') {
                // Generate realistic function placeholder based on prop name and context
                return '{() => {}}';
            } else if (React.isValidElement(value)) {
                // For JSX content, show realistic JSX structure
                if (value.props?.className?.includes('p-4')) {
                    const content = value.props.children || 'Content here';
                    return `{\n${spaces}  <div className="p-4">\n${spaces}    ${content}\n${spaces}  </div>\n${spaces}}`;
                }
                return '{<div>Content here</div>}';
            } else if (Array.isArray(value)) {
                if (value.length === 0) return '{[]}';
                
                // Handle specific array types with proper formatting
                if (value[0]?.id && value[0]?.label) {
                    // Tab items, breadcrumb items, etc.
                    const formattedItems = value.slice(0, 2).map((item, idx) => {
                        let itemStr = `\n${spaces}  { `;
                        const entries = Object.entries(item).filter(([k, v]) => k !== 'content');
                        itemStr += entries.map(([k, v]) => `${k}: ${formatPropValue(v, 0)}`).join(', ');
                        if (item.content) {
                            itemStr += `, content: <div>Content ${idx + 1}</div>`;
                        }
                        itemStr += ' }';
                        return itemStr;
                    });
                    return `{[${formattedItems.join(',')}\n${spaces}]}`;
                } else if (value[0]?.value && value[0]?.label) {
                    // Select options
                    const options = value.slice(0, 3).map(opt => 
                        `\n${spaces}  { value: ${formatPropValue(opt.value)}, label: ${formatPropValue(opt.label)} }`
                    );
                    return `{[${options.join(',')}\n${spaces}]}`;
                } else if (typeof value[0] === 'string') {
                    // String arrays
                    return `{[${value.map(v => formatPropValue(v)).join(', ')}]}`;
                } else {
                    // Generic object arrays
                    return `{[\n${spaces}  // Array of ${value.length} items\n${spaces}]}`;
                }
            } else if (typeof value === 'object' && value !== null) {
                const keys = Object.keys(value);
                if (keys.length === 0) return '{{}}';
                
                // Format simple objects inline if they're small
                if (keys.length <= 2 && keys.every(k => typeof value[k] !== 'object')) {
                    const entries = keys.map(k => `${k}: ${formatPropValue(value[k])}`);
                    return `{{ ${entries.join(', ')} }}`;
                }
                
                // Format complex objects with proper indentation
                const entries = keys.slice(0, 3).map(key => 
                    `\n${spaces}  ${key}: ${formatPropValue(value[key], indent + 1)}`
                );
                return `{{${entries.join(',')}\n${spaces}}}`;
            } else {
                return `{${value}}`;
            }
        };

        // Filter out internal props that shouldn't be shown in code examples
        const propsEntries = Object.entries(props).filter(([key, value]) => 
            key !== 'children' && 
            key !== 'className' && 
            (!key.startsWith('on') || ['onChange', 'onClick', 'onClose'].includes(key))
        );
        
        const propsString = propsEntries
            .map(([key, value]) => {
                if (typeof value === 'boolean' && value === true) {
                    return key;
                } else if (typeof value === 'boolean' && value === false) {
                    return null; // Don't show false boolean props
                } else {
                    return `${key}={${formatPropValue(value)}}`;
                }
            })
            .filter(Boolean)
            .join('\n  ');

        const children = props.children;
        const hasProps = propsString.length > 0;
        const hasMultipleProps = propsString.includes('\n');
        
        if (children) {
            if (hasProps && hasMultipleProps) {
                return `<${componentName}\n  ${propsString}\n>\n  ${children}\n</${componentName}>`;
            } else if (hasProps) {
                return `<${componentName} ${propsString}>\n  ${children}\n</${componentName}>`;
            } else {
                return `<${componentName}>${children}</${componentName}>`;
            }
        } else {
            if (hasProps && hasMultipleProps) {
                return `<${componentName}\n  ${propsString}\n/>`;
            } else if (hasProps) {
                return `<${componentName} ${propsString} />`;
            } else {
                return `<${componentName} />`;
            }
        }
    };

    // Determine if this is a complex component that needs more space
    const isComplexComponent = () => {
        const complexComponents = [
            // Data Grids
            'EditableDataGrid', 'ComparisonTable', 'PivotTable',
            // Management Components
            'UserManager', 'RoleManager', 'SettingsManager',
            // Workflow Components
            'ApprovalWorkflow', 'StateTransition', 'WorkflowTracker',
            // Integration Components
            'APIConnector', 'ExportManager', 'ImportWizard',
            // Template Components
            'DashboardLayout', 'FormLayout', 'ListDetailLayout',
            'SettingsPage', 'ReportsPage', 'WorkflowPage',
            // Navigation Components with complex content
            'Tab', 'Modal',
        ];
        return complexComponents.includes(component.name);
    };

    const isLargeComponent = isComplexComponent();

    return (
        <div className={`border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 ${
            isLargeComponent ? 'md:col-span-2 lg:col-span-3' : ''
        }`}>
            {/* Clean Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                        {component.name}
                    </h3>
                    <button
                        onClick={() => onCopyCode(getBasicUsageCode(component.name))}
                        className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 ${
                            copiedCode === component.name
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                    >
                        {copiedCode === component.name ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 break-words">
                    {component.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {component.variations?.length || 0} variations
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {category}
                    </span>
                </div>
            </div>
            
            {/* Clean Component Preview - Enhanced for complex components */}
            <div className="p-6">
                <div className={`flex items-center justify-center ${
                    isLargeComponent ? 'min-h-[300px] lg:min-h-[400px]' : 'min-h-[120px]'
                }`}>
                    <ComponentPreview component={component} />
                </div>
            </div>

            {/* Clean Action */}
            <div className="p-6 pt-0">
                <Link
                    to={`${component.name.toLowerCase()}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium text-sm transition-colors duration-200"
                >
                    View variations
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

// Component Detail Page showing all variations - Reference Image Style
const ComponentDetailPage = ({ component, category, subcategory, copyToClipboard, copiedCode }) => {
    // Determine if this is a complex component that needs more space
    const isComplexComponent = () => {
        const complexComponents = [
            // Data Grids
            'EditableDataGrid', 'ComparisonTable', 'PivotTable',
            // Management Components
            'UserManager', 'RoleManager', 'SettingsManager',
            // Workflow Components
            'ApprovalWorkflow', 'StateTransition', 'WorkflowTracker',
            // Integration Components
            'APIConnector', 'ExportManager', 'ImportWizard',
            // Template Components
            'DashboardLayout', 'FormLayout', 'ListDetailLayout',
            'SettingsPage', 'ReportsPage', 'WorkflowPage',
            // Navigation Components with complex content
            'Tab', 'Modal',
        ];
        return complexComponents.includes(component.name);
    };

    const generateCodeSnippet = (componentName, props) => {
        const formatPropValue = (value, indent = 0) => {
            const spaces = '  '.repeat(indent);
            
            if (typeof value === 'string') {
                return `"${value}"`;
            } else if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            } else if (typeof value === 'number') {
                return value.toString();
            } else if (typeof value === 'function') {
                // Generate realistic function placeholder based on prop name and context
                return '{() => {}}';
            } else if (React.isValidElement(value)) {
                // For JSX content, show realistic JSX structure
                if (value.props?.className?.includes('p-4')) {
                    const content = value.props.children || 'Content here';
                    return `{\n${spaces}  <div className="p-4">\n${spaces}    ${content}\n${spaces}  </div>\n${spaces}}`;
                }
                return '{<div>Content here</div>}';
            } else if (Array.isArray(value)) {
                if (value.length === 0) return '{[]}';
                
                // Handle specific array types with proper formatting
                if (value[0]?.id && value[0]?.label) {
                    // Tab items, breadcrumb items, etc.
                    const formattedItems = value.slice(0, 2).map((item, idx) => {
                        let itemStr = `\n${spaces}  { `;
                        const entries = Object.entries(item).filter(([k, v]) => k !== 'content');
                        itemStr += entries.map(([k, v]) => `${k}: ${formatPropValue(v, 0)}`).join(', ');
                        if (item.content) {
                            itemStr += `, content: <div>Content ${idx + 1}</div>`;
                        }
                        itemStr += ' }';
                        return itemStr;
                    });
                    return `{[${formattedItems.join(',')}\n${spaces}]}`;
                } else if (value[0]?.value && value[0]?.label) {
                    // Select options
                    const options = value.slice(0, 3).map(opt => 
                        `\n${spaces}  { value: ${formatPropValue(opt.value)}, label: ${formatPropValue(opt.label)} }`
                    );
                    return `{[${options.join(',')}\n${spaces}]}`;
                } else if (typeof value[0] === 'string') {
                    // String arrays
                    return `{[${value.map(v => formatPropValue(v)).join(', ')}]}`;
                } else {
                    // Generic object arrays
                    return `{[\n${spaces}  // Array of ${value.length} items\n${spaces}]}`;
                }
            } else if (typeof value === 'object' && value !== null) {
                const keys = Object.keys(value);
                if (keys.length === 0) return '{{}}';
                
                // Format simple objects inline if they're small
                if (keys.length <= 2 && keys.every(k => typeof value[k] !== 'object')) {
                    const entries = keys.map(k => `${k}: ${formatPropValue(value[k])}`);
                    return `{{ ${entries.join(', ')} }}`;
                }
                
                // Format complex objects with proper indentation
                const entries = keys.slice(0, 3).map(key => 
                    `\n${spaces}  ${key}: ${formatPropValue(value[key], indent + 1)}`
                );
                return `{{${entries.join(',')}\n${spaces}}}`;
            } else {
                return `{${value}}`;
            }
        };

        // Filter out internal props that shouldn't be shown in code examples
        const propsEntries = Object.entries(props).filter(([key, value]) => 
            key !== 'children' && 
            key !== 'className' && 
            (!key.startsWith('on') || ['onChange', 'onClick', 'onClose'].includes(key))
        );
        
        const propsString = propsEntries
            .map(([key, value]) => {
                if (typeof value === 'boolean' && value === true) {
                    return key;
                } else if (typeof value === 'boolean' && value === false) {
                    return ''; // Don't show false boolean props
                } else {
                    return `${key}=${formatPropValue(value)}`;
                }
            })
            .filter(Boolean)
            .join('\n  ');

        const children = props.children;
        const hasProps = propsString.length > 0;
        const hasMultipleProps = propsEntries.length > 2;

        // Format component with proper indentation
        if (children) {
            if (hasProps && hasMultipleProps) {
                return `<${componentName}\n  ${propsString}\n>\n  ${children}\n</${componentName}>`;
            } else if (hasProps) {
                return `<${componentName} ${propsString}>\n  ${children}\n</${componentName}>`;
            } else {
                return `<${componentName}>${children}</${componentName}>`;
            }
        } else {
            if (hasProps && hasMultipleProps) {
                return `<${componentName}\n  ${propsString}\n/>`;
            } else if (hasProps) {
                return `<${componentName} ${propsString} />`;
            } else {
                return `<${componentName} />`;
            }
        }
    };

    const categoryDisplayNames = {
        atoms: 'Atoms',
        molecules: 'Molecules', 
        organisms: 'Organisms',
        templates: 'Templates'
    };

    return (
        <div className="max-w-none">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
                <Breadcrumb 
                    items={generateBreadcrumbItems(category, subcategory, component.name)} 
                    showHome={true}
                    homeIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v4H9V9z" />
                    </svg>}
                    className="text-sm"
                    commerceState=''
                />
            </div>

            {/* Header - Match reference image */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{component.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">{component.description}</p>
            </div>

            {/* Main Variations Section - Match reference image structure */}
            {component.variations && component.variations.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Example with Variations</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">Add any of the below mentioned modifier classes to change the appearance of a {component.name.toLowerCase()}.</p>
                    
                    {/* Variations Grid - Adaptive layout for complex components */}
                    <div className={`grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12 mb-12 ${
                        isComplexComponent() 
                            ? 'grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' 
                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                        {component.variations.slice(0, 8).map((variation, index) => (
                            <div key={index} className="text-center">
                                {/* Category Header - Responsive typography */}
                                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">
                                    {variation.name.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} STYLES
                                </h3>
                                
                                {/* Component Display Area - Enhanced spacing for complex components */}
                                <div className={`flex items-center justify-center ${
                                    isComplexComponent() 
                                        ? 'py-8 px-4 sm:py-12 sm:px-6 min-h-[200px] lg:min-h-[250px]' 
                                        : 'py-6 px-2 sm:py-8 sm:px-4 min-h-[120px] sm:min-h-[140px]'
                                }`}>
                                    <ComponentPreview component={{ ...component, props: variation.props }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional variations in a second row if needed */}
                    {component.variations.length > 8 && (
                        <div className={`grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12 mb-12 ${
                            isComplexComponent() 
                                ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' 
                                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'
                        }`}>
                            {component.variations.slice(8, 12).map((variation, index) => (
                                <div key={index + 8} className="text-center">
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 sm:mb-6">
                                        {variation.name.replace(/([A-Z])/g, ' $1').trim().toUpperCase()} STYLES
                                    </h3>
                                    <div className={`flex items-center justify-center ${
                                        isComplexComponent() 
                                            ? 'py-8 px-4 sm:py-12 sm:px-6 min-h-[200px] lg:min-h-[250px]' 
                                            : 'py-6 px-2 sm:py-8 sm:px-4 min-h-[120px] sm:min-h-[140px]'
                                    }`}>
                                        <ComponentPreview component={{ ...component, props: variation.props }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Code Examples Section - Match reference image styling */}
            <div className="space-y-10">
                {component.variations?.slice(0, 3).map((variation, index) => (
                    <div key={index}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                CODE EXAMPLE
                            </h3>
                            <button
                                onClick={() => copyToClipboard(generateCodeSnippet(component.name, variation.props), `${component.name}-${index}`)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium px-3 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                {copiedCode === `${component.name}-${index}` ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            //code for {variation.name.toLowerCase()} {component.name.toLowerCase()}
                        </p>
                        
                        {/* Code Block - Enhanced overflow handling */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4">
                                <pre className="text-sm text-gray-800 dark:text-gray-200 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    <code>
                                        <span className="text-gray-500 dark:text-gray-400">&lt;</span>
                                        <span className="text-blue-600 dark:text-blue-400">div</span>
                                        <span className="text-gray-500 dark:text-gray-400"> </span>
                                        <span className="text-green-600 dark:text-green-400">className</span>
                                        <span className="text-gray-500 dark:text-gray-400">=</span>
                                        <span className="text-red-500 dark:text-red-400">"user-avatar"</span>
                                        <span className="text-gray-500 dark:text-gray-400">&gt;</span>
                                        <br />
                                        <span className="text-gray-500 dark:text-gray-400">  &lt;</span>
                                        <span className="text-blue-600 dark:text-blue-400">div</span>
                                        <span className="text-gray-500 dark:text-gray-400">&gt;</span>
                                        {generateCodeSnippet(component.name, variation.props)}
                                        <span className="text-gray-500 dark:text-gray-400">&lt;/</span>
                                        <span className="text-blue-600 dark:text-blue-400">div</span>
                                        <span className="text-gray-500 dark:text-gray-400">&gt;</span>
                                        <br />
                                        <span className="text-gray-500 dark:text-gray-400">&lt;/</span>
                                        <span className="text-blue-600 dark:text-blue-400">div</span>
                                        <span className="text-gray-500 dark:text-gray-400">&gt;</span>
                                    </code>
                                </pre>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Component Preview with safe error handling
const ComponentPreview = ({ component }) => {
    try {
        const Component = component.component;
        if (!Component) {
            return (
                <div className="flex items-center justify-center text-gray-400 text-sm">
                    <div className="text-center">
                        <div className="text-gray-300 mb-1">📦</div>
                        <div>Preview not available</div>
                    </div>
                </div>
            );
        }

        // Use provided props or fallback to default preview props
        const props = component.props || getDefaultPreviewProps(component.name);
        
        // Wrapper for better styling and error boundaries with overflow handling
        return (
            <div className="flex items-center justify-center w-full overflow-hidden">
                <div className="flex items-center justify-center min-w-0 max-w-full overflow-auto">
                    <Component {...props} />
                </div>
            </div>
        );
    } catch (error) {
        console.warn(`Preview error for ${component.name}:`, error);
        return (
            <div className="flex items-center justify-center text-gray-400 text-sm">
                <div className="text-center">
                    <div className="text-gray-300 mb-1">⚠</div>
                    <div>Preview unavailable</div>
                    <div className="text-xs mt-1">{component.name}</div>
                </div>
            </div>
        );
    }
};

// Default preview props for components without explicit variations
const getDefaultPreviewProps = (name) => {
    const previewProps = {
        Button: { variant: 'primary', size: 'md', children: 'Sample Button' },
        Input: { placeholder: 'Sample input', value: '', className: 'w-full max-w-xs min-w-0' },
        Select: { 
            placeholder: 'Select option', 
            options: [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }],
            className: 'w-full max-w-xs min-w-0'
        },
        MultiSelect: {
            placeholder: 'Select multiple',
            options: [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }],
            className: 'w-full max-w-xs min-w-0'
        },
        Checkbox: { children: 'Sample checkbox', defaultChecked: false },
        Radio: { name: 'preview-radio', value: '1', children: 'Sample radio' },
        Switch: { children: 'Enable feature', defaultChecked: false },
        Textarea: { placeholder: 'Enter text...', rows: 3, className: 'w-full max-w-xs min-w-0 resize-none' },
        Alert: { variant: 'info', children: 'This is a sample alert message' },
        Badge: { variant: 'primary', children: 'Sample' },
        Avatar: { name: 'John Doe', size: 'md' },
        Icon: { name: 'star', size: 'w-6 h-6' },
        Label: { children: 'Sample Label', required: true },
        Status: { variant: 'active', children: 'Active' },
        Tooltip: { content: 'This is a tooltip', children: <span>Hover me</span> },
        Spinner: { size: 'md' },
        LoadingState: { loading: true, children: 'Loading content...' },
        Toast: { message: 'Sample notification', type: 'info', visible: true },
        Modal: { isOpen: false, title: 'Sample Modal', children: 'Modal content' },
        DatePicker: { placeholder: 'Select date', className: 'w-full max-w-xs min-w-0' },
        FileUpload: { placeholder: 'Choose file', className: 'w-full max-w-xs min-w-0' },
        CreditCardInput: { placeholder: 'Enter card number', className: 'w-full max-w-xs min-w-0' },
        // Navigation components
        Breadcrumb: { items: [{ label: 'Home', href: '#' }, { label: 'Components', href: '#' }, { label: 'Current' }] },
        Menu: { items: [{ label: 'Item 1' }, { label: 'Item 2' }] },
        NavigationButton: { children: 'Navigation', variant: 'primary' },
        Pagination: { currentPage: 1, totalPages: 5, onPageChange: () => {} },
        Tab: { tabs: [{ label: 'Tab 1', content: 'Content 1' }, { label: 'Tab 2', content: 'Content 2' }] },
        // Molecules
        SearchBox: { placeholder: 'Search...', className: 'w-full max-w-xs min-w-0' },
        FilterPanel: { filters: [{ label: 'Filter 1', value: 'filter1' }] },
        SortControl: { options: [{ label: 'Name', value: 'name' }] },
        BulkActions: { selectedCount: 3, actions: [{ label: 'Delete', action: () => {} }] },
        MetricCard: { title: 'Sample Metric', value: '1,234', trend: '+12%' },
        ProgressTracker: { steps: ['Step 1', 'Step 2', 'Step 3'], currentStep: 1 },
        StatusCard: { title: 'Status', status: 'active', description: 'All systems operational' },
        SummaryPanel: { title: 'Summary', items: [{ label: 'Total', value: '100' }] },
        AddressForm: { title: 'Address Information' },
        ContactForm: { title: 'Contact Information' },
        ApprovalForm: { title: 'Approval Request' }
    };
    return previewProps[name] || { children: `${name} Component` };
};

// Helper function for subcategory descriptions
const getSubcategoryDescription = (category, subcategory) => {
    const descriptions = {
        atoms: {
            display: 'Basic visual elements for displaying information and user interface elements.',
            form: 'Essential form controls and input elements for user interaction.',
            feedback: 'Components for providing user feedback, alerts, and loading states.',
            navigation: 'Navigation elements for moving between pages and content sections.'
        },
        molecules: {
            data: 'Combined components for data manipulation, filtering, and search functionality.',
            display: 'Composed display components for showing metrics, progress, and status information.',
            forms: 'Complete form sections combining multiple form elements for specific use cases.'
        },
        organisms: {
            'data-grids': 'Complex data visualization and editing components with advanced functionality.',
            integration: 'Components for external system integration, import/export, and API connectivity.',
            management: 'Administrative interfaces for user, role, and system management.',
            workflow: 'Business process components for approval workflows and state management.'
        },
        templates: {
            layouts: 'Complete page layout structures for different application views.',
            pages: 'Full page templates for common application screens and interfaces.'
        }
    };
    
    return descriptions[category]?.[subcategory] || 'Explore the components in this category.';
};

export default ComponentShowcase;