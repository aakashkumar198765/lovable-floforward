import React, { useState } from 'react';
import { 
  Button, 
  Badge, 
  Modal, 
  Tab,
  EditableDataGrid,
  Icon
} from '../components';
import SchemaPreview from './SchemaPreview';

// Generate random data based on schema property type
const generateRandomValue = (property) => {
  const { type, format, enum: enumValues } = property;
  
  if (enumValues && enumValues.length > 0) {
    return enumValues[Math.floor(Math.random() * enumValues.length)];
  }
  
  switch (type) {
    case 'string':
      if (format === 'email') return `user${Math.floor(Math.random() * 1000)}@example.com`;
      if (format === 'date') return new Date().toISOString().split('T')[0];
      if (property.title?.toLowerCase().includes('number') || property.title?.toLowerCase().includes('id')) {
        return `DOC-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      }
      return property.title || `Sample Text ${Math.floor(Math.random() * 100)}`;
    case 'number':
    case 'integer':
      return Math.floor(Math.random() * 1000) + 1;
    case 'boolean':
      return Math.random() > 0.5;
    case 'array':
      return [`Item ${Math.floor(Math.random() * 10)}`];
    case 'object':
      return { value: `Object ${Math.floor(Math.random() * 10)}` };
    default:
      return 'N/A';
  }
};

// Generate a full schema document with random data - maintaining nested structure
const generateSchemaDocument = (schema, docNumber) => {
  const document = {
    _id: `doc_${docNumber}`,
  };
  
  // Process each group in the schema order
  if (schema.order) {
    schema.order.forEach(groupKey => {
      const groupSchema = schema.properties[groupKey];
      if (groupSchema && groupSchema.properties) {
        document[groupKey] = {};
        
        // Process properties within the group
        Object.keys(groupSchema.properties).forEach(propKey => {
          const property = groupSchema.properties[propKey];
          document[groupKey][propKey] = generateRandomValue(property);
        });
      }
    });
  }
  
  return document;
};

// Generate sample documents for a given schema
const generateSampleDocuments = (schema, count = 5) => {
  if (!schema) return [];
  
  const documents = [];
  for (let i = 1; i <= count; i++) {
    documents.push(generateSchemaDocument(schema, i));
  }
  return documents;
};

// Extract documents from preview data for a given workflow and state
const getDocumentsFromPreviewData = (previewData, workflowName, stateName) => {
  if (!previewData || previewData.length === 0) return [];

  const documents = [];
  
  previewData.forEach((instance, index) => {
    // Find the workflow data in the instance
    const workflowData = instance[workflowName];
    if (workflowData && workflowData[stateName]) {
      // Create a document from the state data
      const document = {
        _id: `preview_doc_${instance.instance_id || index + 1}`,
        instance_id: instance.instance_id || index + 1,
        ...workflowData[stateName]
      };
      documents.push(document);
    }
  });

  return documents;
};

const WorkflowPreview = ({ stateMachines = {}, schemas = {}, previewData = [] }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState(
    Object.keys(stateMachines).length > 0 ? Object.keys(stateMachines)[0] : ''
  );
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Sort workflows by Index value (handling negative indices properly)
  const workflows = Object.keys(stateMachines).sort((a, b) => {
    const workflowA = stateMachines[a];
    const workflowB = stateMachines[b];
    
    // Get Index values, default to 0 if not present
    const indexA = typeof workflowA.Index === 'number' ? workflowA.Index : 0;
    const indexB = typeof workflowB.Index === 'number' ? workflowB.Index : 0;
    
    return indexA - indexB;
  });
  
  const currentWorkflow = stateMachines[selectedWorkflow];
  
  // Get substates in order based on Start and NextState
  const getSubStatesInOrder = (subStates) => {
    if (!subStates || Object.keys(subStates).length === 0) return [];
    
    const orderedSubStates = [];
    
    // Find the starting substate
    let currentSubState = Object.keys(subStates).find(key => subStates[key].Start === true);
    
    if (!currentSubState) {
      console.warn('No starting substate found');
      return Object.keys(subStates); // Fallback to all substates
    }
    
    while (currentSubState && subStates[currentSubState]) {
      const subState = subStates[currentSubState];
      orderedSubStates.push(currentSubState);
      
      // Break if this is the end substate
      if (subState.End === true) {
        break;
      }
      
      // Move to next substate
      const nextSubState = subState.NextState;
      if (!nextSubState || !subStates[nextSubState]) {
        break;
      }
      
      currentSubState = nextSubState;
      
      // Prevent infinite loops
      if (orderedSubStates.length > 10) {
        console.warn('Breaking infinite loop in substates');
        break;
      }
    }
    
    return orderedSubStates;
  };

  // Get states in workflow order based on StartAt and NextState
  const getWorkflowStates = (workflow) => {
    if (!workflow || !workflow.States) return [];
    
    const orderedStates = [];
    let currentState = workflow.StartAt;
    
    // Safety check for StartAt
    if (!currentState || !workflow.States[currentState]) {
      console.warn('Invalid StartAt state:', currentState);
      return Object.keys(workflow.States); // Fallback to all states
    }
    
    while (currentState && workflow.States[currentState]) {
      const state = workflow.States[currentState];
      
      // Check if this state has substates
      if (state.SubStates && Object.keys(state.SubStates).length > 0) {
        // Get substates in order
        const orderedSubStates = getSubStatesInOrder(state.SubStates);
        
        // Add each substate with format "StateName : SubStateName"
        orderedSubStates.forEach(subState => {
          orderedStates.push(`${currentState}:${subState}`);
        });
      } else {
        // Add the state without substates
        orderedStates.push(currentState);
      }
      
      // Break conditions:
      // 1. If state has End: true
      // 2. If NextState schema is commerce and Props.Flip is not true
      if (state && state.End) {
        break;
      }
      
      const nextState = state ? state.NextState : null;
      if (!nextState) {
        break;
      }
      
      // Check if next state exists before accessing it
      if (!workflow.States[nextState]) {
        console.warn('NextState not found:', nextState);
        break;
      }
      
      const nextStateObj = workflow.States[nextState];
      if (nextStateObj && nextStateObj.Schema && 
          (nextStateObj.Schema.includes('Commerce') || nextStateObj.Schema.includes('commerce')) && 
          (!nextStateObj.Props || !nextStateObj.Props.Flip)) {
        break;
      }
      
      currentState = nextState;
      
      // Prevent infinite loops
      if (orderedStates.length > 20) {
        console.warn('Breaking infinite loop in workflow states');
        break;
      }
    }
    
    return orderedStates;
  };
  
  const states = React.useMemo(() => {
    const result = currentWorkflow ? getWorkflowStates(currentWorkflow) : [];
    console.log('Generated states for workflow:', selectedWorkflow, result);
    return result;
  }, [currentWorkflow]);
  
  // Initialize selected state when workflow changes or stateMachines data changes
  React.useEffect(() => {
    if (currentWorkflow && states.length > 0) {
      const firstState = states[0];
      
      // Handle both "State" and "State:SubState" formats for validation
      const mainStateKey = firstState.includes(':') ? firstState.split(':')[0] : firstState;
      
      if (firstState && currentWorkflow.States[mainStateKey]) {
        console.log('Setting selectedState to:', firstState);
        setSelectedState(firstState);
      } else {
        console.warn('First state not found, resetting selected state');
        setSelectedState(null);
      }
    } else {
      setSelectedState(null);
    }
    
    // Reset view mode and selected document when workflow changes
    setViewMode('list');
    setSelectedDocument(null);
  }, [selectedWorkflow, stateMachines, schemas]);

  // Update selected workflow when stateMachines data changes
  React.useEffect(() => {
    const workflowKeys = Object.keys(stateMachines);
    if (workflowKeys.length > 0 && (!selectedWorkflow || !stateMachines[selectedWorkflow])) {
      setSelectedWorkflow(workflowKeys[0]);
    }
  }, [stateMachines]);

  // Reset view mode and selected document when state changes
  React.useEffect(() => {
    if (selectedState) {
      setViewMode('list');
      setSelectedDocument(null);
    }
  }, [selectedState, previewData]);

  // Debug schema information
  React.useEffect(() => {
    console.log('📊 Schemas received in WorkflowPreview:', schemas);
    console.log('📊 Schema keys:', Object.keys(schemas || {}));
    console.log('📊 Preview data received:', previewData);
    console.log('📊 Current workflow:', selectedWorkflow, currentWorkflow?.Name);
    if (selectedState) {
      const mainStateKey = selectedState.includes(':') ? selectedState.split(':')[0] : selectedState;
      if (currentWorkflow && currentWorkflow.States && currentWorkflow.States[mainStateKey]) {
        const workflowName = currentWorkflow.Name || selectedWorkflow;
        const schemaKey = `${workflowName}-${mainStateKey}`.toLowerCase().replace(/\s+/g, '');
        const schema = schemas[schemaKey];
        console.log('📊 Schema key for selected state:', schemaKey);
        console.log('📊 Schema for selected state:', selectedState, schema);
        
        // Check for preview data for this state
        const previewDocs = getDocumentsFromPreviewData(previewData, workflowName, mainStateKey);
        console.log('📊 Preview docs for selected state:', previewDocs);
      }
    }
  }, [schemas, selectedWorkflow, selectedState, currentWorkflow, previewData]);

  // Function to extract schema from state and find matching schema in dynamic schemas
  const getSchemaFromState = (stateKey) => {
    if (!currentWorkflow || !stateKey || !schemas) {
      return null;
    }
    
    // Handle both "State" and "State:SubState" formats
    const mainStateKey = stateKey.includes(':') ? stateKey.split(':')[0] : stateKey;
    
    if (!currentWorkflow.States[mainStateKey]) {
      return null;
    }
    
    const state = currentWorkflow.States[mainStateKey];
    
    // Create schema key from workflow name and state name
    const workflowName = currentWorkflow.Name || selectedWorkflow;
    const schemaKey = `${workflowName}-${mainStateKey}`.toLowerCase().replace(/\s+/g, '');
    
    // Find schema in dynamic schemas object
    const schema = schemas[schemaKey];
    
    return schema || null;
  };

  // State to documents mapping - updated to use real preview data
  const getStateDocuments = (stateKey) => {
    if (!currentWorkflow || !stateKey) return [];

    // Handle both "State" and "State:SubState" formats
    const mainStateKey = stateKey.includes(':') ? stateKey.split(':')[0] : stateKey;
    const workflowName = currentWorkflow.Name || selectedWorkflow;

    // Get documents from preview data first
    const previewDocs = getDocumentsFromPreviewData(previewData, workflowName, mainStateKey);
    
    if (previewDocs.length > 0) {
      console.log(`📊 Using ${previewDocs.length} preview documents for ${workflowName}-${mainStateKey}`);
      return previewDocs;
    }

    // If no preview data available, fall back to generating sample data
    const schema = getSchemaFromState(stateKey);
    if (schema) {
      console.warn(`No preview data found for ${workflowName}-${mainStateKey}, falling back to generated data`);
      return generateSampleDocuments(schema, 3);
    }

    return [];
  };

  const currentDocuments = selectedState ? getStateDocuments(selectedState) : [];
  
  // Create workflow tab items
  const workflowTabItems = workflows.map((workflowKey) => ({
    id: workflowKey,
    label: stateMachines[workflowKey].Name,
    content: null // We'll handle content separately
  }));

  // Document grid columns
  const getDocumentColumns = () => {
    const schema = getSchemaFromState(selectedState);
    if (!schema) return [];

    const columns = [];
    
    // Collect all fields with index > 99
    const indexedFields = [];
    
    if (schema.order) {
      schema.order.forEach(groupKey => {
        const groupSchema = schema.properties[groupKey];
        if (groupSchema && groupSchema.properties) {
          Object.keys(groupSchema.properties).forEach(propKey => {
            const property = groupSchema.properties[propKey];
            const fieldIndex = property.index;
            
            // Only include fields with index > 99
            if (fieldIndex && fieldIndex > 99) {
              indexedFields.push({
                key: `${groupKey}.${propKey}`,
                title: property.title || propKey,
                index: fieldIndex,
                property: property,
                groupKey: groupKey,
                propKey: propKey
              });
            }
          });
        }
      });
    }
    
    // Sort by index value
    indexedFields.sort((a, b) => a.index - b.index);
    
    // Convert to column format
    indexedFields.forEach((field, index) => {
      const isFirstColumn = index === 0; // Make first column clickable
      
      columns.push({
        key: field.key,
        title: field.title,
        width: 180,
        render: (value, record) => {
          const nestedValue = record[field.groupKey]?.[field.propKey];
          
          // All columns now show plain data since row is clickable
          if (field.property.type === 'boolean') {
            return (
              <Badge variant={nestedValue ? "success" : "secondary"}>
                {nestedValue ? "Yes" : "No"}
              </Badge>
            );
          } else if (field.property.format === 'date' && nestedValue) {
            return new Date(nestedValue).toLocaleDateString();
          } else {
            return nestedValue || '-';
          }
        }
      });
    });
    
    // If no indexed fields found, add a fallback _id column
    if (columns.length === 0) {
      columns.push({
        key: '_id',
        title: 'Document ID',
        width: 180,
        render: (value, record) => record._id || '-'
      });
    }
    
    return columns;
  };

  // Render document detail view (replaces modal)
  const renderDocumentDetailView = () => {
    if (!selectedDocument) return null;

    const schema = getSchemaFromState(selectedState);
    if (!schema) return <div>No schema found for state: {selectedState}</div>;

    // Helper function to get icon based on field type/name
    function getFieldIcon(property, propKey) {
      const title = property.title?.toLowerCase() || propKey.toLowerCase();
      
      // Amount/Price/Value fields
      if (title.includes('amount') || title.includes('price') || title.includes('value') || 
          title.includes('cost') || title.includes('total')) {
        return 'star';
      }
      
      // Date fields
      if (title.includes('date') || title.includes('time') || property.format === 'date') {
        return 'clock';
      }
      
      // Organization/Company/Vendor fields
      if (title.includes('vendor') || title.includes('organization') || title.includes('company') || 
          title.includes('client') || title.includes('buyer') || title.includes('seller')) {
        return 'user-plus';
      }
      
      // ID/Number fields
      if (title.includes('number') || title.includes('id') || title.includes('invoice') || 
          title.includes('order') || title.includes('document') || title.includes('bill')) {
        return 'document';
      }
      
      // Status fields
      if (title.includes('status') || title.includes('state')) {
        return 'check-circle';
      }
      
      // Email fields
      if (title.includes('email') || property.format === 'email') {
        return 'bell';
      }
      
      // Phone/Contact fields
      if (title.includes('phone') || title.includes('telephone') || title.includes('contact')) {
        return 'bell';
      }
      
      // Address fields
      if (title.includes('address') || title.includes('location')) {
        return 'settings';
      }
      
      // Default icon
      return 'circle';
    }

    // Helper function to get color for summary cards
    function getFieldColor(index) {
      const colors = ['blue', 'green', 'purple', 'orange'];
      return colors[index % colors.length];
    }

    // Get the document identifier for the title
    const getDocumentTitle = () => {
      // Try to find a field with "Number" or "ID" in title
      if (schema.order) {
        for (const groupKey of schema.order) {
          const groupSchema = schema.properties[groupKey];
          if (groupSchema?.properties) {
            for (const [propKey, property] of Object.entries(groupSchema.properties)) {
              if (property.index && property.index > 99 && 
                  (property.title?.toLowerCase().includes('number') || 
                   property.title?.toLowerCase().includes('id'))) {
                return selectedDocument[groupKey]?.[propKey] || selectedDocument._id;
              }
            }
          }
        }
      }
      return selectedDocument._id;
    };

    // Collect and organize fields with index > 99 by groups
    const organizedData = [];
    let allFields = [];
    
    if (schema.order) {
      schema.order.forEach(groupKey => {
        const groupSchema = schema.properties[groupKey];
        if (groupSchema?.properties) {
          const groupFields = [];
          
          Object.entries(groupSchema.properties).forEach(([propKey, property]) => {
            if (property.index && property.index > 99) {
              const fieldData = {
                key: propKey,
                title: property.title || propKey,
                value: selectedDocument[groupKey]?.[propKey],
                type: property.type,
                format: property.format,
                index: property.index,
                groupKey,
                icon: getFieldIcon(property, propKey),
                priority: getFieldPriority(property, propKey)
              };
              
              allFields.push(fieldData);
              groupFields.push(fieldData);
            }
          });
          
          if (groupFields.length > 0) {
            // Sort fields within group by index
            groupFields.sort((a, b) => a.index - b.index);
            
            organizedData.push({
              groupKey,
              groupTitle: groupSchema.title || groupKey,
              fields: groupFields
            });
          }
        }
      });
    }

    // Helper function to assign priority to fields for summary
    function getFieldPriority(property, propKey) {
      const title = property.title?.toLowerCase() || propKey.toLowerCase();
      
      // High priority fields (for summary)
      if (title.includes('number') || title.includes('id') || title.includes('invoice')) return 10;
      if (title.includes('amount') || title.includes('total') || title.includes('value')) return 9;
      if (title.includes('date')) return 8;
      if (title.includes('vendor') || title.includes('organization') || title.includes('client')) return 7;
      if (title.includes('status') || title.includes('state')) return 6;
      
      // Medium priority
      if (title.includes('name') || title.includes('type')) return 5;
      
      // Low priority
      return 1;
    }

    // Select top 4 fields for summary based on priority and index
    const summaryFields = allFields
      .sort((a, b) => {
        // First sort by priority (higher priority first)
        if (a.priority !== b.priority) return b.priority - a.priority;
        // Then by index (lower index first, as they're more important)
        return a.index - b.index;
      })
      .slice(0, 4)
      .map((field, index) => ({
        ...field,
        color: getFieldColor(index)
      }));

    const formatValue = (value, type, format) => {
      if (value === null || value === undefined || value === '') return '-';
      
      if (type === 'boolean') {
        return (
          <Badge variant={value ? "success" : "secondary"}>
            {value ? "Yes" : "No"}
          </Badge>
        );
      } else if (format === 'date' || type === 'date') {
        // Better date handling
        if (typeof value === 'string' && value.length > 0) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString();
            }
          } catch (e) {
            // If date parsing fails, return the original value
          }
        }
        return value;
      } else if (type === 'object' && typeof value === 'object') {
        return JSON.stringify(value, null, 2);
      } else if (type === 'array' && Array.isArray(value)) {
        return value.join(', ');
      } else if (type === 'number' || type === 'integer') {
        // Format numbers nicely
        if (typeof value === 'number') {
          return value.toLocaleString();
        }
      }
      
      return String(value);
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-0">
        <div className="max-w-8xl mx-auto space-y-6">

          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Icon name="arrow-left" size="sm" />}
                  onClick={() => {
                    setViewMode('list');
                    setSelectedDocument(null);
                  }}
                >
                  Back to Documents
                </Button>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">
                    {getDocumentTitle()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={<Icon name="printer" size="sm" />}
                  onClick={() => window.print()}
                >
                  Print Document
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  iconLeft={<Icon name="download" size="sm" />}
                  onClick={() => {
                    // Export functionality
                    const dataStr = JSON.stringify(selectedDocument, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const exportFileDefaultName = `${getDocumentTitle()}.json`;
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }}
                >
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {summaryFields.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Document Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {summaryFields.map((field, index) => {
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
                    green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
                    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
                    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400'
                  };

                  return (
                    <div key={field.key} className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colorClasses[field.color]} rounded-full flex items-center justify-center`}>
                        <Icon name={field.icon} size="sm" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{field.title}</p>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                          {formatValue(field.value, field.type, field.format)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Sections Rendering */}
          {organizedData.map((group) => (
            <div key={group.groupKey} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {group.groupTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {field.title}
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {formatValue(field.value, field.type, field.format)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {organizedData.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12">
              <div className="text-center">
                <Icon name="alert-circle" size="xl" className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Detailed Fields Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No fields with index greater than 99 found in this schema.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show loading state if no data
  if (!stateMachines || Object.keys(stateMachines).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Workflows...</h2>
          <p className="text-gray-600">Please wait while workflow data is being loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Workflow Preview</h1>
        <p className="text-gray-600 mt-1">Browse workflows, states, schemas and documents</p>
      </div>

      {/* Workflow Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-max">
            <Tab
              items={workflowTabItems}
              activeTab={selectedWorkflow}
              onChange={(tabId) => setSelectedWorkflow(tabId)}
              variant="pills"
              size="sm"
              className="whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      {/* State Pills */}
      {currentWorkflow && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {states.map((stateKey) => {
              // Handle both "State" and "State:SubState" formats
              const mainStateKey = stateKey.includes(':') ? stateKey.split(':')[0] : stateKey;
              const subStateKey = stateKey.includes(':') ? stateKey.split(':')[1] : null;
              
              const state = currentWorkflow.States[mainStateKey];
              
              // Safety check for state existence
              if (!state) {
                console.warn('State not found:', mainStateKey);
                return null;
              }
              
              const isSelected = selectedState === stateKey;
              const documentCount = getStateDocuments(stateKey).length;
              
              // Get display text
              let displayText;
              if (subStateKey) {
                // For substates, show "State : SubState" format
                const mainStateDesc = state.Desc || mainStateKey;
                displayText = `${mainStateDesc} : ${subStateKey}`;
              } else {
                // For regular states
                displayText = state.Desc || stateKey;
              }
              
              return (
                <button
                  key={stateKey}
                  onClick={() => {
                    console.log('Clicked state:', stateKey, 'Current selectedState:', selectedState);
                    setSelectedState(stateKey);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {displayText}
                  <Badge 
                    variant={isSelected ? "secondary" : "primary"}
                    className="text-xs"
                  >
                    {documentCount}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View Toggle and Content */}
      <div className="px-6 py-6">
        {currentWorkflow && selectedState && (
          <>
            {/* View Toggle Buttons - Only show in list/schema modes, not in detail view */}
            {viewMode !== 'detail' && (
              <div className="flex items-center gap-2 mb-6">
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  iconLeft={<Icon name="document" size="sm" />}
                >
                  Documents
                </Button>
                <Button
                  variant={viewMode === 'schema' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('schema')}
                  iconLeft={<Icon name="settings" size="sm" />}
                >
                  Schema
                </Button>
              </div>
            )}

            {/* Content based on view mode */}
            {viewMode === 'list' ? (
              <EditableDataGrid
                columns={getDocumentColumns()}
                data={currentDocuments}
                sortable={true}
                filterable={true}
                showHeader={false}
                showToolbar={false}
                showAddButton={false}
                showFiltersButton={false}
                showExportButton={false}
                showBulkActions={false}
                className="bg-white rounded-lg shadow"
                onRowClick={(record) => {
                  // Generate full document with all schema properties
                  const schema = getSchemaFromState(selectedState);
                  const fullDocument = generateSchemaDocument(schema, record._id?.slice(-1) || '1');
                  setSelectedDocument(fullDocument);
                  setViewMode('detail');
                }}
                rowClassName="cursor-pointer hover:bg-gray-50 transition-colors"
              />
            ) : viewMode === 'schema' ? (
              <SchemaPreview 
                schema={getSchemaFromState(selectedState)} 
                stateName={selectedState}
              />
            ) : (
              renderDocumentDetailView()
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default WorkflowPreview;