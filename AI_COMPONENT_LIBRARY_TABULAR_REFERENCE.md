# AI Component Library - Tabular Reference Guide

## 📋 Quick Reference Tables for AI Integration

### 🔧 Setup & Configuration

| Aspect | Details |
|--------|---------|
| **Main Dependencies** | `react@19.1.0`, `react-dom@19.1.0`, `@reduxjs/toolkit@2.8.2`, `react-router-dom@7.7.0`, `tailwindcss@3.4.17`, `lucide-react@0.536.0` |
| **Import Path** | `import { ComponentName } from 'reusable-components'` |
| **Required Providers** | `<ThemeProvider>`, `<Provider store={store}>`, `<BrowserRouter>` |
| **Global Components** | `<ToastContainer position="top-right" />` |
| **Utility Functions** | `cn()` for class merging, `iconMap` for icon mapping |

### 🏗️ Architecture Overview

| Tier | Count | Purpose | Examples |
|------|-------|---------|----------|
| **Atoms** | 32+ | Basic building blocks | Button, Input, Icon, Badge |
| **Molecules** | 15+ | Component combinations | SearchBox, AddressForm, StatusCard |
| **Organisms** | 12+ | Complex features | EditableDataGrid, ApprovalWorkflow |
| **Templates** | 6+ | Complete page layouts | DashboardLayout, FormLayout |

---

## 🧱 Tier 1: Atomic Components

### Form Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **Button** | `import { Button }` | `<Button variant="primary">Submit</Button>` | `variant`, `size`, `loading`, `disabled` | `commerceState`, `userRole`, `auditTrail`, `iconLeft/Right` |
| **Input** | `import { Input }` | `<Input label="Email" type="email" />` | `type`, `label`, `value`, `onChange` | `status`, `leftIcon/rightIcon`, `encryptionLevel` |
| **Select** | `import { Select }` | `<Select options={opts} value={val} />` | `options`, `value`, `onChange` | `searchable`, `multiple`, `groupBy` |
| **MultiSelect** | `import { MultiSelect }` | `<MultiSelect options={opts} />` | `options`, `value`, `onChange` | `maxSelections`, `searchable` |
| **DatePicker** | `import { DatePicker }` | `<DatePicker label="Date" />` | `value`, `onChange`, `format` | `showTime`, `minDate`, `maxDate` |
| **FileUpload** | `import { FileUpload }` | `<FileUpload onUpload={fn} />` | `accept`, `maxFileSize`, `onUpload` | `multiple`, `encryptionLevel` |
| **Textarea** | `import { Textarea }` | `<Textarea label="Comments" />` | `label`, `value`, `onChange` | `rows`, `maxLength`, `autoResize` |
| **Checkbox** | `import { Checkbox }` | `<Checkbox label="Agree" />` | `checked`, `onChange`, `label` | `indeterminate`, `disabled` |
| **Radio** | `import { Radio }` | `<Radio name="choice" value="a" />` | `name`, `value`, `checked` | `disabled`, `description` |
| **Switch** | `import { Switch }` | `<Switch checked={val} onChange={fn} />` | `checked`, `onChange` | `size`, `disabled`, `label` |

### Display Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **Icon** | `import { Icon }` | `<Icon name="search" />` | `name`, `size`, `color` | `title`, `decorative`, custom size |
| **Badge** | `import { Badge }` | `<Badge variant="primary">New</Badge>` | `variant`, `children` | `size`, `removable` |
| **Avatar** | `import { Avatar }` | `<Avatar src="/img.jpg" alt="User" />` | `src`, `alt`, `size` | `fallback`, `initials` |
| **Label** | `import { Label }` | `<Label htmlFor="input">Name</Label>` | `htmlFor`, `children` | `required`, `className` |
| **Status** | `import { Status }` | `<Status status="approved" />` | `status`, `showIcon` | `commerceState`, `showText` |
| **ThemeToggle** | `import { ThemeToggle }` | `<ThemeToggle />` | None | Automatic theme switching |
| **Tooltip** | `import { Tooltip }` | `<Tooltip content="Help">?</Tooltip>` | `content`, `children` | `position`, `delay` |

