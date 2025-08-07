import React, { useState } from 'react';
import { Navbar, Sidebar } from '../components/atoms/layouts';
import { 
    Home, 
    Settings, 
    Users, 
    FileText, 
    BarChart3,
    Calendar,
    MessageCircle,
    HelpCircle 
} from 'lucide-react';

const NavigationComponentsPage = () => {
    const [activeNavItem, setActiveNavItem] = useState('nav2');
    const [activeSidebarItem, setActiveSidebarItem] = useState('analytics');

    // Sample data for Navbar
    const navbarItems = [
        { id: 'nav1', label: 'Home', href: '#nav1' },
        { id: 'nav2', label: 'Analytics', href: '#nav2', badge: '3' },
        { id: 'nav3', label: 'Reports', href: '#nav3' },
        { 
            id: 'nav4', 
            label: 'Services', 
            submenu: [
                { id: 'web-design', label: 'Web Design', href: '#web-design' },
                { id: 'development', label: 'Development', href: '#development' },
                { 
                    id: 'consulting', 
                    label: 'Consulting',
                    submenu: [
                        { id: 'tech-consulting', label: 'Tech Consulting', href: '#tech' },
                        { id: 'business-consulting', label: 'Business Consulting', href: '#business' }
                    ]
                }
            ]
        },
        { id: 'nav5', label: 'Portfolio', href: '#nav5', badge: '12' },
        { id: 'nav6', label: 'Contact', href: '#nav6' },
        { id: 'nav7', label: 'About', href: '#nav7' },
        { id: 'nav8', label: 'Blog', href: '#nav8' },
        { id: 'nav9', label: 'Support', href: '#nav9', badge: '5' },
        { id: 'nav10', label: 'Documentation', href: '#nav10' },
        { id: 'nav11', label: 'Community', href: '#nav11' },
        { id: 'nav12', label: 'Resources', href: '#nav12' },
        { id: 'nav13', label: 'Pricing', href: '#nav13' },
        { id: 'nav14', label: 'Enterprise', href: '#nav14', badge: 'New' },
        { id: 'nav15', label: 'API', href: '#nav15' }
    ];

    // Sample data for Sidebar
    const sidebarItems = [
        { 
            id: 'dashboard', 
            label: 'Dashboard', 
            icon: <Home />, 
            href: '#dashboard' 
        },
        { 
            id: 'analytics', 
            label: 'Analytics', 
            icon: <BarChart3 />, 
            href: '#analytics', 
            badge: '3' 
        },
        { 
            id: 'users', 
            label: 'Users', 
            icon: <Users />,
            submenu: [
                { id: 'all-users', label: 'All Users', href: '#all-users' },
                { id: 'user-roles', label: 'User Roles', href: '#user-roles', badge: 'New' },
                { id: 'permissions', label: 'Permissions', href: '#permissions' }
            ]
        },
        { 
            id: 'content', 
            label: 'Content Management', 
            icon: <FileText />,
            submenu: [
                { id: 'articles', label: 'Articles', href: '#articles' },
                { id: 'media', label: 'Media Library', href: '#media', badge: '12' },
                { 
                    id: 'categories', 
                    label: 'Categories',
                    submenu: [
                        { id: 'main-categories', label: 'Main Categories', href: '#main' },
                        { id: 'sub-categories', label: 'Sub Categories', href: '#sub' },
                        { id: 'tags', label: 'Tags', href: '#tags' }
                    ]
                }
            ]
        },
        { 
            id: 'calendar', 
            label: 'Calendar', 
            icon: <Calendar />, 
            href: '#calendar' 
        },
        { 
            id: 'messages', 
            label: 'Messages', 
            icon: <MessageCircle />, 
            href: '#messages', 
            badge: '5' 
        },
        { 
            id: 'settings', 
            label: 'Settings', 
            icon: <Settings />, 
            href: '#settings' 
        },
        { 
            id: 'help', 
            label: 'Help & Support', 
            icon: <HelpCircle />, 
            href: '#help' 
        }
    ];

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Navigation</h1>
                <h2 className="text-xl text-gray-600 mb-4">Navigation Components</h2>
                <p className="text-gray-600">
                    Flexible navigation components for horizontal and vertical navigation with advanced features 
                    like overflow handling, nested menus, and responsive behavior.
                </p>
            </div>

            {/* Navbar Component */}
            <ComponentSection 
                title="Navbar" 
                description="Dynamic horizontal navigation component with overflow menu and nested dropdown support."
            >
                <div className="space-y-12">
                    {/* Default Navbar */}
                    <ExampleGroup title="Default Navbar with Overflow">
                        <div className="mb-8">
                            <div className="border border-gray-200 rounded-lg">
                                <Navbar
                                    items={navbarItems}
                                    activeItem={activeNavItem}
                                    variant="default"
                                    size="md"
                                    responsive={true}
                                    showOverflow={true}
                                    overflowTrigger="hover"
                                    onChange={setActiveNavItem}
                                />
                            </div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg -mt-8">
                            <p className="text-sm text-blue-800">
                                <strong>Active Item:</strong> {activeNavItem || 'None'} | 
                                <strong> Click any navigation item to see the active state change</strong>
                            </p>
                        </div>
                        <CodeBlock>{`<Navbar
  items={[
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'analytics', label: 'Analytics', href: '#analytics', badge: '3' },
    { 
      id: 'services', 
      label: 'Services', 
      submenu: [
        { id: 'web-design', label: 'Web Design', href: '#web-design' },
        { id: 'development', label: 'Development', href: '#development' },
        { 
          id: 'consulting', 
          label: 'Consulting',
          submenu: [
            { id: 'tech', label: 'Tech Consulting', href: '#tech' },
            { id: 'business', label: 'Business Consulting', href: '#business' }
          ]
        }
      ]
    },
    { id: 'portfolio', label: 'Portfolio', href: '#portfolio', badge: '12' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ]}
  activeItem={activeItem}
  variant="default"
  size="md"
  responsive={true}
  showOverflow={true}
  overflowTrigger="hover"
  onChange={setActiveItem}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Pills Navbar */}
                    <ExampleGroup title="Pills Navbar">
                        <div className="mb-8">
                            <div className="border border-gray-200 rounded-lg">
                                <Navbar
                                    items={navbarItems.slice(0, 5)}
                                    activeItem={activeNavItem}
                                    variant="pills"
                                    size="md"
                                    responsive={true}
                                    showOverflow={true}
                                    onChange={setActiveNavItem}
                                />
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg -mt-8">
                            <p className="text-xs text-green-700">
                                ✅ Hover over "Services" to see nested dropdowns in action
                            </p>
                        </div>
                        <CodeBlock>{`<Navbar
  items={navItems}
  activeItem="reports"
  variant="pills"
  size="md"
  responsive={true}
  showOverflow={true}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Minimal Navbar */}
                    <ExampleGroup title="Minimal Navbar">
                        <div className="border border-gray-200 rounded-lg">
                            <Navbar
                                items={navbarItems.slice(0, 4)}
                                activeItem={activeNavItem}
                                variant="minimal"
                                size="lg"
                                responsive={true}
                                onChange={setActiveNavItem}
                            />
                        </div>
                        <CodeBlock>{`<Navbar
  items={navItems}
  activeItem="home"
  variant="minimal"
  size="lg"
  responsive={true}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Vertical Navbar */}
                    <ExampleGroup title="Vertical Navbar">
                        <div className="border border-gray-200 rounded-lg" style={{ height: '300px' }}>
                            <Navbar
                                items={navbarItems.slice(0, 6)}
                                activeItem={activeNavItem}
                                variant="default"
                                size="md"
                                orientation="vertical"
                                responsive={true}
                                onChange={setActiveNavItem}
                            />
                        </div>
                        <CodeBlock>{`<Navbar
  items={navItems}
  activeItem="analytics"
  variant="default"
  size="md"
  orientation="vertical"
  responsive={true}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Sidebar Component */}
            <ComponentSection 
                title="Sidebar" 
                description="Collapsible sidebar navigation with nested menus, accordion-style expansion, and multiple theme variants."
            >
                <div className="space-y-12">
                    {/* Default Sidebar */}
                    <ExampleGroup title="Default Sidebar with Nested Menus">
                        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '450px' }}>
                            <Sidebar
                                items={sidebarItems}
                                activeItem={activeSidebarItem}
                                variant="default"
                                size="md"
                                position="left"
                                fixed={false}
                                collapsible={true}
                                defaultCollapsed={false}
                                width={280}
                                collapsedWidth={64}
                                showTooltips={true}
                                onChange={setActiveSidebarItem}
                            />
                        </div>
                        <CodeBlock>{`<Sidebar
  items={[
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <Home />, 
      href: '#dashboard' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 />, 
      href: '#analytics', 
      badge: '3' 
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: <Users />,
      submenu: [
        { id: 'all-users', label: 'All Users', href: '#all-users' },
        { id: 'user-roles', label: 'User Roles', href: '#user-roles', badge: 'New' },
        { id: 'permissions', label: 'Permissions', href: '#permissions' }
      ]
    },
    { 
      id: 'content', 
      label: 'Content Management', 
      icon: <FileText />,
      submenu: [
        { id: 'articles', label: 'Articles', href: '#articles' },
        { id: 'media', label: 'Media Library', href: '#media', badge: '12' },
        { 
          id: 'categories', 
          label: 'Categories',
          submenu: [
            { id: 'main', label: 'Main Categories', href: '#main' },
            { id: 'sub', label: 'Sub Categories', href: '#sub' }
          ]
        }
      ]
    }
  ]}
  activeItem={activeItem}
  variant="default"
  size="md"
  position="left"
  fixed={false}
  collapsible={true}
  defaultCollapsed={false}
  width={280}
  collapsedWidth={64}
  showTooltips={true}
  onChange={setActiveItem}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Dark Sidebar */}
                    <ExampleGroup title="Dark Theme Sidebar (Collapsed)">
                        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                            <Sidebar
                                items={sidebarItems.slice(0, 6)}
                                activeItem="users"
                                variant="dark"
                                size="md"
                                position="left"
                                fixed={false}
                                collapsible={true}
                                defaultCollapsed={true}
                                width={240}
                                collapsedWidth={60}
                                showTooltips={true}
                            />
                        </div>
                        <CodeBlock>{`<Sidebar
  items={sidebarItems}
  activeItem="users"
  variant="dark"
  size="md"
  position="left"
  fixed={false}
  collapsible={true}
  defaultCollapsed={true}
  width={240}
  collapsedWidth={60}
  showTooltips={true}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Light Sidebar */}
                    <ExampleGroup title="Light Theme Sidebar (Small Size)">
                        <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '350px' }}>
                            <Sidebar
                                items={sidebarItems.slice(0, 5)}
                                activeItem="calendar"
                                variant="light"
                                size="sm"
                                position="left"
                                fixed={false}
                                collapsible={true}
                                defaultCollapsed={false}
                                width={220}
                                collapsedWidth={50}
                                showTooltips={true}
                            />
                        </div>
                        <CodeBlock>{`<Sidebar
  items={compactSidebarItems}
  activeItem="calendar"
  variant="light"
  size="sm"
  position="left"
  fixed={false}
  collapsible={true}
  defaultCollapsed={false}
  width={220}
  collapsedWidth={50}
  showTooltips={true}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Right-positioned Sidebar */}
                    <ExampleGroup title="Right-positioned Sidebar">
                        <div className="border border-gray-200 rounded-lg overflow-hidden relative flex" style={{ height: '350px' }}>
                            {/* Main content area to show sidebar positioning */}
                            <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
                                <span className="text-gray-500">Main content area - Sidebar on the right →</span>
                            </div>
                            {/* Right positioned sidebar */}
                            <div className="flex-shrink-0">
                                <Sidebar
                                    items={sidebarItems.slice(0, 4)}
                                    activeItem="messages"
                                    variant="default"
                                    size="md"
                                    position="right"
                                    fixed={false}
                                    collapsible={true}
                                    defaultCollapsed={false}
                                    width={250}
                                    collapsedWidth={60}
                                    showTooltips={true}
                                />
                            </div>
                        </div>
                        <CodeBlock>{`<Sidebar
  items={sidebarItems}
  activeItem="messages"
  variant="default"
  size="md"
  position="right"
  fixed={false}
  collapsible={true}
  defaultCollapsed={false}
  width={250}
  collapsedWidth={60}
  showTooltips={true}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Usage Guidelines */}
            <ComponentSection 
                title="Usage Guidelines" 
                description="Best practices and implementation guidelines for navigation components."
            >
                <div className="space-y-8">
                    <ExampleGroup title="When to Use">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-4">Navbar</h4>
                            <ul className="space-y-2 text-blue-800 text-sm">
                                <li>• Primary horizontal navigation across the top of your application</li>
                                <li>• When you have 3-8 main navigation items</li>
                                <li>• For responsive designs that need to adapt to different screen sizes</li>
                                <li>• When you need nested dropdown menus with multiple levels</li>
                                <li>• For websites and applications with clear page hierarchy</li>
                            </ul>
                            
                            <h4 className="font-semibold text-blue-900 mb-4 mt-6">Sidebar</h4>
                            <ul className="space-y-2 text-blue-800 text-sm">
                                <li>• Vertical navigation for applications with complex navigation structures</li>
                                <li>• When you need persistent navigation that doesn't disappear</li>
                                <li>• For admin dashboards, control panels, and management interfaces</li>
                                <li>• When screen space is limited and you need collapsible navigation</li>
                                <li>• For applications with deep hierarchical menu structures</li>
                            </ul>
                        </div>
                    </ExampleGroup>

                    <ExampleGroup title="Configuration Options">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Navbar Options</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li><strong>Variants:</strong> default, pills, minimal</li>
                                        <li><strong>Sizes:</strong> sm, md, lg</li>
                                        <li><strong>Orientation:</strong> horizontal, vertical</li>
                                        <li><strong>Overflow:</strong> automatic menu collapse</li>
                                        <li><strong>Triggers:</strong> hover, click</li>
                                        <li><strong>Features:</strong> badges, nested menus</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Sidebar Options</h4>
                                    <ul className="space-y-1 text-sm text-gray-600">
                                        <li><strong>Variants:</strong> default, dark, light</li>
                                        <li><strong>Sizes:</strong> sm, md, lg</li>
                                        <li><strong>Position:</strong> left, right</li>
                                        <li><strong>Collapsible:</strong> with toggle button</li>
                                        <li><strong>Tooltips:</strong> when collapsed</li>
                                        <li><strong>Features:</strong> icons, badges, nested menus</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
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

export default NavigationComponentsPage;