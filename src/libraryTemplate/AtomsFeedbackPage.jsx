import React, { useState } from 'react';
import { 
    Alert, 
    LoadingState,
    Modal,
    Spinner,
    Toast,
    // ToastContainer
} from '../components/atoms';

const AtomsFeedbackPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [showSlider, setShowSlider] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const showToast = (variant, message) => {
        const id = Date.now();
        const toast = { id, variant, message };
        setToasts(prev => [...prev, toast]);
        
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const simulateLoading = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Atoms</h1>
                <h2 className="text-xl text-gray-600 mb-4">Feedback Components</h2>
                <p className="text-gray-600">
                    Components for providing user feedback, loading states, and important notifications.
                </p>
            </div>

            {/* Alert Component */}
            <ComponentSection 
                title="Alert" 
                description="Important messages and notifications with different severity levels."
            >
                <div className="space-y-6">
                    {/* Basic Variants */}
                    <ExampleGroup title="Alert Variants">
                        <div className="space-y-4">
                            <Alert variant="info" title="Information">
                                This is an informational alert with additional context.
                            </Alert>
                            <Alert variant="success" title="Success">
                                Your changes have been saved successfully.
                            </Alert>
                            <Alert variant="warning" title="Warning">
                                Please review your input before proceeding.
                            </Alert>
                            <Alert variant="error" title="Error">
                                An error occurred while processing your request.
                            </Alert>
                        </div>
                        <CodeBlock>{`<Alert variant="info" title="Information">
  This is an informational alert.
</Alert>
<Alert variant="success" title="Success">
  Your changes have been saved successfully.
</Alert>
<Alert variant="warning" title="Warning">
  Please review your input before proceeding.
</Alert>
<Alert variant="error" title="Error">
  An error occurred while processing your request.
</Alert>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Severity Levels */}
                    <ExampleGroup title="Severity Levels">
                        <div className="space-y-4">
                            <Alert variant="warning" severity="low" title="Low Priority">
                                This is a low priority warning message.
                            </Alert>
                            <Alert variant="warning" severity="medium" title="Medium Priority">
                                This is a medium priority warning message.
                            </Alert>
                            <Alert variant="warning" severity="high" title="High Priority">
                                This is a high priority warning message.
                            </Alert>
                            <Alert variant="error" severity="critical" title="Critical Alert">
                                This is a critical error that needs immediate attention.
                            </Alert>
                        </div>
                        <CodeBlock>{`<Alert variant="warning" severity="low" title="Low Priority">
  This is a low priority warning message.
</Alert>
<Alert variant="warning" severity="high" title="High Priority">
  This is a high priority warning message.
</Alert>
<Alert variant="error" severity="critical" title="Critical Alert">
  This is a critical error that needs immediate attention.
</Alert>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Dismissible Alerts */}
                    <ExampleGroup title="Dismissible Alerts">
                        <div className="space-y-4">
                            <Alert 
                                variant="info" 
                                title="Dismissible Alert"
                                dismissible
                                onDismiss={() => console.log('Alert dismissed')}
                            >
                                This alert can be dismissed by clicking the close button.
                            </Alert>
                            <Alert 
                                variant="success" 
                                dismissible
                                showIcon
                            >
                                Alert with icon and dismiss functionality.
                            </Alert>
                        </div>
                        <CodeBlock>{`<Alert 
  variant="info" 
  title="Dismissible Alert"
  dismissible
  onDismiss={() => console.log('dismissed')}
>
  This alert can be dismissed.
</Alert>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Banner Style */}
                    <ExampleGroup title="Banner Style">
                        <Alert 
                            variant="warning" 
                            banner
                            title="System Maintenance"
                            showIcon
                        >
                            Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM PST.
                        </Alert>
                        <CodeBlock>{`<Alert 
  variant="warning" 
  banner
  title="System Maintenance"
  showIcon
>
  Scheduled maintenance will occur tonight.
</Alert>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Actions */}
                    <ExampleGroup title="With Actions">
                        <Alert 
                            variant="info" 
                            title="New Feature Available"
                            actions={[
                                { label: 'Learn More', onClick: () => console.log('Learn more clicked') },
                                { label: 'Dismiss', variant: 'secondary', onClick: () => console.log('Dismissed') }
                            ]}
                        >
                            We've added new collaboration features to help your team work better together.
                        </Alert>
                        <CodeBlock>{`<Alert 
  variant="info" 
  title="New Feature Available"
  actions={[
    { label: 'Learn More', onClick: handleLearnMore },
    { label: 'Dismiss', variant: 'secondary', onClick: handleDismiss }
  ]}
>
  We've added new collaboration features.
</Alert>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Spinner Component */}
            <ComponentSection 
                title="Spinner" 
                description="Loading spinners with different sizes, colors, and speeds."
            >
                <div className="space-y-6">
                    {/* Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <Spinner size="xs" />
                                <div className="text-xs text-gray-500 mt-1">XS</div>
                            </div>
                            <div className="text-center">
                                <Spinner size="sm" />
                                <div className="text-xs text-gray-500 mt-1">SM</div>
                            </div>
                            <div className="text-center">
                                <Spinner size="md" />
                                <div className="text-xs text-gray-500 mt-1">MD</div>
                            </div>
                            <div className="text-center">
                                <Spinner size="lg" />
                                <div className="text-xs text-gray-500 mt-1">LG</div>
                            </div>
                            <div className="text-center">
                                <Spinner size="xl" />
                                <div className="text-xs text-gray-500 mt-1">XL</div>
                            </div>
                        </div>
                        <CodeBlock>{`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Colors */}
                    <ExampleGroup title="Colors">
                        <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <Spinner color="primary" />
                                <div className="text-xs text-gray-500 mt-1">Primary</div>
                            </div>
                            <div className="text-center">
                                <Spinner color="success" />
                                <div className="text-xs text-gray-500 mt-1">Success</div>
                            </div>
                            <div className="text-center">
                                <Spinner color="warning" />
                                <div className="text-xs text-gray-500 mt-1">Warning</div>
                            </div>
                            <div className="text-center">
                                <Spinner color="danger" />
                                <div className="text-xs text-gray-500 mt-1">Danger</div>
                            </div>
                            <div className="text-center bg-gray-800 p-2 rounded">
                                <Spinner color="white" />
                                <div className="text-xs text-white mt-1">White</div>
                            </div>
                        </div>
                        <CodeBlock>{`<Spinner color="primary" />
<Spinner color="success" />
<Spinner color="warning" />
<Spinner color="danger" />
<Spinner color="white" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Speed and Thickness */}
                    <ExampleGroup title="Speed and Thickness">
                        <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <Spinner speed="slow" />
                                <div className="text-xs text-gray-500 mt-1">Slow</div>
                            </div>
                            <div className="text-center">
                                <Spinner speed="normal" />
                                <div className="text-xs text-gray-500 mt-1">Normal</div>
                            </div>
                            <div className="text-center">
                                <Spinner speed="fast" />
                                <div className="text-xs text-gray-500 mt-1">Fast</div>
                            </div>
                            <div className="text-center">
                                <Spinner thickness={2} />
                                <div className="text-xs text-gray-500 mt-1">Thin</div>
                            </div>
                            <div className="text-center">
                                <Spinner thickness={6} />
                                <div className="text-xs text-gray-500 mt-1">Thick</div>
                            </div>
                        </div>
                        <CodeBlock>{`<Spinner speed="slow" />
<Spinner speed="normal" />
<Spinner speed="fast" />
<Spinner thickness={2} />
<Spinner thickness={6} />`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Labels */}
                    <ExampleGroup title="With Labels">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Spinner />
                                <span className="text-gray-600">Loading...</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Spinner color="success" />
                                <span className="text-gray-600">Processing your request...</span>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Spinner size="lg" />
                                <div className="mt-2 text-gray-600">Please wait while we load your data</div>
                            </div>
                        </div>
                        <CodeBlock>{`<div className="flex items-center space-x-3">
  <Spinner />
  <span>Loading...</span>
</div>

<div className="text-center">
  <Spinner size="lg" />
  <div className="mt-2">Please wait while we load your data</div>
</div>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* LoadingState Component */}
            <ComponentSection 
                title="LoadingState" 
                description="Comprehensive loading states with overlay and fullscreen options."
            >
                <div className="space-y-6">
                    {/* Basic Loading States */}
                    <ExampleGroup title="Basic Loading States">
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <LoadingState 
                                    loading={true}
                                    text="Loading content..."
                                    size="md"
                                >
                                    <div className="p-8 text-center text-gray-500">
                                        Content will appear here when loaded
                                    </div>
                                </LoadingState>
                            </div>
                            
                            <div className="flex space-x-4">
                                <button 
                                    onClick={simulateLoading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Simulate Loading
                                </button>
                                <LoadingState 
                                    loading={loading}
                                    overlay
                                    text="Processing..."
                                    description="This may take a few moments"
                                >
                                    <div className="p-8 bg-white border rounded-lg text-center">
                                        <h3 className="text-lg font-medium mb-2">Sample Content</h3>
                                        <p className="text-gray-600">
                                            This content will be overlaid with a loading state when the button is clicked.
                                        </p>
                                    </div>
                                </LoadingState>
                            </div>
                        </div>
                        <CodeBlock>{`<LoadingState 
  loading={true}
  text="Loading content..."
  size="md"
>
  <div>Content will appear here when loaded</div>
</LoadingState>

<LoadingState 
  loading={loading}
  overlay
  text="Processing..."
  description="This may take a few moments"
>
  <div>Your content here</div>
</LoadingState>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Different Sizes */}
                    <ExampleGroup title="Sizes">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <LoadingState loading={true} size="sm" text="Small" />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <LoadingState loading={true} size="md" text="Medium" />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <LoadingState loading={true} size="lg" text="Large" />
                            </div>
                        </div>
                        <CodeBlock>{`<LoadingState loading={true} size="sm" text="Small" />
<LoadingState loading={true} size="md" text="Medium" />
<LoadingState loading={true} size="lg" text="Large" />`}</CodeBlock>
                    </ExampleGroup>

                    {/* Fullscreen Loading */}
                    <ExampleGroup title="Fullscreen Loading">
                        <button 
                            onClick={() => {
                                // This would typically show a fullscreen loading state
                                alert('Fullscreen loading would be shown here');
                            }}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            Show Fullscreen Loading
                        </button>
                        <CodeBlock>{`<LoadingState 
  loading={true}
  fullScreen
  text="Loading application..."
  description="Please wait while we prepare everything for you"
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Modal Component */}
            <ComponentSection 
                title="Modal" 
                description="Dialog and drawer interfaces with different positions and sizes."
            >
                <div className="space-y-6">
                    {/* Basic Modal Variants */}
                    <ExampleGroup title="Modal Variants">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Confirmation Modal</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <button 
                                        onClick={() => setShowModal(true)}
                                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Delete Confirmation
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Centered modal with backdrop</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Settings Panel</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <button 
                                        onClick={() => setShowSlider(true)}
                                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Account Settings
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Slides in from the right side</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h5 className="text-sm font-medium text-gray-700">Loading Modal</h5>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <button 
                                        onClick={() => {
                                            setShowLoadingModal(true);
                                            setTimeout(() => setShowLoadingModal(false), 3000);
                                        }}
                                        className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                                    >
                                        Processing Task
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">Modal with loading state</p>
                                </div>
                            </div>
                        </div>
                        
                        <Modal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            title="Delete Confirmation"
                            size="md"
                            closable
                            maskClosable
                            footer={
                                <div className="flex justify-end space-x-3">
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            }
                        >
                            <div className="py-2">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-900 text-center mb-2">
                                    Are you sure you want to delete this project?
                                </p>
                                <p className="text-gray-600 text-center text-sm">
                                    This action cannot be undone. All associated data will be permanently removed from our servers.
                                </p>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={showSlider}
                            onClose={() => setShowSlider(false)}
                            variant="slider"
                            slideDirection="right"
                            title="Account Settings"
                            size="lg"
                            footer={
                                <div className="flex justify-between">
                                    <button 
                                        onClick={() => setShowSlider(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <div className="space-x-3">
                                        <button 
                                            onClick={() => setShowSlider(false)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button 
                                            onClick={() => setShowSlider(false)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            }
                        >
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input 
                                                type="text" 
                                                defaultValue="John Doe"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input 
                                                type="email" 
                                                defaultValue="john@example.com"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Preferences</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Theme
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                                <option>Light</option>
                                                <option>Dark</option>
                                                <option>Auto</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Language
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                id="notifications"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">
                                                Enable email notifications
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>

                        <Modal
                            isOpen={showLoadingModal}
                            onClose={() => setShowLoadingModal(false)}
                            title="Processing Request"
                            size="sm"
                            closable={false}
                            maskClosable={false}
                            loading={true}
                        >
                            <div className="py-4 text-center">
                                <p className="text-gray-600 mb-4">
                                    Please wait while we process your request...
                                </p>
                                <p className="text-sm text-gray-500">
                                    This may take a few moments.
                                </p>
                            </div>
                        </Modal>

                        <CodeBlock>{`// Confirmation Modal
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Delete Confirmation"
  size="md"
  closable
  maskClosable
  footer={
    <div className="flex justify-end space-x-3">
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  }
>
  <div className="py-2">
    <p>Are you sure you want to delete this project?</p>
  </div>
</Modal>

// Settings Slider Panel
<Modal
  isOpen={showSlider}
  onClose={() => setShowSlider(false)}
  variant="slider"
  slideDirection="right"
  title="Account Settings"
  size="lg"
  footer={footerContent}
>
  <div className="space-y-6">
    {/* Settings form content */}
  </div>
</Modal>

// Loading Modal
<Modal
  isOpen={showLoadingModal}
  onClose={() => setShowLoadingModal(false)}
  title="Processing Request"
  size="sm"
  closable={false}
  maskClosable={false}
  loading={true}
>
  <div className="py-4 text-center">
    <p>Please wait while we process your request...</p>
  </div>
</Modal>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Modal Sizes */}
                    <ExampleGroup title="Modal Sizes">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
                                <div key={size} className="space-y-2">
                                    <h5 className="text-xs font-medium text-gray-700 text-center">{size.toUpperCase()}</h5>
                                    <div className="p-2 bg-gray-50 rounded-lg">
                                        <button 
                                            className="w-full px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                                            onClick={() => alert(`${size.toUpperCase()} modal would be shown with appropriate content width`)}
                                        >
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <CodeBlock>{`// Different modal sizes
<Modal size="xs">Extra Small (max-w-xs)</Modal>
<Modal size="sm">Small (max-w-sm)</Modal>
<Modal size="md">Medium (max-w-md)</Modal>
<Modal size="lg">Large (max-w-lg)</Modal>
<Modal size="xl">Extra Large (max-w-xl)</Modal>
<Modal size="2xl">2X Large (max-w-2xl)</Modal>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Modal Positions */}
                    <ExampleGroup title="Modal Positions">
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { pos: 'top', label: 'Top' },
                                { pos: 'center', label: 'Center' },
                                { pos: 'bottom', label: 'Bottom' }
                            ].map(({pos, label}) => (
                                <div key={pos} className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700 text-center">{label}</h5>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <button 
                                            className="w-full px-3 py-2 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                                            onClick={() => alert(`Modal would appear at ${pos} position`)}
                                        >
                                            Show {label} Modal
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <CodeBlock>{`<Modal position="top">Top positioned modal</Modal>
<Modal position="center">Center positioned modal</Modal>
<Modal position="bottom">Bottom positioned modal</Modal>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Slider Directions */}
                    <ExampleGroup title="Slider Directions">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { dir: 'left', label: 'Left', color: 'bg-indigo-500 hover:bg-indigo-600' },
                                { dir: 'right', label: 'Right', color: 'bg-green-500 hover:bg-green-600' },
                                { dir: 'top', label: 'Top', color: 'bg-yellow-500 hover:bg-yellow-600' },
                                { dir: 'bottom', label: 'Bottom', color: 'bg-red-500 hover:bg-red-600' }
                            ].map(({dir, label, color}) => (
                                <div key={dir} className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700 text-center">From {label}</h5>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <button 
                                            className={`w-full px-3 py-2 text-sm text-white rounded transition-colors ${color}`}
                                            onClick={() => alert(`Slider would slide in from ${dir}`)}
                                        >
                                            Slide {label}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <CodeBlock>{`<Modal variant="slider" slideDirection="left">Slides from left</Modal>
<Modal variant="slider" slideDirection="right">Slides from right</Modal>
<Modal variant="slider" slideDirection="top">Slides from top</Modal>
<Modal variant="slider" slideDirection="bottom">Slides from bottom</Modal>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Toast Component */}
            <ComponentSection 
                title="Toast" 
                description="Temporary notifications that appear and disappear automatically."
            >
                <div className="space-y-6">
                    <ExampleGroup title="Toast Variants">
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => showToast('info', 'This is an information toast')}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Info Toast
                            </button>
                            <button 
                                onClick={() => showToast('success', 'Operation completed successfully!')}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Success Toast
                            </button>
                            <button 
                                onClick={() => showToast('warning', 'Please check your input')}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Warning Toast
                            </button>
                            <button 
                                onClick={() => showToast('error', 'An error occurred')}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Error Toast
                            </button>
                        </div>
                        
                        <CodeBlock>{`// Show toast notifications
showToast('info', 'This is an information toast');
showToast('success', 'Operation completed successfully!');
showToast('warning', 'Please check your input');
showToast('error', 'An error occurred');

// Toast component usage
<Toast 
  variant="success"
  duration={4000}
  closable
  onClose={handleClose}
>
  Your message has been sent!
</Toast>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Toast Positions */}
                    <ExampleGroup title="Toast Positions">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {[
                                'top-left', 'top-center', 'top-right',
                                'bottom-left', 'bottom-center', 'bottom-right'
                            ].map(position => (
                                <button 
                                    key={position}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                    onClick={() => alert(`Toast would appear at ${position}`)}
                                >
                                    {position}
                                </button>
                            ))}
                        </div>
                        <CodeBlock>{`<Toast position="top-right">Top Right Toast</Toast>
<Toast position="bottom-center">Bottom Center Toast</Toast>
<Toast position="top-left">Top Left Toast</Toast>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* Toast Container */}
            {/* <ToastContainer>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        variant={toast.variant}
                        duration={4000}
                        closable
                        onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                    >
                        {toast.message}
                    </Toast>
                ))}
            </ToastContainer> */}
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

export default AtomsFeedbackPage;