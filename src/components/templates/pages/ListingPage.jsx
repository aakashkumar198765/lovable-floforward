import React, { useState, useCallback } from 'react';
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
} from '../..';

// Import modals directly
import ExportModal from '../../organisms/data-grids/ExportModal';
import ImportModal from '../../organisms/data-grids/ImportModal';

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
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Modal state management
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Mock workflow states
  const workflowStates = [
    { key: 'state1', label: 'State 1' },
    { key: 'state2', label: 'State 2' },
    { key: 'state3', label: 'State 3' }
  ];

  // Generate dummy data like the infinite scroll example
  const generateDummyData = (start, count) => {
    const data = [];
    const statuses = ['state1', 'state2', 'state3'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const employees = [
      'John Smith',
      'Alice Johnson',
      'Bob Brown',
      'Carol Davis',
      'David Miller',
      'Eva Garcia',
      'Frank Wilson',
      'Grace Lee'
    ];

    for (let i = start; i < start + count; i++) {
      const nameIndex = i % employees.length;
      const name = employees[nameIndex] + ` (${i})`;

      data.push({
        id: `ITEM-${String(i + 1).padStart(3, '0')}`,
        name,
        email: `employee${i}@company.com`,
        department: departments[i % departments.length],
        status: statuses[i % statuses.length],
        salary: Math.floor(Math.random() * 100000) + 40000,
        joinDate: new Date(2020 + Math.floor(i / 100), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
        phone: `+1-555-${String(i).padStart(4, '0')}`,
      });
    }

    return data;
  };

  // Initialize data
  React.useEffect(() => {
    setData(generateDummyData(0, 50));
  }, []);

  // Column configuration matching the infinite scroll example
  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      filterable: true,
      editable: true,
      width: '150px',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      filterable: true,
      editable: true,
      width: '200px',
    },
    {
      key: 'department',
      title: 'Department',
      dataIndex: 'department',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'select',
      editorProps: {
        options: [
          { value: 'Engineering', label: 'Engineering' },
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Sales', label: 'Sales' },
          { value: 'HR', label: 'HR' },
          { value: 'Finance', label: 'Finance' },
        ],
      },
      width: '120px',
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'select',
      editorProps: {
        options: [
          { value: 'state1', label: 'State 1' },
          { value: 'state2', label: 'State 2' },
          { value: 'state3', label: 'State 3' },
        ],
      },
      width: '100px',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'state1' ? 'bg-green-100 text-green-800' :
            value === 'state2' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
          }`}>
          {value === 'state1' ? 'State 1' : value === 'state2' ? 'State 2' : 'State 3'}
        </span>
      ),
    },
    {
      key: 'salary',
      title: 'Salary',
      dataIndex: 'salary',
      sortable: true,
      filterable: true,
      editable: true,
      width: '120px',
      render: (value) => `$${value?.toLocaleString() || 0}`,
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      dataIndex: 'joinDate',
      sortable: true,
      filterable: true,
      editable: true,
      editor: 'datepicker',
      width: '120px',
    },
    {
      key: 'phone',
      title: 'Phone',
      dataIndex: 'phone',
      sortable: true,
      filterable: true,
      editable: true,
      width: '140px',
    },
  ];

  // Bulk actions
  const bulkActions = [
    { key: 'action1', label: 'Action 1', variant: 'success', icon: 'check' },
    { key: 'action2', label: 'Action 2', variant: 'danger', icon: 'x' },
    { key: 'export', label: 'Export Selected', variant: 'secondary', icon: 'download' }
  ];

  const enableBulkActions = true;

  // Simulate API call for loading more data
  const handleLoadMore = useCallback(async (cursor) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentLength = data.length;
    const newData = generateDummyData(currentLength, 25);
    const nextHasMore = currentLength + newData.length < 500; // Limit to 500 total records

    return {
      data: newData,
      nextCursor: currentLength + newData.length,
      hasNextPage: nextHasMore,
    };
  }, [data.length]);

  const handleCellEdit = useCallback((value, record, column) => {
    console.log('Cell edited:', { value, record, column });

    // Update the data
    setData(prevData =>
      prevData.map(item =>
        item.id === record.id
          ? { ...item, [column.key]: value }
          : item
      )
    );
  }, []);

  const handleRowAdd = useCallback(() => {
    const newId = Math.max(...data.map(d => Number(d.id.split('-')[1]))) + 1;
    const newRow = {
      id: `ITEM-${String(newId).padStart(3, '0')}`,
      name: `New Employee ${newId}`,
      email: `new${newId}@company.com`,
      department: 'Engineering',
      status: 'state1',
      salary: 50000,
      joinDate: new Date().toISOString().split('T')[0],
      phone: `+1-555-${String(newId).padStart(4, '0')}`,
    };

    setData(prevData => [...prevData, newRow]);
  }, [data]);

  const handleRowDelete = useCallback((record) => {
    console.log('Row deleted:', record);
    setData(prevData => prevData.filter(item => item.id !== record.id));
  }, []);

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
                        id="listing-page-infinite-scroll"
                        columns={columns}
                        data={data.filter(item => item.status === state.key)}
                        loading={loading}
                        editable={true}
                        infiniteScroll={{
                          enabled: true,
                          hasNextPage,
                          threshold: 200,
                          onLoadMore: handleLoadMore,
                          showLoader: false,
                          onStateChange: (scrollState) => {
                            setHasNextPage(scrollState.hasNextPage);
                          },
                        }}
                        virtualization={{
                          enabled: true,
                          itemHeight: 35,
                          containerHeight: 600,
                          overscan: 3,
                        }}
                        selection={{
                          type: enableBulkActions ? 'checkbox' : 'none',
                          selectedRowKeys: selectedItems,
                          onSelectionChange: handleSelectionChange
                        }}
                        sortable={true}
                        filterable={true}
                        exportable={true}
                        allowedActions={[
                          'edit_completed',
                          'edit_rows',
                          'delete_rows',
                          'bulk_delete',
                          'bulk_edit',
                        ]}
                        onCellEdit={handleCellEdit}
                        onRowAdd={handleRowAdd}
                        onRowDelete={handleRowDelete}
                        onRowClick={handleItemClick}
                        onSort={(columnKey, direction) => {
                          console.log('Sort:', columnKey, direction);
                        }}
                        onFilter={(filters) => {
                          console.log('Filter:', filters);
                        }}
                        scroll={{ x: 900 }}
                        size="small"
                        rowKey="id"
                        className="border-0 w-full"
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