### Feedback Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **Alert** | `import { Alert }` | `<Alert variant="error">Message</Alert>` | `variant`, `children` | `dismissible`, `icon` |
| **Modal** | `import { Modal }` | `<Modal isOpen={true} onClose={fn}>Content</Modal>` | `isOpen`, `onClose`, `children` | `size`, `title`, `preventClose` |
| **Toast** | `import { useToast }` | `showToast({title: "Success"})` | `title`, `description`, `variant` | `duration`, `position` |
| **Spinner** | `import { Spinner }` | `<Spinner />` | `size` | `color`, `className` |
| **LoadingState** | `import { LoadingState }` | `<LoadingState message="Loading..." />` | `message` | `spinner`, `overlay` |

### Navigation Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **Breadcrumb** | `import { Breadcrumb }` | `<Breadcrumb items={items} />` | `items`, `separator` | `maxItems`, `showHome` |
| **Menu** | `import { Menu }` | `<Menu items={items} />` | `items`, `activeItem` | `orientation`, `variant` |
| **Pagination** | `import { Pagination }` | `<Pagination total={100} />` | `total`, `current`, `pageSize` | `showSizeSelector`, `showInfo` |
| **Tab** | `import { Tab }` | `<Tab.Group><Tab.List><Tab>Tab1</Tab></Tab.List></Tab.Group>` | `children` | `defaultIndex`, `onChange` |

---

## 🧬 Tier 2: Molecular Components

### Data Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **SearchBox** | `import { SearchBox }` | `<SearchBox onSearch={fn} />` | `onSearch`, `placeholder` | `debounceMs`, `showClearButton` |
| **FilterPanel** | `import { FilterPanel }` | `<FilterPanel filters={filters} />` | `filters`, `values`, `onChange` | `collapsible`, `presets` |
| **SortControl** | `import { SortControl }` | `<SortControl options={opts} />` | `options`, `value`, `onChange` | `direction`, `multiple` |
| **BulkActions** | `import { BulkActions }` | `<BulkActions actions={actions} />` | `actions`, `selectedItems` | `confirmation`, `loading` |

### Form Compositions

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **AddressForm** | `import { AddressForm }` | `<AddressForm value={addr} onChange={fn} />` | `value`, `onChange` | `countries`, `validation`, `googleMaps` |
| **ContactForm** | `import { ContactForm }` | `<ContactForm value={contact} />` | `value`, `onChange` | `fields`, `validation` |
| **ApprovalForm** | `import { ApprovalForm }` | `<ApprovalForm onApprove={fn} />` | `onApprove`, `onReject` | `approvalLevels`, `comments` |

### Display Compositions

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **StatusCard** | `import { StatusCard }` | `<StatusCard title="Order" status="active" />` | `title`, `status` | `metadata`, `commerceState` |
| **MetricCard** | `import { MetricCard }` | `<MetricCard title="Revenue" value="$100K" />` | `title`, `value` | `change`, `trend`, `period` |
| **SummaryPanel** | `import { SummaryPanel }` | `<SummaryPanel data={summary} />` | `data`, `title` | `collapsible`, `actions` |
| **ProgressTracker** | `import { ProgressTracker }` | `<ProgressTracker steps={steps} />` | `steps`, `currentStep` | `orientation`, `showLabels` |

---

## 🏢 Tier 3: Organism Components

### Data Grids

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **EditableDataGrid** | `import { EditableDataGrid }` | `<EditableDataGrid columns={cols} data={data} />` | `columns`, `data`, `onDataChange` | `editable`, `sortable`, `filterable`, `pagination`, `bulkActions` |
| **ComparisonTable** | `import { ComparisonTable }` | `<ComparisonTable items={items} fields={fields} />` | `items`, `compareFields` | `highlightDifferences`, `allowRemove` |
| **PivotTable** | `import { PivotTable }` | `<PivotTable data={data} config={config} />` | `data`, `pivotConfig` | `aggregations`, `filters` |

### Workflow Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **ApprovalWorkflow** | `import { ApprovalWorkflow }` | `<ApprovalWorkflow workflowId="po" />` | `workflowId`, `currentState` | `approvalLevels`, `onStateChange` |
| **StateTransition** | `import { StateTransition }` | `<StateTransition currentState="pending" />` | `currentState`, `allowedTransitions` | `onTransition`, `validation` |
| **WorkflowTracker** | `import { WorkflowTracker }` | `<WorkflowTracker workflow={wf} />` | `workflow`, `currentStep` | `showHistory`, `interactive` |

