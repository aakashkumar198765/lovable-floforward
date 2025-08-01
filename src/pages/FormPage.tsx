import React from 'react';
import { FormLayout } from '../components';

const FormPage: React.FC = () => {
  return (
    <FormLayout
      title="Customer Registration"
      description="Create a new customer account with comprehensive information"
      steps={[
        {
          title: 'Personal Information',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          )
        },
        {
          title: 'Company Information',
          content: (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Website
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          )
        },
        {
          title: 'Account Preferences',
          content: (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Notification Preferences
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Email notifications for order updates</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">SMS notifications for urgent alerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Marketing communications</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="contact-method" value="email" className="h-4 w-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="contact-method" value="phone" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Phone</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="contact-method" value="both" className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Both Email and Phone</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information or special requirements..."
                />
              </div>
            </div>
          )
        }
      ]}
      currentStep={0}
      showProgress={true}
      showStepNavigation={true}
      autoSave={true}
      autoSaveInterval={30000}
      validationMode="onChange"
      confirmBeforeLeave={true}
      layout="single-column"
      formActions={[
        { 
          id: 'cancel', 
          label: 'Cancel', 
          variant: 'secondary', 
          action: () => console.log('Form cancelled'),
          icon: undefined
        },
        { 
          id: 'save', 
          label: 'Save Draft', 
          variant: 'secondary', 
          action: () => console.log('Draft saved'),
          icon: undefined
        },
        { 
          id: 'submit', 
          label: 'Complete Registration', 
          variant: 'primary', 
          action: () => console.log('Registration completed'),
          icon: undefined
        }
      ]}
      onStepChange={(stepIndex, step) => console.log('Step changed:', stepIndex, step)}
      onFormSubmit={(data) => console.log('Form submitted:', data)}
      onFormSave={(data) => console.log('Form auto-saved:', data)}
      onFieldChange={(fieldName, value) => console.log('Field changed:', fieldName, value)}
      onValidation={(fieldName, error) => console.log('Validation:', fieldName, error)}
      allowedActions={['save', 'submit']}
      commerceState="initiation"
    />
  );
};

export default FormPage;