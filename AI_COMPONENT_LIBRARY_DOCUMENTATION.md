# AI Component Library Documentation
# Reusable React Component Library - Complete AI Reference

## 🎯 Purpose
This documentation serves as a comprehensive reference for AI systems to understand and utilize the Reusable React Component Library for building full-stack React applications. The library follows atomic design principles with enterprise-grade features.

## 🏗️ Architecture Overview

### Four-Tier Component Hierarchy
The library is structured using atomic design principles:

1. **Atoms** (32+ components) - Basic building blocks
2. **Molecules** (15+ components) - Simple component combinations  
3. **Organisms** (12+ components) - Complex, feature-rich components
4. **Templates** (6+ components) - Complete page layouts

### Core Technologies
- **React 19.1.0** with TypeScript
- **Tailwind CSS 3.4.17** for styling
- **Lucide React** for icons
- **Redux Toolkit** for state management
- **React Router DOM** for navigation
- **Webpack** for bundling

## 🔧 Project Setup

### Installation Requirements
```bash
npm install react react-dom react-router-dom
npm install @reduxjs/toolkit react-redux redux-thunk
npm install tailwindcss autoprefixer postcss
npm install lucide-react clsx tailwind-merge
npm install @types/react @types/react-dom typescript
```

### Essential Configuration Files

#### `tailwind.config.js`
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { 'work-sans': ['Work Sans', 'sans-serif'] },
      colors: {
        primary: { /* blue scale 50-900 */ },
        gray: { /* gray scale 50-900 */ },
        success: { /* green scale 50-900 */ },
        warning: { /* yellow scale 50-900 */ },
        error: { /* red scale 50-900 */ }
      }
    }
  }
}
```

#### `postcss.config.js`
```javascript
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} }
}
```

### Theme Provider Setup
Always wrap your application with the ThemeProvider:

```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## 🧱 Tier 1: Atomic Components

### Form Components

#### Button
The most versatile component with comprehensive functionality.

**Import:**
```tsx
import { Button } from 'reusable-components';
```

**Basic Usage:**
```tsx
<Button variant="primary" size="md">Submit</Button>
<Button variant="secondary" loading={isLoading}>Save</Button>
<Button href="/dashboard" variant="outline">Dashboard</Button>
```

**Advanced Features:**
```tsx
<Button
  variant="primary"
  size="lg"
  fullWidth
  loading={isSubmitting}
  disabled={!isValid}
  iconLeft={<Save />}
  iconRight={<ChevronRight />}
  onClick={handleSubmit}
  commerceState="execution"
  userRole={{ permissions: ['po.approve'] }}
  auditTrail={{ enabled: true }}
>
  Approve Purchase Order
</Button>
```

**Props Interface:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `iconLeft/iconRight`: React.ReactNode
- `href`: string (renders as link)
- `commerceState`: CommerceState
- `userRole`: UserRole
- `auditTrail`: AuditConfig

#### Input
Comprehensive input component with validation and theming.

**Import:**
```tsx
import { Input } from 'reusable-components';
```

**Basic Usage:**
```tsx
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Advanced Features:**
```tsx
<Input
  label="Search Products"
  type="text"
  size="lg"
  status="error"
  errorMessage="Product not found"
  leftIcon={<Search />}
  rightIcon={<X />}
  helperText="Search by name, SKU, or category"
  maxLength={100}
  autoComplete="off"
  encryptionLevel="field"
/>
```

**Props Interface:**
- `type`: Standard HTML input types + custom types
- `size`: 'sm' | 'md' | 'lg'
- `variant`: 'default' | 'filled' | 'outline'
- `status`: 'default' | 'error' | 'warning' | 'success'
- `leftIcon/rightIcon`: React.ReactNode
- `encryptionLevel`: 'none' | 'field' | 'form' | 'page'

#### Select
Advanced select with search, multi-select, and grouping.

**Basic Usage:**
```tsx
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>
```

**Advanced Multi-Select:**
```tsx
<MultiSelect
  label="Skills"
  options={skillOptions}
  value={selectedSkills}
  onChange={setSelectedSkills}
  searchable
  groupBy="category"
  maxSelections={5}
  placeholder="Select your skills"
