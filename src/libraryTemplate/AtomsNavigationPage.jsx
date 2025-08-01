import React, { useState } from 'react';
import { 
    Breadcrumb, 
    Menu,
    NavigationButton,
    Pagination,
    Tab
} from '../components/atoms';

const AtomsNavigationPage = () => {
    const [activeTab, setActiveTab] = useState('tab1');
    const [currentPage, setCurrentPage] = useState(1);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Navigation', href: '/components/navigation' },
        { label: 'Breadcrumb' }
    ];

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
        { id: 'projects', label: 'Projects', icon: 'folder', href: '/projects' },
        { id: 'team', label: 'Team', icon: 'users', href: '/team' },
        { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
        { id: 'help', label: 'Help', icon: 'help-circle', href: '/help' }
    ];

    const tabItems = [
        { id: 'tab1', label: 'General', content: 'General settings content goes here.' },
        { id: 'tab2', label: 'Security', content: 'Security settings content goes here.' },
        { id: 'tab3', label: 'Notifications', content: 'Notification settings content goes here.' },
        { id: 'tab4', label: 'Advanced', content: 'Advanced settings content goes here.' }
    ];

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Atoms</h1>
                <h2 className="text-xl text-gray-600 mb-4">Navigation Components</h2>
                <p className="text-gray-600">
                    Components for navigation, wayfinding, and organizing content hierarchy.
                </p>
            </div>

            {/* Breadcrumb Component */}
            <ComponentSection 
                title="Breadcrumb" 
                description="Navigation hierarchy display with customizable separators and collapsible long paths."
            >
                <div className="space-y-6">
                    {/* Basic Breadcrumbs */}
                    <ExampleGroup title="Basic Breadcrumbs">
                        <div className="space-y-3">
                            <Breadcrumb items={breadcrumbItems} />
                            <Breadcrumb 
                                items={breadcrumbItems}
                                showHome
                                homeIcon="home"
                            />
                        </div>
                        <CodeBlock>{`const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/components' },
  { label: 'Navigation', href: '/components/navigation' },
  { label: 'Breadcrumb' }
];

<Breadcrumb items={breadcrumbItems} />
<Breadcrumb 
  items={breadcrumbItems}
  showHome
  homeIcon="home"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Separators */}
                    <ExampleGroup title="Different Separators">
                        <div className="space-y-3">
                            <Breadcrumb items={breadcrumbItems} separator="arrow" />
                            <Breadcrumb items={breadcrumbItems} separator="slash" />
                            <Breadcrumb items={breadcrumbItems} separator="dot" />
                            <Breadcrumb items={breadcrumbItems} separator="dash" />
                            <Breadcrumb items={breadcrumbItems} separator="pipe" />
                            <Breadcrumb items={breadcrumbItems} separator="chevron" />
                        </div>
                        <CodeBlock>{`<Breadcrumb items={items} separator="arrow" />
<Breadcrumb items={items} separator="slash" />
<Breadcrumb items={items} separator="dot" />
<Breadcrumb items={items} separator="dash" />
<Breadcrumb items={items} separator="pipe" />
<Breadcrumb items={items} separator="chevron" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Collapsible Breadcrumbs */}
                    <ExampleGroup title="Collapsible Long Paths">
                        <div className="space-y-3">
                            <Breadcrumb 
                                items={[
                                    { label: 'Home', href: '/' },
                                    { label: 'Category', href: '/category' },
                                    { label: 'Subcategory', href: '/subcategory' },
                                    { label: 'Product Type', href: '/product-type' },
                                    { label: 'Specific Product', href: '/specific-product' },
                                    { label: 'Variant', href: '/variant' },
                                    { label: 'Current Page' }
                                ]}
                                maxItems={4}
                                collapsible
                            />
                        </div>
                        <CodeBlock>{`<Breadcrumb 
  items={longPath}
  maxItems={4}
  collapsible
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Badges */}
                    <ExampleGroup title="With Status Badges">
                        <Breadcrumb 
                            items={[
                                { label: 'Projects', href: '/projects' },
                                { label: 'Website Redesign', href: '/projects/website', badge: { text: 'Active', color: 'green' } },
                                { label: 'Components', href: '/components', badge: { text: 'In Progress', color: 'blue' } },
                                { label: 'Navigation Components', badge: { text: 'Review', color: 'orange' } }
                            ]}
                        />
                        <CodeBlock>{`<Breadcrumb 
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Website Redesign', href: '/projects/website', badge: { text: 'Active', color: 'green' } },
    { label: 'Components', href: '/components', badge: { text: 'In Progress', color: 'blue' } },
    { label: 'Navigation Components', badge: { text: 'Review', color: 'orange' } }
  ]}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Tab Component */}
            <ComponentSection 
                title="Tab" 
                description="Tabbed content navigation with multiple variants and orientations."
            >
                <div className="space-y-6">
                    {/* Basic Tabs */}
                    <ExampleGroup title="Basic Tabs">
                        <Tab
                            items={tabItems}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            variant="default"
                        />
                        <CodeBlock>{`const tabItems = [
  { id: 'tab1', label: 'General', content: 'General settings content...' },
  { id: 'tab2', label: 'Security', content: 'Security settings content...' },
  { id: 'tab3', label: 'Notifications', content: 'Notification settings content...' },
  { id: 'tab4', label: 'Advanced', content: 'Advanced settings content...' }
];

<Tab
  items={tabItems}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="default"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Tab Variants */}
                    <ExampleGroup title="Tab Variants">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Pills Variant</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="pills"
                                        size="md"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Underline Variant</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="underline"
                                        size="md"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Card Variant</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="card"
                                        size="md"
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock>{`<Tab items={items} variant="pills" />
<Tab items={items} variant="underline" />
<Tab items={items} variant="card" />
<Tab items={items} variant="default" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Tab Sizes */}
                    <ExampleGroup title="Tab Sizes">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Small</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="pills"
                                        size="sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Medium</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="pills"
                                        size="md"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Large</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Tab
                                        items={tabItems.slice(0, 3)}
                                        variant="pills"
                                        size="lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock>{`<Tab items={items} size="sm" />
