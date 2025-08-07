import React, { useState } from 'react';
import {
  // Form Components
  Button,
  
  // Display Components
  Badge,
  
  // Feedback Components
  Modal
} from '../../index';

/**
 * Timeline - Reusable Timeline Component
 * 
 * This component displays a timeline of events/transactions in a modal.
 * It's designed to accept API data and render it in a clean, professional format.
 * 
 * Key Features:
 * - Modal-based timeline display
 * - Generic data structure for API integration
 * - Professional, clean design
 * - Expandable details for each timeline item
 * - Configurable through props
 */
const Timeline = ({
  // Modal Props
  isOpen = false,
  onClose,
  title = "Timeline",
  
  // Timeline Data
  timelineData = [],
  totalItems = 0,
  
  // Loading and Error States
  loading = false,
  error = null,
  
  // Customization
  size = "3xl"
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Toggle expanded state for timeline items
  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Default generic timeline data
  const defaultTimelineData = [
    {
      id: 'EVENT-001',
      title: 'Event 1',
      description: 'First timeline event',
      timestamp: 'Jan 15, 2024, 02:30:15 PM',
      daysAgo: '25 days ago',
      createdBy: 'User Admin',
      referenceNumber: 'REF-001',
      status: 'completed',
      type: 'creation'
    },
    {
      id: 'EVENT-002',
      title: 'Event 2', 
      description: 'Second timeline event',
      timestamp: 'Jan 16, 2024, 10:45:20 AM',
      daysAgo: '24 days ago',
      createdBy: 'System User',
      referenceNumber: 'REF-002',
      status: 'completed',
      type: 'update'
    },
    {
      id: 'EVENT-003',
      title: 'Event 3',
      description: 'Third timeline event',
      timestamp: 'Jan 18, 2024, 04:15:45 PM',
      daysAgo: '22 days ago',
      createdBy: 'Admin User',
      referenceNumber: 'REF-003',
      status: 'pending',
      type: 'review'
    },
    {
      id: 'EVENT-004',
      title: 'Event 4',
      description: 'Fourth timeline event',
      timestamp: 'Jan 20, 2024, 09:20:10 AM',
      daysAgo: '20 days ago',
      createdBy: 'Process User',
      referenceNumber: 'REF-004',
      status: 'completed',
      type: 'approval'
    }
  ];

  // Use provided data or default data
  const displayData = timelineData.length > 0 ? timelineData : defaultTimelineData;
  const displayTotal = totalItems > 0 ? totalItems : displayData.length;

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'rejected':
        return 'danger';
      case 'in-progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Get timeline item color based on status or type
  const getTimelineColor = (item, index) => {
    if (item.status === 'completed') return 'bg-green-500';
    if (item.status === 'pending') return 'bg-yellow-500';
    if (item.status === 'failed' || item.status === 'rejected') return 'bg-red-500';
    if (item.status === 'in-progress') return 'bg-blue-500';
    
    // Default colors based on index
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Events: {displayTotal}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">Loading timeline...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Timeline Items */}
        {!loading && !error && (
          <div className="space-y-4">
            {displayData.map((item, index) => (
              <div key={item.id} className="relative">
                {/* Timeline Line */}
                {index < displayData.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
                )}
                
                {/* Timeline Item */}
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className={`flex-shrink-0 w-3 h-3 rounded-full ${getTimelineColor(item, index)} mt-2`}></div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.status && (
                            <Badge variant={getStatusVariant(item.status)} size="sm">
                              {item.status}
                            </Badge>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {item.referenceNumber && (
                            <p><span className="font-medium">Reference:</span> {item.referenceNumber}</p>
                          )}
                          <p><span className="font-medium">Timestamp:</span> {item.timestamp}</p>
                          {item.daysAgo && <p className="text-xs">{item.daysAgo}</p>}
                        </div>
                        
                        {item.createdBy && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Created By: {item.createdBy}
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          {expandedItems.has(item.id) ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Expanded Details */}
                    {expandedItems.has(item.id) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Reference:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{item.referenceNumber}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Created By:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{item.createdBy}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{item.type}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Status:</span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">{item.status}</span>
                          </div>
                          {item.description && (
                            <div className="text-sm col-span-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                              <span className="ml-2 text-gray-600 dark:text-gray-400">{item.description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && displayData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No timeline data available</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Timeline;