/>
```

#### DatePicker
Comprehensive date/time picker with various formats.

```tsx
<DatePicker
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  format="MM/DD/YYYY"
  showTime
  minDate={new Date()}
  maxDate={endDate}
/>
```

#### FileUpload
Drag-and-drop file upload with validation.

```tsx
<FileUpload
  label="Upload Documents"
  accept={['.pdf', '.doc', '.docx']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  multiple
  onUpload={handleFileUpload}
  encryptionLevel="file"
/>
```

### Display Components

#### Icon
Lucide React icon wrapper with size and color management.

```tsx
<Icon name="search" size="md" />
<Icon name="user" size={24} color="#3b82f6" />
<Icon name="check-circle" size="lg" className="text-success-500" />
```

#### Badge
Status and category indicators.

```tsx
<Badge variant="primary">New</Badge>
<Badge variant="success" size="lg">Approved</Badge>
<Badge variant="error">Failed</Badge>
```

#### Avatar
User profile images with fallbacks.

```tsx
<Avatar 
  src="/user-avatar.jpg"
  alt="John Doe"
  size="lg"
  fallback="JD"
/>
```

#### Status
Visual status indicators with commerce state awareness.

```tsx
<Status 
  status="approved"
  commerceState="execution"
  showIcon
  showText
/>
```

### Feedback Components

#### Alert
Contextual information and feedback.

```tsx
<Alert variant="error" dismissible>
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to save changes. Please try again.
  </AlertDescription>
</Alert>
```

#### Modal
Accessible modal dialogs.

```tsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Confirm Action"
  size="md"
>
  <ModalBody>
    Are you sure you want to delete this item?
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </ModalFooter>
</Modal>
```

#### Toast
Notification system with positioning.

```tsx
// In your component
import { useToast } from 'reusable-components';

const { showToast } = useToast();

showToast({
  title: "Success",
  description: "Data saved successfully",
  variant: "success",
  duration: 3000
});

// In your App component
<ToastContainer position="top-right" />
```

#### Spinner & LoadingState
Loading indicators for different scenarios.

```tsx
<Spinner size="lg" />
<LoadingState message="Loading data..." />
```

## 🧬 Tier 2: Molecular Components

### Data Components

#### SearchBox
Advanced search with debouncing and filters.

```tsx
<SearchBox
  placeholder="Search products..."
  searchOnType
  debounceMs={300}
  showClearButton
  onSearch={handleSearch}
  onClear={handleClear}
/>
```

#### FilterPanel
Dynamic filtering interface.

```tsx
<FilterPanel
  filters={[
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: categoryOptions
    },
    {
      key: 'price',
      label: 'Price Range',
      type: 'range',
      min: 0,
      max: 1000
    }
  ]}
  values={filterValues}
  onChange={setFilterValues}
/>
```

#### SortControl
Sorting interface for data tables.

```tsx
<SortControl
  options={[
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date Created' },
    { key: 'price', label: 'Price' }
  ]}
  value={sortConfig}
  onChange={setSortConfig}
/>
```

### Form Compositions

#### AddressForm
Complete address input form.

```tsx
<AddressForm
  value={address}
  onChange={setAddress}
  countries={countryList}
  required={['street', 'city', 'country']}
  showGoogleMaps
/>
```

#### ContactForm
Contact information collection.

```tsx
<ContactForm
  value={contactInfo}
  onChange={setContactInfo}
  fields={['name', 'email', 'phone', 'company']}
  validation="strict"
/>
```

#### ApprovalForm
Workflow approval interface.

```tsx
<ApprovalForm
  title="Purchase Order Approval"
  description="Please review the purchase order details"
  approvalLevels={['manager', 'finance', 'ceo']}
  currentLevel="manager"
  onApprove={handleApprove}
  onReject={handleReject}
  onRequestChanges={handleRequestChanges}
