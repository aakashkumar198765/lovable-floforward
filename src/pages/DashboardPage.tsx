import React from 'react';
import { DashboardLayout } from '../components';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout
      title="Sales Dashboard"
      sidebarContent={
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">Navigation</div>
          <div className="space-y-2">
            <div className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded">📊 Dashboard</div>
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">📈 Analytics</div>
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">👥 Users</div>
            <div className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">⚙️ Settings</div>
          </div>
        </div>
      }
      headerContent={
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome back, Admin</span>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">A</div>
        </div>
      }
      footerContent={
        <div className="text-center text-sm text-gray-500">
          © 2024 Company Name. All rights reserved.
        </div>
      }
      breadcrumbItems={[
        { label: 'Home', href: '/' },
        { label: 'Dashboard' }
      ]}
      metrics={[
        { label: 'Total Sales', value: '$124,563', change: '+12.5%', icon: '💰' },
        { label: 'New Users', value: '1,234', change: '+5.3%', icon: '👥' },
        { label: 'Orders', value: '856', change: '-2.1%', icon: '📦' },
        { label: 'Revenue', value: '$89,234', change: '+8.7%', icon: '📈' }
      ]}
      quickActions={[
        { id: 'new-order', label: 'New Order', icon: '➕' },
        { id: 'export-data', label: 'Export Data', icon: '📤' },
        { id: 'user-report', label: 'User Report', icon: '📊' }
      ]}
      notifications={[
        { title: 'New Order', message: 'Order #12345 has been placed', read: false },
        { title: 'System Update', message: 'Maintenance scheduled for tonight', read: true },
        { title: 'Payment Received', message: 'Payment for order #12344 received', read: false }
      ]}
      onQuickAction={(action) => console.log('Quick action:', action)}
      onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
      onMetricClick={(metric) => console.log('Metric clicked:', metric)}
      allowedActions={['new-order', 'export-data', 'user-report']}
      commerceState="execution"
    >
      <div className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-6">Sales Overview</h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Recent Activity</h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Order #12345 completed</div>
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">👤</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">New user registration</div>
                  <div className="text-xs text-gray-500">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">💳</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Payment processed for order #12344</div>
                  <div className="text-xs text-gray-500">8 minutes ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h5 className="font-medium text-gray-900 mb-4">Quick Stats</h5>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users (24h)</span>
                <span className="text-sm font-medium text-gray-900">2,456</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Orders</span>
                <span className="text-sm font-medium text-gray-900">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="text-sm font-medium text-green-600">12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Order Value</span>
                <span className="text-sm font-medium text-gray-900">$145.32</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Chart Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h5 className="font-medium text-gray-900 mb-4">Sales Trend (Last 30 Days)</h5>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Sales trend chart would be rendered here</p>
              <p className="text-sm text-gray-500 mt-2">Integration with charting library required</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;