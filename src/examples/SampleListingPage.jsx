import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // Navigation Components
  Tab,

  // Form Components
  Button,

  // Display Components
  Icon,

  // Data Components
  BulkActions,

  // Data Grid Components
  EditableDataGrid,

  // Feedback Components
  LoadingState
} from '../components';

// Import modals directly
import ExportModal from '../components/organisms/data-grids/ExportModal';
import ImportModal from '../components/organisms/data-grids/ImportModal';

/**
 * SampleListingPage - Clean and Professional Sample Listing Page
 * 
 * This page demonstrates a clean, compact, and professional implementation
 * of a workflow listing page with optimized spacing and layout.
 */
const SampleListingPage = () => {
  const navigate = useNavigate();

  // Demo state management
  const [currentState, setCurrentState] = useState('state1');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state management
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Mock workflow states
  const workflowStates = [
    { key: 'state1', label: 'State 1' },
    { key: 'state2', label: 'State 2' },
    { key: 'state3', label: 'State 3' }
  ];

  // Generate compact sample data
  const generateSampleData = () => {
    const sampleCount = 5;
    return Array.from({ length: sampleCount }, (_, index) => {
      const item = {
        id: `ITEM-${String(index + 1).padStart(3, '0')}`,
        status: currentState
      };

      item.field1 = `Value ${index + 1}`;
      item.field2 = `Sample Data ${String.fromCharCode(65 + (index % 26))}`;
      item.field3 = Math.floor(Math.random() * 1000);
      item.field4 = new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString();
      item.field5 = (Math.random() * 100).toFixed(2);

      return item;
    });
  };

  const displayData = generateSampleData();

  // Compact column configuration
  const columns = [
    {
      key: 'id',
      title: 'ID',
      dataIndex: 'id',
      sortable: true,
      width: 100,
      fixed: 'left',
      render: (value, record) => (
        <Button
          variant="link"
          size="sm"
          onClick={() => handleItemClick(record)}
          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
        >
          {value}
        </Button>
      )
    },
    {
      key: 'field1',
      title: 'Field 1',
      dataIndex: 'field1',
      sortable: true,
      filterable: true,
      width: 120
    },
    {
      key: 'field2',
      title: 'Field 2',
      dataIndex: 'field2',
      sortable: true,
      filterable: true,
      width: 140
    },
    {
      key: 'field3',
      title: 'Field 3',
      dataIndex: 'field3',
      sortable: true,
      align: 'right',
      width: 100
    },
    {
      key: 'field4',
      title: 'Field 4',
      dataIndex: 'field4',
      sortable: true,
      width: 120
    },
    {
      key: 'field5',
      title: 'Field 5',
      dataIndex: 'field5',
      sortable: true,
      align: 'right',
      width: 100
    }
  ];

  // Bulk actions
  const bulkActions = [
    { key: 'action1', label: 'Action 1', variant: 'success', icon: 'check' },
    { key: 'action2', label: 'Action 2', variant: 'danger', icon: 'x' },
    { key: 'export', label: 'Export Selected', variant: 'secondary', icon: 'download' }
  ];

  const enableBulkActions = true;

  // Event Handlers
  const handleStateChange = (newState) => {
    setCurrentState(newState);
    setCurrentPage(1);
    setSelectedItems([]);
  };

  const handleSearch = (searchValue) => {
    console.log('Search:', searchValue);
    setSearchTerm(searchValue);
  };

  const handleBulkAction = (action, selectedIds) => {
    console.log('Bulk action:', action, 'on items:', selectedIds);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSelectedItems([]);
    }, 1000);
  };

  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    // Navigate to detail page
    navigate(`/templates/pages/detail-page/${item.id}`);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handleSelectionChange = (selectedRowKeys) => {
    setSelectedItems(selectedRowKeys);
  };

  // Modal handlers
  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleImport = (importData) => {
    console.log('Import data:', importData);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowImportModal(false);
      // You can add success notification here
      console.log('Import completed successfully');
    }, 2000);
  };

  const handleExport = (exportData) => {
    console.log('Export data:', exportData);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowExportModal(false);
      // You can add success notification here
      console.log('Export completed successfully');
    }, 2000);
  };

  const handleDownloadTemplate = (templateData) => {
    console.log('Download template:', templateData);
    // Simulate template download
    const templateName = 'import_template.xlsx';
    console.log(`Downloading template: ${templateName}`);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Single Clean Header with Title, Actions and Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Generic Workflow</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage workflow items across different states</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Icon name="plus" size="sm" />}
              onClick={() => navigate('/templates/pages/create-page')}
            >
              Create New
            </Button>

            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Icon name="upload" size="sm" />}
              onClick={handleImportClick}
            >
              Import
            </Button>

            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Icon name="download" size="sm" />}
              onClick={handleExportClick}
            >
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconLeft={<Icon name="refresh" size="sm" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* State Tabs with Content */}
        <div className="p-0">
          <Tab
            items={workflowStates.map(state => ({
              id: state.key,
              label: state.label,
              content: (
                <div>
                  {/* Bulk Actions */}
                  {enableBulkActions && selectedItems.length > 0 && bulkActions.length > 0 && (
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <BulkActions
                        selectedItems={selectedItems}
                        actions={bulkActions}
                        onAction={handleBulkAction}
                        showSelectionCount
                        size="sm"
                      />
                    </div>
                  )}

                  {/* Clean Data Table */}
                  <div className="p-0">
                    <LoadingState loading={loading} text="Loading data...">
                      <EditableDataGrid
                        columns={columns}
                        data={displayData.filter(item => item.status === state.key)}
                        loading={loading}
                        editable={false}
                        selection={{
                          type: enableBulkActions ? 'checkbox' : 'none',
                          selectedRowKeys: selectedItems,
                          onSelectionChange: handleSelectionChange
                        }}
                        pagination={{
                          current: currentPage,
                          total: displayData.filter(item => item.status === state.key).length,
                          pageSize: 10,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total}`,
                          onChange: handlePageChange,
                          pageSizeOptions: ['10', '25', '50', '100'],
                          size: 'small'
                        }}
                        scroll={{ x: 900 }}
                        size="small"
                        onRowClick={handleItemClick}
                        rowKey="id"
                        className="border-0"

                        // Empty state configuration
                        emptyText="No items available"
                      />
                    </LoadingState>
                  </div>
                </div>
              )
            }))}
            activeTab={currentState}
            variant="underline"
            onChange={handleStateChange}
            size="sm"
          />
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
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

      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
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

export default SampleListingPage;