/>
```

### Display Compositions

#### StatusCard
Status information display.

```tsx
<StatusCard
  title="Order Status"
  status="in-progress"
  commerceState="execution"
  metadata={{
    orderId: 'PO-12345',
    lastUpdated: new Date(),
    assignee: 'John Doe'
  }}
/>
```

#### MetricCard
KPI and metrics display.

```tsx
<MetricCard
  title="Revenue"
  value="$125,430"
  change="+12.5%"
  trend="up"
  period="vs last month"
/>
```

#### ProgressTracker
Step-by-step progress visualization.

```tsx
<ProgressTracker
  steps={[
    { id: 'create', label: 'Create Order', status: 'completed' },
    { id: 'approve', label: 'Approval', status: 'active' },
    { id: 'fulfill', label: 'Fulfillment', status: 'pending' }
  ]}
  currentStep="approve"
  orientation="horizontal"
/>
```

## 🏢 Tier 3: Organism Components

### Data Grids

#### EditableDataGrid
Full-featured data table with editing capabilities.

```tsx
<EditableDataGrid
  columns={[
    {
      id: 'name',
      header: 'Product Name',
      accessorKey: 'name',
      editable: true,
      type: 'text',
      required: true
    },
    {
      id: 'price',
      header: 'Price',
      accessorKey: 'price',
      editable: true,
      type: 'currency',
      validation: { min: 0 }
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      editable: true,
      type: 'select',
      options: statusOptions
    }
  ]}
  data={products}
  onDataChange={setProducts}
  editable
  sortable
  filterable
  pagination={{ pageSize: 25, showSizeSelector: true }}
  bulkActions={[
    { key: 'delete', label: 'Delete Selected', variant: 'destructive' },
    { key: 'export', label: 'Export Selected', variant: 'outline' }
  ]}
  onBulkAction={handleBulkAction}
  commerceState="initiation"
  userRole={userRole}
/>
```

#### ComparisonTable
Side-by-side comparison interface.

```tsx
<ComparisonTable
  items={[product1, product2, product3]}
  compareFields={[
    { key: 'name', label: 'Product Name' },
    { key: 'price', label: 'Price', format: 'currency' },
    { key: 'rating', label: 'Rating', format: 'stars' }
  ]}
  highlightDifferences
  allowRemove
  onRemoveItem={handleRemoveItem}
/>
```

### Workflow Components

#### ApprovalWorkflow
Complete approval process management.

```tsx
<ApprovalWorkflow
  workflowId="po-approval"
  currentState="pending-manager"
  approvalLevels={[
    {
      id: 'manager',
      name: 'Manager Approval',
      required: true,
      approvers: ['john.doe@company.com']
    },
    {
      id: 'finance',
      name: 'Finance Review',
      required: true,
      conditions: { amount: { min: 1000 } }
    }
  ]}
  onStateChange={handleStateChange}
  showHistory
/>
```

### Management Components

#### SettingsManager
Application settings interface.

```tsx
<SettingsManager
  sections={[
    {
      id: 'general',
      title: 'General Settings',
      fields: [
        {
          key: 'companyName',
          label: 'Company Name',
          type: 'text',
          required: true
        },
        {
          key: 'timezone',
          label: 'Timezone',
          type: 'select',
          options: timezoneOptions
        }
      ]
    }
  ]}
  values={settings}
  onChange={setSettings}
  onSave={handleSaveSettings}
  validationSchema={settingsSchema}
/>
```

## 🎨 Tier 4: Template Components

### Layout Templates

#### DashboardLayout
Complete dashboard page structure.

```tsx
<DashboardLayout
  header={{
    title: "Dashboard",
    actions: [
      <Button key="new" variant="primary">New Item</Button>
    ]
  }}
  sidebar={{
    items: navigationItems,
    activeItem: currentPage,
    onItemClick: handleNavigation
  }}
  metrics={[
    { title: "Revenue", value: "$125,430", change: "+12.5%" },
    { title: "Orders", value: "1,234", change: "+8.2%" }
  ]}
  quickActions={[
    { label: "Create Order", icon: <Plus />, onClick: () => {} },
    { label: "View Reports", icon: <BarChart />, onClick: () => {} }
  ]}
