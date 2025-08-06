import React, { useState, useCallback } from 'react';
import {
  // Form Components
  Button,
  Input,
  Select,
  Textarea,
  Radio,

  // Display Components
  Icon,

  // Data Grid Components
  EditableDataGrid,

  // Feedback Components
  Modal
} from '../../../components';

/**
 * CreateModal - Generic Create/Form Modal Component
 * 
 * This component displays a create form as a modal with validation,
 * grid layout, and sub-schema sections.
 * 
 * Key Features:
 * - Modal-based form
 * - Form validation
 * - Professional UI design
 * - Generic field structure
 * - Responsive design
 */
const CreateModal = ({
  // Modal Props
  isOpen = false,
  onClose,
  title = "Create New Record",

  // Form Data
  onSubmit,

  // Loading and Error States
  loading = false,
  error = null,

  // Customization
  size = "5xl",

  // Form Configuration
  formSchema = [],
  defaultData = {},

  // Labels (for customization)
  submitButtonLabel = "Create Record",
  cancelButtonLabel = "Cancel"
}) => {
  // Form state management - Match CreatePage structure
  const [formData, setFormData] = useState({
    ...defaultData,
    // Sub-schema 1 - 8 fields (2 rows x 4 fields)
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: '',
    field8: '',
    notes1: '',

    // Sub-schema 2 - 8 fields (2 rows x 4 fields)
    field9: '',
    field10: '',
    field11: '',
    field12: '',
    field13: '',
    field14: '',
    field15: '',
    field16: '',
    notes2: '',

    // Sub-schema 3 - 8 fields (2 rows x 4 fields)
    field17: '',
    field18: '',
    field19: '',
    field20: '',
    field21: '',
    field22: '',
    field23: '',
    field24: '',
    notes3: '',

    // Sub-schema 4 - Table data
    tableData: [
      { id: 1, name: 'Item 1', email: 'item1@company.com', department: 'Engineering', status: 'Active', salary: 50000, joinDate: '2023-01-15', phone: '+1-555-0001' },
      { id: 2, name: 'Item 2', email: 'item2@company.com', department: 'Marketing', status: 'Inactive', salary: 45000, joinDate: '2023-02-20', phone: '+1-555-0002' }
    ],
    notes4: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [hasNextPage, setHasNextPage] = useState(true);

  // Generic select options
  const selectOptions = [
    { value: '', label: 'Select Option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  // Simple validation - Match CreatePage structure
  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!formData.field1.trim()) errors.field1 = 'Field 1 is required';
    if (!formData.field9.trim()) errors.field9 = 'Field 9 is required';
    if (!formData.field17.trim()) errors.field17 = 'Field 17 is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Event handlers
  const handleInputChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));

    // Clear error for this field when user starts typing
    if (formErrors[fieldKey]) {
      setFormErrors(prev => ({
        ...prev,
        [fieldKey]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit && typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    // Clear errors only, don't reset form data to avoid re-render issues
    setFormErrors({});

    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  // Handle table row deletion
  const handleDeleteTableRow = (index) => {
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.filter((_, i) => i !== index)
    }));
  };

  // Generate dummy data for infinite scroll
  const generateDummyData = (start, count) => {
    const data = [];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const statuses = ['Active', 'Inactive', 'Pending'];
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
        id: i + 3, // Start from 3 since we have 2 initial items
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

  // Simulate API call for loading more data
  const handleLoadMore = useCallback(async (cursor) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentLength = formData.tableData.length;
    const newData = generateDummyData(currentLength - 2, 10); // -2 because we start with 2 items
    const nextHasMore = currentLength + newData.length < 100; // Limit to 100 total records

    return {
      data: newData,
      nextCursor: currentLength + newData.length,
      hasNextPage: nextHasMore,
    };
  }, [formData.tableData.length]);

  const handleCellEdit = useCallback((value, record, column) => {
    console.log('Cell edited:', { value, record, column });
    
    // Update the table data
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.map(item => 
        item.id === record.id 
          ? { ...item, [column.key]: value }
          : item
      )
    }));
  }, []);

  const handleRowAdd = useCallback(() => {
    const newId = Math.max(...formData.tableData.map(d => Number(d.id))) + 1;
    const newRow = {
      id: newId,
      name: `New Employee ${newId}`,
      email: `new${newId}@company.com`,
      department: 'Engineering',
      status: 'Active',
      salary: 50000,
      joinDate: new Date().toISOString().split('T')[0],
      phone: `+1-555-${String(newId).padStart(4, '0')}`,
    };
    
    setFormData(prev => ({
      ...prev,
      tableData: [...prev.tableData, newRow]
    }));
  }, [formData.tableData]);

  const handleRowDelete = useCallback((record) => {
    console.log('Row deleted:', record);
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.filter(item => item.id !== record.id)
    }));
  }, []);


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      size={size}
    >
      <div className="space-y-6 min-h-[700px] max-h-[90vh] overflow-y-auto">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Form Content - Match CreatePage Structure */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Primary details for this record
              </p>
            </div>
            <div className="p-6">

              {/* Row 1 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Input
                  label="Field 1"
                  type="text"
                  value={formData.field1}
                  onChange={(e) => handleInputChange('field1', e.target.value)}
                  placeholder="Enter Field 1"
                  required
                  error={formErrors.field1}
                  disabled={loading}
                />
                <Select
                  label="Field 2"
                  value={formData.field2}
                  onChange={(e) => handleInputChange('field2', e.target.value)}
                  options={selectOptions}
                  error={formErrors.field2}
                  disabled={loading}
                />
                <Input
                  label="Field 3"
                  type="date"
                  value={formData.field3}
                  onChange={(e) => handleInputChange('field3', e.target.value)}
                  error={formErrors.field3}
                  disabled={loading}
                />
                <Input
                  label="Field 4"
                  type="number"
                  value={formData.field4}
                  onChange={(e) => handleInputChange('field4', e.target.value)}
                  placeholder="Enter Field 4"
                  error={formErrors.field4}
                  disabled={loading}
                />
              </div>

              {/* Row 2 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Priority Level
                  </label>
                  <Radio
                    name="field5"
                    value={formData.field5}
                    onChange={(value) => handleInputChange('field5', value)}
                    options={[
                      { value: 'high', label: 'High Priority' },
                      { value: 'medium', label: 'Medium Priority' },
                      { value: 'low', label: 'Low Priority' }
                    ]}
                    disabled={loading}
                    orientation="horizontal"
                  />
                </div>
                <Input
                  label="Field 6"
                  type="text"
                  value={formData.field6}
                  onChange={(e) => handleInputChange('field6', e.target.value)}
                  placeholder="Enter Field 6"
                  error={formErrors.field6}
                  disabled={loading}
                />
                <Input
                  label="Field 7"
                  type="email"
                  value={formData.field7}
                  onChange={(e) => handleInputChange('field7', e.target.value)}
                  placeholder="Enter Email"
                  error={formErrors.field7}
                  disabled={loading}
                />
                <Input
                  label="Field 8"
                  type="text"
                  value={formData.field8}
                  onChange={(e) => handleInputChange('field8', e.target.value)}
                  placeholder="Enter Field 8"
                  error={formErrors.field8}
                  disabled={loading}
                />
              </div>

              {/* Textarea */}
              <div className="mt-6">
                <Textarea
                  label="Notes"
                  value={formData.notes1}
                  onChange={(e) => handleInputChange('notes1', e.target.value)}
                  placeholder="Enter additional notes for basic information"
                  rows={2}
                  error={formErrors.notes1}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Additional Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Supplementary information for this record
              </p>
            </div>
            <div className="p-6">

              {/* Row 1 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Input
                  label="Field 9"
                  type="text"
                  value={formData.field9}
                  onChange={(e) => handleInputChange('field9', e.target.value)}
                  placeholder="Enter Field 9"
                  required
                  error={formErrors.field9}
                  disabled={loading}
                />
                <Input
                  label="Field 10"
                  type="date"
                  value={formData.field10}
                  onChange={(e) => handleInputChange('field10', e.target.value)}
                  error={formErrors.field10}
                  disabled={loading}
                />
                <Select
                  label="Field 11"
                  value={formData.field11}
                  onChange={(e) => handleInputChange('field11', e.target.value)}
                  options={selectOptions}
                  error={formErrors.field11}
                  disabled={loading}
                />
                <Input
                  label="Field 12"
                  type="number"
                  value={formData.field12}
                  onChange={(e) => handleInputChange('field12', e.target.value)}
                  placeholder="Enter Field 12"
                  error={formErrors.field12}
                  disabled={loading}
                />
              </div>

              {/* Row 2 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Input
                  label="Field 13"
                  type="text"
                  value={formData.field13}
                  onChange={(e) => handleInputChange('field13', e.target.value)}
                  placeholder="Enter Field 13"
                  error={formErrors.field13}
                  disabled={loading}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status Type
                  </label>
                  <Radio
                    name="field14"
                    value={formData.field14}
                    onChange={(value) => handleInputChange('field14', value)}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'inactive', label: 'Inactive' }
                    ]}
                    disabled={loading}
                    orientation="horizontal"
                  />
                </div>
                <Input
                  label="Field 15"
                  type="date"
                  value={formData.field15}
                  onChange={(e) => handleInputChange('field15', e.target.value)}
                  error={formErrors.field15}
                  disabled={loading}
                />
                <Input
                  label="Field 16"
                  type="text"
                  value={formData.field16}
                  onChange={(e) => handleInputChange('field16', e.target.value)}
                  placeholder="Enter Field 16"
                  error={formErrors.field16}
                  disabled={loading}
                />
              </div>

              {/* Textarea */}
              <div className="mt-6">
                <Textarea
                  label="Additional Notes"
                  value={formData.notes2}
                  onChange={(e) => handleInputChange('notes2', e.target.value)}
                  placeholder="Enter additional notes for supplementary information"
                  rows={2}
                  error={formErrors.notes2}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Extended Properties */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Extended Properties
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Additional attributes and metadata
              </p>
            </div>
            <div className="p-6">

              {/* Row 1 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Input
                  label="Field 17"
                  type="text"
                  value={formData.field17}
                  onChange={(e) => handleInputChange('field17', e.target.value)}
                  placeholder="Enter Field 17"
                  required
                  error={formErrors.field17}
                  disabled={loading}
                />
                <Input
                  label="Field 18"
                  type="text"
                  value={formData.field18}
                  onChange={(e) => handleInputChange('field18', e.target.value)}
                  placeholder="Enter Field 18"
                  error={formErrors.field18}
                  disabled={loading}
                />
                <Select
                  label="Field 19"
                  value={formData.field19}
                  onChange={(e) => handleInputChange('field19', e.target.value)}
                  options={selectOptions}
                  error={formErrors.field19}
                  disabled={loading}
                />
                <Input
                  label="Field 20"
                  type="date"
                  value={formData.field20}
                  onChange={(e) => handleInputChange('field20', e.target.value)}
                  error={formErrors.field20}
                  disabled={loading}
                />
              </div>

              {/* Row 2 - 4 fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <Radio
                    name="field21"
                    value={formData.field21}
                    onChange={(value) => handleInputChange('field21', value)}
                    options={[
                      { value: 'standard', label: 'Standard' },
                      { value: 'premium', label: 'Premium' },
                      { value: 'enterprise', label: 'Enterprise' }
                    ]}
                    disabled={loading}
                    orientation="horizontal"
                  />
                </div>
                <Input
                  label="Field 22"
                  type="number"
                  value={formData.field22}
                  onChange={(e) => handleInputChange('field22', e.target.value)}
                  placeholder="Enter Field 22"
                  error={formErrors.field22}
                  disabled={loading}
                />
                <Input
                  label="Field 23"
                  type="text"
                  value={formData.field23}
                  onChange={(e) => handleInputChange('field23', e.target.value)}
                  placeholder="Enter Field 23"
                  error={formErrors.field23}
                  disabled={loading}
                />
                <Input
                  label="Field 24"
                  type="email"
                  value={formData.field24}
                  onChange={(e) => handleInputChange('field24', e.target.value)}
                  placeholder="Enter Email"
                  error={formErrors.field24}
                  disabled={loading}
                />
              </div>

              {/* Textarea */}
              <div className="mt-6">
                <Textarea
                  label="Property Notes"
                  value={formData.notes3}
                  onChange={(e) => handleInputChange('notes3', e.target.value)}
                  placeholder="Enter notes for extended properties"
                  rows={2}
                  error={formErrors.notes3}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Related Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Related Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage associated items and their details
              </p>
            </div>
            <div className="p-6">

              <EditableDataGrid
                id="create-modal-infinite-scroll"
                columns={[
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
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Pending', label: 'Pending' },
                      ],
                    },
                    width: '100px',
                    render: (value) => (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value === 'Active' ? 'bg-green-100 text-green-800' :
                        value === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {value}
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
                ]}
                data={formData.tableData}
                editable={true}
                infiniteScroll={{
                  enabled: true,
                  hasNextPage,
                  threshold: 200,
                  onLoadMore: handleLoadMore,
                  showLoader: false,
                  onStateChange: (state) => {
                    setHasNextPage(state.hasNextPage);
                  },
                }}
                virtualization={{
                  enabled: true,
                  itemHeight: 35,
                  containerHeight: 300,
                  overscan: 3,
                }}
                selection={{
                  type: 'checkbox',
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
                onSort={(columnKey, direction) => {
                  console.log('Sort:', columnKey, direction);
                }}
                onFilter={(filters) => {
                  console.log('Filter:', filters);
                }}
                size="small"
                rowKey="id"
                onDataChange={(newData) => {
                  setFormData(prev => ({ ...prev, tableData: newData }));
                }}
                className="border border-gray-200 rounded-md mb-4 w-full"
              />

              {/* Textarea */}
              <div className="mt-6">
                <Textarea
                  label="Data Notes"
                  value={formData.notes4}
                  onChange={(e) => handleInputChange('notes4', e.target.value)}
                  placeholder="Enter notes for related data"
                  rows={2}
                  error={formErrors.notes4}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelButtonLabel}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={loading}
            loading={loading}
            iconLeft={<Icon name="check" size="sm" />}
          >
            {loading ? 'Creating...' : submitButtonLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateModal;