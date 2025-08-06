// Component Registry Configuration
// This file makes it easy to add new components to the documentation

import * as Atoms from '../components/atoms';
import * as Molecules from '../components/molecules';
import * as Organisms from '../components/organisms';
import * as Templates from '../components/templates';

// Component Registry - Add new components here
export const componentRegistry = {
  atoms: {
    display: {
      components: [
        {
          name: 'Avatar',
          component: Atoms.Avatar,
          description: 'User profile pictures with fallbacks and status indicators',
          variations: [
            { name: 'Default', props: { name: 'John Doe', size: 'md' } },
            { name: 'With Image', props: { src: 'https://i.pravatar.cc/150?img=1', name: 'John Doe', size: 'md' } },
            { name: 'Small Size', props: { name: 'John Doe', size: 'sm' } },
            { name: 'Large Size', props: { name: 'John Doe', size: 'lg' } },
            { name: 'With Status', props: { name: 'John Doe', size: 'md', status: 'online' } }
          ]
        },
        {
          name: 'Badge',
          component: Atoms.Badge,
          description: 'Status and info badges with multiple variants',
          variations: [
            { name: 'Primary', props: { variant: 'primary', children: 'Primary' } },
            { name: 'Success', props: { variant: 'success', children: 'Success' } },
            { name: 'Warning', props: { variant: 'warning', children: 'Warning' } },
            { name: 'Danger', props: { variant: 'danger', children: 'Danger' } },
            { name: 'Info', props: { variant: 'info', children: 'Info' } }
          ]
        },
        // Add more display components here...
      ]
    },
    form: {
      components: [
        {
          name: 'Button',
          component: Atoms.Button,
          description: 'Interactive buttons with multiple variants and states',
          variations: [
            { name: 'Primary', props: { variant: 'primary', children: 'Primary Button' } },
            { name: 'Secondary', props: { variant: 'secondary', children: 'Secondary Button' } },
            { name: 'Outline', props: { variant: 'outline', children: 'Outline Button' } },
            { name: 'Ghost', props: { variant: 'ghost', children: 'Ghost Button' } },
            { name: 'Large Size', props: { variant: 'primary', size: 'lg', children: 'Large Button' } },
            { name: 'Small Size', props: { variant: 'primary', size: 'sm', children: 'Small Button' } },
            { name: 'Disabled', props: { variant: 'primary', disabled: true, children: 'Disabled Button' } },
            { name: 'Loading', props: { variant: 'primary', loading: true, children: 'Loading...' } }
          ]
        },
        {
          name: 'Input',
          component: Atoms.Input,
          description: 'Text inputs with validation and state handling',
          variations: [
            { name: 'Basic', props: { placeholder: 'Enter text...', label: 'Basic Input' } },
            { name: 'With Icon', props: { placeholder: 'Search...', label: 'Search Input', icon: 'search' } },
            { name: 'Required', props: { placeholder: 'Required field...', label: 'Required Input', required: true } },
            { name: 'With Error', props: { placeholder: 'Invalid input...', label: 'Input with Error', error: 'This field is required' } },
            { name: 'Disabled', props: { placeholder: 'Disabled...', label: 'Disabled Input', disabled: true } },
            { name: 'Password', props: { type: 'password', placeholder: 'Enter password...', label: 'Password Input' } }
          ]
        },
        // Add more form components here...
      ]
    },
    feedback: {
      components: [
        {
          name: 'Alert',
          component: Atoms.Alert,
          description: 'System alerts with multiple variants and actions',
          variations: [
            { name: 'Info', props: { variant: 'info', children: 'This is an informational alert message.' } },
            { name: 'Success', props: { variant: 'success', children: 'Operation completed successfully!' } },
            { name: 'Warning', props: { variant: 'warning', children: 'Please review this warning message.' } },
            { name: 'Error', props: { variant: 'error', children: 'An error occurred. Please try again.' } },
            { name: 'With Action', props: { variant: 'info', children: 'Alert with action button', action: { label: 'Action', onClick: () => {} } } }
          ]
        },
        // Add more feedback components here...
      ]
    },
    navigation: {
      components: [
        {
          name: 'Breadcrumb',
          component: Atoms.Breadcrumb,
          description: 'Hierarchical navigation breadcrumbs',
          variations: [
            { name: 'Basic', props: { items: [{ label: 'Home', href: '#' }, { label: 'Products', href: '#' }, { label: 'Current Page' }] } },
            { name: 'With Icons', props: { items: [{ label: 'Home', href: '#', icon: 'home' }, { label: 'Products', href: '#', icon: 'package' }, { label: 'Current Page' }] } },
            { name: 'Long Path', props: { items: [{ label: 'Dashboard', href: '#' }, { label: 'Settings', href: '#' }, { label: 'User Management', href: '#' }, { label: 'Permissions', href: '#' }, { label: 'Current' }] } }
          ]
        },
        // Add more navigation components here...
      ]
    }
  },
  molecules: {
    data: {
      components: [
        {
          name: 'SearchBox',
          component: Molecules.SearchBox,
          description: 'Search interface with debouncing',
          variations: [
            { name: 'Basic', props: { placeholder: 'Search products...' } },
            { name: 'With Clear Button', props: { placeholder: 'Search...', showClearButton: true } },
            { name: 'With Search Button', props: { placeholder: 'Enter search term...', showSearchButton: true } }
          ]
        },
        // Add more data components here...
      ]
    },
    display: {
      components: [
        {
          name: 'MetricCard',
          component: Molecules.MetricCard,
          description: 'Data visualization cards with trends',
          variations: [
            { name: 'Basic', props: { title: 'Total Sales', value: '$24,500', trend: '+12%', trendDirection: 'up' } },
            { name: 'Negative Trend', props: { title: 'Active Users', value: '1,234', trend: '-5%', trendDirection: 'down' } },
            { name: 'With Chart', props: { title: 'Revenue', value: '$45,780', trend: '+8%', showChart: true, chartData: [10, 15, 12, 18, 20] } }
          ]
        },
        // Add more display components here...
      ]
    },
    forms: {
      components: [
        {
          name: 'ContactForm',
          component: Molecules.ContactForm,
          description: 'Comprehensive contact information form',
          variations: [
            { name: 'Basic', props: { title: 'Contact Information', showJobInfo: false } },
            { name: 'With Company', props: { title: 'Business Contact', showJobInfo: true, showCompany: true } }
          ]
        },
        // Add more form components here...
      ]
    }
  },
  organisms: {
    'data-grids': {
      components: [
        {
          name: 'EditableDataGrid',
          component: Organisms.EditableDataGrid,
          description: 'Full-featured data grid with editing, sorting, and filtering capabilities',
          variations: [
            {
              name: 'Basic',
              props: {
                columns: [
                  { key: 'name', title: 'Name', editable: true },
                  { key: 'email', title: 'Email', editable: true },
                  { key: 'status', title: 'Status', type: 'select', options: ['Active', 'Inactive'] }
                ],
                data: [
                  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
                  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' }
                ],
                onUpdate: () => {}
              }
            }
          ],
          thirdPartyLibraries: ['react-table', 'date-fns']
        },
        // Add more data grid components here...
      ]
    },
    integration: {
      components: [
        // Add integration components here...
      ]
    },
    management: {
      components: [
        // Add management components here...
      ]
    },
    workflow: {
      components: [
        // Add workflow components here...
      ]
    }
  },
  templates: {
    layouts: {
      components: [
        {
          name: 'DashboardLayout',
          component: Templates.DashboardLayout,
          description: 'Complete dashboard layout with sidebar, header, and responsive content areas',
          variations: [
            {
              name: 'With Sidebar',
              props: {
                sidebar: { title: 'Dashboard', menuItems: ['Overview', 'Analytics', 'Settings'] },
                header: { title: 'Welcome Back', user: 'John Doe' },
                children: 'Main dashboard content goes here...'
              }
            }
          ]
        },
        // Add more layout components here...
      ]
    },
    pages: {
      components: [
        {
          name: 'LoginPage',
          component: Templates.LoginPageTemplate,
          description: 'Enterprise-grade login page template with email and OTP authentication',
          variations: [
            {
              name: 'Default',
              props: {},
              description: 'Complete login page with email validation, OTP verification, social login, and enterprise features'
            }
          ],
          features: [
            'Two-step authentication (email + OTP)',
            'Form validation and error handling',
            'Loading states and user feedback',
            'Social login integration',
            'Remember me functionality',
            'Forgot password support',
            'Responsive design',
            'Accessibility compliance',
            'Enterprise security features'
          ]
        }
      ]
    }
  }
};