>
  {/* Dashboard content */}
</DashboardLayout>
```

#### FormLayout
Structured form page layout.

```tsx
<FormLayout
  title="Create Purchase Order"
  subtitle="Fill in the details below"
  steps={[
    { id: 'details', label: 'Order Details' },
    { id: 'items', label: 'Line Items' },
    { id: 'review', label: 'Review & Submit' }
  ]}
  currentStep="details"
  onStepChange={setCurrentStep}
  actions={
    <div className="flex gap-4">
      <Button variant="outline" onClick={handleSaveDraft}>
        Save Draft
      </Button>
      <Button variant="primary" onClick={handleNext}>
        Next Step
      </Button>
    </div>
  }
>
  {/* Form content */}
</FormLayout>
```

## 🎯 Enterprise Features

### Commerce State System
Components automatically adapt behavior based on transaction states:

```tsx
// Component behavior changes based on commerce state
<Button 
  commerceState="execution" // readonly, limited actions
  allowedActions={['view', 'comment']} // restricts available actions
>
  Process Order
</Button>

<Input
  commerceState="settlement" // readonly mode
  value={orderAmount}
  disabled // automatically disabled in settlement
/>
```

**Commerce States:**
- `initiation`: Normal editing mode
- `agreement`: Restricted editing, pending approval
- `execution`: Processing state, limited actions  
- `settlement`: Readonly mode with settlement actions
- `completion`: Readonly, historical view

### Role-Based Access Control (RBAC)

```tsx
<Button
  userRole={{
    permissions: ['po.approve', 'po.edit'],
    roles: ['manager', 'finance']
  }}
  requiredPermissions={['po.approve']}
  fallbackComponent={<span>Insufficient permissions</span>}
>
  Approve Order
</Button>
```

### Audit Trail & Security

```tsx
<Input
  auditTrail={{
    enabled: true,
    logUserActions: true,
    trackChanges: true,
    encryptionLevel: 'field'
  }}
  value={sensitiveData}
  onChange={handleChange}
/>
```

## 🔧 Utility Functions

### Class Name Utilities
```tsx
import { cn } from 'reusable-components/utils';

// Merge Tailwind classes with conflict resolution
const buttonClasses = cn(
  'px-4 py-2',
  'bg-blue-500 hover:bg-blue-600',
  variant === 'large' && 'px-6 py-3',
  disabled && 'opacity-50 cursor-not-allowed'
);
```

### Icon Mapping
```tsx
import { iconMap } from 'reusable-components/utils';

// Pre-mapped Lucide icons
<Icon name="search" /> // renders Search icon
<Icon name="user-plus" /> // renders UserPlus icon
```

## 🗄️ State Management

### Redux Store Setup
```tsx
import { store, useAppDispatch, useAppSelector } from 'reusable-components/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {/* Your app */}
      </ThemeProvider>
    </Provider>
  );
}
```

### Available Slices
- `authSlice`: User authentication state
- `purchaseOrderSlice`: Purchase order management
- `vendorSlice`: Vendor information
- `settingsSlice`: Application settings

## 🎨 Styling System

### Design Tokens
The library uses a comprehensive design token system:

```tsx
// Color Scale (50-900 for each)
primary: blue scale
gray: neutral scale  
success: green scale
warning: yellow scale
error: red scale

// Spacing Scale
'1': '0.25rem' (4px)
'2': '0.5rem' (8px)
'3': '0.75rem' (12px)
'4': '1rem' (16px)
// ... up to '20': '5rem' (80px)

// Border Radius
'sm': '0.125rem' (2px)
'md': '0.375rem' (6px)  
'lg': '0.5rem' (8px)
'xl': '0.75rem' (12px)
'2xl': '1rem' (16px)
```

### Dark Mode Support
All components support dark mode via the theme context:

```tsx
import { useTheme } from 'reusable-components';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <Button onClick={toggleTheme}>
        Toggle Theme
      </Button>
    </div>
  );
}
```

## 🚀 Building Complete Applications

### Step 1: Project Setup
```bash
# Create new React project
npx create-react-app my-app --template typescript
cd my-app

