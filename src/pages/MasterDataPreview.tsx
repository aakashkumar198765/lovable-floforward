import React, { useState, useEffect, useMemo } from 'react';
import { Tab, Badge, Button, Icon, EditableDataGrid } from '../components';
import SchemaPreview from './SchemaPreview';
import { getSession } from '../services/paramai_browsersdk';

interface MasterDataPreviewProps {
  projectId?: string;
  mindsConfig?: any;
}

const MasterDataPreview: React.FC<MasterDataPreviewProps> = ({ 
  projectId = "", 
  mindsConfig = {} 
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [viewMode, setViewMode] = useState('documents'); // 'documents' or 'schema'
  
  // New state for master schema session management
  const [masterSchemaSession, setMasterSchemaSession] = useState<any>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [masterSchemas, setMasterSchemas] = useState<Record<string, any>>({});
  const [masterData, setMasterData] = useState<Record<string, any[]>>({});

  // Dynamic tab items based on master schemas
  const tabItems = Object.keys(masterSchemas).map(key => ({
    id: key,
    label: masterSchemas[key].title || key,
  }));

  // Get the schema for the active tab from the dynamic master schemas
  const activeSchema = masterSchemas[activeTab];

  // Check for existing master schema session (similar to MasterSchemaConfig)
  const checkMasterSchemaSession = async () => {
    if (!projectId || !mindsConfig?.masterSchemaMindId) {
      setIsCheckingSession(false);
      return;
    }

    try {
      setIsCheckingSession(true);
      console.log('🔍 Checking master schema session for project:', projectId);
      console.log('🔍 Using mind ID:', mindsConfig.masterSchemaMindId);
      
      // Get all sessions for master schema mind
      const masterSchemaSessions = await getSession(mindsConfig.masterSchemaMindId);
      console.log('🔍 All master schema sessions:', masterSchemaSessions);
      
      // Find sessions matching the project ID and sort by execution time (e_at) to get most recent
      const matchingSessions = masterSchemaSessions?.response?.filter(
        (el: any) => el?.name === projectId
      ) || [];
      
      console.log('🔍 Matching sessions for project:', matchingSessions);
      
      if (matchingSessions.length > 0) {
        // Sort by e_at timestamp (most recent first) and take the first one
        const sortedSessions = matchingSessions.sort((a: any, b: any) => {
          const dateA = new Date(a.e_at || 0);
          const dateB = new Date(b.e_at || 0);
          return dateB.getTime() - dateA.getTime(); // Descending order (most recent first)
        });
        
        const mostRecentSession = sortedSessions[0];
        console.log('🔍 Found', matchingSessions.length, 'sessions for project', projectId);
        console.log('🔍 Most recent session:', mostRecentSession._id, 'executed at:', mostRecentSession.e_at);
        
        // Fetch the specific session content
        const sessionDetails = await getSession(
          mindsConfig.masterSchemaMindId,
          "",
          mostRecentSession._id
        );
        console.log('🔍 Full session details:', sessionDetails);
        
        setMasterSchemaSession(sessionDetails?.response || {});
        setHasExistingSession(true);
        
        // Parse the master schema CSV content and create individual schema objects
        if (sessionDetails?.response?.output?.content) {
          const content = sessionDetails.response.output.content;
          console.log('🔍 Session output content keys:', Object.keys(content));
          
          // Find the first content item that contains CSV data
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('📊 Master Schema CSV content:', csvContent.substring(0, 200));
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              console.log('📊 Parsed master schemas:', Object.keys(parsedSchemas));
              setMasterSchemas(parsedSchemas);
              
              if (Object.keys(parsedSchemas).length > 0) {
                const firstSchemaKey = Object.keys(parsedSchemas)[0];
                
                // Set active tab to first schema if it's not already set
                if (!activeTab) {
                  setActiveTab(firstSchemaKey);
                }
              }
            }
          }
        }
      } else {
        console.log('🔍 No sessions found for project:', projectId);
        setHasExistingSession(false);
        setMasterSchemaSession(null);
        setMasterSchemas({});
        setMasterData({});
      }
    } catch (error) {
      console.error("Error checking master schema session:", error);
      setHasExistingSession(false);
      setMasterSchemaSession(null);
      setMasterSchemas({});
      setMasterData({});
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Parse master schema CSV content into individual schemas (same logic as MasterSchemaConfig)
  const parseMasterSchemaCSV = (csvContent: string) => {
    if (!csvContent) return {};

    const lines = csvContent.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return {};

    // Get headers
    const headers = lines[0].split(",").map((h) => h.trim());
    const schemaData: Record<string, any> = {};

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      try {
        // Better CSV parsing to handle commas within quoted fields
        const line = lines[i];
        const values: string[] = [];
        let currentValue = "";
        let inQuotes = false;
        let j = 0;

        while (j < line.length) {
          const char = line[j];

          if (char === '"') {
            if (inQuotes && line[j + 1] === '"') {
              // Escaped quote
              currentValue += '"';
              j += 2;
            } else {
              // Start or end of quoted field
              inQuotes = !inQuotes;
              j++;
            }
          } else if (char === "," && !inQuotes) {
            // Field separator
            values.push(currentValue.trim());
            currentValue = "";
            j++;
          } else {
            currentValue += char;
            j++;
          }
        }

        // Add the last value
        values.push(currentValue.trim());

        if (values.length < 3) continue; // Need at least 3 fields

        const schema = values[0];
        const subSchema = values[1];
        const subSchemaType = values[2];
        const keyProperty = values[3] || "";
        const propertyTitle = values[4] || "";
        const description = values[5] || "";
        const propertyType = values[6] || "";
        const format = values[7] || "";
        const required = values[8] === "true";
        const options = values[9] || "";

        // Create unique schema key
        const schemaKey = schema.toLowerCase().replace(/\s+/g, "");

        if (!schemaData[schemaKey]) {
          schemaData[schemaKey] = {
            _id: `master:${schema}`,
            title: schema,
            type: "object",
            properties: {},
            order: [],
            schema: schema,
          };
        }

        // Add subSchema to properties if not exists
        if (!schemaData[schemaKey].properties[subSchema]) {
          schemaData[schemaKey].properties[subSchema] = {
            type: subSchemaType,
            title: subSchema,
            properties: {},
            order: [],
          };
          schemaData[schemaKey].order.push(subSchema);
        }

        // Add property to subSchema if keyProperty exists
        if (keyProperty && propertyTitle) {
          // Generate a simple index based on position
          const currentIndex = Object.keys(
            schemaData[schemaKey].properties[subSchema].properties
          ).length;
          const index = currentIndex > 3 ? 100 + currentIndex : currentIndex;

          // Parse options safely
          let enumValues = undefined;
          if (options && options.length > 0) {
            try {
              if (options.startsWith("[") && options.endsWith("]")) {
                const cleanOptions = options.replace(/\"\"/g, '"');
                enumValues = JSON.parse(cleanOptions);
              }
            } catch (e) {
              console.warn("Failed to parse options for", keyProperty, ":", options, e);
              enumValues = undefined;
            }
          }

          schemaData[schemaKey].properties[subSchema].properties[keyProperty] = {
            type: propertyType,
            title: propertyTitle,
            description: description,
            format: format || undefined,
            required: required,
            index: index,
            enum: enumValues,
          };

          if (!schemaData[schemaKey].properties[subSchema].order.includes(keyProperty)) {
            schemaData[schemaKey].properties[subSchema].order.push(keyProperty);
          }
        }
      } catch (error) {
        console.warn("Error parsing CSV line", i, ":", lines[i], error);
        continue;
      }
    }

    return schemaData;
  };

  // Check session on component mount
  useEffect(() => {
    checkMasterSchemaSession();
  }, [projectId, mindsConfig?.masterSchemaMindId]);

  // Helper function to generate random sample values based on property type
  const generateSampleValue = (property: any, docIndex: number) => {
    const { type, format, enum: enumValues, title } = property;
    const lowerTitle = title?.toLowerCase() || '';

    const sampleData: Record<string, string[]> = {
      email: ['emily.carter@gcs.com', 'john.smith@acetonesupplies.com', 'sara.jones@techcorp.io', 'mike.williams@logistics.co', 'linda.brown@web.dev'],
      address: ['123 Industrial Way, Chemistry Park, Suite 200', '456 Production Blvd, Industrial City', '789 Innovation Drive, Tech Hub', '101 Data Center Road, Cloud Valley', '212 Algorithm Ave, AI District'],
      city: ['Chemville', 'Industropolis', 'Techville', 'Dataville', 'AItown'],
      postal_code: ['CV1234', 'IP5678', 'TV9101', 'DV1121', 'AT3141'],
      payment_method: ['Credit Card', 'Bank Transfer', 'PayPal', 'Stripe', 'Wire'],
      category: ['Electronics', 'Raw Materials', 'Finished Goods', 'Services', 'Software'],
      special_requirements: ['Handle with care', 'Fragile', 'Refrigerate upon arrival', 'Signature required', 'Expedited shipping'],
    };

    if (enumValues && Array.isArray(enumValues) && enumValues.length > 0) {
      return enumValues[docIndex % enumValues.length];
    }

    if (lowerTitle.includes('email')) return sampleData.email[docIndex % sampleData.email.length];
    if (lowerTitle.includes('address')) return sampleData.address[docIndex % sampleData.address.length];
    if (lowerTitle.includes('city')) return sampleData.city[docIndex % sampleData.city.length];
    if (lowerTitle.includes('postal code')) return sampleData.postal_code[docIndex % sampleData.postal_code.length];
    if (lowerTitle.includes('payment method')) return sampleData.payment_method[docIndex % sampleData.payment_method.length];
    if (lowerTitle.includes('category')) return sampleData.category[docIndex % sampleData.category.length];
    if (lowerTitle.includes('special requirements')) return sampleData.special_requirements[docIndex % sampleData.special_requirements.length];
    
    if (lowerTitle.includes('unit price') || lowerTitle.includes('total price')) return (Math.random() * 450 + 50).toFixed(2);
    if (lowerTitle.includes('duration')) return `${Math.floor(Math.random() * 11) + 1} months`;

    switch (type) {
      case 'string':
        if (format === 'date') {
          const d = new Date();
          d.setDate(d.getDate() - docIndex);
          return d.toISOString().split('T')[0];
        }
        if (lowerTitle.includes('number') || lowerTitle.includes('id')) {
          return `DOC-${String(1000 + docIndex).padStart(4, '0')}`;
        }
        return `Sample ${title} ${docIndex + 1}`;
      case 'number':
      case 'integer':
        return Math.floor(Math.random() * 1000) + docIndex;
      case 'boolean':
        return (docIndex % 2 === 0);
      default:
        return '-';
    }
  };

  // Generate a full schema document with random data - maintaining nested structure
  const generateSchemaDocument = (schema: any, docNumber: number) => {
    const document: any = {
      _id: `doc_${docNumber}`,
    };
    
    // Process each group in the schema order
    if (schema.order) {
      schema.order.forEach((groupKey: string) => {
        const groupSchema = schema.properties[groupKey];
        if (groupSchema && groupSchema.properties) {
          document[groupKey] = {};
          
          // Process properties within the group
          Object.keys(groupSchema.properties).forEach((propKey: string) => {
            const property = groupSchema.properties[propKey];
            document[groupKey][propKey] = generateSampleValue(property, docNumber - 1); // docNumber is 1-based
          });
        }
      });
    }
    
    return document;
  };

  // Generate sample documents for a given schema
  const generateSampleDocuments = (schema: any, count: number = 5) => {
    if (!schema) return [];
    
    const documents = [];
    for (let i = 1; i <= count; i++) {
      documents.push(generateSchemaDocument(schema, i));
    }
    return documents;
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setViewMode('documents'); // Reset to documents view when tab changes
  };

  // Generate sample data when active tab changes and data is not available
  useEffect(() => {
    if (activeTab && masterSchemas[activeTab]) {
      setMasterData(prevMasterData => {
        if (!prevMasterData[activeTab] || prevMasterData[activeTab].length === 0) {
          const sampleDocs = generateSampleDocuments(masterSchemas[activeTab], 5);
          return { ...prevMasterData, [activeTab]: sampleDocs };
        }
        return prevMasterData;
      });
    }
  }, [activeTab, masterSchemas]);

    const tableHeaders = useMemo(() => {
    const currentSchema = masterSchemas[activeTab];
    if (!currentSchema || !currentSchema.order) return [];
    const headers: { key: string; title: string }[] = [];
    currentSchema.order.forEach((groupKey: string) => {
      const group = currentSchema.properties[groupKey];
      if (group && group.properties && group.order) {
        group.order.forEach((propKey: string) => {
          headers.push({
            key: propKey,
            title: group.properties[propKey]?.title || propKey,
          });
        });
      }
    });
    return headers;
  }, [masterSchemas, activeTab]);

  const tableData = useMemo(() => {
    return (masterData[activeTab] || []).map(doc => {
      const flatDoc: Record<string, any> = {};
      tableHeaders.forEach(header => {
        let value: any = 'N/A';
        if (doc) {
          // Search for the property in the document's groups
          for (const groupKey of Object.keys(doc)) {
            if (doc[groupKey] && typeof doc[groupKey] === 'object' && header.key in doc[groupKey]) {
              value = doc[groupKey][header.key];
              break;
            }
          }
        }
        flatDoc[header.key] = value;
      });
      return flatDoc;
    });
  }, [masterData, activeTab, tableHeaders]);

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading master schema configuration...</p>
        </div>
      </div>
    );
  }

  // Show message if no schemas available
  if (!hasExistingSession || Object.keys(masterSchemas).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="info" size="lg" className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Master Schema Available</h3>
          <p className="text-gray-600">
            No master schema session found for this project. Generate a master schema first to view schemas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Master Data Preview</h1>
        <p className="text-gray-600 mt-1">
          Browse master data entities and their schemas from generated master schema.
        </p>
      </div>

      {/* Data Type Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-max">
            <Tab
              items={tabItems}
              activeTab={activeTab}
              onChange={handleTabChange}
              variant="pills"
              size="sm"
              className="whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant={viewMode === 'documents' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('documents')}
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

        {viewMode === 'documents' ? (
          <div key={activeTab} className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableHeaders.map(header => (
                    <th key={header.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableHeaders.map(header => (
                      <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof row[header.key] === 'boolean' ? String(row[header.key]) : row[header.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            {activeSchema ? (
              <SchemaPreview 
                schema={activeSchema} 
                stateName={activeTab}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Icon name="info" size="lg" className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Schema Available</h3>
                <p className="text-gray-600">
                  No schema found for "{activeTab}". Please check the master schema generation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDataPreview;
