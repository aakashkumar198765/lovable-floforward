import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PurchaseOrderItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  requestorId: string;
  requestorName: string;
  department: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  orderDate: string;
  deliveryDate: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  approvalHistory: ApprovalRecord[];
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRecord {
  id: string;
  approverId: string;
  approverName: string;
  action: 'approved' | 'rejected' | 'pending';
  comments: string;
  timestamp: string;
}

interface PurchaseOrderState {
  orders: PurchaseOrder[];
  currentOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    priority: string[];
    department: string[];
    dateRange: {
      start: string;
      end: string;
    };
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

// Generate mock purchase orders for demonstration
const generateMockPurchaseOrders = (): PurchaseOrder[] => {
  const mockOrders: PurchaseOrder[] = [];
  const statuses: PurchaseOrder['status'][] = ['draft', 'pending_approval', 'approved', 'rejected', 'completed', 'cancelled'];
  const priorities: PurchaseOrder['priority'][] = ['low', 'medium', 'high', 'urgent'];
  const departments = ['IT', 'Procurement', 'Operations', 'HR', 'Finance', 'Marketing'];
  const vendors = [
    { id: '1', name: 'Global Tech Solutions' },
    { id: '2', name: 'Office Supplies Pro' },
    { id: '3', name: 'Industrial Equipment Corp' },
    { id: '4', name: 'Green Energy Solutions' },
    { id: '5', name: 'Construction Materials Inc' },
    { id: '6', name: 'Medical Supplies Direct' },
    { id: '7', name: 'Digital Marketing Agency' },
    { id: '8', name: 'Logistics Express' },
    { id: '9', name: 'Food Service Distributors' },
    { id: '10', name: 'Security Systems Ltd' },
    { id: '11', name: 'Enterprise Software Partners' },
    { id: '12', name: 'Healthcare Equipment Solutions' },
    { id: '13', name: 'Advanced Manufacturing Tools' },
    { id: '14', name: 'Sustainable Facilities Management' },
    { id: '15', name: 'Professional Services Group' },
    { id: '16', name: 'Transportation & Fleet Services' },
    { id: '17', name: 'Scientific Instruments Inc' },
    { id: '18', name: 'Quality Assurance Systems' },
    { id: '19', name: 'Environmental Solutions Corp' },
    { id: '20', name: 'Innovation Technology Partners' }
  ];

  const sampleItems = [
    // Technology
    { description: 'Laptop Computer Dell XPS 13', category: 'Technology', unitPrice: 1299.99 },
    { description: 'Desktop Computer HP Workstation', category: 'Technology', unitPrice: 1899.99 },
    { description: 'Industrial Printer HP LaserJet', category: 'Technology', unitPrice: 899.99 },
    { description: 'Network Router Cisco Enterprise', category: 'Technology', unitPrice: 2499.99 },
    { description: 'Monitor 27" 4K Display', category: 'Technology', unitPrice: 399.99 },
    { description: 'Server Dell PowerEdge', category: 'Technology', unitPrice: 4999.99 },
    { description: 'Tablets iPad Pro 12.9"', category: 'Technology', unitPrice: 1099.99 },
    { description: 'Smartphones iPhone 14 Pro', category: 'Technology', unitPrice: 999.99 },
    
    // Office Supplies
    { description: 'Office Desk Chair Ergonomic', category: 'Office Supplies', unitPrice: 299.99 },
    { description: 'Paper Supplies A4 Premium', category: 'Office Supplies', unitPrice: 12.99 },
    { description: 'Standing Desk Adjustable', category: 'Office Supplies', unitPrice: 599.99 },
    { description: 'Conference Table 8-Person', category: 'Office Supplies', unitPrice: 1299.99 },
    { description: 'Filing Cabinet 4-Drawer', category: 'Office Supplies', unitPrice: 199.99 },
    { description: 'Whiteboard 6ft x 4ft', category: 'Office Supplies', unitPrice: 149.99 },
    { description: 'Stationery Supplies Bundle', category: 'Office Supplies', unitPrice: 89.99 },
    
    // Industrial & Manufacturing
    { description: 'Safety Equipment Hard Hats', category: 'Safety', unitPrice: 45.99 },
    { description: 'Industrial Tools Power Drill Set', category: 'Industrial', unitPrice: 299.99 },
    { description: 'Warehouse Shelving Unit', category: 'Industrial', unitPrice: 899.99 },
    { description: 'Forklift Parts Maintenance Kit', category: 'Industrial', unitPrice: 799.99 },
    { description: 'Safety Vests High-Visibility', category: 'Safety', unitPrice: 29.99 },
    { description: 'Machine Parts CNC Components', category: 'Industrial', unitPrice: 1999.99 },
    
    // Medical & Healthcare
    { description: 'Medical Supplies First Aid Kit', category: 'Medical', unitPrice: 89.99 },
    { description: 'Hospital Bed Electric Adjustable', category: 'Medical', unitPrice: 3999.99 },
    { description: 'Medical Equipment Stethoscope', category: 'Medical', unitPrice: 199.99 },
    { description: 'Surgical Instruments Sterile Set', category: 'Medical', unitPrice: 599.99 },
    { description: 'Wheelchair Standard Manual', category: 'Medical', unitPrice: 299.99 },
    
    // Software & Licensing
    { description: 'Software License Adobe Creative', category: 'Software', unitPrice: 599.99 },
    { description: 'Microsoft Office 365 Business', category: 'Software', unitPrice: 149.99 },
    { description: 'Antivirus Software Enterprise', category: 'Software', unitPrice: 99.99 },
    { description: 'CAD Software Autodesk License', category: 'Software', unitPrice: 1799.99 },
    { description: 'Project Management Software', category: 'Software', unitPrice: 299.99 },
    
    // Maintenance & Facilities
    { description: 'Cleaning Supplies Janitorial', category: 'Maintenance', unitPrice: 156.99 },
    { description: 'HVAC System Filters', category: 'Maintenance', unitPrice: 79.99 },
    { description: 'Landscaping Equipment Mower', category: 'Maintenance', unitPrice: 899.99 },
    { description: 'Electrical Supplies Wiring Kit', category: 'Maintenance', unitPrice: 199.99 },
    { description: 'Plumbing Supplies Pipe Fittings', category: 'Maintenance', unitPrice: 129.99 },
    
    // Food Service & Catering
    { description: 'Commercial Kitchen Equipment', category: 'Food Service', unitPrice: 2999.99 },
    { description: 'Catering Supplies Serving Trays', category: 'Food Service', unitPrice: 49.99 },
    { description: 'Coffee Machine Industrial', category: 'Food Service', unitPrice: 1299.99 },
    { description: 'Refrigeration Unit Commercial', category: 'Food Service', unitPrice: 3499.99 },
    
    // Transportation & Logistics
    { description: 'Vehicle Parts Fleet Maintenance', category: 'Transportation', unitPrice: 499.99 },
    { description: 'Shipping Containers Storage', category: 'Transportation', unitPrice: 1999.99 },
    { description: 'Loading Dock Equipment', category: 'Transportation', unitPrice: 2499.99 },
    
    // Marketing & Events
    { description: 'Marketing Materials Brochures', category: 'Marketing', unitPrice: 299.99 },
    { description: 'Event Supplies Banner Stands', category: 'Marketing', unitPrice: 199.99 },
    { description: 'Trade Show Booth Display', category: 'Marketing', unitPrice: 3999.99 }
  ];

  // Generate 100+ mock orders for comprehensive testing and virtualization demo
  for (let i = 1; i <= 150; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    // Generate random items for this order
    const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items
    const orderItems: PurchaseOrderItem[] = [];
    
    for (let j = 0; j < numItems; j++) {
      const item = sampleItems[Math.floor(Math.random() * sampleItems.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const totalPrice = item.unitPrice * quantity;
      
      orderItems.push({
        id: `item-${i}-${j}`,
        description: item.description,
        quantity,
        unitPrice: item.unitPrice,
        totalPrice,
        category: item.category
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.085; // 8.5% tax
    const shippingCost = subtotal > 500 ? 0 : 25; // Free shipping over $500
    const totalAmount = subtotal + taxAmount + shippingCost;

    // Generate dates
    const createdDate = new Date(2024, Math.floor(Math.random() * 7), Math.floor(Math.random() * 28) + 1);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 30) + 7); // 7-37 days later

    // Generate approval history for non-draft orders
    const approvalHistory: ApprovalRecord[] = [];
    if (status !== 'draft') {
      const approvers = ['John Smith', 'Sarah Johnson', 'Mike Wilson'];
      const approver = approvers[Math.floor(Math.random() * approvers.length)];
      
      approvalHistory.push({
        id: `approval-${i}-1`,
        approverId: `user-${Math.floor(Math.random() * 3) + 1}`,
        approverName: approver,
        action: status === 'rejected' ? 'rejected' : (status === 'pending_approval' ? 'pending' : 'approved'),
        comments: status === 'rejected' ? 'Budget exceeded for this quarter' : (status === 'pending_approval' ? 'Under review' : 'Approved for processing'),
        timestamp: new Date(createdDate.getTime() + 86400000).toISOString() // 1 day after creation
      });
    }

    mockOrders.push({
      id: `po-${i.toString().padStart(3, '0')}`,
      poNumber: `PO-2024-${i.toString().padStart(4, '0')}`,
      vendorId: vendor.id,
      vendorName: vendor.name,
      requestorId: `user-${Math.floor(Math.random() * 3) + 1}`,
      requestorName: ['John Smith', 'Sarah Johnson', 'Mike Wilson'][Math.floor(Math.random() * 3)],
      department,
      status,
      priority,
      orderDate: createdDate.toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      shippingCost,
      totalAmount: Math.round(totalAmount * 100) / 100,
      approvalHistory,
      notes: `Purchase order for ${department} department - ${priority} priority`,
      attachments: Math.random() > 0.7 ? [`attachment-${i}.pdf`] : [],
      createdAt: createdDate.toISOString(),
      updatedAt: new Date(createdDate.getTime() + Math.floor(Math.random() * 7) * 86400000).toISOString() // Updated within a week
    });
  }

  return mockOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const mockPurchaseOrders = generateMockPurchaseOrders();

const initialState: PurchaseOrderState = {
  orders: mockPurchaseOrders,
  currentOrder: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    priority: [],
    department: [],
    dateRange: {
      start: '',
      end: '',
    },
  },
  pagination: {
    page: 1,
    pageSize: 20,
    total: mockPurchaseOrders.length,
  },
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPurchaseOrders: (state, action: PayloadAction<PurchaseOrder[]>) => {
      state.orders = action.payload;
      state.pagination.total = action.payload.length;
    },
    addPurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      state.orders.unshift(action.payload);
      state.pagination.total += 1;
    },
    updatePurchaseOrder: (state, action: PayloadAction<PurchaseOrder>) => {
      const index = state.orders.findIndex(order => order.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    deletePurchaseOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
      state.pagination.total -= 1;
    },
    setCurrentOrder: (state, action: PayloadAction<PurchaseOrder | null>) => {
      state.currentOrder = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: PurchaseOrder['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    addApprovalRecord: (state, action: PayloadAction<{ orderId: string; approval: ApprovalRecord }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.approvalHistory.push(action.payload.approval);
        order.updatedAt = new Date().toISOString();
      }
    },
    setFilters: (state, action: PayloadAction<Partial<PurchaseOrderState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action: PayloadAction<Partial<PurchaseOrderState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: [],
        priority: [],
        department: [],
        dateRange: { start: '', end: '' },
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setPurchaseOrders,
  addPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  setCurrentOrder,
  updateOrderStatus,
  addApprovalRecord,
  setFilters,
  setPagination,
  clearFilters,
} = purchaseOrderSlice.actions;

// Thunk actions
export const createPurchaseOrder = (orderData: any) => (dispatch: any) => {
  dispatch(setLoading(true));
  
  const newOrder: PurchaseOrder = {
    id: Date.now().toString(),
    poNumber: orderData.poNumber || orderData.orderNumber,
    vendorId: orderData.vendorId || Date.now().toString(),
    vendorName: orderData.vendor || orderData.vendorName,
    requestorId: orderData.createdBy,
    requestorName: orderData.requestorName || 'Unknown',
    department: orderData.department || 'General',
    status: 'draft',
    priority: orderData.priority,
    orderDate: new Date().toISOString(),
    deliveryDate: orderData.deliveryDate,
    items: orderData.items || [],
    subtotal: orderData.subtotal || orderData.totalAmount || 0,
    taxAmount: orderData.taxAmount || 0,
    shippingCost: orderData.shippingCost || 0,
    totalAmount: orderData.totalAmount || 0,
    approvalHistory: [],
    notes: orderData.notes || '',
    attachments: orderData.attachments || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dispatch(addPurchaseOrder(newOrder));
  dispatch(setLoading(false));
};

export const setPurchaseOrderFilters = (filters: any) => (dispatch: any) => {
  dispatch(setFilters(filters));
};

export const setPurchaseOrderPagination = (pagination: any) => (dispatch: any) => {
  dispatch(setPagination(pagination));
};

export default purchaseOrderSlice.reducer;