# Install component library dependencies
npm install @reduxjs/toolkit react-redux react-router-dom
npm install tailwindcss autoprefixer postcss
npm install lucide-react clsx tailwind-merge
```

### Step 2: Configure Tailwind
Create `tailwind.config.js` with the library's configuration (see above).

### Step 3: Setup Providers
```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from 'reusable-components';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders/*" element={<OrdersApp />} />
          </Routes>
          <ToastContainer position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
```

### Step 4: Create Feature Pages
```tsx
// DashboardPage.tsx
import {
  DashboardLayout,
  MetricCard,
  EditableDataGrid,
  SearchBox,
  Button
} from 'reusable-components';

function DashboardPage() {
  return (
    <DashboardLayout
      header={{
        title: "Dashboard",
        actions: [
          <SearchBox key="search" placeholder="Search..." />,
          <Button key="new" variant="primary">New Order</Button>
        ]
      }}
      sidebar={{ items: navigationItems }}
      metrics={[
        { title: "Revenue", value: "$125,430", change: "+12.5%" },
        { title: "Orders", value: "1,234", change: "+8.2%" }
      ]}
    >
      <EditableDataGrid
        columns={orderColumns}
        data={orders}
        editable
        sortable
        filterable
      />
    </DashboardLayout>
  );
}
```

### Step 5: Form Handling
```tsx
// CreateOrderPage.tsx
import {
  FormLayout,
  Input,
  Select,
  DatePicker,
  AddressForm,
  Button,
  useToast
} from 'reusable-components';

function CreateOrderPage() {
  const [formData, setFormData] = useState({});
  const { showToast } = useToast();

  const handleSubmit = async () => {
    try {
      await createOrder(formData);
      showToast({
        title: "Success",
        description: "Order created successfully",
        variant: "success"
      });
    } catch (error) {
      showToast({
        title: "Error", 
        description: "Failed to create order",
        variant: "error"
      });
    }
  };

  return (
    <FormLayout
      title="Create Order"
      steps={formSteps}
      currentStep={currentStep}
    >
      <div className="space-y-6">
        <Input
          label="Order Number"
          value={formData.orderNumber}
          onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
          required
        />
        
        <Select
          label="Vendor"
          options={vendorOptions}
          value={formData.vendor}
          onChange={(value) => setFormData({...formData, vendor: value})}
          searchable
        />
        
        <DatePicker
          label="Required Date"
          value={formData.requiredDate}
          onChange={(date) => setFormData({...formData, requiredDate: date})}
          minDate={new Date()}
        />
        
        <AddressForm
          value={formData.deliveryAddress}
          onChange={(address) => setFormData({...formData, deliveryAddress: address})}
        />
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Order
          </Button>
        </div>
      </div>
    </FormLayout>
  );
}
```

## 📱 Responsive Design

All components are fully responsive and mobile-optimized:

```tsx
// Components automatically adapt to screen size
<EditableDataGrid
  columns={columns}
  data={data}
  responsive={{
    mobile: { columns: ['name', 'status'] }, // Show limited columns on mobile
    tablet: { columns: ['name', 'date', 'status', 'actions'] }
  }}
/>

// Layout components stack on mobile
<DashboardLayout
  sidebar={{ 
    collapsible: true,
    defaultCollapsed: true // Collapsed by default on mobile
  }}
>
  {/* Content */}
</DashboardLayout>
```

## ♿ Accessibility

Components follow WCAG 2.1 guidelines:

```tsx
// Automatic ARIA attributes
<Input
  label="Email" // Automatically generates aria-labelledby
  required // Adds aria-required="true"
  status="error" // Adds aria-invalid="true"
  errorMessage="Invalid email" // Adds aria-describedby
/>

// Keyboard navigation support
<Modal
  isOpen={isOpen}
  onClose={onClose}
  // Focus management, escape key handling, and focus trapping built-in
>
  {/* Content */}
</Modal>

