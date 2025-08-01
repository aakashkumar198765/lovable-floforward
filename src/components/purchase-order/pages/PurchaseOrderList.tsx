import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';
import { setFilters, setPagination } from '../../../store/slices/purchaseOrderSlice';
import { EditableDataGrid } from '../../organisms/data-grids';
import { SearchBox, BulkActions, MetricCard } from '../../molecules';
import { Button, Badge, Status } from '../../atoms';

const PurchaseOrderList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    orders: purchaseOrders, 
    filters, 
    pagination,
    loading 
  } = useSelector((state: RootState) => state.purchaseOrders);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the top of the component
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    }, 0);
  }, [location.pathname]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let filtered = [...purchaseOrders];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.notes && order.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.status && filters.status.length > 0 && !filters.status.includes('all')) {
      filtered = filtered.filter(order => filters.status.includes(order.status));
    }

    if (filters.priority && filters.priority.length > 0 && !filters.priority.includes('all')) {
      filtered = filtered.filter(order => filters.priority.includes(order.priority));
    }

    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const startDate = new Date(start);
        const endDate = new Date(end);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    return filtered;
  }, [purchaseOrders, searchTerm, filters]);

  // Pagination logic
  const paginatedOrders = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    return filteredOrders.slice(startIndex, startIndex + pagination.pageSize);
  }, [filteredOrders, pagination]);

  // Summary metrics for filtered results
  const summaryMetrics = useMemo(() => {
    const totalValue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingCount = filteredOrders.filter(order => order.status === 'pending_approval').length;
    const approvedCount = filteredOrders.filter(order => order.status === 'approved').length;
    const urgentCount = filteredOrders.filter(order => order.priority === 'urgent').length;
    
    return {
      totalOrders: filteredOrders.length,
      totalValue,
      pendingCount,
      approvedCount,
      urgentCount
    };
  }, [filteredOrders]);

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

  // Table columns configuration for the data grid
  const columns = [
    {
      key: 'poNumber',
      title: 'Order Number',
      dataIndex: 'poNumber',
      sortable: true,
      filterable: true,
      width: 150,
      render: (value: string, row: any) => (
        <button
          onClick={() => navigate(`/purchase-order/orders/details/${row.id}`, { replace: true })}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {value}
        </button>
      ),
    },
    {
      key: 'vendor',
      title: 'Vendor',
      dataIndex: 'vendorName',
      sortable: true,
      filterable: true,
      width: 200,
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      filterable: true,
      width: 120,
      render: (value: string) => (
        <Badge
          variant="filled"
          color={getStatusColor(value)}
          size="sm"
        >
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      dataIndex: 'priority',
      sortable: true,
      filterable: true,
      width: 100,
      render: (value: string) => (
        <Status
          status={value === 'urgent' ? 'error' : value === 'high' ? 'warning' : 'active'}
          variant="badge"
          size="sm"
        />
      ),
    },
    {
      key: 'totalAmount',
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      sortable: true,
      filterable: true,
      width: 120,
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'createdAt',
      title: 'Created Date',
      dataIndex: 'createdAt',
      sortable: true,
      filterable: true,
      width: 120,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      width: 100,
      render: (value: any, row: any) => (
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => navigate(`edit/${row.id}`)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };


  const handleBulkAction = (action: string, selectedIds: string[] | number[]) => {
    console.log(`Bulk action: ${action} on`, selectedIds);
    // Implement bulk actions here
  };

  const bulkActions = [
    { label: 'Approve Selected', value: 'approve', color: 'success' },
    { label: 'Reject Selected', value: 'reject', color: 'error' },
    { label: 'Export Selected', value: 'export', color: 'primary' },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'All Statuses', value: 'all' },
        { label: 'Draft', value: 'draft' },
        { label: 'Pending Approval', value: 'pending_approval' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'All Priorities', value: 'all' },
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ];

  return (
    <div className="space-y-6" ref={scrollRef}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all purchase orders
          </p>
        </div>
        <Button
          onClick={() => navigate('new')}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Create New Order
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Orders"
          metric={{ value: summaryMetrics.totalOrders, label: "Orders" }}
          trend={{ direction: "up", value: 12, period: "from all time" }}
          size="sm"
        />
        <MetricCard
          title="Total Value"
          metric={{ value: summaryMetrics.totalValue, label: "Total Value", format: "currency" }}
          trend={{ direction: "up", value: 8, period: "this period" }}
          size="sm"
        />
        <MetricCard
          title="Pending Approval"
          metric={{ value: summaryMetrics.pendingCount, label: "Pending" }}
          trend={{ direction: "down", value: 3, period: "vs last week" }}
          size="sm"
        />
        <MetricCard
          title="Approved Orders"
          metric={{ value: summaryMetrics.approvedCount, label: "Approved" }}
          trend={{ direction: "up", value: 15, period: "this week" }}
          size="sm"
        />
        <MetricCard
          title="Urgent Priority"
          metric={{ value: summaryMetrics.urgentCount, label: "Urgent" }}
          trend={{ direction: "neutral", value: 0, period: "no change" }}
          size="sm"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBox
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by order number, vendor, or description..."
              size="md"
            />
          </div>
          <div className="lg:w-80">
            <div className="flex space-x-2">
              <div className="flex-1">
                <select 
                  value={filters.status[0] || 'all'} 
                  onChange={(e) => handleFilterChange({...filters, status: e.target.value === 'all' ? [] : [e.target.value]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex-1">
                <select 
                  value={filters.priority[0] || 'all'} 
                  onChange={(e) => handleFilterChange({...filters, priority: e.target.value === 'all' ? [] : [e.target.value]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <BulkActions
              selectedItems={selectedOrders}
              actions={bulkActions}
              onAction={handleBulkAction}
              showSelectionCount={true}
            />
          </div>
        )}
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <EditableDataGrid
          data={paginatedOrders}
          columns={columns}
          loading={loading}
          selection={{
            type: 'checkbox',
            selectedRowKeys: selectedOrders,
            onSelectionChange: setSelectedOrders
          }}
          virtualization={{
            enabled: true,
            itemHeight: 60
          }}
          pagination={{
            current: pagination.page,
            total: filteredOrders.length,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page: number, pageSize?: number) => {
              dispatch(setPagination({ 
                ...pagination, 
                page,
                ...(pageSize && { pageSize })
              }));
            },
            onShowSizeChange: (page: number, pageSize: number) => {
              dispatch(setPagination({ 
                ...pagination, 
                page: 1, // Reset to first page when changing page size
                pageSize 
              }));
            }
          }}
          bordered={true}
          exportable={true}
          resizable={true}
          filterable={true}
          commerceState="execution"
        />
      </div>

      {/* Summary Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-900">
            {filteredOrders.length}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-blue-600">
            {filteredOrders.filter(o => o.status === 'pending_approval').length}
          </div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-green-600">
            {filteredOrders.filter(o => o.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-2xl font-bold text-gray-900">
            ${filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Value</div>
        </div>
      </div> */}
    </div>
  );
};

export default PurchaseOrderList;