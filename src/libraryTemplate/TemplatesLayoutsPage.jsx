import React, { useState } from 'react';
import { 
    DashboardLayout,
    FormLayout,
    ListDetailLayout
} from '../components/templates';

const TemplatesLayoutsPage = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [theme, setTheme] = useState('light');

    // Sample data for layouts
    const sampleMetrics = [
        {
            title: 'Total Revenue',
            value: 245680,
            format: 'currency',
            trend: { direction: 'up', percentage: 12.5 },
            status: 'excellent'
        },
        {
            title: 'New Customers',
            value: 1234,
            format: 'number',
            trend: { direction: 'up', percentage: 8.2 },
            status: 'normal'
        },
        {
            title: 'Conversion Rate',
            value: 23.4,
            format: 'percentage',
            trend: { direction: 'down', percentage: 2.1 },
            status: 'warning'
        },
        {
            title: 'Active Users',
            value: 45678,
            format: 'number',
            trend: { direction: 'up', percentage: 15.3 },
            status: 'excellent'
        }
    ];

    const quickActions = [
        {
            label: 'Create New Project',
            icon: 'plus',
            variant: 'primary',
            onClick: () => console.log('Create project')
        },
        {
            label: 'Import Data',
            icon: 'upload',
            variant: 'secondary',
            onClick: () => console.log('Import data')
        },
        {
            label: 'Generate Report',
            icon: 'file-text',
            variant: 'outline',
            onClick: () => console.log('Generate report')
        },
        {
            label: 'Export Analytics',
            icon: 'download',
            variant: 'ghost',
            onClick: () => console.log('Export analytics')
        }
    ];

    const notifications = [
        {
            id: 1,
            title: 'New user registered',
            message: 'John Doe just signed up for your service',
            time: '2 minutes ago',
            type: 'info',
            unread: true
        },
        {
            id: 2,
            title: 'Payment received',
            message: 'Invoice #1234 has been paid',
            time: '1 hour ago',
            type: 'success',
            unread: true
        },
        {
            id: 3,
            title: 'Server maintenance',
            message: 'Scheduled maintenance will begin in 2 hours',
            time: '3 hours ago',
            type: 'warning',
            unread: false
        }
    ];

    const sampleFormData = {
        title: 'User Profile Form',
        description: 'Update your personal information and preferences',
        sections: [
            {
                title: 'Personal Information',
                fields: [
                    { name: 'firstName', label: 'First Name', type: 'text', required: true },
                    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
                    { name: 'email', label: 'Email', type: 'email', required: true },
                    { name: 'phone', label: 'Phone', type: 'tel' }
                ]
            },
            {
                title: 'Preferences',
                fields: [
                    { name: 'notifications', label: 'Email Notifications', type: 'checkbox' },
                    { name: 'theme', label: 'Theme Preference', type: 'select', options: [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'auto', label: 'Auto' }
                    ]},
                    { name: 'language', label: 'Language', type: 'select', options: [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' }
                    ]}
                ]
            }
        ]
    };

    const listData = [
        {
            id: 1,
            title: 'Project Alpha',
            description: 'E-commerce platform development',
            status: 'Active',
            priority: 'High',
            dueDate: '2024-02-15',
            assignee: 'John Doe',
            progress: 75
        },
        {
            id: 2,
            title: 'Marketing Campaign',
            description: 'Q1 digital marketing initiative',
            status: 'Planning',
            priority: 'Medium',
            dueDate: '2024-02-28',
            assignee: 'Jane Smith',
            progress: 25
        },
        {
            id: 3,
            title: 'System Migration',
            description: 'Legacy system modernization',
            status: 'On Hold',
            priority: 'Low',
            dueDate: '2024-03-15',
            assignee: 'Mike Johnson',
            progress: 10
        }
    ];

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
                <h2 className="text-xl text-gray-600 mb-4">Layout Templates</h2>
                <p className="text-gray-600">
                    Complete layout templates that combine multiple components to create full-page experiences.
                </p>
            </div>

            {/* DashboardLayout Component */}
            <ComponentSection 
                title="DashboardLayout" 
                description="Complete dashboard template with sidebar, header, metrics, and quick actions."
            >
                <div className="space-y-6">
                    {/* Full Dashboard Layout */}
                    <ExampleGroup title="Complete Dashboard Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-96">
                            <DashboardLayout
                                sidebarPosition="left"
                                sidebarCollapsible={true}
                                sidebarCollapsed={sidebarCollapsed}
                                onSidebarToggle={setSidebarCollapsed}
                                metrics={sampleMetrics}
                                quickActions={quickActions}
                                notifications={notifications}
                                theme={theme}
                                onThemeChange={setTheme}
                                user={{
                                    name: 'John Doe',
                                    email: 'john@example.com',
                                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                                }}
                                breadcrumbs={[
                                    { label: 'Dashboard', href: '/dashboard' },
                                    { label: 'Analytics', href: '/dashboard/analytics' },
                                    { label: 'Overview' }
                                ]}
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Content</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                                <div className="text-sm text-gray-500 mb-1">Chart {i}</div>
                                                <div className="h-24 bg-gradient-to-r from-blue-50 to-indigo-50 rounded flex items-center justify-center">
                                                    <span className="text-gray-400">Visualization</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DashboardLayout>
                        </div>
                        <CodeBlock>{`<DashboardLayout
  sidebarPosition="left"
  sidebarCollapsible={true}
  sidebarCollapsed={sidebarCollapsed}
  onSidebarToggle={setSidebarCollapsed}
  metrics={[
    {
      title: 'Total Revenue',
      value: 245680,
      format: 'currency',
      trend: { direction: 'up', percentage: 12.5 },
      status: 'excellent'
    },
    {
      title: 'New Customers',
      value: 1234,
      format: 'number',
      trend: { direction: 'up', percentage: 8.2 },
      status: 'normal'
    }
  ]}
  quickActions={[
    {
      label: 'Create New Project',
      icon: 'plus',
      variant: 'primary',
      onClick: () => console.log('Create project')
    }
  ]}
  notifications={notifications}
  theme={theme}
  onThemeChange={setTheme}
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  }}
  breadcrumbs={breadcrumbs}
>
  {/* Your dashboard content */}
  <div className="p-6">
    <h3>Dashboard Content</h3>
    {/* Charts, tables, etc. */}
  </div>
</DashboardLayout>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact Dashboard */}
                    <ExampleGroup title="Compact Dashboard Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-80">
                            <DashboardLayout
                                variant="compact"
                                sidebarPosition="left"
                                metrics={sampleMetrics.slice(0, 2)}
                                quickActions={quickActions.slice(0, 2)}
                                theme="light"
                                showBreadcrumbs={false}
                                user={{
                                    name: 'Jane Smith',
                                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fe?w=32&h=32&fit=crop&crop=face'
                                }}
                            >
                                <div className="p-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                        <h4 className="font-medium text-gray-900 mb-2">Compact Content Area</h4>
                                        <p className="text-gray-600 text-sm">
                                            This is a more compact version of the dashboard layout suitable for 
                                            applications with limited screen space.
                                        </p>
                                    </div>
                                </div>
                            </DashboardLayout>
                        </div>
                        <CodeBlock>{`<DashboardLayout
  variant="compact"
  sidebarPosition="left"
  metrics={compactMetrics}
  quickActions={compactActions}
  theme="light"
  showBreadcrumbs={false}
  user={{
    name: 'Jane Smith',
    avatar: '/avatar.jpg'
  }}
>
  <div className="p-4">
    {/* Compact content */}
  </div>
</DashboardLayout>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Dark Theme Dashboard */}
                    <ExampleGroup title="Dark Theme Dashboard">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-80">
                            <DashboardLayout
                                sidebarPosition="left"
                                metrics={sampleMetrics.slice(0, 3)}
                                quickActions={quickActions.slice(0, 3)}
                                theme="dark"
                                user={{
                                    name: 'Alex Wilson',
                                    email: 'alex@example.com'
                                }}
                                className="bg-gray-900"
                            >
                                <div className="p-6 bg-gray-900 text-white">
                                    <h3 className="text-lg font-semibold mb-4">Dark Theme Content</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                                <div className="text-sm text-gray-400 mb-1">Dark Card {i}</div>
                                                <div className="h-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded flex items-center justify-center">
                                                    <span className="text-gray-300">Dark Content</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DashboardLayout>
                        </div>
                        <CodeBlock>{`<DashboardLayout
  sidebarPosition="left"
  metrics={metrics}
  quickActions={actions}
  theme="dark"
  user={{
    name: 'Alex Wilson',
    email: 'alex@example.com'
  }}
  className="bg-gray-900"
>
  <div className="p-6 bg-gray-900 text-white">
    {/* Dark theme content */}
  </div>
</DashboardLayout>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* FormLayout Component */}
            <ComponentSection 
                title="FormLayout" 
                description="Form-focused layout with validation display and section organization."
            >
                <div className="space-y-6">
                    {/* Basic Form Layout */}
                    <ExampleGroup title="Complete Form Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-96">
                            <FormLayout
                                title={sampleFormData.title}
                                description={sampleFormData.description}
                                sections={sampleFormData.sections}
                                showProgress={true}
                                currentStep={1}
                                totalSteps={2}
                                onSubmit={(data) => console.log('Form submitted:', data)}
                                onCancel={() => console.log('Form cancelled')}
                                submitLabel="Save Changes"
                                cancelLabel="Cancel"
                                showRequiredIndicator={true}
                                layout="vertical"
                            />
                        </div>
                        <CodeBlock>{`const formData = {
  title: 'User Profile Form',
  description: 'Update your personal information',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
      ]
    },
    {
      title: 'Preferences',
      fields: [
        { name: 'notifications', label: 'Email Notifications', type: 'checkbox' },
        { name: 'theme', label: 'Theme', type: 'select', options: themeOptions }
      ]
    }
  ]
};

