import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { MetricCard, StatusCard } from '../../molecules';
import { Button, Badge, Status } from '../../atoms';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders: purchaseOrders } = useSelector((state: RootState) => state.purchaseOrders);
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      // Scroll to the top of the component
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
      }, 0);
    }, [location.pathname]);

  // Calculate metrics
  const totalOrders = purchaseOrders.length;
  const pendingOrders = purchaseOrders.filter(po => po.status === 'pending_approval').length;
  const approvedOrders = purchaseOrders.filter(po => po.status === 'approved').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);

  const recentOrders = [...purchaseOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'gray';
      case 'pending_approval': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your purchase orders today.
            </p>
          </div>
          <Button
            onClick={() => navigate('/purchase-order/orders/new', { replace: true })}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create New Order
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          metric={{ value: totalOrders, label: "Total Orders" }}
          trend={{ direction: "up", value: 12, period: "vs last month" }}
        />
        <MetricCard
          title="Pending Approval"
          metric={{ value: pendingOrders, label: "Pending Approval" }}
          trend={{ direction: "down", value: 8, period: "vs last month" }}
        />
        <MetricCard
          title="Approved Orders"
          metric={{ value: approvedOrders, label: "Approved Orders" }}
          trend={{ direction: "up", value: 15, period: "vs last month" }}
        />
        <MetricCard
          title="Total Value"
          metric={{ value: totalValue, label: "Total Value", format: "currency" }}
          trend={{ direction: "up", value: 22, period: "vs last month" }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Purchase Orders
                </h2>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/purchase-order/orders', { replace: true })}
                >
                  View All
                </Button>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/purchase-order/orders/edit/${order.id}`, { replace: true })}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">
                            {order.poNumber}
                          </span>
                          <Badge
                            variant="filled"
                            color={getStatusColor(order.status)}
                            size="sm"
                          >
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.vendorName} • ${order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <Status
                          status={order.priority === 'urgent' ? 'error' : order.priority === 'high' ? 'warning' : 'active'}
                          variant="badge"
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No purchase orders found.</p>
                  <Button
                    onClick={() => navigate('/purchase-order/orders/new', { replace: true })}
                    className="mt-4"
                  >
                    Create Your First Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="space-y-6">
          <StatusCard
            title="System Status"
            status="All systems operational"
            description="Purchase order system is running smoothly"
            statusVariant="success"
            variant="filled"
          />

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/purchase-order/orders/new', { replace: true })}
              >
                Create Purchase Order
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/purchase-order/orders', { replace: true })}
              >
                View All Orders
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/purchase-order/settings', { replace: true })}
              >
                System Settings
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Role
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge variant="filled" color="primary">
                  {user?.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Department</span>
                <span className="text-sm font-medium">{user?.department}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;