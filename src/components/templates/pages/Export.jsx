import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExportModal from '../../organisms/data-grids/ExportModal';

/**
 * ExportModalPage - Standalone Export Modal Page
 * 
 * This page renders the ExportModal as a standalone page for demonstration
 * and testing purposes.
 */
const ExportModalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleExport = (exportData) => {
    console.log('Export data:', exportData);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Export completed successfully');
      // Optionally navigate back or show success message
    }, 2000);
  };

  const handleClose = () => {
    navigate('/templates/pages/listing-page');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <ExportModal
        isOpen={true}
        onClose={handleClose}
        onExport={handleExport}
        title="Export Data"
        loading={loading}
        exportFields={[
          {
            key: 'dateRange',
            type: 'dateRange',
            label: 'Date Range',
            fromLabel: 'From Date',
            toLabel: 'To Date',
            required: false
          },
          {
            key: 'recordId',
            type: 'text',
            label: 'Record ID Filter',
            placeholder: 'Enter record ID to filter',
            required: false
          },
          {
            key: 'status',
            type: 'select',
            label: 'Status',
            options: [
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' }
            ],
            required: false
          },
          {
            key: 'type',
            type: 'select',
            label: 'Type',
            options: [
              { value: '', label: 'All Types' },
              { value: 'type1', label: 'Type 1' },
              { value: 'type2', label: 'Type 2' },
              { value: 'type3', label: 'Type 3' }
            ],
            required: false
          }
        ]}
      />
    </div>
  );
};

export default ExportModalPage;