<FormLayout
  title={formData.title}
  description={formData.description}
  sections={formData.sections}
  showProgress={true}
  currentStep={1}
  totalSteps={2}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="Save Changes"
  showRequiredIndicator={true}
  layout="vertical"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Horizontal Form Layout */}
                    <ExampleGroup title="Horizontal Form Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-80">
                            <FormLayout
                                title="Quick Settings"
                                sections={[{
                                    title: 'Account Settings',
                                    fields: [
                                        { name: 'username', label: 'Username', type: 'text' },
                                        { name: 'timezone', label: 'Timezone', type: 'select', options: [
                                            { value: 'utc', label: 'UTC' },
                                            { value: 'pst', label: 'PST' },
                                            { value: 'est', label: 'EST' }
                                        ]},
                                        { name: 'autoSave', label: 'Auto-save', type: 'checkbox' }
                                    ]
                                }]}
                                layout="horizontal"
                                compact={true}
                                showProgress={false}
                                onSubmit={(data) => console.log('Settings saved:', data)}
                                submitLabel="Apply"
                            />
                        </div>
                        <CodeBlock>{`<FormLayout
  title="Quick Settings"
  sections={[{
    title: 'Account Settings',
    fields: [
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'timezone', label: 'Timezone', type: 'select', options: timezones },
      { name: 'autoSave', label: 'Auto-save', type: 'checkbox' }
    ]
  }]}
  layout="horizontal"
  compact={true}
  showProgress={false}
  onSubmit={handleSubmit}
  submitLabel="Apply"
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* ListDetailLayout Component */}
            <ComponentSection 
                title="ListDetailLayout" 
                description="Master-detail interface with list view and detailed item display."
            >
                <div className="space-y-6">
                    {/* Basic List-Detail Layout */}
                    <ExampleGroup title="Project List-Detail Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-96">
                            <ListDetailLayout
                                listTitle="Projects"
                                listData={listData}
                                selectedItemId={1}
                                onItemSelect={(item) => console.log('Selected:', item)}
                                listColumns={[
                                    { key: 'title', title: 'Title', sortable: true },
                                    { key: 'status', title: 'Status', render: (value) => (
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            value === 'Active' ? 'bg-green-100 text-green-800' :
                                            value === 'Planning' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {value}
                                        </span>
                                    )},
                                    { key: 'assignee', title: 'Assignee' },
                                    { key: 'dueDate', title: 'Due Date' }
                                ]}
                                detailRender={(item) => (
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600 mb-4">{item.description}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                <div className="text-sm text-gray-900">{item.status}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                                <div className="text-sm text-gray-900">{item.priority}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                                                <div className="text-sm text-gray-900">{item.assignee}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                                <div className="text-sm text-gray-900">{item.dueDate}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${item.progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">{item.progress}% complete</div>
                                        </div>
                                        
                                        <div className="flex space-x-3">
                                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                Edit
                                            </button>
                                            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                                                Archive
                                            </button>
                                        </div>
                                    </div>
                                )}
                                searchable={true}
                                filterable={true}
                                sortable={true}
                                showActions={true}
                                actions={[
                                    { label: 'New Project', variant: 'primary', onClick: () => console.log('New project') },
                                    { label: 'Import', variant: 'secondary', onClick: () => console.log('Import') }
                                ]}
                            />
                        </div>
                        <CodeBlock>{`<ListDetailLayout
  listTitle="Projects"
  listData={listData}
  selectedItemId={selectedId}
  onItemSelect={handleItemSelect}
  listColumns={[
    { key: 'title', title: 'Title', sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      render: (value) => <StatusBadge status={value} />
    },
    { key: 'assignee', title: 'Assignee' },
    { key: 'dueDate', title: 'Due Date' }
  ]}
  detailRender={(item) => (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
      <p className="text-gray-600 mb-4">{item.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div className="text-sm">{item.status}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="text-sm">{item.priority}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Progress</label>
        <ProgressBar value={item.progress} />
      </div>
      
      <div className="flex space-x-3">
        <Button variant="primary">Edit</Button>
        <Button variant="secondary">Archive</Button>
      </div>
    </div>
  )}
  searchable={true}
  filterable={true}
  sortable={true}
  showActions={true}
  actions={[
    { label: 'New Project', variant: 'primary', onClick: handleNew },
    { label: 'Import', variant: 'secondary', onClick: handleImport }
  ]}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact List-Detail */}
                    <ExampleGroup title="Compact List-Detail Layout">
                        <div className="border border-gray-200 rounded-lg overflow-hidden h-80">
                            <ListDetailLayout
                                listTitle="Team Members"
                                listData={[
                                    { id: 1, name: 'John Doe', role: 'Developer', status: 'Active' },
                                    { id: 2, name: 'Jane Smith', role: 'Designer', status: 'Active' },
                                    { id: 3, name: 'Mike Johnson', role: 'Manager', status: 'Away' }
                                ]}
                                selectedItemId={1}
                                listColumns={[
                                    { key: 'name', title: 'Name' },
                                    { key: 'role', title: 'Role' },
                                    { key: 'status', title: 'Status' }
                                ]}
                                detailRender={(item) => (
                                    <div className="p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><strong>Role:</strong> {item.role}</div>
                                            <div><strong>Status:</strong> {item.status}</div>
                                        </div>
                                    </div>
                                )}
                                variant="compact"
                                searchable={false}
                                showActions={false}
                            />
                        </div>
                        <CodeBlock>{`<ListDetailLayout
  listTitle="Team Members"
  listData={teamData}
  selectedItemId={selectedId}
  listColumns={[
    { key: 'name', title: 'Name' },
    { key: 'role', title: 'Role' },
    { key: 'status', title: 'Status' }
  ]}
  detailRender={(item) => (
    <div className="p-4">
      <h4 className="font-semibold mb-2">{item.name}</h4>
      <div className="space-y-2 text-sm">
        <div><strong>Role:</strong> {item.role}</div>
        <div><strong>Status:</strong> {item.status}</div>
      </div>
    </div>
  )}
  variant="compact"
  searchable={false}
  showActions={false}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>
        </div>
    );
};

// Helper Components
const ComponentSection = ({ title, description, children }) => (
    <div className="mb-12">
        <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-6">
            {children}
        </div>
    </div>
);

const ExampleGroup = ({ title, children }) => (
    <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        {children}
    </div>
);

const CodeBlock = ({ children }) => (
    <div className="mt-4 bg-gray-800 text-green-400 rounded-md p-4 overflow-x-auto">
        <pre className="text-sm">
            <code>{children}</code>
        </pre>
    </div>
);

export default TemplatesLayoutsPage;