### Management Components

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **SettingsManager** | `import { SettingsManager }` | `<SettingsManager sections={sections} />` | `sections`, `values`, `onChange` | `validation`, `onSave` |
| **UserManager** | `import { UserManager }` | `<UserManager users={users} />` | `users`, `onUserChange` | `roles`, `permissions` |
| **RoleManager** | `import { RoleManager }` | `<RoleManager roles={roles} />` | `roles`, `permissions` | `onRoleChange`, `inheritance` |

---

## 🎨 Tier 4: Template Components

### Layout Templates

| Component | Import | Basic Usage | Key Props | Advanced Features |
|-----------|--------|-------------|-----------|-------------------|
| **DashboardLayout** | `import { DashboardLayout }` | `<DashboardLayout header={header}>{content}</DashboardLayout>` | `header`, `sidebar`, `children` | `metrics`, `quickActions` |
| **FormLayout** | `import { FormLayout }` | `<FormLayout title="Form">{form}</FormLayout>` | `title`, `children` | `steps`, `actions`, `validation` |
| **ListDetailLayout** | `import { ListDetailLayout }` | `<ListDetailLayout>{content}</ListDetailLayout>` | `children` | `responsive`, `splitRatio` |

---

## 🏢 Enterprise Features

### Commerce State System

| State | Behavior | Allowed Actions | UI Changes |
|-------|----------|-----------------|-------------|
| **initiation** | Normal editing mode | All actions available | Full interactivity |
| **agreement** | Restricted editing | Limited to approval actions | Some fields readonly |
| **execution** | Processing state | View, comment only | Most actions disabled |
| **settlement** | Settlement mode | Settlement actions only | Readonly with settlement UI |
| **completion** | Historical view | View only | Completely readonly |

### Role-Based Access Control (RBAC)

| Prop | Type | Usage | Example |
|------|------|-------|---------|
| `userRole` | `UserRole` | User's role and permissions | `{ permissions: ['po.approve'], roles: ['manager'] }` |
| `requiredPermissions` | `string[]` | Required permissions for action | `['po.edit', 'po.delete']` |
| `allowedActions` | `string[]` | Specific allowed actions | `['view', 'edit', 'approve']` |
| `fallbackComponent` | `ReactNode` | Component shown when access denied | `<span>Access Denied</span>` |

### Audit Trail Configuration

| Prop | Type | Purpose | Example |
|------|------|---------|---------|
| `auditTrail.enabled` | `boolean` | Enable audit logging | `true` |
| `auditTrail.logUserActions` | `boolean` | Log user interactions | `true` |
| `auditTrail.trackChanges` | `boolean` | Track data changes | `true` |
| `auditTrail.encryptionLevel` | `string` | Data encryption level | `'field'` \| `'form'` \| `'page'` |

---

## 🎯 Common Usage Patterns

### CRUD Operations Pattern

| Operation | Components Used | Code Pattern |
|-----------|----------------|--------------|
| **List** | `EditableDataGrid`, `SearchBox`, `FilterPanel` | `<SearchBox /><FilterPanel /><EditableDataGrid />` |
| **Create** | `FormLayout`, `Input`, `Select`, `Button` | `<FormLayout><Input /><Button>Create</Button></FormLayout>` |
| **Edit** | `Modal`, `FormLayout`, Form components | `<Modal><FormLayout>...form fields</FormLayout></Modal>` |
| **Delete** | `Modal`, `Button`, `Alert` | `<Modal><Alert variant="error"><Button>Delete</Button></Alert></Modal>` |

### Form Wizard Pattern

| Step | Components | Code Pattern |
|------|------------|--------------|
| **Multi-step** | `FormLayout`, `ProgressTracker` | `<FormLayout steps={steps}><ProgressTracker /></FormLayout>` |
| **Navigation** | `Button` group | `<Button variant="outline">Previous</Button><Button>Next</Button>` |
| **Validation** | `Alert`, `Input` with `status` | `<Input status="error" errorMessage="Required" />` |

### Dashboard Pattern

