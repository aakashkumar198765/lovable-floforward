import React, { useState, useEffect } from 'react';
import { Tab, Badge, Button, Icon } from '../components';
import SchemaPreview from './SchemaPreview';
import { getSession } from '../services/paramai_browsersdk';

interface MasterDataPreviewProps {
  data: Record<string, any[]>;
  projectId?: string;
  mindsConfig?: any;
}

const MasterDataPreview: React.FC<MasterDataPreviewProps> = ({ 
  data, 
  projectId = "", 
  mindsConfig = {} 
}) => {
  const dataKeys = Object.keys(data);
  const [activeTab, setActiveTab] = useState(dataKeys[0]);
  const [viewMode, setViewMode] = useState('documents'); // 'documents' or 'schema'
  
  // New state for master schema session management
  const [masterSchemaSession, setMasterSchemaSession] = useState<any>(null);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [masterSchemas, setMasterSchemas] = useState<Record<string, any>>({});

  const activeData = data[activeTab] || [];
  const headers = activeData.length > 0 ? Object.keys(activeData[0]) : [];

  const tabItems = dataKeys.map(key => ({
    id: key,
    label: key,
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
      // Get all sessions for master schema mind
      const masterSchemaSessions = await getSession(mindsConfig.masterSchemaMindId);
      
      // Find sessions matching the project ID and sort by execution time (e_at) to get most recent
      const matchingSessions = masterSchemaSessions?.response?.filter(
        (el: any) => el?.name === projectId
      ) || [];
      
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
          // Find the first content item that contains CSV data
          const firstContentKey = Object.keys(content)[0];
          if (firstContentKey && content[firstContentKey] && content[firstContentKey][0]) {
            const csvContent = content[firstContentKey][0].content;
            if (csvContent) {
              console.log('📊 Master Schema CSV content:', csvContent.substring(0, 200));
              const parsedSchemas = parseMasterSchemaCSV(csvContent);
              console.log('📊 Parsed master schemas:', Object.keys(parsedSchemas));
              setMasterSchemas(parsedSchemas);
            }
          }
        }
      } else {
        console.log('🔍 No sessions found for project:', projectId);
        setHasExistingSession(false);
        setMasterSchemaSession(null);
      }
    } catch (error) {
      console.error("Error checking master schema session:", error);
      setHasExistingSession(false);
      setMasterSchemaSession(null);
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setViewMode('documents'); // Reset to documents view when tab changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Master Data Preview</h1>
        <p className="text-gray-600 mt-1">
          {hasExistingSession 
            ? "Browse master data entities and their schemas from generated master schema."
            : "Browse master data entities and their records."
          }
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
            disabled={!hasExistingSession || isCheckingSession}
          >
            Schema
          </Button>
        </div>

        {viewMode === 'documents' ? (
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((header) => (
                        <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof row[header] === 'boolean' ? (
                            <Badge variant={row[header] ? 'success' : 'secondary'}>
                              {row[header].toString()}
                            </Badge>
                          ) : (
                            row[header]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {isCheckingSession ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading master schema...</p>
                </div>
              </div>
            ) : hasExistingSession && activeSchema ? (
              <SchemaPreview 
                schema={activeSchema} 
                stateName={activeTab}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Icon name="info" size="lg" className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Schema Available</h3>
                <p className="text-gray-600">
                  {hasExistingSession 
                    ? `No schema found for "${activeTab}". Please check the master schema generation.`
                    : "No master schema session found for this project. Generate a master schema first to view schemas."
                  }
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