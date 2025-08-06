import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  // Form Components
  Button,

  // Display Components
  Icon,
  StatusCard,
  Badge,

  // Data Grid Components
  EditableDataGrid,

  // Feedback Components
  LoadingState
} from '../components';
import Timeline from '../components/organisms/workflow/Timeline';

/**
 * SampleDetailPage2 - Detail Page 2 (Hardcoded)
 * 
 * This component is a hardcoded version without schema-driven approach.
 * It demonstrates the standard layout for displaying detailed information
 * about a specific document/record with hardcoded business data.
 * 
 * Key Features:
 * - Hardcoded layout and data
 * - Back navigation to listing page
 * - Document summary cards
 * - Business information sections
 * - Ordered items table
 * - Action buttons (Print, Export, etc.)
 */
const SampleDetailPage2 = ({
  // Navigation Props
  backUrl = '/templates/pages/listing-page',
  backLabel = 'Back to Listing',

  // Document Props
  documentId,
  documentData,
  loading = false,
  error = null,

  // Action Handlers
  onPrint,
  onExport,
  onEdit,
  onDelete,

  // Enterprise Props
  userRole,
  allowedActions = ['view', 'edit', 'print', 'export'],
  auditTrail,
  commerceState = 'execution'
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentDocument, setCurrentDocument] = useState(null);
  const [showTimeline, setShowTimeline] = useState(false);

  // Generate hardcoded document data
  const generateDocumentData = (docId) => {
    return {
      // Document Header
      id: docId || 'DOC-001',
      identifier: '52-PO/000001521815',
      name: 'Production Order Details',
      status: 'State 1',
      type: 'Purchase Order',

      // Summary Information
      summary: {
        totalItems: '156',
        totalAmount: '₹2,45,780',
        vendor: 'ABC Corp Ltd',
        orderDate: '2024-01-15'
      },

      // Basic Information
      basicInfo: {
        buyerName: 'John Smith',
        buyerId: 'BUY-001',
        department: 'Procurement',
        requestDate: '2024-01-10',
        priority: 'High',
        category: 'Raw Materials',
        reference: 'REF-2024-001',
        approver: 'Jane Doe'
      },

      // Document Details
      documentDetails: {
        documentNumber: 'ITEM-001',
        documentDate: '2024-01-15',
        documentType: 'Purchase Order',
        documentStatus: 'Approved',
        createdBy: 'System Admin',
        createdDate: '2024-01-15',
        lastModified: '2024-01-16',
        version: '1.2'
      },

      // Vendor Information
      vendorInfo: {
        organization: 'ABC Corporation Ltd',
        vendorId: 'VND-001',
        email: 'orders@abccorp.com',
        taxId: 'GST123456789',
        plantId: 'PLT-MUM-001',
        deliveryAddress: 'Mumbai, Maharashtra',
        expectedDelivery: '2024-02-15',
        paymentTerms: 'Net 30'
      },

      // Additional Information
      additionalInfo: {
        info1: 'Information 1',
        info2: 'Information 2',
        info3: 'Information 3',
        info4: 'Information 4',
        info5: 'Information 5',
        info6: 'Information 6',
        info7: 'Information 7',
        info8: 'Information 8'
      },

      // Ordered Items
      orderedItems: [
        {
          id: 'ITEM-001',
          field1: 'Product Alpha',
          field2: 'SKU-001',
          field3: 'Electronics',
          field4: 'High',
          field5: '250',
          field6: 'Active'
        },
        {
          id: 'ITEM-002',
          field1: 'Product Beta',
          field2: 'SKU-002',
          field3: 'Hardware',
          field4: 'Medium',
          field5: '180',
          field6: 'Pending'
        },
        {
          id: 'ITEM-003',
          field1: 'Product Gamma',
          field2: 'SKU-003',
          field3: 'Software',
          field4: 'Low',
          field5: '75',
          field6: 'Active'
        }
      ]
    };
  };

  // Load document data
  useEffect(() => {
    const docId = id || documentId;
    if (docId) {
      setCurrentDocument(generateDocumentData(docId));
    }
  }, [id, documentId]);

  // Event Handlers
  const handleBack = () => {
    navigate(backUrl);
  };

  const handlePrint = () => {
    onPrint?.(currentDocument);
    window.print();
  };

  const handleExport = () => {
    onExport?.(currentDocument);
    // Implement export logic
  };

  const handleEdit = () => {
    onEdit?.(currentDocument);
    // Navigate to edit page or open modal
  };

  const handleViewTimeline = () => {
    setShowTimeline(true);
  };

  const handleCloseTimeline = () => {
    setShowTimeline(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingState loading={true} text="Loading document details..." />
      </div>
    );
  }

  if (error || !currentDocument) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Icon name="alert-circle" size="xl" className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Document Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The requested document could not be loaded.
            </p>
            <Button variant="primary" onClick={handleBack}>
              {backLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Hardcoded column configuration for ordered items table
  const orderedItemsColumns = [
    {
      key: 'field1',
      title: 'Field 1',
      dataIndex: 'field1',
      width: 150,
      fixed: 'left'
    },
    {
      key: 'field2',
      title: 'Field 2',
      dataIndex: 'field2',
      width: 120
    },
    {
      key: 'field3',
      title: 'Field 3',
      dataIndex: 'field3',
      width: 120
    },
    {
      key: 'field4',
      title: 'Field 4',
      dataIndex: 'field4',
      width: 120
    },
    {
      key: 'field5',
      title: 'Field 5',
      dataIndex: 'field5',
      width: 120,
      align: 'right'
    },
    {
      key: 'field6',
      title: 'Field 6',
      dataIndex: 'field6',
      width: 120,
      render: (value) => (
        <Badge
          variant={value === 'Active' ? 'success' : 'default'}
          size="sm"
        >
          {value || 'Active'}
        </Badge>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Icon name="arrow-left" size="sm" />}
                onClick={handleBack}
              >
                {backLabel}
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {currentDocument.identifier}
                </span>
                <Badge variant="primary" size="sm">
                  {currentDocument.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconLeft={<Icon name="printer" size="sm" />}
                onClick={handlePrint}
              >
                Print Document
              </Button>

              <Button
                variant="primary"
                size="sm"
                iconLeft={<Icon name="timeline" size="sm" />}
                onClick={handleViewTimeline}
              >
                View Timeline
              </Button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentDocument.name}
            </h1>
          </div>
        </div>

        {/* Order Summary Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="package" size="sm" className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentDocument.summary.totalItems}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="currency-rupee" size="sm" className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentDocument.summary.totalAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Icon name="building" size="sm" className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vendor</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentDocument.summary.vendor}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="calendar" size="sm" className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentDocument.summary.orderDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Buyer Name</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.buyerName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Buyer ID</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.buyerId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Department</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.department}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Request Date</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.requestDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Priority</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.priority}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Category</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.category}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Reference</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.reference}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Approver</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.basicInfo.approver}</p>
            </div>
          </div>
        </div>

        {/* Document Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Document Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Document Number</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.documentNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Document Date</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.documentDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Document Type</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.documentType}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Document Status</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.documentStatus}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Created By</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.createdBy}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Created Date</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.createdDate}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Last Modified</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.lastModified}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Version</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.documentDetails.version}</p>
            </div>
          </div>
        </div>

        {/* Vendor & Delivery Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vendor & Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Organization</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.organization}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Vendor ID</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.vendorId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tax ID</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.taxId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Plant ID</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.plantId}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Delivery Address</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.deliveryAddress}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Expected Delivery</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.expectedDelivery}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Terms</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.vendorInfo.paymentTerms}</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 1</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info1}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 2</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info2}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 3</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info3}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 4</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info4}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 5</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info5}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 6</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info6}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 7</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info7}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Info 8</h3>
              <p className="text-gray-900 dark:text-white">{currentDocument.additionalInfo.info8}</p>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ordered Items ({currentDocument.orderedItems.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete item details including vendor response and acceptance status
            </p>
          </div>

          <div className="p-0">
            <EditableDataGrid
              columns={orderedItemsColumns}
              data={currentDocument.orderedItems}
              loading={false}
              editable={false}
              pagination={false}
              scroll={{ x: 800 }}
              size="small"
              rowKey="id"
              className="border-0"
            />
          </div>
        </div>
      </div>

      {/* Timeline Component */}
      <Timeline
        isOpen={showTimeline}
        onClose={handleCloseTimeline}
        title="Transaction Timeline"
        timelineData={[]} // Will use default generic data
        totalItems={4}
      />
    </div>
  );
};

export default SampleDetailPage2;