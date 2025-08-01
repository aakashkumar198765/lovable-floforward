# Reusable Components Library - Documentation

This is the comprehensive documentation website for the Reusable Components Library, an enterprise-grade React component library built with TypeScript and Tailwind CSS.

## 🚀 Quick Start

### Option 1: View Online
Open `docs/index.html` directly in your web browser to view the documentation.

### Option 2: Serve Locally
For the best experience, serve the documentation locally:

```bash
# Using Python 3
cd docs
python -m http.server 8000

# Using Node.js (if you have http-server installed)
cd docs
npx http-server -p 8000

# Using PHP
cd docs
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📁 Documentation Structure

```
docs/
├── index.html              # Main documentation page
├── assets/
│   ├── css/
│   │   └── main.css        # Styling for the documentation
│   ├── js/
│   │   └── main.js         # Interactive functionality
│   └── images/             # Documentation images
├── components/             # Individual component pages
│   ├── atoms/             # Atomic component docs
│   ├── molecules/         # Molecular component docs
│   ├── organisms/         # Organism component docs
│   └── templates/         # Template component docs
├── examples/              # Usage examples
└── guides/               # Getting started guides
```

## 🎯 Features

### Interactive Documentation
- **Live Code Examples**: Copy-paste ready code snippets
- **Component Previews**: Visual previews of components in action
- **Interactive Tabs**: Multiple examples per component
- **Search Functionality**: Quick component lookup
- **Responsive Design**: Works on all screen sizes

### Comprehensive Coverage
- **65+ Components**: Full component library documentation
- **4-Tier Architecture**: Atoms, Molecules, Organisms, Templates
- **Enterprise Features**: Commerce states, audit trails, RBAC
- **TypeScript Support**: Complete type definitions
- **Accessibility**: WCAG 2.1 compliance information

### Developer-Friendly
- **Copy Code Buttons**: One-click code copying
- **API Reference**: Complete props documentation
- **Usage Examples**: Real-world use cases
- **Best Practices**: Implementation guidelines
- **Mobile Navigation**: Touch-friendly mobile experience

## 🎨 Component Categories

### Tier 1: Atomic Components (32+ components)
Basic building blocks that form the foundation of your UI:
- **Form Components**: Button, Input, Select, Checkbox, Radio, Switch, DatePicker, FileUpload
- **Display Components**: Avatar, Badge, Icon, Label, Status, ThemeToggle, Tooltip
- **Feedback Components**: Alert, LoadingState, Modal, Spinner, Toast
- **Navigation Components**: Breadcrumb, Menu, NavigationButton, Pagination, Tab

### Tier 2: Molecular Components (15+ components)
Component combinations for common UI patterns:
- **Data Components**: SearchBox, FilterPanel, SortControl, BulkActions
- **Form Compositions**: AddressForm, ContactForm, PaymentForm, ApprovalForm
- **Display Compositions**: StatusCard, MetricCard, SummaryPanel, ProgressTracker

### Tier 3: Organism Components (12+ components)
Complex, feature-rich components for enterprise applications:
- **Data Grids**: EditableDataGrid, ComparisonTable, PivotTable
- **Workflow Components**: ApprovalWorkflow, StateTransition, WorkflowTracker
- **Management Components**: SettingsManager, UserManager, RoleManager
- **Integration Components**: ImportWizard, ExportManager, APIConnector

### Tier 4: Template Components (6+ components)
Complete page layouts and templates:
- **Layout Templates**: DashboardLayout, FormLayout, ListDetailLayout
- **Page Templates**: SettingsPage, ReportsPage, WorkflowPage

## 🏢 Enterprise Features

### Commerce State Awareness
Components adapt their behavior based on transaction states:
- **Initiation**: Normal editing mode
- **Agreement**: Restricted editing, pending approval
- **Execution**: Processing state, limited actions
- **Settlement**: Readonly mode with settlement actions
- **Completion**: Readonly, historical view

### Role-Based Access Control (RBAC)
Components respect user permissions and roles:
- Permission-based component visibility
- Action-level access control
- Role-based UI customization

### Audit Trail & Security
Comprehensive logging and security features:
- User action tracking
- Change history logging
- Data encryption support
- Compliance reporting

### AI Configuration
AI-powered component customization:
- Layout optimization
- Feature suggestions
- Performance insights
- Usage analytics

## 🔧 Development

### Local Development
1. Clone the repository
2. Navigate to the `docs` folder
3. Serve the files using your preferred method
4. Open in browser at `http://localhost:8000`

### Updating Documentation
1. Edit the HTML content in `index.html`
2. Update styles in `assets/css/main.css`
3. Modify interactive features in `assets/js/main.js`
4. Test changes locally before deploying

### Adding New Components
1. Add component information to the JavaScript component registry
2. Create detailed component documentation in the appropriate section
3. Add API reference information
4. Include usage examples and best practices

## 📱 Browser Support

The documentation website supports:
- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 88+
- **Responsive Design**: Works on screens from 320px to 4K

## 🎯 Navigation Guide

### Main Navigation
- **Overview**: Library introduction and architecture
- **Getting Started**: Installation and quick start guide
- **Components**: Browse all components by category
- **Examples**: Real-world usage examples
- **API Reference**: Complete props and methods documentation

### Sidebar Navigation
- **Quick Search**: Filter components by name
- **Category Browsing**: Navigate by component tier
- **Enterprise Features**: Advanced functionality documentation

### Interactive Elements
- **Code Examples**: Click to copy code snippets
- **Component Previews**: See components in action
- **Modal Details**: Detailed component information
- **Responsive Menu**: Mobile-friendly navigation

## 🔍 Search Tips

- Use the search box to quickly find components
- Search supports partial matches (e.g., "but" finds "Button")
- Categories are filtered based on search terms
- Clear search to see all components

## 📋 Usage Examples

### Basic Component Usage
```jsx
import { Button, Input, Modal } from 'reusable-components';

function MyForm() {
  return (
    <div>
      <Input label="Name" placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </div>
  );
}
```

### Enterprise Features
```jsx
import { Button } from 'reusable-components';

<Button
  commerceState="execution"
  allowedActions={['approve', 'reject']}
  userRole={{ permissions: ['po.approve'] }}
  auditTrail={{ enabled: true, logUserActions: true }}
>
  Approve Purchase Order
</Button>
```

### Data Management
```jsx
import { EditableDataGrid, SearchBox, FilterPanel } from 'reusable-components';

function UserManagement() {
  return (
    <div>
      <SearchBox onSearch={handleSearch} />
      <FilterPanel filters={filterConfig} />
      <EditableDataGrid
        columns={columns}
        data={users}
        editable
        sortable
        filterable
      />
    </div>
  );
}
```

## 🆘 Support & Feedback

### Getting Help
- Browse the comprehensive component documentation
- Check the examples section for usage patterns
- Review the API reference for prop details
- Look at the best practices guides

### Reporting Issues
- Document any bugs or issues you encounter
- Provide browser and version information
- Include steps to reproduce the problem
- Suggest improvements or new features

### Contributing
- Follow the established documentation patterns
- Ensure examples are tested and functional
- Include both basic and advanced usage examples
- Maintain consistent formatting and style

## 📄 License

This documentation is part of the Reusable Components Library project. Please refer to the main project license for usage terms.

---

**Documentation Version**: 1.0.0  
**Last Updated**: January 2025  
**Library Version**: 0.1.0

For questions about the component library or this documentation, please contact the development team.