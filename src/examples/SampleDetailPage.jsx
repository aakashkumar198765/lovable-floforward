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
 * SampleDetailPage - Generic Detail Page Template
 * 
 * This component serves as a canonical example for all workflow detail pages.
 * It demonstrates the standard layout for displaying detailed information
 * about a specific document/record with vendor details, document summary,
 * and ordered items.
 * 
 * Key Features:
 * - Schema-driven layout
 * - Back navigation to listing page
 * - Document summary cards
 * - Vendor & delivery information
 * - Ordered items table
 * - Action buttons (Print, Export, etc.)
 */
const SampleDetailPage = ({
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

  // Dummy Schema Definition
  const documentSchema = {
    "@context": "https://schema.org",
    "@type": "PurchaseOrder",
    "sections": {
      "summary": {
        "title": "Order Summary",
        "icon": "package",
        "layout": "cards",
        "fields": [
          { "key": "totalItems", "label": "Total Items", "type": "number", "icon": "package", "color": "blue" },
          { "key": "totalAmount", "label": "Total Amount", "type": "currency", "icon": "currency-rupee", "color": "green" },
          { "key": "vendor", "label": "Vendor", "type": "text", "icon": "building", "color": "purple" },
          { "key": "orderDate", "label": "Order Date", "type": "date", "icon": "calendar", "color": "orange" }
        ]
      },
      "basicInfo": {
        "title": "Basic Information",
        "layout": "grid",
        "columns": 4,
        "fields": [
          { "key": "buyerName", "label": "Buyer Name", "type": "text" },
          { "key": "buyerId", "label": "Buyer ID", "type": "text" },
          { "key": "department", "label": "Department", "type": "text" },
          { "key": "requestDate", "label": "Request Date", "type": "date" },
          { "key": "priority", "label": "Priority", "type": "text" },
          { "key": "category", "label": "Category", "type": "text" },
          { "key": "reference", "label": "Reference", "type": "text" },
          { "key": "approver", "label": "Approver", "type": "text" }
        ]
      },
      "documentDetails": {
        "title": "Document Details",
        "layout": "grid",
        "columns": 4,
        "fields": [
          { "key": "documentNumber", "label": "Document Number", "type": "text" },
          { "key": "documentDate", "label": "Document Date", "type": "date" },
          { "key": "documentType", "label": "Document Type", "type": "text" },
          { "key": "documentStatus", "label": "Document Status", "type": "text" },
          { "key": "createdBy", "label": "Created By", "type": "text" },
          { "key": "createdDate", "label": "Created Date", "type": "date" },
          { "key": "lastModified", "label": "Last Modified", "type": "date" },
          { "key": "version", "label": "Version", "type": "text" }
        ]
      },
      "vendorInfo": {
        "title": "Vendor & Delivery Information",
        "layout": "grid",
        "columns": 4,
        "fields": [
          { "key": "organization", "label": "Organization", "type": "text" },
          { "key": "vendorId", "label": "Vendor ID", "type": "text" },
          { "key": "email", "label": "Email", "type": "email" },
          { "key": "taxId", "label": "Tax ID", "type": "text" },
          { "key": "plantId", "label": "Plant ID", "type": "text" },
          { "key": "deliveryAddress", "label": "Delivery Address", "type": "text" },
          { "key": "expectedDelivery", "label": "Expected Delivery", "type": "date" },
          { "key": "paymentTerms", "label": "Payment Terms", "type": "text" }
        ]
      },
      "additionalInfo": {
        "title": "Additional Information",
        "layout": "grid",
        "columns": 4,
        "fields": [
          { "key": "info1", "label": "Info 1", "type": "text" },
          { "key": "info2", "label": "Info 2", "type": "text" },
          { "key": "info3", "label": "Info 3", "type": "text" },
          { "key": "info4", "label": "Info 4", "type": "text" },
          { "key": "info5", "label": "Info 5", "type": "text" },
          { "key": "info6", "label": "Info 6", "type": "text" },
          { "key": "info7", "label": "Info 7", "type": "text" },
          { "key": "info8", "label": "Info 8", "type": "text" }
        ]
      },
      "relatedItems": {
        "title": "Ordered Items",
        "layout": "table",
        "description": "Complete item details including vendor response and acceptance status",
        "columns": [
          { "key": "field1", "title": "Field 1", "width": 150, "fixed": "left" },
          { "key": "field2", "title": "Field 2", "width": 120 },
          { "key": "field3", "title": "Field 3", "width": 120 },
          { "key": "field4", "title": "Field 4", "width": 120 },
          { "key": "field5", "title": "Field 5", "width": 120, "align": "right" },
          { "key": "field6", "title": "Field 6", "width": 120, "render": "badge" }
        ]
      }
    }
  };

  // Generate JSON-LD data based on schema
  const generateDocumentData = (docId) => {
    return {
      "@context": "https://schema.org",
      "@type": "PurchaseOrder",
      "@id": docId || 'DOC-001',
      "identifier": docId || '52-PO/000001521815',
      "name": 'State 1 Details',
      "orderStatus": 'State 1',
      "additionalType": 'Generic Document',

      // Data matching the schema structure
      "summary": {
        "totalItems": '156',
        "totalAmount": '₹2,45,780',
        "vendor": 'ABC Corp Ltd',
        "orderDate": '2024-01-15'
      },

      "basicInfo": {
        "buyerName": 'John Smith',
        "buyerId": 'BUY-001',
        "department": 'Procurement',
        "requestDate": '2024-01-10',
        "priority": 'High',
        "category": 'Raw Materials',
        "reference": 'REF-2024-001',
        "approver": 'Jane Doe'
      },

      "documentDetails": {
        "documentNumber": 'ITEM-001',
        "documentDate": '2024-01-15',
        "documentType": 'Purchase Order',
        "documentStatus": 'Approved',
        "createdBy": 'System Admin',
        "createdDate": '2024-01-15',
        "lastModified": '2024-01-16',
        "version": '1.2'
      },

      "vendorInfo": {
        "organization": 'ABC Corporation Ltd',
        "vendorId": 'VND-001',
        "email": 'orders@abccorp.com',
        "taxId": 'GST123456789',
        "plantId": 'PLT-MUM-001',
        "deliveryAddress": 'Mumbai, Maharashtra',
        "expectedDelivery": '2024-02-15',
        "paymentTerms": 'Net 30'
      },

      "additionalInfo": {
        "info1": 'Information 1',
        "info2": 'Information 2',
        "info3": 'Information 3',
        "info4": 'Information 4',
        "info5": 'Information 5',
        "info6": 'Information 6',
        "info7": 'Information 7',
        "info8": 'Information 8'
      },

      "relatedItems": [
        {
          "@id": 'ITEM-001',
          "field1": 'Product Alpha',
          "field2": 'SKU-001',
          "field3": 'Electronics',
          "field4": 'High',
          "field5": '250',
          "field6": 'Active'
        },
        {
          "@id": 'ITEM-002',
          "field1": 'Product Beta',
          "field2": 'SKU-002',
          "field3": 'Hardware',
          "field4": 'Medium',
          "field5": '180',
          "field6": 'Pending'
        },
        {
          "@id": 'ITEM-003',
          "field1": 'Product Gamma',
          "field2": 'SKU-003',
          "field3": 'Software',
          "field4": 'Low',
          "field5": '75',
          "field6": 'Active'
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

  // Generate columns from schema
  const generateTableColumns = (schemaColumns) => {
    return schemaColumns.map(col => ({
      key: col.key,
      title: col.title,
      dataIndex: col.key,
      width: col.width,
      align: col.align,
      fixed: col.fixed,
      render: col.render === 'badge' ? (value) => (
        <Badge
          variant={value === 'Active' ? 'success' : 'default'}
          size="sm"
        >
          {value || 'Active'}
        </Badge>
      ) : undefined
    }));
  };

  // Get columns for related items from schema
  const relatedItemsColumns = generateTableColumns(documentSchema.sections.relatedItems.columns);

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
                  {currentDocument.orderStatus}
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

        {/* Dynamic Sections Rendering */}
        {Object.entries(documentSchema.sections).filter(([key]) => key !== 'relatedItems').map(([sectionKey, section]) => {
          const sectionData = currentDocument[sectionKey];

          return (
            <div key={sectionKey} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>

              {section.layout === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {section.fields.map(field => {
                    const colorClasses = {
                      blue: 'bg-blue-100 text-blue-600',
                      green: 'bg-green-100 text-green-600',
                      purple: 'bg-purple-100 text-purple-600',
                      orange: 'bg-orange-100 text-orange-600'
                    };

                    return (
                      <div key={field.key} className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colorClasses[field.color]} rounded-full flex items-center justify-center`}>
                          <Icon name={field.icon} size="sm" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{field.label}</p>
                          <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {sectionData[field.key]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.layout === 'grid' && (
                <div className={`grid grid-cols-1 md:grid-cols-${section.columns} gap-6`}>
                  {section.fields.map(field => (
                    <div key={field.key}>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {field.label}
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {sectionData[field.key]}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Related Items Table */}
        {documentSchema.sections.relatedItems && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {documentSchema.sections.relatedItems.title} ({currentDocument.relatedItems.length})
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {documentSchema.sections.relatedItems.description}
              </p>
            </div>

            <div className="p-0">
              <EditableDataGrid
                columns={relatedItemsColumns}
                data={currentDocument.relatedItems}
                loading={false}
                editable={false}
                pagination={false}
                scroll={{ x: documentSchema.sections.relatedItems.columns.reduce((acc, col) => acc + col.width, 0) }}
                size="small"
                rowKey="@id"
                className="border-0"
              />
            </div>
          </div>
        )}
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

export default SampleDetailPage;