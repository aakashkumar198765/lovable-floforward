import React from 'react';
import { Badge } from '../components';

const SchemaPreview = ({ schema, stateName }) => {
  if (!schema) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Schema Preview - {stateName}
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No schema available for this state</p>
        </div>
      </div>
    );
  }

  const renderProperty = (propKey, property, groupKey) => {
    const getTypeColor = (type) => {
      switch (type) {
        case 'string': return 'bg-blue-100 text-blue-800';
        case 'number': 
        case 'integer': return 'bg-green-100 text-green-800';
        case 'boolean': return 'bg-purple-100 text-purple-800';
        case 'array': return 'bg-orange-100 text-orange-800';
        case 'object': return 'bg-gray-100 text-gray-800';
        case 'date': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getFormatBadge = (format) => {
      if (!format) return null;
      return (
        <Badge variant="secondary" className="text-xs ml-2">
          {format}
        </Badge>
      );
    };

    return (
      <div key={`${groupKey}-${propKey}`} className="border border-gray-200 rounded p-4 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-sm font-medium text-gray-900">
            {propKey}
          </span>
          <Badge className={`text-xs ${getTypeColor(property.type)}`}>
            {property.type}
          </Badge>
          {getFormatBadge(property.format)}
          {property.required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
          {property.index && (
            <Badge variant="outline" className="text-xs">
              #{property.index}
            </Badge>
          )}
        </div>
        
        {property.title && (
          <div className="text-sm font-medium text-gray-700 mb-1">
            {property.title}
          </div>
        )}
        
        {property.description && (
          <div className="text-sm text-gray-600 mb-2">
            {property.description}
          </div>
        )}
        
        {property.enum && (
          <div className="text-sm">
            <span className="font-medium text-gray-700">Options: </span>
            <span className="font-mono text-gray-600">
              {Array.isArray(property.enum) ? property.enum.join(', ') : property.enum}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderGroup = (groupKey, group) => {
    if (!group.properties || Object.keys(group.properties).length === 0) {
      return null;
    }

    // Sort properties by index if available
    const sortedProperties = Object.entries(group.properties).sort(([, a], [, b]) => {
      const indexA = a.index || 0;
      const indexB = b.index || 0;
      return indexA - indexB;
    });

    return (
      <div key={groupKey} className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-md font-semibold text-gray-900">
            {group.title || groupKey}
          </h4>
          <Badge variant="outline" className="text-xs">
            {group.type}
          </Badge>
        </div>
        
        <div className="pl-4 border-l-2 border-gray-200">
          {sortedProperties.map(([propKey, property]) => 
            renderProperty(propKey, property, groupKey)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-end mb-6">
        <Badge variant="outline" className="text-xs">
          {Object.keys(schema.properties || {}).length} groups
        </Badge>
      </div>

      {schema.order && schema.order.length > 0 ? (
        <div>
          {schema.order.map(groupKey => {
            const group = schema.properties[groupKey];
            return group ? renderGroup(groupKey, group) : null;
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No schema structure available</p>
        </div>
      )}
    </div>
  );
};

export default SchemaPreview; 