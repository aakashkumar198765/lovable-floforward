# Workflow-Driven React Application Architecture Guide

## Overview

This comprehensive guide establishes the conventions, directory structure, and design patterns for building highly scalable, consistent, and maintainable workflow-centric React applications. The architecture ensures business-aligned modularity, state-specific customization, reusable UI components, and enhanced developer productivity through clear patterns and AI-assisted development.

## Core Architecture Principles

### Business-Domain Modularization

Each business process (e.g., "Plans", "Production") is organized as a dedicated module, avoiding generic "Workflow" folders in favor of domain-specific naming.

### State-Specific Page Structure

Every workflow state receives its own complete set of pages (List, Detail, Create, Import, Export) to accommodate distinct schemas and business logic requirements.

### Unified Navigation System

- Primary navigation at the top level
- Secondary navigation (tabs/menus) for states, auto-generated from state machine definitions
- Single source of truth for all navigation elements

### Component-Driven UI

All pages utilize a shared, theme-aware component library ensuring consistency and maintainability.

### Service Layer Architecture

All backend/API interactions flow through a standardized services layer, keeping business logic separate from UI components.

### Pattern-Based Development

Canonical code examples guide developers, facilitate onboarding, and enable AI-assisted code generation.

## Project Structure

```
/project-root
├── /src
│   ├── /components                 # Reusable UI components
│   │   ├── TopNav.jsx             # Primary navigation
│   │   ├── TabNav.jsx             # Secondary navigation
│   │   └── ...
│   ├── /layouts
│   │   └── MainLayout.jsx         # Page structure wrapper
│   ├── /modules
│   │   ├── /Plans                 # Business domain module
│   │   │   ├── index.jsx          # State controller & navigation
│   │   │   └── /states
│   │   │       ├── /Created
│   │   │       │   ├── List.jsx
│   │   │       │   ├── Detail.jsx
│   │   │       │   ├── Create.jsx
│   │   │       │   ├── Import.jsx
│   │   │       │   └── Export.jsx
│   │   │       ├── /Approved
│   │   │       │   ├── List.jsx
│   │   │       │   ├── Detail.jsx
│   │   │       │   ├── Create.jsx
│   │   │       │   ├── Import.jsx
│   │   │       │   └── Export.jsx
│   │   │       └── ...
│   │   ├── /Production            # Additional workflow module
│   │   │   ├── index.jsx
│   │   │   └── /states
│   │   │       ├── /Scheduled
│   │   │       ├── /Running
│   │   │       ├── /Finished
│   │   │       └── ...
│   │   ├── /MasterData            # Non-workflow module
│   │   ├── /Settings
│   │   └── /Login
│   ├── /schemas                   # State-specific schemas
│   │   ├── plans.created.schema.json
│   │   ├── plans.approved.schema.json
│   │   ├── production.scheduled.schema.json
│   │   └── ...
│   ├── /statemachines             # Workflow definitions
│   │   ├── plans.machine.json
│   │   ├── production.machine.json
│   │   └── ...
│   ├── /services
│   │   ├── paramSDKAdapter.js     # Low-level API adapter
│   │   ├── paramSDKAPI.js         # Business logic service layer
│   │   └── workflowHelpers.js     # Workflow utilities
│   ├── /config
│   │   └── modulesManifest.json   # Module registration
│   ├── /theme
│   │   ├── colors.js
│   │   ├── typography.js
│   │   └── globalStyles.js
│   ├── routes.js
│   ├── App.jsx
│   └── index.js
├── /examples                      # Canonical page templates
│   ├── StateListExample.jsx
│   ├── StateDetailExample.jsx
│   ├── StateCreateExample.jsx
│   ├── StateImportExample.jsx
│   └── StateExportExample.jsx
├── /public
├── package.json
└── README.md
```

## Configuration and Registration

### Module Manifest Configuration

The `/src/config/modulesManifest.json` file defines module metadata for routing, navigation, and code generation:

```json
[
  {
    "name": "plans",
    "type": "workflow",
    "path": "/plans",
    "statemachine": "plans.machine.json"
  },
  {
    "name": "production",
    "type": "workflow",
    "path": "/production",
    "statemachine": "production.machine.json"
  },
  {
    "name": "settings",
    "type": "nonworkflow",
    "path": "/settings"
  }
]
```

### State Machine Definition

Each workflow module references a JSON file describing its states and transitions:

**Example:** `/src/statemachines/plans.machine.json`

```json
{
  "states": [
    { "name": "Created", "display": "Created" },
    { "name": "Approved", "display": "Approved" },
    { "name": "InProgress", "display": "In Progress" },
    { "name": "Completed", "display": "Completed" }
  ],
  "transitions": [
    { "from": "Created", "to": "Approved", "action": "approve" },
    { "from": "Approved", "to": "InProgress", "action": "start" },
    { "from": "InProgress", "to": "Completed", "action": "complete" }
  ]
}
```

## State-Specific Page Architecture

### Page Types per State

Each workflow state maintains its own complete set of pages to accommodate unique schemas and business requirements:

- **List.jsx** - Data table with state-specific filtering and columns
- **Detail.jsx** - Read-only view with state-appropriate actions
- **Create.jsx** - Form using state-specific schema validation
- **Import.jsx** - Bulk data import with state-specific templates
- **Export.jsx** - Data export with state-specific formatting

