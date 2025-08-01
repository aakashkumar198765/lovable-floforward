import React from 'react';
import { Avatar, Badge, Icon, Label, Status, Tooltip } from '../components/atoms';

const AtomsDisplayPage = () => {
    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Atoms</h1>
                <h2 className="text-xl text-gray-600 mb-4">Display Components</h2>
                <p className="text-gray-600">
                    Basic visual components for displaying information, user identities, and status indicators.
                </p>
            </div>

            {/* Avatar Component */}
            <ComponentSection 
                title="Avatar" 
                description="User profile picture display with status indicators and fallback options."
            >
                <div className="space-y-6">
                    {/* Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="flex items-center space-x-4">
                            <Avatar size="xs" name="John Doe" />
                            <Avatar size="sm" name="John Doe" />
                            <Avatar size="md" name="John Doe" />
                            <Avatar size="lg" name="John Doe" />
                            <Avatar size="xl" name="John Doe" />
                            <Avatar size="2xl" name="John Doe" />
                        </div>
                        <CodeBlock>{`<Avatar size="xs" name="John Doe" />
<Avatar size="sm" name="John Doe" />
<Avatar size="md" name="John Doe" />
<Avatar size="lg" name="John Doe" />
<Avatar size="xl" name="John Doe" />
<Avatar size="2xl" name="John Doe" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Shapes */}
                    <ExampleGroup title="Shapes">
                        <div className="flex items-center space-x-4">
                            <Avatar shape="circle" name="Circle" />
                            <Avatar shape="rounded" name="Rounded" />
                            <Avatar shape="square" name="Square" />
                        </div>
                        <CodeBlock>{`<Avatar shape="circle" name="Circle" />
<Avatar shape="rounded" name="Rounded" />
<Avatar shape="square" name="Square" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status Indicators */}
                    <ExampleGroup title="Status Indicators">
                        <div className="flex items-center space-x-4">
                            <Avatar name="Online" status="online" />
                            <Avatar name="Offline" status="offline" />
                            <Avatar name="Away" status="away" />
                            <Avatar name="Busy" status="busy" />
                        </div>
                        <CodeBlock>{`<Avatar name="Online" status="online" />
<Avatar name="Offline" status="offline" />
<Avatar name="Away" status="away" />
<Avatar name="Busy" status="busy" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Images */}
                    <ExampleGroup title="With Images">
                        <div className="flex items-center space-x-4">
                            <Avatar 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                name="John Smith" 
                            />
                            <Avatar 
                                src="https://images.unsplash.com/photo-1494790108755-2616b612b1fe?w=32&h=32&fit=crop&crop=face" 
                                name="Jane Doe" 
                                status="online"
                            />
                        </div>
                        <CodeBlock>{`<Avatar 
  src="https://example.com/avatar.jpg" 
  name="John Smith" 
/>
<Avatar 
  src="https://example.com/avatar2.jpg" 
  name="Jane Doe" 
  status="online"
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Badge Component */}
            <ComponentSection 
                title="Badge" 
                description="Small status or category labels with different visual styles."
            >
                <div className="space-y-6">
                    {/* Variants */}
                    <ExampleGroup title="Variants">
                        <div className="flex items-center space-x-4">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="outlined">Outlined</Badge>
                            <Badge variant="filled">Filled</Badge>
                        </div>
                        <CodeBlock>{`<Badge variant="default">Default</Badge>
<Badge variant="outlined">Outlined</Badge>
<Badge variant="filled">Filled</Badge>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Colors */}
                    <ExampleGroup title="Colors">
                        <div className="flex flex-wrap gap-2">
                            <Badge color="primary">Primary</Badge>
                            <Badge color="success">Success</Badge>
                            <Badge color="warning">Warning</Badge>
                            <Badge color="error">Error</Badge>
                            <Badge color="gray">Gray</Badge>
                        </div>
                        <CodeBlock>{`<Badge color="primary">Primary</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="error">Error</Badge>
<Badge color="gray">Gray</Badge>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Removable */}
                    <ExampleGroup title="Removable">
                        <div className="flex items-center space-x-4">
                            <Badge removable onRemove={() => console.log('removed')}>
                                Removable
                            </Badge>
                            <Badge color="success" removable onRemove={() => console.log('removed')}>
                                Success Tag
                            </Badge>
                        </div>
                        <CodeBlock>{`<Badge removable onRemove={() => console.log('removed')}>
  Removable
</Badge>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Icon Component */}
            <ComponentSection 
                title="Icon" 
                description="Comprehensive icon system with extensive built-in library."
            >
                <div className="space-y-6">
                    {/* Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="flex items-center space-x-4">
                            <Icon name="check" size="xs" />
                            <Icon name="check" size="sm" />
                            <Icon name="check" size="md" />
                            <Icon name="check" size="lg" />
                            <Icon name="check" size="xl" />
                        </div>
                        <CodeBlock>{`<Icon name="check" size="xs" />
<Icon name="check" size="sm" />
<Icon name="check" size="md" />
<Icon name="check" size="lg" />
<Icon name="check" size="xl" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Common Icons */}
                    <ExampleGroup title="Common Icons">
                        <div className="grid grid-cols-8 gap-4">
                            {[
                                'check', 'x', 'plus', 'minus', 'search', 'menu', 'settings',
                                'user', 'users', 'home', 'star', 'heart', 'edit', 'trash',
                                'download', 'upload', 'refresh', 'bell', 'info', 'warning',
                                'error', 'success', 'arrow-up', 'arrow-down'
                            ].map(iconName => (
                                <div key={iconName} className="flex flex-col items-center space-y-1 p-2 rounded hover:bg-gray-50">
                                    <Icon name={iconName} size="lg" />
                                    <span className="text-xs text-gray-500">{iconName}</span>
                                </div>
                            ))}
                        </div>
                        <CodeBlock>{`<Icon name="check" />
<Icon name="x" />
<Icon name="plus" />
<Icon name="search" />
<Icon name="user" />
<Icon name="settings" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Colors */}
                    <ExampleGroup title="Custom Colors">
                        <div className="flex items-center space-x-4">
                            <Icon name="heart" color="red" size="lg" />
                            <Icon name="star" color="yellow" size="lg" />
                            <Icon name="check" color="green" size="lg" />
                            <Icon name="info" color="blue" size="lg" />
                        </div>
                        <CodeBlock>{`<Icon name="heart" color="red" />
<Icon name="star" color="yellow" />
<Icon name="check" color="green" />
<Icon name="info" color="blue" />`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Status Component */}
            <ComponentSection 
                title="Status" 
                description="Visual status indicators with multiple display modes and animations."
            >
                <div className="space-y-6">
                    {/* Variants */}
                    <ExampleGroup title="Display Variants">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-6">
                                <Status status="active" variant="dot" />
                                <Status status="active" variant="badge" />
                                <Status status="active" variant="text" />
                                <Status status="active" variant="icon" />
                            </div>
                        </div>
                        <CodeBlock>{`<Status status="active" variant="dot" />
<Status status="active" variant="badge" />
<Status status="active" variant="text" />
<Status status="active" variant="icon" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status Types */}
                    <ExampleGroup title="Status Types">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Status status="active" variant="badge" showLabel />
                                <Status status="inactive" variant="badge" showLabel />
                                <Status status="pending" variant="badge" showLabel />
                                <Status status="success" variant="badge" showLabel />
                            </div>
                            <div className="space-y-2">
                                <Status status="error" variant="badge" showLabel />
                                <Status status="warning" variant="badge" showLabel />
                                <Status status="online" variant="badge" showLabel />
                                <Status status="offline" variant="badge" showLabel />
                            </div>
                        </div>
                        <CodeBlock>{`<Status status="active" variant="badge" showLabel />
<Status status="inactive" variant="badge" showLabel />
<Status status="pending" variant="badge" showLabel />
<Status status="success" variant="badge" showLabel />
<Status status="error" variant="badge" showLabel />
<Status status="warning" variant="badge" showLabel />
<Status status="online" variant="badge" showLabel />
<Status status="offline" variant="badge" showLabel />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Animated */}
                    <ExampleGroup title="Animated States">
                        <div className="flex items-center space-x-6">
                            <Status status="pending" variant="dot" animated />
                            <Status status="online" variant="dot" animated />
                            <Status status="active" variant="badge" animated showLabel />
                        </div>
                        <CodeBlock>{`<Status status="pending" variant="dot" animated />
<Status status="online" variant="dot" animated />
<Status status="active" variant="badge" animated showLabel />`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Tooltip Component */}
            <ComponentSection 
                title="Tooltip" 
                description="Contextual information overlays with advanced positioning."
            >
                <div className="space-y-6">
                    {/* Basic Usage */}
                    <ExampleGroup title="Basic Tooltips">
                        <div className="flex items-center justify-center space-x-8 py-8">
                            <Tooltip content="This is a tooltip" placement="top">
                                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Hover me (top)
                                </button>
                            </Tooltip>
                            <Tooltip content="Bottom tooltip" placement="bottom">
                                <button className="px-4 py-2 bg-green-500 text-white rounded">
                                    Hover me (bottom)
                                </button>
                            </Tooltip>
                            <Tooltip content="Left tooltip" placement="left">
                                <button className="px-4 py-2 bg-purple-500 text-white rounded">
                                    Hover me (left)
                                </button>
                            </Tooltip>
                            <Tooltip content="Right tooltip" placement="right">
                                <button className="px-4 py-2 bg-red-500 text-white rounded">
                                    Hover me (right)
                                </button>
                            </Tooltip>
                        </div>
                        <CodeBlock>{`<Tooltip content="This is a tooltip" placement="top">
  <button>Hover me (top)</button>
</Tooltip>
<Tooltip content="Bottom tooltip" placement="bottom">
  <button>Hover me (bottom)</button>
</Tooltip>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Triggers */}
                    <ExampleGroup title="Different Triggers">
                        <div className="flex items-center space-x-4">
                            <Tooltip content="Hover trigger" trigger="hover">
                                <button className="px-4 py-2 bg-gray-500 text-white rounded">
                                    Hover
                                </button>
                            </Tooltip>
                            <Tooltip content="Click trigger" trigger="click">
                                <button className="px-4 py-2 bg-orange-500 text-white rounded">
                                    Click  
                                </button>
                            </Tooltip>
                            <Tooltip content="Focus trigger" trigger="focus">
                                <input 
                                    className="px-3 py-2 border rounded" 
                                    placeholder="Focus me"
                                />
                            </Tooltip>
                        </div>
                        <CodeBlock>{`<Tooltip content="Hover trigger" trigger="hover">
  <button>Hover</button>
</Tooltip>
<Tooltip content="Click trigger" trigger="click">
  <button>Click</button>
</Tooltip>
<Tooltip content="Focus trigger" trigger="focus">
  <input placeholder="Focus me" />
</Tooltip>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Arrow */}
                    <ExampleGroup title="Tooltips with Arrow">
                        <div className="flex items-center justify-center space-x-8 py-8">
                            <Tooltip content="Tooltip with arrow" placement="top" arrow>
                                <button className="px-4 py-2 bg-indigo-500 text-white rounded">
                                    Arrow Top
                                </button>
                            </Tooltip>
                            <Tooltip content="Bottom arrow tooltip" placement="bottom" arrow>
                                <button className="px-4 py-2 bg-teal-500 text-white rounded">
                                    Arrow Bottom
                                </button>
                            </Tooltip>
                            <Tooltip content="Left arrow tooltip with longer text that wraps" placement="left" arrow>
                                <button className="px-4 py-2 bg-pink-500 text-white rounded">
                                    Arrow Left
                                </button>
                            </Tooltip>
                            <Tooltip content="Right arrow" placement="right" arrow>
                                <button className="px-4 py-2 bg-cyan-500 text-white rounded">
                                    Arrow Right
                                </button>
                            </Tooltip>
                        </div>
                        <CodeBlock>{`<Tooltip content="Tooltip with arrow" placement="top" arrow>
  <button>Arrow Top</button>
</Tooltip>
<Tooltip content="Long text tooltip" placement="left" arrow>
  <button>Arrow Left</button>
</Tooltip>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Edge Cases */}
                    <ExampleGroup title="Edge Cases & Long Content">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Tooltip content="This tooltip is positioned at the left edge and should stay within viewport boundaries" placement="right" arrow>
                                    <button className="px-4 py-2 bg-gray-600 text-white rounded">
                                        Left Edge
                                    </button>
                                </Tooltip>
                                <Tooltip content="This tooltip is positioned at the right edge and should adjust accordingly" placement="left" arrow>
                                    <button className="px-4 py-2 bg-gray-600 text-white rounded">
                                        Right Edge
                                    </button>
                                </Tooltip>
                            </div>
                            <div className="text-center">
                                <Tooltip content="This is a very long tooltip content that should wrap properly within the maximum width constraints and still be fully visible without being cut off by container boundaries or viewport edges. It demonstrates how the tooltip handles text overflow and positioning." placement="top" arrow>
                                    <button className="px-4 py-2 bg-purple-600 text-white rounded">
                                        Long Content Tooltip
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <CodeBlock>{`<Tooltip content="Long tooltip text..." placement="top" arrow>
  <button>Long Content</button>
</Tooltip>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Advanced Features */}
                    <ExampleGroup title="Advanced Features">
                        <div className="flex items-center justify-center space-x-6 py-8">
                            <Tooltip 
                                content="Tooltip with delay" 
                                placement="top" 
                                delay={500}
                                arrow
                            >
                                <button className="px-4 py-2 bg-yellow-500 text-white rounded">
                                    Delayed (500ms)
                                </button>
                            </Tooltip>
                            
                            <Tooltip 
                                content="This tooltip is disabled" 
                                placement="top" 
                                disabled={true}
                                arrow
                            >
                                <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed">
                                    Disabled Tooltip
                                </button>
                            </Tooltip>
                            
                            <Tooltip 
                                content={
                                    <div>
                                        <div className="font-semibold">Rich Content</div>
                                        <div className="text-xs opacity-75">HTML content works too!</div>
                                    </div>
                                } 
                                placement="bottom" 
                                arrow
                            >
                                <button className="px-4 py-2 bg-green-600 text-white rounded">
                                    Rich Content
                                </button>
                            </Tooltip>
                        </div>
                        <CodeBlock>{`<Tooltip content="Delayed tooltip" delay={500} arrow>
  <button>Delayed (500ms)</button>
</Tooltip>

<Tooltip content="Rich content" disabled={true}>
  <button>Disabled</button>
</Tooltip>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Label Component */}
            <ComponentSection 
                title="Label" 
                description="Form field labels with accessibility and status indicators."
            >
                <div className="space-y-6">
                    {/* Basic Labels */}
                    <ExampleGroup title="Basic Labels">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <input id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <Label htmlFor="password" required>Password</Label>
                                <input id="password" type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div>
                                <Label htmlFor="bio" optional>Bio</Label>
                                <textarea id="bio" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                        <CodeBlock>{`<Label htmlFor="email">Email Address</Label>
<Label htmlFor="password" required>Password</Label>
<Label htmlFor="bio" optional>Bio</Label>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status Colors */}
                    <ExampleGroup title="Status Colors">
                        <div className="space-y-4">
                            <Label color="default">Default Label</Label>
                            <Label color="error">Error Label</Label>
                            <Label color="warning">Warning Label</Label>
                            <Label color="success">Success Label</Label>
                            <Label color="muted">Muted Label</Label>
                        </div>
                        <CodeBlock>{`<Label color="default">Default Label</Label>
<Label color="error">Error Label</Label>
<Label color="warning">Warning Label</Label>
<Label color="success">Success Label</Label>
<Label color="muted">Muted Label</Label>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Sizes and Weights */}
                    <ExampleGroup title="Sizes and Weights">
                        <div className="space-y-4">
                            <Label size="sm" weight="normal">Small Normal</Label>
                            <Label size="md" weight="medium">Medium Medium</Label>
                            <Label size="lg" weight="semibold">Large Semibold</Label>
                            <Label size="lg" weight="bold">Large Bold</Label>
                        </div>
                        <CodeBlock>{`<Label size="sm" weight="normal">Small Normal</Label>
<Label size="md" weight="medium">Medium Medium</Label>
<Label size="lg" weight="semibold">Large Semibold</Label>
<Label size="lg" weight="bold">Large Bold</Label>`}</CodeBlock>
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

export default AtomsDisplayPage;