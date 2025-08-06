import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImportModal from '../components/organisms/data-grids/ImportModal';

/**
 * ImportModalPage - Standalone Import Modal Page
 * 
 * This page renders the ImportModal as a standalone page for demonstration
 * and testing purposes.
 */
const ImportModalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleImport = (importData) => {
    console.log('Import data:', importData);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Import completed successfully');
      // Optionally navigate back or show success message
    }, 2000);
  };

  const handleDownloadTemplate = (templateData) => {
    console.log('Download template:', templateData);
    // Simulate template download
    const templateName = 'import_template.xlsx';
    console.log(`Downloading template: ${templateName}`);
  };

  const handleClose = () => {
    navigate('/templates/pages/listing-page');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <ImportModal
        isOpen={true}
        onClose={handleClose}
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
        title="Upload Data"
        loading={loading}
        templateHeaders={[
          { key: 'recordId', label: 'Record ID', required: true },
          { key: 'title', label: 'Title', required: true },
          { key: 'description', label: 'Description', required: false },
          { key: 'status', label: 'Status', required: true },
          { key: 'type', label: 'Type', required: true },
          { key: 'category', label: 'Category', required: false },
          { key: 'priority', label: 'Priority', required: false },
          { key: 'assignedTo', label: 'Assigned To', required: false },
          { key: 'dueDate', label: 'Due Date', required: false },
          { key: 'startDate', label: 'Start Date', required: false },
          { key: 'endDate', label: 'End Date', required: false },
          { key: 'tags', label: 'Tags', required: false },
          { key: 'notes', label: 'Notes', required: false },
          { key: 'estimatedHours', label: 'Estimated Hours', required: false },
          { key: 'actualHours', label: 'Actual Hours', required: false },
          { key: 'budget', label: 'Budget', required: false }
        ]}
      />
    </div>
  );
};

export default ImportModalPage;