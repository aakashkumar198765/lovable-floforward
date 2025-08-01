import React, { useState } from 'react';
import { 
    EditableDataGrid,
    ComparisonTable,
    PivotTable
} from '../components/organisms';

const OrganismsDataGridsPage = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [gridData, setGridData] = useState([
        { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            role: 'Admin', 
            status: 'Active', 
            lastLogin: '2024-01-15',
            department: 'Engineering'
        },
        { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com', 
            role: 'User', 
            status: 'Active', 
            lastLogin: '2024-01-14',
            department: 'Marketing'
        },
        { 
            id: 3, 
            name: 'Mike Johnson', 
            email: 'mike@example.com', 
            role: 'Editor', 
            status: 'Inactive', 
            lastLogin: '2024-01-10',
            department: 'Content'
        },
        { 
            id: 4, 
            name: 'Sarah Wilson', 
            email: 'sarah@example.com', 
            role: 'User', 
            status: 'Active', 
            lastLogin: '2024-01-16',
            department: 'Sales'
        },
        { 
            id: 5, 
            name: 'Tom Brown', 
            email: 'tom@example.com', 
            role: 'Admin', 
            status: 'Active', 
            lastLogin: '2024-01-15',
            department: 'Engineering'
        }
    ]);

    const columns = [
        {
            key: 'name',
            title: 'Name',
            sortable: true,
            filterable: true,
            editable: true,
            width: '200px'
        },
        {
            key: 'email',
            title: 'Email',
            sortable: true,
            filterable: true,
            editable: true,
            width: '250px'
        },
        {
            key: 'role',
            title: 'Role',
            sortable: true,
            filterable: true,
            editable: true,
            editType: 'select',
            editOptions: [
                { value: 'Admin', label: 'Admin' },
                { value: 'User', label: 'User' },
                { value: 'Editor', label: 'Editor' }
            ],
            width: '120px'
        },
        {
            key: 'status',
            title: 'Status',
            sortable: true,
            filterable: true,
            editable: true,
            editType: 'select',
            editOptions: [
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }
            ],
            render: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {value}
                </span>
            ),
            width: '100px'
        },
        {
            key: 'department',
            title: 'Department',
            sortable: true,
            filterable: true,
            editable: true,
            editType: 'select',
            editOptions: [
                { value: 'Engineering', label: 'Engineering' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Sales', label: 'Sales' },
                { value: 'Content', label: 'Content' }
            ],
            width: '150px'
        },
        {
            key: 'lastLogin',
            title: 'Last Login',
            sortable: true,
            filterable: true,
            editable: true,
            editType: 'date',
            width: '120px'
        }
    ];

    const comparisonData = [
        {
            feature: 'Storage',
            basic: '10 GB',
            pro: '100 GB',
            enterprise: '1 TB',
            highlight: 'pro'
        },
        {
            feature: 'Users',
            basic: '5 users',
            pro: '50 users',
            enterprise: 'Unlimited',
            highlight: 'enterprise'
        },
        {
            feature: 'Support',
            basic: 'Email',
            pro: 'Priority Email',
            enterprise: '24/7 Phone',
            highlight: 'enterprise'
        },
        {
            feature: 'API Access',
            basic: '❌',
            pro: '✅',
            enterprise: '✅',
            highlight: 'pro'
        },
        {
            feature: 'Custom Integrations',
            basic: '❌',
            pro: '❌',
            enterprise: '✅',
            highlight: 'enterprise'
        }
    ];

    const pivotData = [
        { region: 'North', product: 'Product A', quarter: 'Q1', sales: 150000, units: 120 },
        { region: 'North', product: 'Product A', quarter: 'Q2', sales: 180000, units: 140 },
        { region: 'North', product: 'Product B', quarter: 'Q1', sales: 120000, units: 90 },
        { region: 'North', product: 'Product B', quarter: 'Q2', sales: 140000, units: 100 },
        { region: 'South', product: 'Product A', quarter: 'Q1', sales: 200000, units: 160 },
        { region: 'South', product: 'Product A', quarter: 'Q2', sales: 220000, units: 170 },
        { region: 'South', product: 'Product B', quarter: 'Q1', sales: 100000, units: 80 },
        { region: 'South', product: 'Product B', quarter: 'Q2', sales: 110000, units: 85 }
    ];

    const handleCellEdit = (rowId, columnKey, newValue) => {
        setGridData(prevData =>
            prevData.map(row =>
                row.id === rowId ? { ...row, [columnKey]: newValue } : row
            )
        );
    };

    const handleRowDelete = (rowIds) => {
        setGridData(prevData => prevData.filter(row => !rowIds.includes(row.id)));
    };

    const handleBulkAction = (action, selectedIds) => {
        console.log(`Bulk action: ${action} on rows:`, selectedIds);
        if (action === 'delete') {
            handleRowDelete(selectedIds);
        }
    };

    const handleExport = (format, data) => {
        console.log(`Exporting ${data.length} rows to ${format}`);
        // Export logic would go here
    };

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Organisms</h1>
                <h2 className="text-xl text-gray-600 mb-4">Data Grids</h2>
                <p className="text-gray-600">
                    Advanced data table components with editing, filtering, sorting, and export capabilities.
                </p>
            </div>

            {/* EditableDataGrid Component */}
            <ComponentSection 
                title="EditableDataGrid" 
                description="Advanced data table with inline editing, selection, sorting, filtering, and bulk operations."
            >
                <div className="space-y-6">
                    {/* Basic Editable Grid */}
                    <ExampleGroup title="Full-Featured Data Grid">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <EditableDataGrid
                                data={gridData}
                                columns={columns}
                                editable={true}
                                selection={{
                                    enabled: true,
                                    multiple: true,
                                    selectedRows: selectedRows,
                                    onSelectionChange: setSelectedRows
                                }}
                                sorting={{
                                    enabled: true,
                                    defaultSort: { column: 'name', direction: 'asc' }
                                }}
                                filtering={{
                                    enabled: true,
                                    showFilterRow: true
                                }}
                                pagination={{
                                    enabled: true,
                                    pageSize: 10,
                                    showPageInfo: true
                                }}
                                bulkActions={[
                                    {
                                        label: 'Delete Selected',
                                        action: 'delete',
                                        variant: 'danger',
                                        icon: 'trash',
                                        confirmation: 'Are you sure you want to delete the selected rows?'
                                    },
                                    {
                                        label: 'Export Selected',
                                        action: 'export',
                                        variant: 'secondary',
                                        icon: 'download'
                                    },
                                    {
                                        label: 'Bulk Edit',
                                        action: 'bulkEdit',
                                        variant: 'primary',
                                        icon: 'edit'
                                    }
                                ]}
                                exportable={{
                                    enabled: true,
                                    formats: ['csv', 'excel', 'json', 'pdf'],
                                    filename: 'user-data'
                                }}
                                onCellEdit={handleCellEdit}
                                onBulkAction={handleBulkAction}
                                onExport={handleExport}
                                rowHeight="auto"
                                stickyHeader={true}
                                virtualization={{
                                    enabled: false // For smaller datasets
                                }}
                            />
                        </div>
                        <CodeBlock>{`const columns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    filterable: true,
    editable: true,
    width: '200px'
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
    filterable: true,
    editable: true,
    editType: 'select',
    editOptions: [
      { value: 'Admin', label: 'Admin' },
      { value: 'User', label: 'User' },
      { value: 'Editor', label: 'Editor' }
    ]
  },
  {
    key: 'status',
    title: 'Status',
    render: (value) => (
      <span className={\`px-2 py-1 rounded-full text-xs \${
        value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }\`}>
        {value}
      </span>
    )
  }
];

<EditableDataGrid
  data={data}
  columns={columns}
  editable={true}
  selection={{
    enabled: true,
    multiple: true,
    selectedRows: selectedRows,
    onSelectionChange: setSelectedRows
  }}
  sorting={{
    enabled: true,
    defaultSort: { column: 'name', direction: 'asc' }
  }}
  filtering={{
    enabled: true,
    showFilterRow: true
  }}
  pagination={{
    enabled: true,
    pageSize: 10,
    showPageInfo: true
  }}
  bulkActions={bulkActions}
  exportable={{
    enabled: true,
    formats: ['csv', 'excel', 'json', 'pdf'],
    filename: 'user-data'
  }}
  onCellEdit={handleCellEdit}
  onBulkAction={handleBulkAction}
  onExport={handleExport}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Read-only Grid */}
                    <ExampleGroup title="Read-only Data Grid">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <EditableDataGrid
                                data={gridData.slice(0, 3)}
                                columns={columns.map(col => ({ ...col, editable: false }))}
                                editable={false}
                                selection={{
                                    enabled: true,
                                    multiple: false
                                }}
                                sorting={{ enabled: true }}
                                filtering={{ enabled: false }}
                                pagination={{ enabled: false }}
                                variant="minimal"
                            />
                        </div>
                        <CodeBlock>{`<EditableDataGrid
  data={data}
  columns={readOnlyColumns}
  editable={false}
  selection={{
    enabled: true,
    multiple: false
  }}
  sorting={{ enabled: true }}
  filtering={{ enabled: false }}
  pagination={{ enabled: false }}
  variant="minimal"
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Compact Grid */}
                    <ExampleGroup title="Compact Data Grid">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <EditableDataGrid
                                data={gridData}
                                columns={columns.slice(0, 4)}
                                size="compact"
                                editable={true}
                                selection={{ enabled: true }}
                                sorting={{ enabled: true }}
                                pagination={{
                                    enabled: true,
                                    pageSize: 5,
                                    compact: true
                                }}
                                variant="striped"
                            />
                        </div>
                        <CodeBlock>{`<EditableDataGrid
  data={data}
  columns={columns}
  size="compact"
  editable={true}
  selection={{ enabled: true }}
  sorting={{ enabled: true }}
  variant="striped"
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* ComparisonTable Component */}
            <ComponentSection 
                title="ComparisonTable" 
                description="Side-by-side comparison table for features, plans, or products."
            >
                <div className="space-y-6">
                    {/* Basic Comparison Table */}
                    <ExampleGroup title="Plan Comparison">
                        <ComparisonTable
                            data={comparisonData}
                            columns={[
                                { key: 'feature', title: 'Features', sticky: true },
                                { key: 'basic', title: 'Basic Plan', subtitle: '$9/month' },
                                { key: 'pro', title: 'Pro Plan', subtitle: '$29/month', featured: true },
                                { key: 'enterprise', title: 'Enterprise', subtitle: 'Custom pricing' }
                            ]}
                            highlightColumn="pro"
                            showHeaders={true}
                            variant="default"
                        />
                        <CodeBlock>{`const comparisonData = [
  {
    feature: 'Storage',
    basic: '10 GB',
    pro: '100 GB',
    enterprise: '1 TB',
    highlight: 'pro'
  },
  {
    feature: 'Users',
    basic: '5 users',
    pro: '50 users',
    enterprise: 'Unlimited',
    highlight: 'enterprise'
  }
];

<ComparisonTable
  data={comparisonData}
  columns={[
    { key: 'feature', title: 'Features', sticky: true },
    { key: 'basic', title: 'Basic Plan', subtitle: '$9/month' },
    { key: 'pro', title: 'Pro Plan', subtitle: '$29/month', featured: true },
    { key: 'enterprise', title: 'Enterprise', subtitle: 'Custom pricing' }
  ]}
  highlightColumn="pro"
  showHeaders={true}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Product Comparison */}
                    <ExampleGroup title="Product Comparison">
                        <ComparisonTable
                            data={[
                                {
                                    feature: 'Screen Size',
                                    laptop: '13.3"',
                                    tablet: '10.9"',
                                    phone: '6.1"'
                                },
                                {
                                    feature: 'Battery Life',
                                    laptop: '18 hours',
                                    tablet: '10 hours',
                                    phone: '17 hours',
                                    highlight: 'laptop'
                                },
                                {
                                    feature: 'Weight',
                                    laptop: '2.8 lbs',
                                    tablet: '1.0 lb',
                                    phone: '6.1 oz',
                                    highlight: 'phone'
                                },
                                {
                                    feature: 'Price',
                                    laptop: '$1,299',
                                    tablet: '$599',
                                    phone: '$799',
                                    highlight: 'tablet'
                                }
                            ]}
                            columns={[
                                { key: 'feature', title: 'Specifications' },
                                { key: 'laptop', title: 'MacBook Air', image: '/laptop.jpg' },
                                { key: 'tablet', title: 'iPad Air', image: '/tablet.jpg' },
                                { key: 'phone', title: 'iPhone', image: '/phone.jpg' }
                            ]}
                            variant="card"
                            showImages={true}
                        />
                        <CodeBlock>{`<ComparisonTable
  data={productData}
  columns={[
    { key: 'feature', title: 'Specifications' },
    { key: 'laptop', title: 'MacBook Air', image: '/laptop.jpg' },
    { key: 'tablet', title: 'iPad Air', image: '/tablet.jpg' },
    { key: 'phone', title: 'iPhone', image: '/phone.jpg' }
  ]}
  variant="card"
  showImages={true}
/>`}</CodeBlock>
                    </ExampleGroup>
                </div>
            </ComponentSection>

            {/* PivotTable Component */}
            <ComponentSection 
                title="PivotTable" 
                description="Dynamic pivot table with aggregations and drill-down capabilities."
            >
                <div className="space-y-6">
                    {/* Basic Pivot Table */}
                    <ExampleGroup title="Sales Pivot Table">
                        <PivotTable
                            data={pivotData}
                            rows={['region']}
                            columns={['quarter']}
                            values={['sales', 'units']}
                            aggregations={{
                                sales: 'sum',
                                units: 'sum'
                            }}
                            showTotals={true}
                            showSubtotals={true}
                            formatters={{
                                sales: (value) => `$${value.toLocaleString()}`,
                                units: (value) => value.toLocaleString()
                            }}
                        />
                        <CodeBlock>{`const pivotData = [
  { region: 'North', product: 'Product A', quarter: 'Q1', sales: 150000, units: 120 },
  { region: 'North', product: 'Product A', quarter: 'Q2', sales: 180000, units: 140 },
  { region: 'South', product: 'Product A', quarter: 'Q1', sales: 200000, units: 160 },
  // ... more data
];

<PivotTable
  data={pivotData}
  rows={['region']}
  columns={['quarter']}
  values={['sales', 'units']}
  aggregations={{
    sales: 'sum',
    units: 'sum'
  }}
  showTotals={true}
  showSubtotals={true}
  formatters={{
    sales: (value) => \`$\${value.toLocaleString()}\`,
    units: (value) => value.toLocaleString()
  }}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Multi-dimensional Pivot */}
                    <ExampleGroup title="Multi-dimensional Pivot">
                        <PivotTable
                            data={pivotData}
                            rows={['region', 'product']}
                            columns={['quarter']}
                            values={['sales']}
                            aggregations={{
                                sales: 'sum'
                            }}
                            showTotals={true}
                            showSubtotals={true}
                            collapsible={true}
                            defaultExpanded={false}
                            formatters={{
                                sales: (value) => `$${value.toLocaleString()}`
                            }}
                        />
                        <CodeBlock>{`<PivotTable
  data={pivotData}
  rows={['region', 'product']}
  columns={['quarter']}
  values={['sales']}
  aggregations={{ sales: 'sum' }}
  showTotals={true}
  showSubtotals={true}
  collapsible={true}
  defaultExpanded={false}
/>`}</CodeBlock>
                    </ExampleGroup>

                    {/* Interactive Pivot */}
                    <ExampleGroup title="Interactive Pivot Table">
                        <PivotTable
                            data={pivotData}
                            rows={['region']}
                            columns={['product', 'quarter']}
                            values={['sales', 'units']}
                            aggregations={{
                                sales: 'sum',
                                units: 'avg'
                            }}
                            showTotals={true}
                            interactive={true}
                            onCellClick={(cell) => console.log('Cell clicked:', cell)}
                            onDrillDown={(dimension, value) => console.log('Drill down:', dimension, value)}
                            exportable={true}
                            colorScheme="blue"
                        />
                        <CodeBlock>{`<PivotTable
  data={pivotData}
  rows={['region']}
  columns={['product', 'quarter']}
  values={['sales', 'units']}
  aggregations={{
    sales: 'sum',
    units: 'avg'
  }}
  showTotals={true}
  interactive={true}
  onCellClick={(cell) => console.log('Cell clicked:', cell)}
  onDrillDown={(dimension, value) => console.log('Drill down:', dimension, value)}
  exportable={true}
  colorScheme="blue"
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

export default OrganismsDataGridsPage;