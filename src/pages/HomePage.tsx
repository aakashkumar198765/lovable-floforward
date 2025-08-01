import React, { useState } from "react";
import {
  InputAllTypes,
  TextareaAllTypes,
  SelectAllTypes,
  DatePickerAllTypes,
  FileUploadAllTypes,
  Button,
  Avatar,
  Badge,
  Icon,
  Label,
  Status,
  Tooltip,
  Alert,
  LoadingState,
  Modal,
  Spinner,
  Toast,
  Breadcrumb,
  Menu,
  NavigationButton,
  Pagination,
  Tab,
  AddressForm,
  ApprovalForm,
  BulkActions,
  ContactForm,
  PaymentForm,
  FilterPanel,
  MetricCard,
  ProgressTracker,
  SearchBox,
  SortControl,
  StatusCard,
  SummaryPanel,
  EditableDataGrid,
  ComparisonTable,
  PivotTable,
  ApprovalWorkflow,
  StateTransition,
  WorkflowTracker,
  SettingsManager,
  UserManager,
  RoleManager,
  ImportWizard,
  ExportManager,
  APIConnector,
  DashboardLayout,
  FormLayout,
  ListDetailLayout,
  SettingsPage,
  ReportsPage,
  WorkflowPage,
  ThemeToggle,
} from "../components";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentPage, setPaginationPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleLoadingToggle = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-work-sans">
            Reusable React Component Library
          </h1>
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Input Component
          </h2>
          <InputAllTypes />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Text-Area Component
          </h2>
          <TextareaAllTypes />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Button Component
          </h2>
          <Button />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            DatePicker Component
          </h2>
          <DatePickerAllTypes />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            FileUpload Component
          </h2>
          <FileUploadAllTypes />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Select Component
          </h2>
          <SelectAllTypes />
        </div>

        {/* Display Components Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Display Components
          </h2>

          {/* Avatar Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Avatar Component
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Avatar name="John Doe" size="sm" />
              <Avatar name="Jane Smith" size="md" />
              <Avatar name="Bob Johnson" size="lg" status="online" />
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User Avatar"
                size="xl"
                status="away"
                commerceState="execution"
              />
            </div>
          </div>

          {/* Badge Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Badge Component
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="default" color="primary">
                Default
              </Badge>
              <Badge variant="outlined" color="success">
                Success
              </Badge>
              <Badge variant="filled" color="warning">
                Warning
              </Badge>
              <Badge variant="filled" color="error" removable>
                Error
              </Badge>
              <Badge variant="outlined" color="gray">
                Gray
              </Badge>
            </div>
          </div>

          {/* Icon Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Icon Component
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <Icon name="check" size="sm" />
              <Icon name="warning" size="md" color="#f59e0b" />
              <Icon name="error" size="lg" color="#ef4444" />
              <Icon name="success" size="xl" color="#10b981" />
              <Icon name="settings" size="lg" commerceState="agreement" />
            </div>
          </div>

          {/* Label Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Label Component
            </h3>
            <div className="space-y-2">
              <Label size="sm" weight="normal">
                Small Label
              </Label>
              <Label size="md" weight="medium" required>
                Medium Required Label
              </Label>
              <Label size="lg" weight="bold" color="error">
                Large Error Label
              </Label>
              <Label size="md" weight="semibold" color="success" optional>
                Optional Success Label
              </Label>
            </div>
          </div>

          {/* Status Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Status Component
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Status status="active" variant="dot" />
                <Status status="pending" variant="dot" animated />
                <Status status="error" variant="dot" size="lg" />
                <Status
                  status="success"
                  variant="dot"
                  commerceState="completion"
                />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Status status="online" variant="badge" />
                <Status status="away" variant="badge" size="sm" />
                <Status status="busy" variant="badge" size="lg" />
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Status status="active" variant="text" />
                <Status status="inactive" variant="text" showLabel={false} />
                <Status status="warning" variant="icon" />
                <Status status="error" variant="icon" size="lg" />
              </div>
            </div>
          </div>

          {/* Tooltip Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Tooltip Component
            </h3>
            <div className="flex flex-wrap gap-8 items-center">
              <Tooltip content="This is a tooltip on hover" placement="top">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Hover me (Top)
                </button>
              </Tooltip>
              <Tooltip
                content="Click tooltip example"
                placement="right"
                trigger="click"
              >
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                  Click me (Right)
                </button>
              </Tooltip>
              <Tooltip
                content="Commerce state aware tooltip"
                placement="bottom"
                arrow={true}
              >
                <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                  Commerce State (Bottom)
                </button>
              </Tooltip>
              <Tooltip
                content="Focus to see this tooltip"
                placement="left"
                trigger="focus"
              >
                <input
                  type="text"
                  placeholder="Focus me (Left)"
                  className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Feedback Components Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Feedback Components
          </h2>

          {/* Alert Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Alert Component
            </h3>
            <div className="space-y-4">
              <Alert
                variant="info"
                title="Info Alert"
                description="This is an informational alert."
              />
              <Alert
                variant="success"
                title="Success!"
                description="Operation completed successfully."
                dismissible
              />
              <Alert
                variant="warning"
                title="Warning"
                description="Please review your settings."
                severity="high"
              />
              <Alert
                variant="error"
                title="Error"
                description="Something went wrong."
                dismissible
                severity="critical"
              />
              <Alert variant="info" banner commerceState="execution">
                <p>This is a banner alert with commerce state awareness.</p>
              </Alert>
            </div>
          </div>

          {/* Spinner Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Spinner Component
            </h3>
            <div className="flex flex-wrap gap-6 items-center">
              <Spinner size="xs" />
              <Spinner size="sm" color="success" />
              <Spinner size="md" color="warning" label="Loading..." />
              <Spinner size="lg" color="danger" speed="fast" />
              <Spinner size="xl" color="primary" commerceState="execution" />
            </div>
          </div>

          {/* LoadingState Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              LoadingState Component
            </h3>
            <div className="space-y-4">
              <button
                onClick={handleLoadingToggle}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Test Loading State (3s)
              </button>
              <LoadingState
                loading={isLoading}
                text="Processing your request..."
                description="Please wait while we handle your request."
                size="md"
              >
                <div className="p-4 bg-gray-100 rounded">
                  <p>This content is hidden when loading.</p>
                </div>
              </LoadingState>
            </div>
          </div>

          {/* Modal Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Modal Component
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Open Center Modal
                </button>
                <button
                  onClick={() => setIsSliderOpen(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Open Right Slider
                </button>
              </div>

              {/* Center Modal */}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Center Modal Example"
                size="md"
                variant="modal"
                position="center"
                commerceState="agreement"
                footer={
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Confirm
                    </button>
                  </div>
                }
              >
                <p className="text-gray-600 mb-4">
                  This is a centered modal with commerce state awareness. It
                  includes proper focus management, keyboard navigation, and
                  accessibility features.
                </p>
                <p className="text-sm text-gray-500">
                  The modal background now properly covers the entire screen
                  with a fixed backdrop.
                </p>
              </Modal>

              {/* Right Slider Modal */}
              <Modal
                isOpen={isSliderOpen}
                onClose={() => setIsSliderOpen(false)}
                title="Right Slider Panel"
                size="md"
                variant="slider"
                slideDirection="right"
                commerceState="execution"
                footer={
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsSliderOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setIsSliderOpen(false)}
                      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      Save
                    </button>
                  </div>
                }
              >
                <div className="space-y-6">
                  <p className="text-gray-600">
                    This is a right-sliding panel that slides in from the right
                    side of the screen.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Slider Features:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Slides from any direction (left, right, top, bottom)
                      </li>
                      <li>• Configurable size and positioning</li>
                      <li>• Full-height layout with proper scrolling</li>
                      <li>• Commerce state awareness</li>
                      <li>• Keyboard navigation and focus management</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      The slider maintains the same enterprise features as the
                      modal variant, including audit trails, accessibility, and
                      commerce state indicators.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Layout Structure:
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded">
                        <h5 className="font-medium text-blue-900">
                          Header (Fixed)
                        </h5>
                        <p className="text-sm text-blue-700">
                          Always visible at the top with title and close button
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <h5 className="font-medium text-green-900">
                          Body (Scrollable)
                        </h5>
                        <p className="text-sm text-green-700">
                          This content area scrolls when content overflows
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded">
                        <h5 className="font-medium text-purple-900">
                          Footer (Fixed)
                        </h5>
                        <p className="text-sm text-purple-700">
                          Always pinned to the bottom with action buttons
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">
                      Scroll Test Content:
                    </h4>
                    {Array.from({ length: 20 }, (_, i) => (
                      <div key={i} className="p-3 bg-gray-100 rounded">
                        <p className="text-sm text-gray-600">
                          Scroll test item {i + 1}. This content demonstrates
                          that the body area scrolls properly while the header
                          and footer remain fixed in position.
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-50 rounded">
                    <h4 className="font-medium text-yellow-900">Note:</h4>
                    <p className="text-sm text-yellow-700">
                      Try scrolling in this content area. The header and footer
                      should remain fixed while only this body content scrolls.
                    </p>
                  </div>
                </div>
              </Modal>
            </div>
          </div>

          {/* Toast Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Toast Component
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => setShowToast(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Show Toast
              </button>
              {showToast && (
                <div className="relative">
                  <Toast
                    variant="success"
                    title="Success!"
                    description="Your action was completed successfully."
                    onClose={() => setShowToast(false)}
                    duration={5000}
                    commerceState="completion"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Components Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Navigation Components
          </h2>

          {/* Breadcrumb Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Breadcrumb Component
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Default with Home Icon
                </h4>
                <Breadcrumb
                  items={[
                    { id: "1", label: "Home", href: "/" },
                    { id: "2", label: "Products", href: "/products" },
                    {
                      id: "3",
                      label: "Electronics",
                      href: "/products/electronics",
                    },
                    {
                      id: "4",
                      label: "Smartphones",
                      href: "/products/electronics/smartphones",
                    },
                    { id: "5", label: "iPhone 15", current: true },
                  ]}
                  showHome={true}
                  maxItems={3}
                  collapsible={true}
                  commerceState="execution"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  With Custom Separator (Slash)
                </h4>
                <Breadcrumb
                  items={[
                    { id: "1", label: "Dashboard", href: "/dashboard" },
                    { id: "2", label: "Settings", href: "/settings" },
                    { id: "3", label: "Profile", current: true },
                  ]}
                  showHome={false}
                  separator={
                    <span className="mx-2 text-gray-400 font-medium">/</span>
                  }
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  With Icons and Badges
                </h4>
                <Breadcrumb
                  items={[
                    {
                      id: "1",
                      label: "Projects",
                      href: "/projects",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      ),
                    },
                    {
                      id: "2",
                      label: "Website",
                      href: "/projects/website",
                      badge: "Active",
                    },
                    {
                      id: "3",
                      label: "Components",
                      href: "/projects/website/components",
                      badge: "12",
                    },
                    {
                      id: "4",
                      label: "Navigation",
                      current: true,
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"
                          />
                        </svg>
                      ),
                    },
                  ]}
                  showHome={true}
                  separator={<span className="mx-2 text-gray-400">•</span>}
                  commerceState="agreement"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Long Path with Collapsible
                </h4>
                <Breadcrumb
                  items={[
                    { id: "1", label: "Root", href: "/" },
                    { id: "2", label: "Users", href: "/users" },
                    { id: "3", label: "Management", href: "/users/management" },
                    {
                      id: "4",
                      label: "Roles",
                      href: "/users/management/roles",
                    },
                    {
                      id: "5",
                      label: "Permissions",
                      href: "/users/management/roles/permissions",
                    },
                    {
                      id: "6",
                      label: "Access Control",
                      href: "/users/management/roles/permissions/access",
                    },
                    { id: "7", label: "Details", current: true },
                  ]}
                  showHome={true}
                  maxItems={4}
                  collapsible={true}
                  separator={
                    <svg
                      className="w-3 h-3 text-gray-400 mx-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Tab Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Tab Component
            </h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Default Variant
                </h4>
                <Tab
                  items={[
                    {
                      id: "tab1",
                      label: "Overview",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Dashboard Overview
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Monitor your application's key metrics and
                            performance indicators.
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-200">
                              <h4 className="font-medium text-gray-700">
                                Total Users
                              </h4>
                              <p className="text-2xl font-bold text-blue-600">
                                12,345
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-200">
                              <h4 className="font-medium text-gray-700">
                                Revenue
                              </h4>
                              <p className="text-2xl font-bold text-green-600">
                                $45,678
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-200">
                              <h4 className="font-medium text-gray-700">
                                Growth
                              </h4>
                              <p className="text-2xl font-bold text-purple-600">
                                +23%
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "tab2",
                      label: "Analytics",
                      badge: "New",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Analytics Dashboard
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Deep dive into your data with advanced analytics and
                            reporting tools.
                          </p>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                              <span className="font-medium text-gray-700">
                                Page Views
                              </span>
                              <span className="text-green-600 font-bold">
                                156,789
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                              <span className="font-medium text-gray-700">
                                Conversion Rate
                              </span>
                              <span className="text-green-600 font-bold">
                                3.2%
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                              <span className="font-medium text-gray-700">
                                Bounce Rate
                              </span>
                              <span className="text-orange-600 font-bold">
                                24.5%
                              </span>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      id: "tab3",
                      label: "Settings",
                      icon: (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Application Settings
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Configure your application preferences and system
                            settings.
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                              <span className="font-medium text-gray-700">
                                Dark Mode
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                              <span className="font-medium text-gray-700">
                                Notifications
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  defaultChecked
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  variant="default"
                  size="md"
                  commerceState="agreement"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Pills Variant
                </h4>
                <Tab
                  items={[
                    {
                      id: "pill1",
                      label: "Home",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">
                            Welcome Home
                          </h3>
                          <p className="text-blue-700">
                            Your dashboard homepage with quick access to all
                            features.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "pill2",
                      label: "About",
                      badge: "Info",
                      content: (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">
                            About Us
                          </h3>
                          <p className="text-blue-700">
                            Learn more about our company, mission, and values.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "pill3",
                      label: "Contact",
                      content: (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-blue-800 mb-2">
                            Get in Touch
                          </h3>
                          <p className="text-blue-700">
                            Contact our support team for assistance and
                            inquiries.
                          </p>
                        </div>
                      ),
                    },
                  ]}
                  variant="pills"
                  size="sm"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Underline Variant
                </h4>
                <Tab
                  items={[
                    {
                      id: "under1",
                      label: "Dashboard",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Dashboard Overview
                          </h3>
                          <p className="text-gray-600">
                            Main dashboard with key metrics and quick actions.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "under2",
                      label: "Reports",
                      badge: "3",
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Reports & Analytics
                          </h3>
                          <p className="text-gray-600">
                            Detailed reports and data visualization tools.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "under3",
                      label: "Users",
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            User Management
                          </h3>
                          <p className="text-gray-600">
                            Manage user accounts and permissions.
                          </p>
                        </div>
                      ),
                    },
                  ]}
                  variant="underline"
                  size="md"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Card Variant
                </h4>
                <Tab
                  items={[
                    {
                      id: "card1",
                      label: "Overview",
                      icon: (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      ),
                      content: (
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            System Overview
                          </h3>
                          <p className="text-gray-600">
                            Complete system status and health monitoring.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "card2",
                      label: "Performance",
                      badge: "Live",
                      content: (
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Performance Metrics
                          </h3>
                          <p className="text-gray-600">
                            Real-time performance monitoring and optimization.
                          </p>
                        </div>
                      ),
                    },
                    {
                      id: "card3",
                      label: "Security",
                      content: (
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Security Center
                          </h3>
                          <p className="text-gray-600">
                            Security settings and threat monitoring.
                          </p>
                        </div>
                      ),
                    },
                  ]}
                  variant="card"
                  size="md"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  With Closable and Addable Features
                </h4>
                <Tab
                  items={[
                    {
                      id: "close1",
                      label: "Tab 1",
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          Content of closable tab 1
                        </div>
                      ),
                    },
                    {
                      id: "close2",
                      label: "Tab 2",
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          Content of closable tab 2
                        </div>
                      ),
                    },
                    {
                      id: "close3",
                      label: "Tab 3",
                      content: (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          Content of closable tab 3
                        </div>
                      ),
                    },
                  ]}
                  variant="default"
                  size="md"
                  closable={true}
                  addable={true}
                  onClose={(tabId) => console.log("Closing tab:", tabId)}
                  onAdd={() => console.log("Adding new tab")}
                />
              </div>
            </div>
          </div>

          {/* Menu Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Menu Component
            </h3>
            <div className="flex flex-wrap gap-6">
              <Menu
                items={[
                  {
                    id: "profile",
                    label: "Profile",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    ),
                  },
                  { id: "divider1", divider: true },
                  {
                    id: "settings",
                    label: "Settings",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ),
                    submenu: [
                      { id: "general", label: "General" },
                      { id: "security", label: "Security" },
                      { id: "notifications", label: "Notifications" },
                    ],
                  },
                  { id: "help", label: "Help & Support", shortcut: "⌘?" },
                  { id: "divider2", divider: true },
                  {
                    id: "logout",
                    label: "Logout",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    ),
                  },
                ]}
                trigger="click"
                commerceState="execution"
              >
                <NavigationButton variant="secondary" size="md">
                  User Menu
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </NavigationButton>
              </Menu>

              <Menu
                items={[
                  { id: "new", label: "New Document", shortcut: "⌘N" },
                  { id: "open", label: "Open...", shortcut: "⌘O" },
                  { id: "save", label: "Save", shortcut: "⌘S" },
                  { id: "divider", divider: true },
                  { id: "export", label: "Export", badge: "Pro" },
                ]}
                trigger="hover"
                placement="bottom"
              >
                <NavigationButton variant="ghost" size="md">
                  File Actions
                </NavigationButton>
              </Menu>
            </div>
          </div>

          {/* Navigation Button Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Navigation Button Component
            </h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <NavigationButton variant="primary" size="md">
                  Primary Button
                </NavigationButton>
                <NavigationButton variant="secondary" size="md">
                  Secondary Button
                </NavigationButton>
                {/* <NavigationButton variant="ghost" size="md">Ghost Button</NavigationButton> */}
                <NavigationButton variant="link" size="md">
                  Link Button
                </NavigationButton>
                <NavigationButton variant="text" size="md">
                  Text Button
                </NavigationButton>
              </div>

              <div className="flex flex-wrap gap-4">
                <NavigationButton variant="primary" size="md" loading={true}>
                  Loading...
                </NavigationButton>
                <NavigationButton
                  variant="secondary"
                  size="md"
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  }
                  iconPosition="left"
                >
                  With Icon
                </NavigationButton>
                <NavigationButton variant="ghost" size="md" disabled={true}>
                  Disabled
                </NavigationButton>
                <NavigationButton
                  variant="primary"
                  size="md"
                  href="#"
                  commerceState="completion"
                >
                  As Link
                </NavigationButton>
              </div>
            </div>
          </div>

          {/* Pagination Component */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Pagination Component
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Full Pagination
                </h4>
                <Pagination
                  current={currentPage}
                  total={250}
                  pageSize={pageSize}
                  showSizeChanger={true}
                  showQuickJumper={true}
                  showTotal={true}
                  showFirstLastJumpers={true}
                  onChange={(page, size) => {
                    setPaginationPage(page);
                    if (size) setPageSize(size);
                  }}
                  onShowSizeChange={(page, size) => {
                    setPaginationPage(page);
                    if (size) setPageSize(size);
                  }}
                  commerceState="execution"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                  Simple Pagination
                </h4>
                <Pagination
                  current={1}
                  total={50}
                  pageSize={10}
                  simple={true}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Commerce State Information */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Commerce State Information</h3>
          <div className="space-y-2">
            <p><strong>Current State:</strong> {commerceState}</p>
            <p><strong>Input Value:</strong> {inputValue || 'Empty'}</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Commerce State Behaviors:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Initiation:</strong> Full editing capabilities</li>
                <li><strong>Agreement:</strong> Partial restrictions may apply</li>
                <li><strong>Execution:</strong> Active state with full features</li>
                <li><strong>Settlement:</strong> Limited editing based on permissions</li>
                <li><strong>Completion:</strong> Read-only state</li>
              </ul>
            </div>
          </div>
        </div> */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Search Box
          </h2>
          <SearchBox />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Address Form
          </h2>
          <AddressForm />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Bulk Actions
          </h2>
          <BulkActions
            actions={[
              {
                key: "delete",
                label: "Delete Selected",
                icon: "🗑️",
                variant: "danger",
                confirmMessage: "Are you sure you want to delete these items?",
              },
              {
                key: "export",
                label: "Export",
                icon: "📤",
                variant: "secondary",
              },
              {
                key: "archive",
                label: "Archive",
                icon: "📦",
                variant: "tertiary",
              },
            ]}
            selectedItems={["item1", "item2", "item3"]}
            onAction={(action, items) =>
              console.log("Bulk action:", action, items)
            }
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Approval Form
          </h2>
          <ApprovalForm
            approvalLevels={[
              {
                level: 1,
                name: "Manager Review",
                approvers: ["manager1"],
                required: true,
              },
              {
                level: 2,
                name: "Director Approval",
                approvers: ["director1"],
                required: true,
              },
              {
                level: 3,
                name: "Executive Sign-off",
                approvers: ["exec1"],
                required: false,
              },
            ]}
            approvers={[
              { value: "manager1", label: "John Manager" },
              { value: "director1", label: "Sarah Director" },
              { value: "exec1", label: "Mike Executive" },
            ]}
            onSubmit={(data) => console.log("Approval submitted:", data)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Contact Form
          </h2>
          <ContactForm />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Payment Form
          </h2>
          <PaymentForm
            title="Secure Payment Information"
            allowedMethods={[
              "credit_card",
              "debit_card",
              "paypal",
              "apple_pay",
            ]}
            showBillingAddress={true}
            showSaveOptions={true}
            showTermsAgreement={true}
            enableEncryption={true}
            layout="vertical"
            size="md"
            variant="outlined"
            defaultValue={{
              method: "credit_card",
              savePaymentMethod: false,
              agreeToTerms: false,
            }}
            countries={[
              { value: "US", label: "United States" },
              { value: "CA", label: "Canada" },
              { value: "GB", label: "United Kingdom" },
              { value: "AU", label: "Australia" },
              { value: "FR", label: "France" },
              { value: "DE", label: "Germany" },
            ]}
            states={[
              { value: "AL", label: "Alabama" },
              { value: "CA", label: "California" },
              { value: "FL", label: "Florida" },
              { value: "NY", label: "New York" },
              { value: "TX", label: "Texas" },
              { value: "WA", label: "Washington" },
            ]}
            validation={{
              required: [
                "method",
                "cardNumber",
                "cardHolderName",
                "expiryMonth",
                "expiryYear",
                "cvv",
              ],
              patterns: {
                cardNumber: "^[0-9]{13,19}$",
                cvv: "^[0-9]{3,4}$",
                paypalEmail: "^[^@]+@[^@]+\\.[^@]+$",
              },
            }}
            onChange={(data: any) =>
              console.log("Payment form data changed:", data)
            }
            onValidation={(isValid: boolean, errors: any) =>
              console.log("Payment form validation:", isValid, errors)
            }
            onSubmit={(data: any) =>
              console.log("Payment form submitted:", data)
            }
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Progress Tracker
          </h2>
          <ProgressTracker
            steps={[
              {
                key: "step1",
                title: "Planning",
                description: "Project planning phase",
                status: "completed",
              },
              {
                key: "step2",
                title: "Development",
                description: "Development in progress",
                status: "in_progress",
              },
              {
                key: "step3",
                title: "Testing",
                description: "Quality assurance testing",
                status: "pending",
              },
              {
                key: "step4",
                title: "Deployment",
                description: "Production deployment",
                status: "pending",
              },
            ]}
            currentStep="step2"
            onStepClick={(step) => console.log("Step clicked:", step)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Metric Card
          </h2>
          <MetricCard
            title="Revenue"
            metric={{ value: 125000, format: "currency" }}
            trend={{ value: 15, direction: "up", period: "vs last month" }}
            status="excellent"
            description="Monthly revenue performance"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Status Card
          </h2>
          <StatusCard
            status="success"
            title="System Status"
            description="All systems operational"
            actions={[
              { key: "refresh", label: "Refresh", variant: "secondary" },
              { key: "details", label: "View Details", variant: "primary" },
            ]}
            // onActionClick={(action) => console.log('Action clicked:', action)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Summary Panel
          </h2>
          <SummaryPanel
            sections={[
              {
                key: "overview",
                title: "Project Overview",
                items: [
                  {
                    key: "name",
                    label: "Project Name",
                    value: "E-commerce Platform",
                  },
                  { key: "status", label: "Status", value: "In Progress" },
                  { key: "budget", label: "Budget", value: "$50,000" },
                ],
              },
              {
                key: "team",
                title: "Team Information",
                items: [
                  { key: "lead", label: "Team Lead", value: "Alice Johnson" },
                  { key: "members", label: "Team Size", value: "8 members" },
                  { key: "duration", label: "Duration", value: "6 months" },
                ],
              },
            ]}
            onItemClick={(section, item) =>
              console.log("Item clicked:", section, item)
            }
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Filter Panel
          </h2>
          <FilterPanel
            filters={[
              {
                key: "search",
                type: "text",
                label: "Search",
                placeholder: "Enter search term",
              },
              {
                key: "status",
                type: "select",
                label: "Status",
                options: [
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ],
              },
              {
                key: "category",
                type: "multiselect",
                label: "Category",
                options: [
                  { value: "tech", label: "Technology" },
                  { value: "design", label: "Design" },
                  { value: "marketing", label: "Marketing" },
                ],
              },
            ]}
            onFilterChange={(filters) =>
              console.log("Filters changed:", filters)
            }
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Sort Control
          </h2>
          <SortControl
            options={[
              { key: "name", label: "Name" },
              { key: "date", label: "Date Created" },
              { key: "status", label: "Status" },
              { key: "priority", label: "Priority" },
            ]}
            onChange={(sorts) => console.log("Sort changed:", sorts)}
          />
        </div>
        {/* Organism Components Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Tier 3: Organism Components (Enterprise Features)
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            EditableDataGrid
          </h2>
          <EditableDataGrid
            columns={[
              {
                key: "id",
                title: "ID",
                dataIndex: "id",
                width: 80,
                sortable: true,
              },
              {
                key: "name",
                title: "Product Name",
                dataIndex: "name",
                editable: true,
                sortable: true,
                filterable: true,
              },
              {
                key: "category",
                title: "Category",
                dataIndex: "category",
                editable: true,
                editor: "select",
                editorProps: {
                  options: [
                    { value: "electronics", label: "Electronics" },
                    { value: "clothing", label: "Clothing" },
                    { value: "books", label: "Books" },
                  ],
                },
              },
              {
                key: "price",
                title: "Price",
                dataIndex: "price",
                editable: true,
                validator: (value) =>
                  Number(value) > 0 ? null : "Price must be greater than 0",
              },
              {
                key: "status",
                title: "Status",
                dataIndex: "status",
                editable: true,
                editor: "select",
                editorProps: {
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                    { value: "pending", label: "Pending" },
                  ],
                },
              },
            ]}
            data={[
              {
                id: 1,
                name: "iPhone 15",
                category: "electronics",
                price: 999,
                status: "active",
              },
              {
                id: 2,
                name: "MacBook Pro",
                category: "electronics",
                price: 2499,
                status: "active",
              },
              {
                id: 3,
                name: "Nike Air Max",
                category: "clothing",
                price: 150,
                status: "pending",
              },
              {
                id: 4,
                name: "React Handbook",
                category: "books",
                price: 29.99,
                status: "active",
              },
              {
                id: 5,
                name: "iPad Air",
                category: "electronics",
                price: 599,
                status: "inactive",
              },
            ]}
            editable
            selection={{
              type: "checkbox",
              selectedRowKeys: [],
              onSelectionChange: (keys, rows) =>
                console.log("Selection:", keys, rows),
            }}
            pagination={{
              current: 1,
              pageSize: 10,
              total: 5,
              showSizeChanger: true,
            }}
            onCellEdit={(value, record, column) =>
              console.log("Cell edited:", value, record, column)
            }
            onRowAdd={() => console.log("Row add clicked")}
            onRowDelete={(record) => console.log("Row delete:", record)}
            allowedActions={["edit_rows", "delete_rows", "bulk_delete"]}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Comparison Table
          </h2>
          <ComparisonTable
            items={[
              {
                id: "vendor1",
                name: "TechCorp Solutions",
                data: {
                  price: 25000,
                  rating: 4.5,
                  experience: 8,
                  support: true,
                  delivery: "2 weeks",
                },
                metadata: { category: "Software" },
              },
              {
                id: "vendor2",
                name: "Innovation Labs",
                data: {
                  price: 32000,
                  rating: 4.8,
                  experience: 12,
                  support: true,
                  delivery: "3 weeks",
                },
                metadata: { category: "Software" },
              },
              {
                id: "vendor3",
                name: "Digital Dynamics",
                data: {
                  price: 28000,
                  rating: 4.2,
                  experience: 6,
                  support: false,
                  delivery: "1 week",
                },
                metadata: { category: "Software" },
              },
            ]}
            criteria={[
              {
                key: "price",
                label: "Price ($)",
                weight: 0.3,
                type: "numeric",
              },
              { key: "rating", label: "Rating", weight: 0.25, type: "rating" },
              {
                key: "experience",
                label: "Experience (years)",
                weight: 0.2,
                type: "numeric",
              },
              {
                key: "support",
                label: "24/7 Support",
                weight: 0.15,
                type: "boolean",
              },
              {
                key: "delivery",
                label: "Delivery Time",
                weight: 0.1,
                type: "text",
              },
            ]}
            scoring={{ enabled: true, method: "weighted" }}
            showScores
            showRanking
            highlightBest
            onItemSelect={(item) => console.log("Selected vendor:", item)}
            onCompare={(items) => console.log("Comparing:", items)}
            commerceState="agreement"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Pivot Table
          </h2>
          <PivotTable
            data={[
              {
                region: "North",
                quarter: "Q1",
                product: "Laptops",
                sales: 120000,
                units: 150,
              },
              {
                region: "North",
                quarter: "Q1",
                product: "Phones",
                sales: 80000,
                units: 200,
              },
              {
                region: "North",
                quarter: "Q2",
                product: "Laptops",
                sales: 135000,
                units: 170,
              },
              {
                region: "North",
                quarter: "Q2",
                product: "Phones",
                sales: 95000,
                units: 240,
              },
              {
                region: "South",
                quarter: "Q1",
                product: "Laptops",
                sales: 95000,
                units: 120,
              },
              {
                region: "South",
                quarter: "Q1",
                product: "Phones",
                sales: 110000,
                units: 280,
              },
              {
                region: "South",
                quarter: "Q2",
                product: "Laptops",
                sales: 105000,
                units: 130,
              },
              {
                region: "South",
                quarter: "Q2",
                product: "Phones",
                sales: 125000,
                units: 320,
              },
            ]}
            rows={["region"]}
            columns={["quarter"]}
            values={[
              {
                field: "sales",
                aggregation: "sum",
                formatter: (value) => `$${value.toLocaleString()}`,
              },
              {
                field: "units",
                aggregation: "sum",
                formatter: (value) => `${value} units`,
              },
            ]}
            showTotals
            showSubtotals
            onCellClick={(value, rowData, colData) =>
              console.log("Pivot cell clicked:", value, rowData, colData)
            }
            onDrillDown={(field, value) =>
              console.log("Drill down:", field, value)
            }
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Approval Workflow
          </h2>
          <ApprovalWorkflow
            title="Purchase Order Approval"
            steps={[
              {
                id: "step1",
                name: "Manager Review",
                description: "Initial review by department manager",
                type: "approval",
                status: "completed",
                assignees: ["manager1"],
                completedBy: "manager1",
                completedAt: "2024-01-15T10:30:00Z",
                duration: 1800,
              },
              {
                id: "step2",
                name: "Finance Approval",
                description: "Budget verification and financial approval",
                type: "approval",
                status: "in_progress",
                assignees: ["finance1"],
                dueDate: "2024-01-20T17:00:00Z",
              },
              {
                id: "step3",
                name: "Director Sign-off",
                description: "Final approval by department director",
                type: "approval",
                status: "pending",
                assignees: ["director1"],
                dependencies: ["step2"],
              },
            ]}
            currentStep="step2"
            requestData={{
              requestTitle: "New Server Hardware Purchase",
              description:
                "Request for new server infrastructure to support growing demand",
              amount: 75000,
              requestedBy: "john.doe",
            }}
            approvers={[
              {
                id: "manager1",
                name: "Jane Manager",
                role: "Department Manager",
                level: 1,
              },
              {
                id: "finance1",
                name: "Bob Finance",
                role: "Finance Director",
                level: 2,
              },
              {
                id: "director1",
                name: "Alice Director",
                role: "IT Director",
                level: 3,
              },
            ]}
            showProgress
            showHistory
            showComments
            allowDelegate
            onStepAction={(stepId, action, data) =>
              console.log("Workflow action:", stepId, action, data)
            }
            onWorkflowComplete={(result) =>
              console.log("Workflow completed:", result)
            }
            commerceState="agreement"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            State Transition
          </h2>
          <StateTransition
            currentState="in_review"
            availableStates={[
              {
                key: "draft",
                label: "Draft",
                description: "Initial draft state",
                color: "gray",
                icon: "📝",
              },
              {
                key: "in_review",
                label: "In Review",
                description: "Under review",
                color: "blue",
                icon: "👁️",
              },
              {
                key: "approved",
                label: "Approved",
                description: "Approved for processing",
                color: "green",
                icon: "✅",
              },
              {
                key: "rejected",
                label: "Rejected",
                description: "Rejected with comments",
                color: "red",
                icon: "❌",
              },
              {
                key: "on_hold",
                label: "On Hold",
                description: "Temporarily paused",
                color: "yellow",
                icon: "⏸️",
              },
            ]}
            transitions={[
              { from: "draft", to: "in_review", label: "Submit for Review" },
              { from: "in_review", to: "approved", label: "Approve" },
              { from: "in_review", to: "rejected", label: "Reject" },
              { from: "in_review", to: "on_hold", label: "Put on Hold" },
              { from: "on_hold", to: "in_review", label: "Resume Review" },
              { from: "rejected", to: "draft", label: "Return to Draft" },
            ]}
            layout="buttons"
            showHistory
            showValidation
            confirmTransitions
            onStateChange={(from, to) =>
              console.log("State changed:", from, "->", to)
            }
            onValidate={(toState) => {
              console.log("Validating transition to:", toState);
              return Promise.resolve(true);
            }}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Settings Manager
          </h2>
          <SettingsManager
            title="Application Settings"
            categories={[
              {
                id: "general",
                name: "General Settings",
                description: "Basic application configuration",
                icon: "⚙️",
                settings: [
                  {
                    id: "app_name",
                    name: "Application Name",
                    description: "Display name for the application",
                    type: "string",
                    value: "Component Library Demo",
                    defaultValue: "My App",
                    validation: { required: true, minLength: 3, maxLength: 50 },
                  },
                  {
                    id: "debug_mode",
                    name: "Debug Mode",
                    description: "Enable debug logging",
                    type: "boolean",
                    value: false,
                    defaultValue: false,
                  },
                  {
                    id: "theme",
                    name: "Theme",
                    description: "Application color theme",
                    type: "select",
                    value: "light",
                    defaultValue: "light",
                    options: [
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                      { value: "auto", label: "System" },
                    ],
                  },
                ],
              },
              {
                id: "security",
                name: "Security Settings",
                description: "Security and authentication settings",
                icon: "🔐",
                settings: [
                  {
                    id: "session_timeout",
                    name: "Session Timeout (minutes)",
                    description: "Auto-logout after inactivity",
                    type: "number",
                    value: 30,
                    defaultValue: 60,
                    validation: { required: true, min: 5, max: 480 },
                  },
                  {
                    id: "require_2fa",
                    name: "Require Two-Factor Authentication",
                    description: "Force 2FA for all users",
                    type: "boolean",
                    value: true,
                    defaultValue: false,
                  },
                  {
                    id: "api_key",
                    name: "API Key",
                    description: "Secret API key for external services",
                    type: "string",
                    value: "***hidden***",
                    defaultValue: "",
                    sensitive: true,
                    validation: { required: false, minLength: 20 },
                  },
                ],
              },
            ]}
            layout="tabs"
            searchable
            exportable
            importable
            showSaveButton
            showResetButton
            autoSave={false}
            validation
            onSettingChange={(settingId, value, categoryId) =>
              console.log("Setting changed:", settingId, value, categoryId)
            }
            onSave={(settings) => {
              console.log("Saving settings:", settings);
              return Promise.resolve();
            }}
            onReset={(categoryId) => console.log("Reset settings:", categoryId)}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Import Wizard
          </h2>
          <ImportWizard
            title="Product Data Import"
            supportedFormats={["csv", "xlsx", "json"]}
            maxFileSize={5 * 1024 * 1024} // 5MB
            templateDownload
            batchProcessing
            fieldMapping={[
              { source: "product_name", target: "name", required: true },
              {
                source: "product_category",
                target: "category",
                required: true,
              },
              {
                source: "product_price",
                target: "price",
                required: true,
                transformer: (value) => parseFloat(value),
              },
              { source: "product_status", target: "status", required: false },
            ]}
            validationRules={[
              {
                field: "name",
                type: "required",
                message: "Product name is required",
              },
              {
                field: "price",
                type: "type",
                params: "number",
                message: "Price must be a number",
              },
              {
                field: "price",
                type: "range",
                params: { min: 0, max: 10000 },
                message: "Price must be between 0 and 10000",
              },
            ]}
            showProgress
            allowSkipSteps
            onFileUpload={(file) => console.log("File uploaded:", file.name)}
            onFieldMapping={(mapping) => console.log("Field mapping:", mapping)}
            onValidation={(data) => {
              console.log("Validating data:", data.length, "records");
              // Simulate validation
              return Promise.resolve(
                data.map((record, index) => ({
                  ...record,
                  errors: index % 5 === 0 ? ["Sample validation error"] : [],
                }))
              );
            }}
            onImport={(data, options) => {
              console.log(
                "Importing:",
                data.length,
                "records with options:",
                options
              );
              return Promise.resolve({ imported: data.length, failed: 0 });
            }}
            onComplete={(result) => console.log("Import completed:", result)}
            onCancel={() => console.log("Import cancelled")}
            commerceState="initiation"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Workflow Tracker
          </h2>
          <WorkflowTracker
            title="Project Workflows"
            workflows={[
              {
                id: "wf1",
                name: "User Onboarding Process",
                status: "active",
                currentStep: "Document Review",
                totalSteps: 5,
                completedSteps: 2,
                assignee: "Alice Johnson",
                priority: "high",
                dueDate: "2024-02-15T17:00:00Z",
                startDate: "2024-01-20T09:00:00Z",
                metadata: { department: "HR" }
              },
              {
                id: "wf2",
                name: "Product Launch Workflow",
                status: "paused",
                currentStep: "Marketing Review",
                totalSteps: 8,
                completedSteps: 5,
                assignee: "Bob Smith",
                priority: "medium",
                dueDate: "2024-03-01T17:00:00Z",
                startDate: "2024-01-10T09:00:00Z",
                metadata: { department: "Product" }
              },
              {
                id: "wf3",
                name: "Security Audit",
                status: "completed",
                currentStep: "Final Report",
                totalSteps: 4,
                completedSteps: 4,
                assignee: "Carol Wilson",
                priority: "urgent",
                completedDate: "2024-01-25T16:30:00Z",
                startDate: "2024-01-15T09:00:00Z",
                metadata: { department: "Security" }
              }
            ]}
            groupBy="status"
            layout="list"
            showMetrics
            showFilters
            autoRefresh={false}
            onWorkflowClick={(workflow) => console.log("Workflow clicked:", workflow)}
            onWorkflowAction={(workflowId, action) => console.log("Workflow action:", workflowId, action)}
            onFilterChange={(filters) => console.log("Filters changed:", filters)}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            User Manager
          </h2>
          <UserManager
            title="System Users"
            users={[
              {
                id: "user1",
                username: "alice.johnson",
                email: "alice@company.com",
                firstName: "Alice",
                lastName: "Johnson",
                status: "active",
                roles: ["admin", "manager"],
                lastLogin: "2024-01-20T14:30:00Z",
                createdAt: "2023-06-15T09:00:00Z",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b494?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              },
              {
                id: "user2",
                username: "bob.smith",
                email: "bob@company.com",
                firstName: "Bob",
                lastName: "Smith",
                status: "active",
                roles: ["editor"],
                lastLogin: "2024-01-19T16:45:00Z",
                createdAt: "2023-08-10T10:30:00Z"
              },
              {
                id: "user3",
                username: "carol.wilson",
                email: "carol@company.com",
                firstName: "Carol",
                lastName: "Wilson",
                status: "inactive",
                roles: ["viewer"],
                lastLogin: "2024-01-10T11:20:00Z",
                createdAt: "2023-09-05T14:15:00Z"
              }
            ]}
            roles={[
              { id: "admin", name: "Administrator", permissions: ["all"] },
              { id: "manager", name: "Manager", permissions: ["read", "write", "delete"] },
              { id: "editor", name: "Editor", permissions: ["read", "write"] },
              { id: "viewer", name: "Viewer", permissions: ["read"] }
            ]}
            layout="table"
            searchable
            filterable
            bulkActions
            inviteUsers
            onUserCreate={(userData) => console.log("Create user:", userData)}
            onUserUpdate={(userId, userData) => console.log("Update user:", userId, userData)}
            onUserDelete={(userId) => console.log("Delete user:", userId)}
            onStatusChange={(userId, status) => console.log("Status change:", userId, status)}
            allowedActions={["create_users", "edit_users", "delete_users", "invite_users", "change_user_status"]}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Role Manager
          </h2>
          <RoleManager
            title="System Roles & Permissions"
            roles={[
              {
                id: "admin",
                name: "Administrator",
                description: "Full system access with all permissions",
                type: "system",
                permissions: ["read", "write", "delete", "admin", "manage_users", "manage_roles"],
                userCount: 2,
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: "2023-12-01T10:00:00Z"
              },
              {
                id: "manager",
                name: "Manager",
                description: "Management level access with team oversight",
                type: "custom",
                permissions: ["read", "write", "delete", "manage_team"],
                userCount: 5,
                createdAt: "2023-06-15T09:00:00Z",
                updatedAt: "2024-01-15T14:30:00Z"
              },
              {
                id: "editor",
                name: "Content Editor",
                description: "Can create and edit content",
                type: "custom",
                permissions: ["read", "write"],
                userCount: 12,
                createdAt: "2023-03-10T12:00:00Z",
                updatedAt: "2023-11-20T16:45:00Z"
              },
              {
                id: "viewer",
                name: "Viewer",
                description: "Read-only access to system",
                type: "system",
                permissions: ["read"],
                userCount: 25,
                createdAt: "2023-01-01T00:00:00Z",
                updatedAt: "2023-08-15T11:20:00Z"
              }
            ]}
            permissions={[
              { id: "read", name: "Read Access", description: "View data and content", category: "Content", type: "read" },
              { id: "write", name: "Write Access", description: "Create and modify content", category: "Content", type: "write" },
              { id: "delete", name: "Delete Access", description: "Remove content", category: "Content", type: "delete" },
              { id: "admin", name: "Admin Access", description: "Administrative functions", category: "System", type: "admin" },
              { id: "manage_users", name: "Manage Users", description: "User management", category: "Users", type: "admin" },
              { id: "manage_roles", name: "Manage Roles", description: "Role management", category: "Security", type: "admin" },
              { id: "manage_team", name: "Manage Team", description: "Team oversight", category: "Management", type: "write" }
            ]}
            layout="table"
            searchable
            cloneable
            showPermissionMatrix
            onRoleCreate={(roleData) => console.log("Create role:", roleData)}
            onRoleUpdate={(roleId, roleData) => console.log("Update role:", roleId, roleData)}
            onRoleDelete={(roleId) => console.log("Delete role:", roleId)}
            onRoleClone={(roleId, newName) => console.log("Clone role:", roleId, newName)}
            onPermissionChange={(roleId, permissionIds) => console.log("Permission change:", roleId, permissionIds)}
            allowedActions={["create_roles", "edit_roles", "delete_roles", "clone_roles", "manage_permissions"]}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Export Manager
          </h2>
          <ExportManager
            title="Data Export Center"
            data={[
              { id: 1, name: "Product A", category: "Electronics", price: 299.99, status: "active", created: "2024-01-15" },
              { id: 2, name: "Product B", category: "Clothing", price: 49.99, status: "inactive", created: "2024-01-10" },
              { id: 3, name: "Product C", category: "Books", price: 19.99, status: "active", created: "2024-01-20" },
              { id: 4, name: "Product D", category: "Electronics", price: 599.99, status: "active", created: "2024-01-18" }
            ]}
            formats={[
              { key: 'csv', label: 'CSV', extension: 'csv', mimeType: 'text/csv', description: 'Comma-separated values', icon: '📄' },
              { key: 'excel', label: 'Excel', extension: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Microsoft Excel file', icon: '📊' },
              { key: 'json', label: 'JSON', extension: 'json', mimeType: 'application/json', description: 'JavaScript Object Notation', icon: '🔧' },
              { key: 'pdf', label: 'PDF', extension: 'pdf', mimeType: 'application/pdf', description: 'Portable Document Format', icon: '📋' }
            ]}
            templates={[
              {
                id: "template1",
                name: "Product Summary",
                format: "csv",
                fields: ["name", "category", "price", "status"],
                description: "Basic product information"
              },
              {
                id: "template2",
                name: "Detailed Report",
                format: "excel",
                fields: ["id", "name", "category", "price", "status", "created"],
                description: "Complete product data"
              }
            ]}
            fields={[
              { key: "id", label: "Product ID", type: "number", required: true },
              { key: "name", label: "Product Name", type: "string", required: true },
              { key: "category", label: "Category", type: "string", required: false },
              { key: "price", label: "Price", type: "number", required: true, formatter: (value) => `$${value}` },
              { key: "status", label: "Status", type: "string", required: false },
              { key: "created", label: "Created Date", type: "string", required: false }
            ]}
            filters={{ category: "", status: "" }}
            scheduling={{ enabled: true, frequency: 'weekly' }}
            showPreview
            showProgress
            batchSize={1000}
            onExport={(format, options) => {
              console.log("Export requested:", format, options);
              return Promise.resolve();
            }}
            onSchedule={(schedule) => console.log("Schedule export:", schedule)}
            onTemplateCreate={(template) => console.log("Create template:", template)}
            allowedActions={["export_data", "create_templates", "schedule_exports"]}
            commerceState="execution"
            size="md"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            API Connector
          </h2>
          <APIConnector
            title="External API Management"
            endpoints={[
              {
                id: "api1",
                name: "User Service API",
                description: "Internal user management service",
                url: "https://api.company.com/users",
                method: "GET",
                status: "connected",
                authentication: { type: "bearer" },
                lastTested: "2024-01-20T14:30:00Z",
                parameters: [
                  { name: "limit", type: "query", required: false, description: "Number of users to return" },
                  { name: "offset", type: "query", required: false, description: "Pagination offset" }
                ]
              },
              {
                id: "api2",
                name: "Payment Gateway",
                description: "External payment processing",
                url: "https://payments.stripe.com/v1/charges",
                method: "POST",
                status: "error",
                authentication: { type: "api_key" },
                lastTested: "2024-01-19T16:45:00Z",
                parameters: [
                  { name: "amount", type: "body", required: true, description: "Payment amount in cents" },
                  { name: "currency", type: "body", required: true, description: "Currency code" }
                ]
              },
              {
                id: "api3",
                name: "Analytics API",
                description: "Data analytics service",
                url: "https://analytics.company.com/events",
                method: "POST",
                status: "disconnected",
                authentication: { type: "oauth2" },
                parameters: [
                  { name: "event_type", type: "body", required: true, description: "Type of analytics event" }
                ]
              }
            ]}
            integrations={[
              {
                id: "int1",
                name: "User Sync Integration",
                type: "polling",
                source: "User Service API",
                target: "Internal Database",
                schedule: "*/15 * * * *",
                status: "active",
                lastRun: "2024-01-20T15:00:00Z",
                nextRun: "2024-01-20T15:15:00Z"
              },
              {
                id: "int2",
                name: "Payment Webhook",
                type: "webhook",
                source: "Payment Gateway",
                target: "Order Service",
                status: "error",
                lastRun: "2024-01-20T10:30:00Z"
              },
              {
                id: "int3",
                name: "Analytics Reporter",
                type: "realtime",
                source: "Analytics API",
                target: "Dashboard",
                status: "paused",
                lastRun: "2024-01-19T18:00:00Z"
              }
            ]}
            layout="tabs"
            testable
            monitorable
            showLogs
            showMetrics
            onEndpointTest={(endpointId) => {
              console.log("Testing endpoint:", endpointId);
              return Promise.resolve({ success: true, message: "Connection successful", responseTime: 120 });
            }}
            onEndpointSave={(endpointData) => console.log("Save endpoint:", endpointData)}
            onIntegrationToggle={(integrationId, active) => console.log("Toggle integration:", integrationId, active)}
            onIntegrationRun={(integrationId) => console.log("Run integration:", integrationId)}
            onIntegrationCreate={(integrationData) => console.log("Create integration:", integrationData)}
            allowedActions={["test_endpoints", "edit_endpoints", "create_endpoints", "toggle_integrations", "run_integrations", "create_integrations"]}
            commerceState="execution"
            size="md"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;