import React, { useState } from 'react';

const ComponentDetailView = ({ component, onClose }) => {
    const [copiedCode, setCopiedCode] = useState('');

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    // Component variations based on component type
    const getComponentVariations = (componentName) => {
        const variations = {
            Button: [
                {
                    title: "Variants",
                    examples: [
                        { code: `<Button variant="primary">Primary</Button>`, props: { variant: "primary", children: "Primary" } },
                        { code: `<Button variant="secondary">Secondary</Button>`, props: { variant: "secondary", children: "Secondary" } },
                        { code: `<Button variant="tertiary">Tertiary</Button>`, props: { variant: "tertiary", children: "Tertiary" } },
                        { code: `<Button variant="danger">Danger</Button>`, props: { variant: "danger", children: "Danger" } },
                        { code: `<Button variant="success">Success</Button>`, props: { variant: "success", children: "Success" } },
                        { code: `<Button variant="warning">Warning</Button>`, props: { variant: "warning", children: "Warning" } },
                        { code: `<Button variant="ghost">Ghost</Button>`, props: { variant: "ghost", children: "Ghost" } },
                        { code: `<Button variant="link">Link</Button>`, props: { variant: "link", children: "Link" } }
                    ]
                },
                {
                    title: "Sizes",
                    examples: [
                        { code: `<Button size="xs">Extra Small</Button>`, props: { size: "xs", children: "Extra Small" } },
                        { code: `<Button size="sm">Small</Button>`, props: { size: "sm", children: "Small" } },
                        { code: `<Button size="md">Medium</Button>`, props: { size: "md", children: "Medium" } },
                        { code: `<Button size="lg">Large</Button>`, props: { size: "lg", children: "Large" } },
                        { code: `<Button size="xl">Extra Large</Button>`, props: { size: "xl", children: "Extra Large" } }
                    ]
                },
                {
                    title: "States",
                    examples: [
                        { code: `<Button>Normal</Button>`, props: { children: "Normal" } },
                        { code: `<Button loading>Loading</Button>`, props: { loading: true, children: "Loading" } },
                        { code: `<Button disabled>Disabled</Button>`, props: { disabled: true, children: "Disabled" } },
                        { code: `<Button fullWidth>Full Width</Button>`, props: { fullWidth: true, children: "Full Width" } }
                    ]
                }
            ],
            Input: [
                {
                    title: "Basic Types",
                    examples: [
                        { code: `<Input label="Email" type="email" placeholder="Enter your email" />`, props: { label: "Email", type: "email", placeholder: "Enter your email" } },
                        { code: `<Input label="Password" type="password" placeholder="Enter password" />`, props: { label: "Password", type: "password", placeholder: "Enter password" } },
                        { code: `<Input label="Number" type="number" placeholder="Enter number" />`, props: { label: "Number", type: "number", placeholder: "Enter number" } },
                        { code: `<Input label="Search" type="search" placeholder="Search..." />`, props: { label: "Search", type: "search", placeholder: "Search..." } }
                    ]
                },
                {
                    title: "Sizes",
                    examples: [
                        { code: `<Input size="sm" placeholder="Small input" />`, props: { size: "sm", placeholder: "Small input" } },
                        { code: `<Input size="md" placeholder="Medium input" />`, props: { size: "md", placeholder: "Medium input" } },
                        { code: `<Input size="lg" placeholder="Large input" />`, props: { size: "lg", placeholder: "Large input" } }
                    ]
                },
                {
                    title: "States",
                    examples: [
                        { code: `<Input status="error" placeholder="Error state" errorMessage="This field is required" />`, props: { status: "error", placeholder: "Error state", errorMessage: "This field is required" } },
                        { code: `<Input status="success" placeholder="Success state" />`, props: { status: "success", placeholder: "Success state" } },
                        { code: `<Input disabled placeholder="Disabled input" />`, props: { disabled: true, placeholder: "Disabled input" } }
                    ]
                }
            ],
            Badge: [
                {
                    title: "Variants",
                    examples: [
                        { code: `<Badge variant="default">Default</Badge>`, props: { variant: "default", children: "Default" } },
                        { code: `<Badge variant="primary">Primary</Badge>`, props: { variant: "primary", children: "Primary" } },
                        { code: `<Badge variant="success">Success</Badge>`, props: { variant: "success", children: "Success" } },
                        { code: `<Badge variant="warning">Warning</Badge>`, props: { variant: "warning", children: "Warning" } },
                        { code: `<Badge variant="error">Error</Badge>`, props: { variant: "error", children: "Error" } }
                    ]
                },
                {
                    title: "Sizes",
                    examples: [
                        { code: `<Badge size="sm">Small</Badge>`, props: { size: "sm", children: "Small" } },
                        { code: `<Badge size="md">Medium</Badge>`, props: { size: "md", children: "Medium" } },
                        { code: `<Badge size="lg">Large</Badge>`, props: { size: "lg", children: "Large" } }
                    ]
                }
            ],
            Alert: [
                {
                    title: "Variants",
                    examples: [
                        { code: `<Alert variant="info">Information message</Alert>`, props: { variant: "info", children: "Information message" } },
                        { code: `<Alert variant="success">Success message</Alert>`, props: { variant: "success", children: "Success message" } },
                        { code: `<Alert variant="warning">Warning message</Alert>`, props: { variant: "warning", children: "Warning message" } },
                        { code: `<Alert variant="error">Error message</Alert>`, props: { variant: "error", children: "Error message" } }
                    ]
                }
            ],
            Checkbox: [
                {
                    title: "States",
                    examples: [
                        { code: `<Checkbox>Unchecked</Checkbox>`, props: { children: "Unchecked" } },
                        { code: `<Checkbox defaultChecked>Checked</Checkbox>`, props: { defaultChecked: true, children: "Checked" } },
                        { code: `<Checkbox disabled>Disabled</Checkbox>`, props: { disabled: true, children: "Disabled" } },
                        { code: `<Checkbox indeterminate>Indeterminate</Checkbox>`, props: { indeterminate: true, children: "Indeterminate" } }
                    ]
                }
            ],
            Switch: [
                {
                    title: "States",
                    examples: [
                        { code: `<Switch>Off</Switch>`, props: { children: "Off" } },
                        { code: `<Switch defaultChecked>On</Switch>`, props: { defaultChecked: true, children: "On" } },
                        { code: `<Switch disabled>Disabled</Switch>`, props: { disabled: true, children: "Disabled" } }
                    ]
                },
                {
                    title: "Sizes",
                    examples: [
                        { code: `<Switch size="sm">Small</Switch>`, props: { size: "sm", children: "Small" } },
                        { code: `<Switch size="md">Medium</Switch>`, props: { size: "md", children: "Medium" } },
                        { code: `<Switch size="lg">Large</Switch>`, props: { size: "lg", children: "Large" } }
                    ]
                }
            ]
        };

        // Return default variations if component not found
        return variations[componentName] || [
            {
                title: "Basic Usage",
                examples: [
                    { code: `<${componentName} />`, props: {} }
                ]
            }
        ];
    };

    const variations = getComponentVariations(component.name);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{component.name}</h2>
                        <p className="text-gray-600 mt-1">{component.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <div className="space-y-8">
                        {variations.map((variation, index) => (
                            <div key={index}>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{variation.title}</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {variation.examples.map((example, exampleIndex) => (
                                        <div key={exampleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Preview */}
                                            <div className="p-6 bg-gray-50 border-b border-gray-200">
                                                <div className="flex items-center justify-center min-h-[60px]">
                                                    <ComponentPreview 
                                                        component={component} 
                                                        props={example.props}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Code */}
                                            <div className="p-4 bg-white dark:bg-gray-800">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code</span>
                                                    <button
                                                        onClick={() => copyToClipboard(example.code, `${index}-${exampleIndex}`)}
                                                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                                                            copiedCode === `${index}-${exampleIndex}`
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {copiedCode === `${index}-${exampleIndex}` ? '✓ Copied!' : 'Copy'}
                                                    </button>
                                                </div>
                                                <pre className="bg-gray-100 rounded-md p-3 text-sm overflow-x-auto">
                                                    <code className="text-gray-800">{example.code}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Component Preview with safe error handling
const ComponentPreview = ({ component, props = {} }) => {
    try {
        const Component = component.component;
        if (!Component) {
            return <div className="text-gray-400 text-sm">Preview not available</div>;
        }

        return <Component {...props} />;
    } catch (error) {
        return (
            <div className="text-gray-400 text-sm text-center">
                <div className="text-gray-300 mb-1">⚠</div>
                Preview unavailable
            </div>
        );
    }
};

export default ComponentDetailView;