<Tab items={items} size="md" />
<Tab items={items} size="lg" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Vertical Tabs */}
                    <ExampleGroup title="Vertical Orientation">
                        <Tab
                            items={tabItems}
                            orientation="vertical"
                            variant="pills"
                            className="h-64"
                        />
                        <CodeBlock>{`<Tab
  items={items}
  orientation="vertical"
  variant="pills"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Full Width Tabs */}
                    <ExampleGroup title="Full Width">
                        <Tab
                            items={tabItems.slice(0, 4)}
                            variant="underline"
                            fullWidth
                        />
                        <CodeBlock>{`<Tab
  items={items}
  variant="underline"
  fullWidth
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Closable Tabs */}
                    <ExampleGroup title="Closable Tabs">
                        <Tab
                            items={tabItems.map(item => ({ ...item, closable: true }))}
                            variant="card"
                            closable
                            onTabClose={(tabId) => console.log(`Closing tab: ${tabId}`)}
                        />
                        <CodeBlock>{`<Tab
  items={items.map(item => ({ ...item, closable: true }))}
  variant="card"
  closable
  onTabClose={(tabId) => console.log(\`Closing tab: \${tabId}\`)}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Pagination Component */}
            <ComponentSection 
                title="Pagination" 
                description="Page navigation with customizable display options and jump controls."
            >
                <div className="space-y-6">
                    {/* Basic Pagination */}
                    <ExampleGroup title="Basic Pagination">
                        <div className="space-y-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={10}
                                onPageChange={setCurrentPage}
                            />
                            <div className="text-sm text-gray-600">
                                Current page: {currentPage} of 10
                            </div>
                        </div>
                        <CodeBlock>{`<Pagination
  currentPage={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Page Info */}
                    <ExampleGroup title="With Page Information">
                        <Pagination
                            currentPage={3}
                            totalPages={20}
                            totalItems={200}
                            itemsPerPage={10}
                            showPageInfo
                            showItemCount
                        />
                        <CodeBlock>{`<Pagination
  currentPage={3}
  totalPages={20}
  totalItems={200}
  itemsPerPage={10}
  showPageInfo
  showItemCount
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact Pagination */}
                    <ExampleGroup title="Compact Style">
                        <Pagination
                            currentPage={5}
                            totalPages={50}
                            compact
                            showJumpToPage
                        />
                        <CodeBlock>{`<Pagination
  currentPage={5}
  totalPages={50}
  compact
  showJumpToPage
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Size Variants */}
                    <ExampleGroup title="Size Variants">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Small</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Pagination
                                        currentPage={2}
                                        totalPages={8}
                                        size="sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Medium</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Pagination
                                        currentPage={2}
                                        totalPages={8}
                                        size="md"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Large</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Pagination
                                        currentPage={2}
                                        totalPages={8}
                                        size="lg"
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock>{`<Pagination currentPage={2} totalPages={8} size="sm" />
<Pagination currentPage={2} totalPages={8} size="md" />
<Pagination currentPage={2} totalPages={8} size="lg" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Custom Page Ranges */}
                    <ExampleGroup title="Custom Page Range Display">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Show 3 pages around current</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Pagination
                                        currentPage={10}
                                        totalPages={25}
                                        siblingCount={1}
                                        boundaryCount={1}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Show 5 pages around current</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <Pagination
                                        currentPage={10}
                                        totalPages={25}
                                        siblingCount={2}
                                        boundaryCount={2}
                                    />
                                </div>
                            </div>
                        </div>
                        <CodeBlock>{`<Pagination
  currentPage={10}
  totalPages={25}
  siblingCount={1}
  boundaryCount={1}
/>
<Pagination
  currentPage={10}
  totalPages={25}
  siblingCount={2}
  boundaryCount={2}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* NavigationButton Component */}
            <ComponentSection 
                title="NavigationButton" 
                description="Specialized buttons for navigation actions with directional indicators."
            >
                <div className="space-y-6">
                    {/* Basic Navigation Buttons */}
                    <ExampleGroup title="Basic Navigation Buttons">
                        <div className="flex flex-wrap gap-4">
                            <NavigationButton direction="back">
                                Go Back
                            </NavigationButton>
                            <NavigationButton direction="forward">
                                Continue
                            </NavigationButton>
                            <NavigationButton direction="up">
                                Go Up
                            </NavigationButton>
                            <NavigationButton direction="down">
                                Go Down
                            </NavigationButton>
                        </div>
                        <CodeBlock>{`<NavigationButton direction="back">Go Back</NavigationButton>
<NavigationButton direction="forward">Continue</NavigationButton>
<NavigationButton direction="up">Go Up</NavigationButton>
<NavigationButton direction="down">Go Down</NavigationButton>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Variants and Sizes */}
                    <ExampleGroup title="Variants and Sizes">
                        <div className="space-y-4">
                            <div className="flex space-x-4">
                                <NavigationButton direction="back" variant="primary" size="sm">
                                    Previous
                                </NavigationButton>
                                <NavigationButton direction="forward" variant="primary" size="md">
                                    Next
                                </NavigationButton>
                                <NavigationButton direction="forward" variant="primary" size="lg">
                                    Continue
                                </NavigationButton>
                            </div>
                            <div className="flex space-x-4">
                                <NavigationButton direction="back" variant="secondary">
                                    Cancel
                                </NavigationButton>
                                <NavigationButton direction="forward" variant="ghost">
                                    Skip
                                </NavigationButton>
                                <NavigationButton direction="up" variant="outline">
                                    Top
                                </NavigationButton>
                            </div>
                        </div>
                        <CodeBlock>{`<NavigationButton direction="back" variant="primary" size="sm">
  Previous
</NavigationButton>
<NavigationButton direction="forward" variant="secondary">
  Next
</NavigationButton>
<NavigationButton direction="up" variant="ghost">
  Top
</NavigationButton>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Custom Icons */}
                    <ExampleGroup title="With Custom Icons">
                        <div className="flex space-x-4">
                            <NavigationButton 
                                direction="back" 
                                icon="arrow-left"
                                variant="outline"
                            >
                                Previous Step
                            </NavigationButton>
                            <NavigationButton 
                                direction="forward" 
                                icon="arrow-right"
                                variant="primary"
                            >
                                Next Step
                            </NavigationButton>
                            <NavigationButton 
                                direction="up" 
                                icon="chevron-up"
                                variant="ghost"
                            >
                                Back to Top
                            </NavigationButton>
                        </div>
                        <CodeBlock>{`<NavigationButton 
  direction="back" 
  icon="arrow-left"
  variant="outline"
>
  Previous Step
</NavigationButton>
<NavigationButton 
  direction="forward" 
  icon="arrow-right"
  variant="primary"
>
  Next Step
</NavigationButton>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Disabled States */}
                    <ExampleGroup title="Disabled States">
                        <div className="flex space-x-4">
                            <NavigationButton direction="back" disabled>
                                First Page
                            </NavigationButton>
                            <NavigationButton direction="forward" disabled>
                                Last Page
                            </NavigationButton>
                        </div>
                        <CodeBlock>{`<NavigationButton direction="back" disabled>
  First Page
</NavigationButton>
<NavigationButton direction="forward" disabled>
  Last Page
</NavigationButton>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Menu Component */}
            <ComponentSection 
                title="Menu" 
                description="Navigation menu with hierarchical items and customizable styling."
            >
                <div className="space-y-6">
                    {/* Basic Menu */}
                    <ExampleGroup title="Basic Menu">
                        <div className="max-w-xs">
                            <Menu
                                items={menuItems}
                                variant="default"
                                orientation="vertical"
                            />
                        </div>
                        <CodeBlock>{`const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
  { id: 'projects', label: 'Projects', icon: 'folder', href: '/projects' },
  { id: 'team', label: 'Team', icon: 'users', href: '/team' },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
  { id: 'help', label: 'Help', icon: 'help-circle', href: '/help' }
];

<Menu
  items={menuItems}
  variant="default"
  orientation="vertical"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Horizontal Menu */}
                    <ExampleGroup title="Horizontal Menu">
                        <Menu
                            items={menuItems.slice(0, 4)}
                            variant="pills"
                            orientation="horizontal"
                        />
                        <CodeBlock>{`<Menu
  items={menuItems}
  variant="pills"
  orientation="horizontal"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Menu with Submenus */}
                    <ExampleGroup title="Menu with Submenus">
                        <div className="max-w-xs">
                            <Menu
                                items={[
                                    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
                                    { 
                                        id: 'projects', 
                                        label: 'Projects', 
                                        icon: 'folder',
                                        children: [
                                            { id: 'active', label: 'Active Projects', href: '/projects/active' },
                                            { id: 'archived', label: 'Archived Projects', href: '/projects/archived' },
                                            { id: 'templates', label: 'Project Templates', href: '/projects/templates' }
                                        ]
                                    },
                                    { 
                                        id: 'team', 
                                        label: 'Team', 
                                        icon: 'users',
                                        children: [
                                            { id: 'members', label: 'Team Members', href: '/team/members' },
                                            { id: 'roles', label: 'Roles & Permissions', href: '/team/roles' }
                                        ]
                                    },
                                    { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' }
                                ]}
                                variant="default"
                                collapsible
                            />
                        </div>
                        <CodeBlock>{`<Menu
  items={[
    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: 'folder',
      children: [
        { id: 'active', label: 'Active Projects', href: '/projects/active' },
        { id: 'archived', label: 'Archived Projects', href: '/projects/archived' }
      ]
    }
  ]}
  variant="default"
  collapsible
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact Menu */}
                    <ExampleGroup title="Compact Menu">
                        <div className="max-w-xs">
                            <Menu
                                items={menuItems}
                                variant="minimal"
                                compact
                                showIcons={false}
                            />
                        </div>
                        <CodeBlock>{`<Menu
  items={menuItems}
  variant="minimal"
  compact
  showIcons={false}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {children}
        </div>
    </div>
);

const ExampleGroup = ({ title, children }) => (
    <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">{title}</h4>
        {children}
    </div>
);

const CodeBlock = ({ children }) => (
    <div className="mt-4 bg-gray-100 rounded-md p-4 overflow-x-auto">
        <pre className="text-sm text-gray-800">
            <code>{children}</code>
        </pre>
    </div>
);

export default AtomsNavigationPage;