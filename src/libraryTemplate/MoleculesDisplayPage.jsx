import React, { useState } from 'react';
import { 
    MetricCard,
    ProgressTracker,
    StatusCard,
    SummaryPanel
} from '../components/molecules';

const MoleculesDisplayPage = () => {
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    // Sample data for components
    const salesMetric = {
        value: 245680,
        format: 'currency',
        unit: 'USD',
        prefix: '$'
    };

    const conversionMetric = {
        value: 23.4,
        format: 'percentage',
        suffix: '%'
    };

    const progressSteps = [
        { id: 'step1', label: 'Project Planning', status: 'completed', description: 'Initial project setup and planning' },
        { id: 'step2', label: 'Design Phase', status: 'completed', description: 'UI/UX design and wireframes' },
        { id: 'step3', label: 'Development', status: 'active', description: 'Frontend and backend development' },
        { id: 'step4', label: 'Testing', status: 'pending', description: 'Quality assurance and testing' },
        { id: 'step5', label: 'Deployment', status: 'pending', description: 'Production deployment' }
    ];

    const summaryData = {
        title: 'Monthly Report Summary',
        description: 'Overview of key metrics and performance indicators for this month',
        metrics: [
            { label: 'Total Revenue', value: '$123,456', change: '+12.5%', trend: 'up' },
            { label: 'New Customers', value: '1,234', change: '+8.2%', trend: 'up' },
            { label: 'Active Users', value: '45,678', change: '-2.1%', trend: 'down' },
            { label: 'Conversion Rate', value: '3.4%', change: '+0.5%', trend: 'up' }
        ],
        actions: [
            { label: 'View Full Report', variant: 'primary', onClick: () => console.log('View report') },
            { label: 'Export Data', variant: 'secondary', onClick: () => console.log('Export') }
        ]
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Molecules</h1>
                <h2 className="text-xl text-gray-600 mb-4">Display Components</h2>
                <p className="text-gray-600">
                    Composite display components that combine multiple atoms to show complex information, 
                    metrics, and status indicators.
                </p>
            </div>

            {/* MetricCard Component */}
            <ComponentSection 
                title="MetricCard" 
                description="KPI and metrics display with trends, comparisons, and interactive features."
            >
                <div className="space-y-6">
                    {/* Basic Metrics */}
                    <ExampleGroup title="Basic Metrics">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                title="Total Sales"
                                metric={salesMetric}
                                trend={{ direction: 'up', percentage: 12.5 }}
                                variant="default"
                            />
                            <MetricCard
                                title="Conversion Rate"
                                metric={conversionMetric}
                                trend={{ direction: 'up', percentage: 2.3 }}
                                variant="outlined"
                            />
                            <MetricCard
                                title="Active Users"
                                metric={{ value: 45678, format: 'number' }}
                                trend={{ direction: 'down', percentage: 1.2 }}
                                status="warning"
                                variant="filled"
                            />
                            <MetricCard
                                title="Server Uptime"
                                metric={{ value: 99.9, format: 'percentage', suffix: '%' }}
                                status="excellent"
                                variant="gradient"
                            />
                        </div>
                        <CodeBlock>{`<MetricCard
  title="Total Sales"
  metric={{
    value: 245680,
    format: 'currency',
    unit: 'USD',
    prefix: '$'
  }}
  trend={{ direction: 'up', percentage: 12.5 }}
  variant="default"
/>

<MetricCard
  title="Conversion Rate"
  metric={{
    value: 23.4,
    format: 'percentage',
    suffix: '%'
  }}
  trend={{ direction: 'up', percentage: 2.3 }}
  variant="outlined"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status-based Metrics */}
                    <ExampleGroup title="Status-based Metrics">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard
                                title="System Health"
                                metric={{ value: 98.5, format: 'percentage', suffix: '%' }}
                                status="excellent"
                                variant="filled"
                            />
                            <MetricCard
                                title="Response Time"
                                metric={{ value: 245, format: 'number', suffix: 'ms' }}
                                status="normal"
                                threshold={{ warning: 300, critical: 500 }}
                            />
                            <MetricCard
                                title="Error Rate"
                                metric={{ value: 0.8, format: 'percentage', suffix: '%' }}
                                status="warning"
                                threshold={{ warning: 1, critical: 2 }}
                            />
                            <MetricCard
                                title="Disk Usage"
                                metric={{ value: 85, format: 'percentage', suffix: '%' }}
                                status="critical"
                                threshold={{ warning: 70, critical: 85 }}
                            />
                        </div>
                        <CodeBlock>{`<MetricCard
  title="System Health"
  metric={{ value: 98.5, format: 'percentage', suffix: '%' }}
  status="excellent"
  variant="filled"
/>

<MetricCard
  title="Error Rate"
  metric={{ value: 0.8, format: 'percentage', suffix: '%' }}
  status="warning"
  threshold={{ warning: 1, critical: 2 }}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* With Targets and Comparisons */}
                    <ExampleGroup title="With Targets and Comparisons">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <MetricCard
                                title="Monthly Goal"
                                metric={{ value: 75, format: 'percentage', suffix: '%' }}
                                target={{ value: 100, label: 'Target: 100%' }}
                                comparison={{ 
                                    previous: 65, 
                                    label: 'vs last month',
                                    format: 'percentage'
                                }}
                                variant="outlined"
                            />
                            <MetricCard
                                title="Quarter Performance"
                                metric={{ value: 1250000, format: 'currency', prefix: '$' }}
                                target={{ 
                                    value: 1500000, 
                                    label: 'Q4 Target: $1.5M',
                                    showProgress: true
                                }}
                                comparison={{ 
                                    previous: 1100000, 
                                    label: 'vs Q3',
                                    format: 'currency'
                                }}
                            />
                        </div>
                        <CodeBlock>{`<MetricCard
  title="Monthly Goal"
  metric={{ value: 75, format: 'percentage', suffix: '%' }}
  target={{ value: 100, label: 'Target: 100%' }}
  comparison={{ 
    previous: 65, 
    label: 'vs last month',
    format: 'percentage'
  }}
/>

<MetricCard
  title="Quarter Performance"
  metric={{ value: 1250000, format: 'currency', prefix: '$' }}
  target={{ 
    value: 1500000, 
    label: 'Q4 Target: $1.5M',
    showProgress: true
  }}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Interactive Metrics */}
                    <ExampleGroup title="Interactive Metrics">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MetricCard
                                title="Real-time Data"
                                metric={{ value: 1234, format: 'number' }}
                                refreshable
                                loading={refreshing}
                                onRefresh={handleRefresh}
                            />
                            <MetricCard
                                title="Clickable Metric"
                                metric={{ value: 5678, format: 'number' }}
                                clickable
                                onClick={() => alert('Metric clicked!')}
                            />
                            <MetricCard
                                title="With Actions"
                                metric={{ value: 42, format: 'number', suffix: ' items' }}
                                actions={[
                                    { label: 'View Details', onClick: () => console.log('Details') },
                                    { label: 'Export', onClick: () => console.log('Export') }
                                ]}
                            />
                        </div>
                        <CodeBlock>{`<MetricCard
  title="Real-time Data"
  metric={{ value: 1234, format: 'number' }}
  refreshable
  loading={refreshing}
  onRefresh={handleRefresh}
/>

<MetricCard
  title="Clickable Metric"
  metric={{ value: 5678, format: 'number' }}
  clickable
  onClick={() => alert('Metric clicked!')}
/>

<MetricCard
  title="With Actions"
  metric={{ value: 42, format: 'number', suffix: ' items' }}
  actions={[
    { label: 'View Details', onClick: () => console.log('Details') },
    { label: 'Export', onClick: () => console.log('Export') }
  ]}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* ProgressTracker Component */}
            <ComponentSection 
                title="ProgressTracker" 
                description="Visual progress tracking with step-by-step indicators and descriptions."
            >
                <div className="space-y-6">
                    {/* Basic Progress Tracker */}
                    <ExampleGroup title="Basic Progress Tracker">
                        <ProgressTracker
                            steps={progressSteps}
                            orientation="horizontal"
                            variant="default"
                        />
                        <CodeBlock>{`const progressSteps = [
  { id: 'step1', label: 'Project Planning', status: 'completed', description: 'Initial project setup' },
  { id: 'step2', label: 'Design Phase', status: 'completed', description: 'UI/UX design and wireframes' },
  { id: 'step3', label: 'Development', status: 'active', description: 'Frontend and backend development' },
  { id: 'step4', label: 'Testing', status: 'pending', description: 'Quality assurance and testing' },
  { id: 'step5', label: 'Deployment', status: 'pending', description: 'Production deployment' }
];

<ProgressTracker
  steps={progressSteps}
  orientation="horizontal"
  variant="default"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Vertical Progress Tracker */}
                    <ExampleGroup title="Vertical Progress Tracker">
                        <div className="max-w-md">
                            <ProgressTracker
                                steps={progressSteps}
                                orientation="vertical"
                                variant="detailed"
                                showDescriptions
                            />
                        </div>
                        <CodeBlock>{`<ProgressTracker
  steps={progressSteps}
  orientation="vertical"
  variant="detailed"
  showDescriptions
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Different Variants */}
                    <ExampleGroup title="Different Variants">
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Minimal Variant</h5>
                                <ProgressTracker
                                    steps={progressSteps.slice(0, 4)}
                                    variant="minimal"
                                    orientation="horizontal"
                                />
                            </div>
                            
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Numbered Variant</h5>
                                <ProgressTracker
                                    steps={progressSteps.slice(0, 4)}
                                    variant="numbered"
                                    orientation="horizontal"
                                />
                            </div>
                            
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">With Icons</h5>
                                <ProgressTracker
                                    steps={[
                                        { id: 'plan', label: 'Planning', status: 'completed', icon: 'clipboard' },
                                        { id: 'design', label: 'Design', status: 'completed', icon: 'paint-brush' },
                                        { id: 'develop', label: 'Development', status: 'active', icon: 'code' },
                                        { id: 'test', label: 'Testing', status: 'pending', icon: 'check-circle' },
                                        { id: 'deploy', label: 'Deployment', status: 'pending', icon: 'rocket' }
                                    ]}
                                    variant="icons"
                                    orientation="horizontal"
                                />
                            </div>
                        </div>
                        <CodeBlock>{`<ProgressTracker steps={steps} variant="minimal" />
<ProgressTracker steps={steps} variant="numbered" />
<ProgressTracker 
  steps={stepsWithIcons} 
  variant="icons" 
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Interactive Progress Tracker */}
                    <ExampleGroup title="Interactive Progress Tracker">
                        <ProgressTracker
                            steps={progressSteps}
                            orientation="horizontal"
                            clickable
                            onStepClick={(step) => console.log('Step clicked:', step)}
                            showProgress
                        />
                        <CodeBlock>{`<ProgressTracker
  steps={progressSteps}
  orientation="horizontal"
  clickable
  onStepClick={(step) => console.log('Step clicked:', step)}
  showProgress
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* StatusCard Component */}
            <ComponentSection 
                title="StatusCard" 
                description="Status display cards with indicators, messages, and action buttons."
            >
                <div className="space-y-6">
                    {/* Basic Status Cards */}
                    <ExampleGroup title="Basic Status Cards">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatusCard
                                status="success"
                                title="System Online"
                                message="All systems are operating normally"
                                variant="default"
                            />
                            <StatusCard
                                status="warning"
                                title="Maintenance Mode"
                                message="Scheduled maintenance in progress"
                                variant="outlined"
                            />
                            <StatusCard
                                status="error"
                                title="Service Down"
                                message="Database connection failed"
                                variant="filled"
                            />
                            <StatusCard
                                status="info"
                                title="Update Available"
                                message="New version 2.1.0 is available"
                                variant="minimal"
                            />
                        </div>
                        <CodeBlock>{`<StatusCard
  status="success"
  title="System Online"
  message="All systems are operating normally"
  variant="default"
/>

<StatusCard
  status="warning"
  title="Maintenance Mode"
  message="Scheduled maintenance in progress"
  variant="outlined"
/>

<StatusCard
  status="error"
  title="Service Down"
  message="Database connection failed"
  variant="filled"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Status Cards with Actions */}
                    <ExampleGroup title="Status Cards with Actions">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatusCard
                                status="warning"
                                title="Storage Almost Full"
                                message="80% of storage capacity has been used. Consider upgrading your plan."
                                actions={[
                                    { label: 'Upgrade Plan', variant: 'primary', onClick: () => console.log('Upgrade') },
                                    { label: 'Manage Files', variant: 'secondary', onClick: () => console.log('Manage') }
                                ]}
                            />
                            <StatusCard
                                status="info"
                                title="Backup Completed"
                                message="Daily backup completed successfully at 3:00 AM."
                                timestamp="2 hours ago"
                                actions={[
                                    { label: 'View Details', variant: 'outline', onClick: () => console.log('Details') }
                                ]}
                            />
                        </div>
                        <CodeBlock>{`<StatusCard
  status="warning"
  title="Storage Almost Full"
  message="80% of storage capacity has been used."
  actions={[
    { label: 'Upgrade Plan', variant: 'primary', onClick: handleUpgrade },
    { label: 'Manage Files', variant: 'secondary', onClick: handleManage }
  ]}
/>

<StatusCard
  status="info"
  title="Backup Completed"
  message="Daily backup completed successfully."
  timestamp="2 hours ago"
  actions={[
    { label: 'View Details', variant: 'outline', onClick: handleDetails }
  ]}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Dismissible Status Cards */}
                    <ExampleGroup title="Dismissible Status Cards">
                        <div className="space-y-4">
                            <StatusCard
                                status="success"
                                title="Welcome!"
                                message="Your account has been successfully created."
                                dismissible
                                onDismiss={() => console.log('Dismissed')}
                            />
                            <StatusCard
                                status="info"
                                title="New Feature"
                                message="Try our new dashboard analytics feature."
                                dismissible
                                persistent={false}
                                autoClose={5000}
                                onDismiss={() => console.log('Auto dismissed')}
                            />
                        </div>
                        <CodeBlock>{`<StatusCard
  status="success"
  title="Welcome!"
  message="Your account has been successfully created."
  dismissible
  onDismiss={() => console.log('Dismissed')}
/>

<StatusCard
  status="info"
  title="New Feature"
  message="Try our new dashboard analytics feature."
  dismissible
  autoClose={5000}
  onDismiss={() => console.log('Auto dismissed')}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Custom Status Cards */}
                    <ExampleGroup title="Custom Status Cards">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatusCard
                                status="custom"
                                title="Custom Status"
                                message="This card uses custom styling and colors."
                                customColor="#6366f1"
                                icon="star"
                            />
                            <StatusCard
                                status="pending"
                                title="Processing Request"
                                message="Your request is being processed..."
                                loading
                                progress={65}
                            />
                        </div>
                        <CodeBlock>{`<StatusCard
  status="custom"
  title="Custom Status"
  message="This card uses custom styling."
  customColor="#6366f1"
  icon="star"
/>

<StatusCard
  status="pending"
  title="Processing Request"
  message="Your request is being processed..."
  loading
  progress={65}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* SummaryPanel Component */}
            <ComponentSection 
                title="SummaryPanel" 
                description="Comprehensive summary panels with metrics, charts, and action buttons."
            >
                <div className="space-y-6">
                    {/* Basic Summary Panel */}
                    <ExampleGroup title="Basic Summary Panel">
                        <SummaryPanel
                            title={summaryData.title}
                            description={summaryData.description}
                            metrics={summaryData.metrics}
                            actions={summaryData.actions}
                            variant="default"
                        />
                        <CodeBlock>{`const summaryData = {
  title: 'Monthly Report Summary',
  description: 'Overview of key metrics and performance indicators',
  metrics: [
    { label: 'Total Revenue', value: '$123,456', change: '+12.5%', trend: 'up' },
    { label: 'New Customers', value: '1,234', change: '+8.2%', trend: 'up' },
    { label: 'Active Users', value: '45,678', change: '-2.1%', trend: 'down' },
    { label: 'Conversion Rate', value: '3.4%', change: '+0.5%', trend: 'up' }
  ],
  actions: [
    { label: 'View Full Report', variant: 'primary', onClick: handleViewReport },
    { label: 'Export Data', variant: 'secondary', onClick: handleExport }
  ]
};

<SummaryPanel
  title={summaryData.title}
  description={summaryData.description}
  metrics={summaryData.metrics}
  actions={summaryData.actions}
  variant="default"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact Summary Panel */}
                    <ExampleGroup title="Compact Summary Panel">
                        <SummaryPanel
                            title="Quick Stats"
                            metrics={summaryData.metrics.slice(0, 2)}
                            variant="compact"
                            layout="horizontal"
                        />
                        <CodeBlock>{`<SummaryPanel
  title="Quick Stats"
  metrics={metrics.slice(0, 2)}
  variant="compact"
  layout="horizontal"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Summary Panel with Chart */}
                    <ExampleGroup title="Summary Panel with Visualization">
                        <SummaryPanel
                            title="Performance Overview"
                            description="Monthly performance trends and key insights"
                            metrics={[
                                { label: 'This Month', value: '$45,678', change: '+15.3%', trend: 'up' },
                                { label: 'Last Month', value: '$39,542', change: '+8.7%', trend: 'up' }
                            ]}
                            chart={{
                                type: 'line',
                                data: [
                                    { month: 'Jan', value: 30000 },
                                    { month: 'Feb', value: 35000 },
                                    { month: 'Mar', value: 32000 },
                                    { month: 'Apr', value: 39542 },
                                    { month: 'May', value: 45678 }
                                ]
                            }}
                            actions={[
                                { label: 'View Trends', variant: 'primary' },
                                { label: 'Download Report', variant: 'outline' }
                            ]}
                        />
                        <CodeBlock>{`<SummaryPanel
  title="Performance Overview"
  description="Monthly performance trends and key insights"
  metrics={metrics}
  chart={{
    type: 'line',
    data: chartData
  }}
  actions={actions}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Summary Panel Variants */}
                    <ExampleGroup title="Different Variants">
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Card Variant</h5>
                                <SummaryPanel
                                    title="Team Performance"
                                    metrics={summaryData.metrics.slice(0, 3)}
                                    variant="card"
                                    bordered
                                />
                            </div>
                            
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Minimal Variant</h5>
                                <SummaryPanel
                                    title="System Status"
                                    metrics={[
                                        { label: 'Uptime', value: '99.9%', status: 'success' },
                                        { label: 'Response Time', value: '245ms', status: 'normal' },
                                        { label: 'Error Rate', value: '0.1%', status: 'success' }
                                    ]}
                                    variant="minimal"
                                />
                            </div>
                        </div>
                        <CodeBlock>{`<SummaryPanel
  title="Team Performance"
  metrics={metrics}
  variant="card"
  bordered
/>

<SummaryPanel
  title="System Status"
  metrics={statusMetrics}
  variant="minimal"
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

export default MoleculesDisplayPage;