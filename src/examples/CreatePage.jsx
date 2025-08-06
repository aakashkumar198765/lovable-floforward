import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {

  // Form Components
  Button,
  Input,
  Select,
  Textarea,
  Radio,

  // Display Components
  Icon,
  Badge,

  // Data Grid Components
  EditableDataGrid,

  // Feedback Components
  LoadingState
} from '../components';

/**
 * CreatePage - Generic Create/Form Page Component
 * 
 * This page demonstrates a clean, professional form implementation
 * with validation, grid layout, and sub-schema sections.
 * 
 * Key Features:
 * - Grid-based layout with sub-schemas
 * - Form validation
 * - Professional UI design
 * - Generic field structure
 * - Responsive design
 */
const CreatePage = () => {
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
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
      { id: 1, name: 'Item 1', quantity: 10, price: 25.50, status: 'active' },
      { id: 2, name: 'Item 2', quantity: 5, price: 15.00, status: 'inactive' }
    ],
    notes4: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Simple validation
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

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Form submitted:', formData);

      // Navigate back to listing page on success
      navigate('/templates/pages/listing-page');

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/templates/pages/listing-page');
  };

  // Handle table row deletion
  const handleDeleteTableRow = (index) => {
    setFormData(prev => ({
      ...prev,
      tableData: prev.tableData.filter((_, i) => i !== index)
    }));
  };

  // Generic select options
  const selectOptions = [
    { value: '', label: 'Select Option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                iconLeft={<Icon name="arrow-left" size="sm" />}
                disabled={loading}
              >
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Record
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fill in the information below to create a new record
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={loading}
                iconLeft={<Icon name="check" size="sm" />}
              >
                {loading ? 'Creating...' : 'Save Record'}
              </Button>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <LoadingState loading={loading} text="Creating record...">
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
                    rows={3}
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
                    rows={3}
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
                    rows={3}
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
                  columns={[
                    {
                      key: 'name',
                      title: 'Name',
                      dataIndex: 'name',
                      editable: true,
                      width: 200
                    },
                    {
                      key: 'quantity',
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      editable: true,
                      width: 120,
                      align: 'right'
                    },
                    {
                      key: 'price',
                      title: 'Value',
                      dataIndex: 'price',
                      editable: true,
                      width: 120,
                      align: 'right',
                      render: (value) => `$${value}`
                    },
                    {
                      key: 'status',
                      title: 'Status',
                      dataIndex: 'status',
                      editable: true,
                      width: 120
                    },
                    // {
                    //   key: 'actions',
                    //   title: 'Actions',
                    //   width: 80,
                    //   align: 'center',
                    //   render: (value, record, index) => (
                    //     <Button
                    //       variant="outline"
                    //       size="xs"
                    //       onClick={() => handleDeleteTableRow(index)}
                    //       iconLeft={<Icon name="trash" size="xs" />}
                    //       className="text-red-600 hover:text-red-800 border-red-300 hover:border-red-500"
                    //       disabled={loading}
                    //       aria-label={`Delete row ${record.name}`}
                    //     />
                    //   )
                    // }
                  ]}
                  data={formData.tableData}
                  editable={true}
                  allowedActions={["delete_rows"]}
                  size="small"
                  pagination={false}
                  rowKey="id"
                  onDataChange={(newData) => {
                    setFormData(prev => ({ ...prev, tableData: newData }));
                  }}
                  className="border border-gray-200 rounded-md mb-6"
                />

                {/* Textarea */}
                <div className="mt-6">
                  <Textarea
                    label="Data Notes"
                    value={formData.notes4}
                    onChange={(e) => handleInputChange('notes4', e.target.value)}
                    placeholder="Enter notes for related data"
                    rows={3}
                    error={formErrors.notes4}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Keep unchanged as requested */}
            {/* <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"> */}
            <div className="flex items-center justify-end space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={loading}
                iconLeft={<Icon name="check" size="sm" />}
              >
                {loading ? 'Creating...' : 'Submit'}
              </Button>
            </div>
            {/* </div> */}
          </form>
        </LoadingState>
      </div>
    </div>
  );
};

export default CreatePage;