// Screen reader support
<Icon 
  name="search"
  decorative={false} // Adds role="img" and aria-label
  title="Search products"
/>
```

## 🧪 Testing Patterns

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from 'reusable-components';

test('button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Integration Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import MyComponent from './MyComponent';

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </Provider>
  );
}

test('component works with providers', () => {
  renderWithProviders(<MyComponent />);
  // Test component functionality
});
```

## 🚀 Performance Optimization

### Code Splitting
```tsx
import { lazy, Suspense } from 'react';
import { LoadingState } from 'reusable-components';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardPage />
    </Suspense>
  );
}
```

### Memoization
```tsx
import { memo, useMemo } from 'react';
import { EditableDataGrid } from 'reusable-components';

const OptimizedDataGrid = memo(function DataGrid({ data, columns }) {
  const memoizedColumns = useMemo(() => {
    return columns.map(col => ({
      ...col,
      // Column configuration
    }));
  }, [columns]);

  return (
    <EditableDataGrid
      data={data}
      columns={memoizedColumns}
    />
  );
});
```

## 🔐 Security Best Practices

### Data Encryption
```tsx
<Input
  type="password"
  encryptionLevel="field" // Encrypts field data
  value={password}
  onChange={handlePasswordChange}
/>

<FileUpload
  encryptionLevel="file" // Encrypts uploaded files
  onUpload={handleFileUpload}
/>
```

### Permission Checks
```tsx
<Button
  userRole={currentUser.role}
  requiredPermissions={['order.approve']}
  onClick={handleApprove}
>
  Approve Order
</Button>
```

## 📊 Common Patterns

### CRUD Operations
```tsx
function EntityManager() {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between">
          <SearchBox onSearch={handleSearch} />
          <Button variant="primary" onClick={handleCreate}>
            Add New
          </Button>
        </div>
        
        <EditableDataGrid
          data={entities}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          bulkActions={[
            { key: 'delete', label: 'Delete Selected' }
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
```

### Form Wizards
```tsx
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'review', label: 'Review' }
  ];

  return (
    <FormLayout
      title="Setup Wizard"
      steps={steps}
      currentStep={currentStep}
    >
      {currentStep === 0 && <BasicInfoStep />}
      {currentStep === 1 && <DetailsStep />}
      {currentStep === 2 && <ReviewStep />}
      
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(step => step - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button 
          variant="primary"
          onClick={() => setCurrentStep(step => step + 1)}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </FormLayout>
  );
}
```

### Master-Detail Views
```tsx
function MasterDetailView() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <ListDetailLayout>
      <ListDetailLayout.List>
        <SearchBox onSearch={handleSearch} />
        <div className="space-y-2">
          {items.map(item => (
            <StatusCard
              key={item.id}
              title={item.name}
              status={item.status}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </ListDetailLayout.List>
      
      <ListDetailLayout.Detail>
        {selectedItem ? (
          <div>
            <h2>{selectedItem.name}</h2>
            <DetailForm item={selectedItem} />
          </div>
        ) : (
          <div>Select an item to view details</div>
        )}
      </ListDetailLayout.Detail>
    </ListDetailLayout>
  );
}
```

## 🔄 State Management Patterns

### Redux Integration
```tsx
import { useAppDispatch, useAppSelector } from 'reusable-components/store';

function OrderManagement() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.purchaseOrders.items);
  const loading = useAppSelector(state => state.purchaseOrders.loading);

  const handleCreateOrder = (orderData) => {
    dispatch(createPurchaseOrder(orderData));
  };

  return (
    <EditableDataGrid
      data={orders}
      loading={loading}
      onRowAdd={handleCreateOrder}
    />
  );
}
```

### Local State Management
```tsx
function ComponentWithLocalState() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        status={errors.name ? 'error' : 'default'}
        errorMessage={errors.name}
      />
    </div>
  );
}
```

This comprehensive documentation provides everything an AI needs to understand and build applications using the Reusable React Component Library. The library's atomic design structure, enterprise features, and comprehensive component set enable rapid development of sophisticated React applications. 