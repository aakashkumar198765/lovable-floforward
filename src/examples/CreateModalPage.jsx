import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateModal from '../components/organisms/data-grids/CreateModal';

/**
 * CreateModalPage - Standalone Create Modal Page
 * 
 * This page renders the CreateModal as a standalone page for demonstration
 * and testing purposes.
 */
const CreateModalPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Record created successfully');
      // Navigate back to listing page
      navigate('/templates/pages/listing-page');
    }, 2000);
  };

  const handleClose = () => {
    navigate('/templates/pages/listing-page');
  };

  const formSchema = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Essential details for the record',
      icon: 'document',
      fields: [
        {
          key: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'Enter title',
          required: true,
          validation: { minLength: 3, maxLength: 100 }
        },
        {
          key: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Enter description',
          required: true,
          validation: { minLength: 10, maxLength: 500 }
        },
        {
          key: 'category',
          label: 'Category',
          type: 'select',
          required: true,
          options: [
            { value: '', label: 'Select Category' },
            { value: 'category1', label: 'Category 1' },
            { value: 'category2', label: 'Category 2' },
            { value: 'category3', label: 'Category 3' },
            { value: 'category4', label: 'Category 4' }
          ]
        },
        {
          key: 'priority',
          label: 'Priority',
          type: 'select',
          required: true,
          options: [
            { value: '', label: 'Select Priority' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' }
          ]
        }
      ]
    },
    {
      id: 'details',
      title: 'Details',
      description: 'Timeline and assignment information',
      icon: 'calendar',
      fields: [
        {
          key: 'startDate',
          label: 'Start Date',
          type: 'date',
          required: true
        },
        {
          key: 'endDate',
          label: 'End Date',
          type: 'date',
          required: false
        },
        {
          key: 'assignedTo',
          label: 'Assigned To',
          type: 'text',
          placeholder: 'Enter assignee name',
          required: false
        },
        {
          key: 'department',
          label: 'Department',
          type: 'select',
          required: false,
          options: [
            { value: '', label: 'Select Department' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'sales', label: 'Sales' },
            { value: 'hr', label: 'Human Resources' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <CreateModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Create New Record"
        loading={loading}
        formSchema={formSchema}
        defaultData={{
          title: '',
          description: '',
          category: '',
          priority: '',
          startDate: '',
          endDate: '',
          assignedTo: '',
          department: ''
        }}
      />
    </div>
  );
};

export default CreateModalPage;