| Section | Components | Code Pattern |
|---------|------------|--------------|
| **Layout** | `DashboardLayout` | `<DashboardLayout header={} sidebar={}>{content}</DashboardLayout>` |
| **Metrics** | `MetricCard` | `<MetricCard title="Revenue" value="$100K" change="+12%" />` |
| **Data** | `EditableDataGrid` | `<EditableDataGrid columns={} data={} />` |
| **Actions** | `Button`, `SearchBox` | `<SearchBox /><Button>Add New</Button>` |

---

## 🔧 Utility Functions & Hooks

### Class Name Utilities

| Function | Import | Usage | Purpose |
|----------|--------|-------|---------|
| `cn()` | `import { cn } from 'utils'` | `cn('class1', 'class2', condition && 'class3')` | Merge Tailwind classes with conflict resolution |

### Icon Mapping

| Category | Available Icons | Usage Pattern |
|----------|----------------|---------------|
| **Basic** | `check`, `x`, `plus`, `minus` | `<Icon name="check" />` |
| **Arrows** | `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right` | `<Icon name="arrow-right" />` |
| **UI** | `search`, `menu`, `settings`, `filter` | `<Icon name="search" />` |
| **Status** | `info`, `warning`, `error`, `success` | `<Icon name="warning" />` |
| **Actions** | `edit`, `trash`, `save`, `download` | `<Icon name="edit" />` |

### Theme Hook

| Hook | Import | Usage | Returns |
|------|--------|-------|---------|
| `useTheme` | `import { useTheme }` | `const { theme, toggleTheme } = useTheme()` | `{ theme: 'light' \| 'dark', toggleTheme: () => void }` |

### Toast Hook

| Hook | Import | Usage | Methods |
|------|--------|-------|---------|
| `useToast` | `import { useToast }` | `const { showToast } = useToast()` | `showToast({ title, description, variant, duration })` |

---

## 🚀 Quick Start Templates

### Basic App Setup

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, ToastContainer } from 'reusable-components';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
          <ToastContainer position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
```

### Dashboard Page Template

```tsx
import { DashboardLayout, MetricCard, EditableDataGrid, SearchBox, Button } from 'reusable-components';

function Dashboard() {
  return (
    <DashboardLayout
      header={{
        title: "Dashboard",
        actions: [<SearchBox key="search" />, <Button key="new">New</Button>]
      }}
      sidebar={{ items: navItems }}
      metrics={[
        { title: "Revenue", value: "$125K", change: "+12%" },
        { title: "Orders", value: "1,234", change: "+8%" }
      ]}
    >
      <EditableDataGrid columns={columns} data={data} />
    </DashboardLayout>
  );
}
```

### Form Page Template

```tsx
import { FormLayout, Input, Select, Button, useToast } from 'reusable-components';

function CreateOrder() {
  const { showToast } = useToast();
  
  return (
    <FormLayout title="Create Order" steps={steps}>
      <div className="space-y-4">
        <Input label="Order Number" required />
        <Select label="Vendor" options={vendors} searchable />
        <div className="flex gap-4">
          <Button variant="outline">Save Draft</Button>
          <Button variant="primary">Create Order</Button>
        </div>
      </div>
    </FormLayout>
  );
}
```

---

## 📊 Component Prop Reference

### Size Variants

| Size | Usage | Components |
|------|-------|------------|
| `xs` | Extra small | Icon |
| `sm` | Small | Button, Input, Badge |
| `md` | Medium (default) | All components |
| `lg` | Large | Button, Input, Modal |
| `xl` | Extra large | Button, Icon |

### Color Variants

| Variant | Usage | Components |
|---------|-------|------------|
| `primary` | Main actions | Button, Badge, Alert |
| `secondary` | Secondary actions | Button, Badge |
| `outline` | Outlined style | Button |
| `ghost` | Minimal style | Button |
| `destructive` | Delete/dangerous actions | Button, Alert |
| `success` | Success states | Badge, Alert, Status |
| `warning` | Warning states | Badge, Alert, Status |
| `error` | Error states | Badge, Alert, Status |

### Status Values

| Status | Visual | Usage |
|--------|--------|-------|
| `default` | Normal state | All form components |
| `error` | Red border/text | Form validation |
| `warning` | Yellow border/text | Form warnings |
| `success` | Green border/text | Form success |
| `pending` | Blue/gray | Processing states |
| `approved` | Green | Approval workflows |
| `rejected` | Red | Approval workflows |

This tabular reference provides quick access to all component information, making it easy for AI systems to understand and implement the component library efficiently. 