import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { addPurchaseOrder, updatePurchaseOrder } from '../../../store/slices/purchaseOrderSlice';
import { Input, Select, Textarea, Button, DatePicker, FileUpload } from '../../atoms';
import { EditableDataGrid } from '../../organisms';
import { Toast, Alert } from '../../atoms';

interface PurchaseOrderFormData {
  poNumber: string;
  vendor: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deliveryDate: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    category: string;
  }>;
  notes: string;
  attachments: File[];
}

const PurchaseOrderForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const isEditing = Boolean(id);

  const { orders: purchaseOrders, loading } = useSelector((state: RootState) => state.purchaseOrders);
  const { user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<PurchaseOrderFormData>({
    poNumber: '',
    vendor: '',
    description: '',
    priority: 'medium',
    deliveryDate: '',
    items: [],
    notes: '',
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load existing order if editing
  useEffect(() => {
    if (isEditing && id) {
      const existingOrder = purchaseOrders.find(po => po.id === id);
      if (existingOrder) {
        setFormData({
          poNumber: existingOrder.poNumber,
          vendor: existingOrder.vendorName,
          description: existingOrder.notes,
          priority: existingOrder.priority,
          deliveryDate: existingOrder.deliveryDate,
          items: existingOrder.items || [],
          notes: existingOrder.notes || '',
          attachments: []
        });
      }
    } else {
      // Generate new order number for new orders
      const orderCount = purchaseOrders.length + 1;
      setFormData(prev => ({
        ...prev,
        poNumber: `PO-${new Date().getFullYear()}-${orderCount.toString().padStart(4, '0')}`
      }));
    }
  }, [isEditing, id, purchaseOrders]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item_${index}_description`] = 'Item description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };


  const handleItemsChange = (items: any[]) => {
    const processedItems = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));
    
    setFormData(prev => ({
      ...prev,
      items: processedItems
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToastMessage('Please fix the validation errors');
      setShowToast(true);
      return;
    }

    const orderData = {
      ...formData,
      totalAmount: formData.items.reduce((sum, item) => sum + item.totalPrice, 0),
      status: isEditing ? 'updated' : 'draft',
      createdBy: user?.id || '',
      createdAt: isEditing ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (isEditing) {
        const existingOrder = purchaseOrders.find(po => po.id === id!);
        if (existingOrder) {
          const updatedOrder = {
            ...existingOrder,
            poNumber: orderData.poNumber,
            vendorName: orderData.vendor,
            notes: orderData.description,
            priority: orderData.priority,
            deliveryDate: orderData.deliveryDate,
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            updatedAt: new Date().toISOString()
          };
          dispatch(updatePurchaseOrder(updatedOrder));
        }
        setToastMessage('Purchase order updated successfully');
      } else {
        const newOrder = {
          id: Date.now().toString(),
          poNumber: orderData.poNumber,
          vendorId: Date.now().toString(),
          vendorName: orderData.vendor,
          requestorId: orderData.createdBy,
          requestorName: user?.name || 'Unknown',
          department: user?.department || 'General',
          status: 'draft' as const,
          priority: orderData.priority,
          orderDate: new Date().toISOString(),
          deliveryDate: orderData.deliveryDate,
          items: orderData.items.map(item => ({
            ...item,
            category: item.category || 'General'
          })),
          subtotal: orderData.totalAmount,
          taxAmount: 0,
          shippingCost: 0,
          totalAmount: orderData.totalAmount,
          approvalHistory: [],
          notes: orderData.notes,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          commerceState: 'initiation' as const,
          encryption: 'standard' as const,
          auditTrail: [],
        };
        dispatch(addPurchaseOrder(newOrder));
        setToastMessage('Purchase order created successfully');
      }
      
      setShowToast(true);
      setTimeout(() => {
        navigate('../orders');
      }, 2000);
      
    } catch (error) {
      setToastMessage('Error saving purchase order');
      setShowToast(true);
    }
  };


  const itemColumns = [
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
      editable: true,
      width: 250,
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      editable: true,
      width: 150,
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      editable: true,
      width: 100,
      editor: 'input' as const,
    },
    {
      key: 'unitPrice',
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      editable: true,
      width: 120,
      editor: 'input' as const,
      render: (value: number) => `$${value?.toFixed(2)}`,
    },
    {
      key: 'totalPrice',
      title: 'Total Price',
      dataIndex: 'totalPrice',
      width: 120,
      render: (value: number, record: any) => `$${(record.quantity * record.unitPrice).toFixed(2)}`,
    },
  ];

  const renderStepContent = () => {
    return (
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Order Number"
              value={formData.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
              disabled
              helperText="Auto-generated order number"
            />
            
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(value) => handleInputChange('priority', value)}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
              required
            />
            
            <Input
              label="Vendor"
              value={formData.vendor}
              onChange={(e) => handleInputChange('vendor', e.target.value)}
              errorMessage={errors.vendor}
              required
              placeholder="Enter vendor name"
            />
            
            <DatePicker
              label="Delivery Date"
              value={formData.deliveryDate?.toString?.().split('T')[0] || ''}
              onChange={(date) => handleInputChange('deliveryDate', date)}
              errorMessage={errors.deliveryDate}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="mt-6">
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              errorMessage={errors.description}
              required
              rows={3}
              placeholder="Describe the purpose and details of this purchase order"
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            <Button
              onClick={() => {
                const newItem = {
                  id: `item_${Date.now()}`,
                  description: '',
                  category: 'General',
                  quantity: 1,
                  unitPrice: 0,
                  totalPrice: 0
                };
                handleItemsChange([...formData.items, newItem]);
              }}
              size="sm"
              variant="secondary"
            >
              Add Item
            </Button>
          </div>
          
          {errors.items && (
            <Alert variant="error" description={errors.items} />
          )}
          
          <EditableDataGrid
            data={formData.items}
            columns={itemColumns}
            editable={true}
            allowedActions={['edit_rows', 'delete_rows']}
            loading={false}
            commerceState="initiation"
            onCellEdit={(value, record, column) => {
              const fieldName = column.dataIndex as string;
              const updatedItems = formData.items.map(item => 
                item.id === record.id 
                  ? { 
                      ...item, 
                      [fieldName]: value, 
                      totalPrice: fieldName === 'quantity' || fieldName === 'unitPrice' 
                        ? (fieldName === 'quantity' ? value * item.unitPrice : item.quantity * value) 
                        : item.totalPrice 
                    }
                  : item
              );
              handleItemsChange(updatedItems);
            }}
            onRowAdd={() => {
              const newItem = {
                id: `item_${Date.now()}`,
                description: '',
                category: 'General',
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0
              };
              handleItemsChange([...formData.items, newItem]);
            }}
            onRowDelete={(record) => {
              const filteredItems = formData.items.filter(item => item.id !== record.id);
              handleItemsChange(filteredItems);
            }}
          />
          
          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span>${formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Additional Information</h3>
          
          <div className="space-y-6">
            <Textarea
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Any additional notes or special instructions"
            />
            
            <FileUpload
              label="Attachments"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onFilesChange={(files) => handleInputChange('attachments', files)}
              helperText="Upload relevant documents (PDF, DOC, images)"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update purchase order details' : 'Create a new purchase order with all required information'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('../orders')}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={formData.items.length === 0}
          >
            {isEditing ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
      
      {showToast && (
        <Toast
          variant="success"
          title="Success"
          description={toastMessage}
          onClose={() => setShowToast(false)}
          duration={3000}
          position='top-right'
        />
      )}
    </div>
  );
};

export default PurchaseOrderForm;