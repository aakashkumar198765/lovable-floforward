import React, { useState } from 'react';
import { Tab, Badge, Button, Icon } from '../components';
import SchemaPreview from './SchemaPreview';
import masterSchemas from './sample_data/master_schemas.json';

interface MasterDataPreviewProps {
  data: Record<string, any[]>;
}

const MasterDataPreview: React.FC<MasterDataPreviewProps> = ({ data }) => {
  const dataKeys = Object.keys(data);
  const [activeTab, setActiveTab] = useState(dataKeys[0]);
  const [viewMode, setViewMode] = useState('documents'); // 'documents' or 'schema'

  const activeData = data[activeTab] || [];
  const headers = activeData.length > 0 ? Object.keys(activeData[0]) : [];

  const tabItems = dataKeys.map(key => ({
    id: key,
    label: key,
  }));

  // Get the schema for the active tab from the imported master schemas
  const activeSchema = (masterSchemas as Record<string, any>)[activeTab];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setViewMode('documents'); // Reset to documents view when tab changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Master Data Preview</h1>
        <p className="text-gray-600 mt-1">Browse master data entities and their records.</p>
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
          <SchemaPreview 
            schema={activeSchema} 
            stateName={activeTab}
          />
        )}
      </div>
    </div>
  );
};

export default MasterDataPreview;