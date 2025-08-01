import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Button, Badge, Status } from '../../atoms';
import { EditableDataGrid } from '../../organisms/data-grids';

const PurchaseOrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { orders: purchaseOrders } = useSelector((state: RootState) => state.purchaseOrders);
  const order = purchaseOrders.find(po => po.id === id);

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-6">The requested purchase order could not be found.</p>
            <Button onClick={() => navigate('../orders')} variant="primary">
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'gray';
      case 'medium': return 'primary';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Table columns for order items
  const itemColumns = [
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      width: 300,
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      width: 150,
      render: (value: string) => (
        <Badge variant="outline" color="primary" size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      align: 'center' as const,
    },
    {
      key: 'unitPrice',
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      width: 120,
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'totalPrice',
      title: 'Total Price',
      dataIndex: 'totalPrice',
      width: 120,
      align: 'right' as const,
      render: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Order Details</h1>
          <p className="text-gray-600 mt-1">
            View detailed information for order {order.poNumber}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate(`../orders/edit/${order.id}`)}
            variant="secondary"
            size="md"
          >
            Edit Order
          </Button>
          <Button
            onClick={() => navigate('../orders')}
            variant="primary"
            size="md"
          >
            Back to Orders
          </Button>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Order Number */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Order Number</div>
              <div className="text-lg font-semibold text-gray-900">{order.poNumber}</div>
            </div>

            {/* Vendor */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Vendor</div>
              <div className="text-lg font-semibold text-gray-900">{order.vendorName}</div>
            </div>

            {/* Status */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
              <Badge
                variant="filled"
                color={getStatusColor(order.status)}
                size="md"
              >
                {order.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Priority */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Priority</div>
              <Status
                status={order.priority === 'urgent' ? 'error' : order.priority === 'high' ? 'warning' : 'active'}
                variant="badge"
                size="md"
              />
            </div>

            {/* Order Date */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Order Date</div>
              <div className="text-lg font-semibold text-gray-900">{formatDate(order.orderDate)}</div>
            </div>

            {/* Delivery Date */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Delivery Date</div>
              <div className="text-lg font-semibold text-gray-900">{formatDate(order.deliveryDate)}</div>
            </div>

            {/* Requestor */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Requestor</div>
              <div className="text-lg font-semibold text-gray-900">{order.requestorName}</div>
            </div>

            {/* Department */}
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Department</div>
              <div className="text-lg font-semibold text-gray-900">{order.department}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Financial Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Subtotal</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(order.subtotal)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Tax Amount</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(order.taxAmount)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Shipping Cost</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(order.shippingCost)}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-600 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(order.totalAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            <Badge variant="outline" color="primary" size="sm">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <EditableDataGrid
            data={order.items}
            columns={itemColumns}
            loading={false}
            editable={false}
            bordered={true}
            commerceState="execution"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Approval History */}
        {order.approvalHistory && order.approvalHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Approval History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {order.approvalHistory.map((approval) => (
                  <div key={approval.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">{approval.approverName}</div>
                      <Badge
                        variant="filled"
                        color={
                          approval.action === 'approved' ? 'success' :
                          approval.action === 'rejected' ? 'error' : 'warning'
                        }
                        size="sm"
                      >
                        {approval.action}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{approval.comments}</div>
                    <div className="text-xs text-gray-500">{formatDate(approval.timestamp)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {order.attachments && order.attachments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {order.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <div className="text-sm text-gray-900">{attachment}</div>
                    <Button size="xs" variant="secondary">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;