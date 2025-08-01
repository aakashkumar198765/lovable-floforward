import React from 'react';
import { ListDetailLayout } from '../components';

const ListDetailPage: React.FC = () => {
  const mockCustomers = [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john.doe@acmecorp.com', 
      status: 'active', 
      company: 'ACME Corporation',
      phone: '+1 (555) 123-4567',
      industry: 'Technology',
      joinDate: '2023-01-15',
      lastActivity: '2024-01-20',
      totalOrders: 45,
      totalSpent: 12450.75
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane.smith@techsolutions.com', 
      status: 'active', 
      company: 'Tech Solutions Ltd',
      phone: '+1 (555) 987-6543',
      industry: 'Software',
      joinDate: '2023-03-22',
      lastActivity: '2024-01-19',
      totalOrders: 32,
      totalSpent: 8920.50
    },
    { 
      id: '3', 
      name: 'Bob Johnson', 
      email: 'bob.johnson@innovatetech.com', 
      status: 'inactive', 
      company: 'Innovate Tech Inc',
      phone: '+1 (555) 456-7890',
      industry: 'Healthcare',
      joinDate: '2022-11-08',
      lastActivity: '2023-12-15',
      totalOrders: 18,
      totalSpent: 5670.25
    },
    { 
      id: '4', 
      name: 'Alice Brown', 
      email: 'alice.brown@futureflow.com', 
      status: 'active', 
      company: 'Future Flow Systems',
      phone: '+1 (555) 321-0987',
      industry: 'Finance',
      joinDate: '2023-06-10',
      lastActivity: '2024-01-21',
      totalOrders: 67,
      totalSpent: 18340.80
    },
    { 
      id: '5', 
      name: 'Charlie Wilson', 
      email: 'charlie.wilson@greentech.com', 
      status: 'pending', 
      company: 'Green Tech Solutions',
      phone: '+1 (555) 654-3210',
      industry: 'Energy',
      joinDate: '2024-01-18',
      lastActivity: '2024-01-20',
      totalOrders: 3,
      totalSpent: 890.00
    }
  ];

  const selectedCustomer = mockCustomers[0];

  return (
    <ListDetailLayout
      title="Customer Management System"
      listTitle="Customer Directory"
      detailTitle="Customer Profile"
      items={mockCustomers}
      selectedItem={selectedCustomer}
      showSearch={true}
      showFilters={true}
      showBulkActions={true}
      showItemActions={true}
      listWidth="w-2/5"
      layout="horizontal"
      filters={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' }
          ]
        },
        {
          key: 'industry',
          label: 'Industry',
          options: [
            { value: 'technology', label: 'Technology' },
            { value: 'software', label: 'Software' },
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'finance', label: 'Finance' },
            { value: 'energy', label: 'Energy' }
          ]
        }
      ]}
      bulkActions={[
        { id: 'activate', label: 'Activate', variant: 'primary' },
        { id: 'deactivate', label: 'Deactivate', variant: 'secondary' },
        { id: 'export', label: 'Export', variant: 'secondary' },
        { id: 'delete', label: 'Delete', variant: 'danger' }
      ]}
      itemActions={[
        { id: 'edit', label: 'Edit', icon: '✏️' },
        { id: 'view-orders', label: 'View Orders', icon: '📦' },
        { id: 'send-email', label: 'Send Email', icon: '📧' },
        { id: 'delete', label: 'Delete', icon: '🗑️' }
      ]}
      searchPlaceholder="Search customers by name, email, or company..."
      emptyStateMessage="No customers found matching your criteria"
      onItemSelect={(item) => console.log('Customer selected:', item)}
      onItemAction={(item, action) => console.log('Item action:', action, 'for customer:', item.name)}
      onBulkAction={(selectedItems, action) => console.log('Bulk action:', action, 'on', selectedItems.length, 'customers')}
      onSearch={(term) => console.log('Search term:', term)}
      onFilter={(filters) => console.log('Filters applied:', filters)}
      onSort={(field, direction) => console.log('Sort by:', field, direction)}
      detailContent={
        selectedCustomer && (
          <div className="space-y-6">
            {/* Customer Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-blue-100">{selectedCustomer.company}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                    selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedCustomer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600">Total Spent</div>
                <div className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600">Avg. Order Value</div>
                <div className="text-2xl font-bold text-blue-600">${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}</div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Phone</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Industry</label>
                  <div className="mt-1 text-sm text-gray-900">{selectedCustomer.industry}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Join Date</label>
                  <div className="mt-1 text-sm text-gray-900">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm">📦</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Order #ORD-2024-001 completed</div>
                    <div className="text-xs text-gray-500">2 days ago • $245.00</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">💳</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Payment received for order #ORD-2024-001</div>
                    <div className="text-xs text-gray-500">3 days ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">📧</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Email campaign opened</div>
                    <div className="text-xs text-gray-500">1 week ago</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                Send Email
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700">
                View Orders
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50">
                Edit Profile
              </button>
            </div>
          </div>
        )
      }
      allowedActions={['activate', 'deactivate', 'edit', 'view-orders', 'send-email']}
      commerceState="execution"
    />
  );
};

export default ListDetailPage;