// Navigation mapping for DashLite-style sidebar
export const navigationMapping = {
  'Ui Elements': ['atoms.display', 'atoms.form', 'atoms.feedback', 'atoms.navigation'],
  'Components': ['overview', 'installation'],
  'Tables': ['organisms.data-grids'],
  'Forms': ['atoms.form', 'molecules.forms'],
  'Charts': ['molecules.display'],
  'Widgets': ['molecules.data'],
  'Miscellaneous': ['templates.layouts', 'templates.pages', 'organisms.management', 'organisms.integration', 'organisms.workflow']
};

// Helper function to get components by path
export const getComponentsByPath = (path) => {
  const [category, subcategory] = path.split('.');
  return componentRegistry[category]?.[subcategory]?.components || [];
};

// Helper function to get all components for a navigation category
export const getComponentsForNavCategory = (navCategory) => {
  const paths = navigationMapping[navCategory] || [];
  const allComponents = [];
  
  paths.forEach(path => {
    const components = getComponentsByPath(path);
    allComponents.push(...components);
  });
  
  return allComponents;
};

// Helper function to add a new component (for easy extension)
export const addComponent = (category, subcategory, componentConfig) => {
  if (!componentRegistry[category]) {
    componentRegistry[category] = {};
  }
  if (!componentRegistry[category][subcategory]) {
    componentRegistry[category][subcategory] = { components: [] };
  }
  
  componentRegistry[category][subcategory].components.push(componentConfig);
};

// Example of how to add a new component:
// addComponent('atoms', 'display', {
//   name: 'NewComponent',
//   component: NewComponent,
//   description: 'Description of the new component',
//   variations: [
//     { name: 'Default', props: { ... } }
//   ]
// });

export default componentRegistry;