### Schema Organization

Schemas are stored in `/schemas/` using the naming convention: `<module>.<state>.schema.json`

Examples:
- `plans.created.schema.json`
- `plans.approved.schema.json`
- `production.scheduled.schema.json`

## Navigation System

### Primary Navigation Flow

```
TopNav → Module Selection → TabNav (States) → Page Type Selection
```

### Navigation Hierarchy

```
TopNav (Modules)
└── Plans Module
    └── TabNav (States: Created, Approved, InProgress, Completed)
        └── Page Actions (List, Detail, Create, Import, Export)
```

### Module Index Implementation

The `index.jsx` file in each workflow module:

1. Reads the corresponding state machine definition
2. Renders the `TabNav` component for state navigation
3. Manages active state selection
4. Routes to appropriate state pages
5. Provides default routing to List view

## Service Layer Architecture

### Service Layer Components

**paramSDKAPI.js (Business Logic Layer)**
- Primary interface for all UI components
- Handles business logic and data transformation
- Manages application state and caching

**paramSDKAdapter.js (Integration Layer)**
- Low-level API communication
- Protocol-specific implementations
- Error handling and retry logic

**workflowHelpers.js (Workflow Utilities)**
- State transition logic
- Permission and role validation
- Workflow-specific business rules

### Service Usage Pattern

```javascript
// In React components - always use business layer
import { getPlansData, createPlan } from '../services/paramSDKAPI';

// Never directly import adapter in UI components
// import { apiCall } from '../services/paramSDKAdapter'; // ❌ Don't do this
```

## Development Standards

### Canonical Examples

The `/examples` directory contains template implementations for each page type. All new state pages should be generated from these examples and then customized as needed.

### Development Workflow

1. **Module Creation**
   - Add entry to `modulesManifest.json`
   - Create module directory structure
   - Define state machine JSON

2. **State Implementation**
   - Create state subdirectory
   - Generate pages from canonical examples
   - Implement state-specific schema
   - Configure navigation and routing

3. **Component Usage**
   - Use shared components from `/components`
   - Apply consistent theming
   - Follow established patterns

### Code Organization Rules

✅ **Do:**
- Use business-domain module names
- Create separate pages for each state
- Keep business logic in service layer
- Generate pages from canonical examples
- Maintain schema consistency

❌ **Don't:**
- Put API calls directly in components
- Use generic "Workflow" folder names
- Share pages between different states
- Hardcode workflow logic in UI

## Maintenance and Scaling

### Evolution Strategy

1. **Pattern Updates** - Evolve canonical examples as best practices change
2. **Schema Management** - Keep schemas synchronized with state machine definitions
3. **Component Library** - Continuously improve shared components
4. **Service Layer** - Maintain clean API abstractions

### Performance Considerations

- State-specific page loading reduces bundle size
- Lazy loading of workflow modules
- Optimized component reuse across states
- Efficient API service layer caching

## Implementation Checklist

### New Module Setup

- [ ] Add module entry to `modulesManifest.json`
- [ ] Create module folder structure in `/modules/`
- [ ] Define state machine JSON file
- [ ] Create schema files for each state

### State Implementation

- [ ] Create state subdirectories
- [ ] Generate List, Detail, Create, Import, Export pages from examples
- [ ] Implement state-specific schemas
- [ ] Configure state navigation
- [ ] Test all page transitions

### Quality Assurance

- [ ] Verify navigation between modules and states
- [ ] Test all CRUD operations
- [ ] Validate schema compliance
- [ ] Ensure component consistency
- [ ] Verify service layer integration

## Frequently Asked Questions

**Q: Why create separate pages for each state instead of sharing them?**

A: Each workflow state often requires different schemas, validation rules, available actions, and UI layouts. State-specific pages provide maximum flexibility and prevent complex conditional logic that would make shared pages difficult to maintain.

**Q: How are schemas organized and referenced?**

A: Schemas are stored in the `/schemas/` directory using the naming convention `<module>.<state>.schema.json`. This allows for easy lookup and maintains clear relationships between states and their data structures.

**Q: Can non-workflow modules use the same structure?**

A: Yes, but non-workflow modules only require a single level of CRUD pages without state-specific subdirectories. They follow the same component and service layer patterns.

**Q: How is navigation automatically generated?**

A: The module's `index.jsx` reads the state machine definition and generates the `TabNav` component dynamically. This ensures navigation always reflects the current workflow configuration.

**Q: What happens when workflow requirements change?**

A: Update the state machine JSON file, add or modify schemas as needed, and create or update the corresponding state pages. The navigation will automatically reflect these changes.

## Conclusion

This architecture provides a robust foundation for enterprise-grade workflow applications. By combining business-domain modularity, state-specific customization, reusable components, and clear service layer separation, it enables teams to build maintainable, scalable applications that can evolve with changing business requirements.

The pattern-based approach facilitates both human developer productivity and AI-assisted development, ensuring consistent code quality and accelerated delivery timelines.

**Remember to keep this guide current as your application and best practices evolve. Regular updates to canonical examples and architectural patterns will maintain the system's effectiveness over time.**