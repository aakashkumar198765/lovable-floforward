import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import {
  updateSettings,
  SystemSettings,
} from "../../../store/slices/settingsSlice";
import { SettingsManager } from "../../organisms/management";
import { Input, Select, Switch, Button, Textarea } from "../../atoms";
import { Alert, Toast } from "../../atoms";
import { Tab } from "../../atoms";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state: RootState) => state.settings);
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    general: {
      companyName: settings.company?.name || "Company Name",
      currency: "USD",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      theme: "light",
    },
    purchase: {
      autoApprovalLimit: settings.procurement?.autoApprovalLimit || 1000,
      requireApprovalAbove: 5000,
      defaultPriority: "medium",
      allowDuplicateOrders: false,
      defaultTaxRate: settings.procurement?.defaultTaxRate || 0.085,
      defaultPaymentTerms:
        settings.procurement?.defaultPaymentTerms || "Net 30",
      emailNotifications: settings.notifications?.emailNotifications || true,
    },
    approval: {
      multiLevelApproval:
        settings.procurement?.requireMultipleApprovals || true,
      approvalTimeout: 72,
      escalationRules: true,
      requireComments: false,
    },
    notifications: {
      emailNotifications: settings.notifications?.emailNotifications || true,
      smsNotifications: settings.notifications?.smsNotifications || false,
      pushNotifications: true,
      notifyOnStatusChange: true,
      notifyOnApproval: settings.notifications?.approvalReminders || true,
      digestFrequency: "daily",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // General settings validation
    if (!formData.general.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    // Purchase settings validation
    if (formData.purchase.autoApprovalLimit < 0) {
      newErrors.autoApprovalLimit = "Auto approval limit must be positive";
    }

    if (
      formData.purchase.requireApprovalAbove <=
      formData.purchase.autoApprovalLimit
    ) {
      newErrors.requireApprovalAbove =
        "Approval threshold must be higher than auto approval limit";
    }

    // Approval settings validation
    if (
      formData.approval.approvalTimeout < 1 ||
      formData.approval.approvalTimeout > 168
    ) {
      newErrors.approvalTimeout =
        "Approval timeout must be between 1 and 168 hours";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setToastMessage("Please fix the validation errors");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // Structure the form data according to SystemSettings interface
      const structuredSettings: Partial<SystemSettings> = {
        company: {
          name: formData.general.companyName,
          address: settings.company?.address || "",
          phone: settings.company?.phone || "",
          email: settings.company?.email || "",
          logo: settings.company?.logo || "",
        },
        procurement: {
          autoApprovalLimit: formData.purchase.autoApprovalLimit,
          requireMultipleApprovals: formData.approval.multiLevelApproval,
          allowEmergencyOrders: !formData.purchase.allowDuplicateOrders,
          defaultTaxRate: formData.purchase.defaultTaxRate,
          defaultPaymentTerms: formData.purchase.defaultPaymentTerms,
        },
        notifications: {
          emailNotifications: formData.notifications.emailNotifications,
          smsNotifications: formData.notifications.smsNotifications,
          approvalReminders: formData.notifications.notifyOnApproval,
          reminderFrequency: settings.notifications?.reminderFrequency || 24,
        },
      };

      dispatch(updateSettings(structuredSettings));
      setToastMessage("Settings saved successfully");
      setShowToast(true);
    } catch (error) {
      setToastMessage("Error saving settings");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "settings" },
    { id: "purchase", label: "Purchase Orders", icon: "document" },
    { id: "approval", label: "Approval Workflow", icon: "check-circle" },
    { id: "notifications", label: "Notifications", icon: "bell" },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          value={formData.general.companyName}
          onChange={(e) =>
            handleInputChange("general", "companyName", e.target.value)
          }
          errorMessage={errors.companyName}
          required
        />

        <Select
          label="Currency"
          value={formData.general.currency}
          onChange={(value) => handleInputChange("general", "currency", value)}
          options={[
            { value: "USD", label: "US Dollar (USD)" },
            { value: "EUR", label: "Euro (EUR)" },
            { value: "GBP", label: "British Pound (GBP)" },
            { value: "CAD", label: "Canadian Dollar (CAD)" },
          ]}
          required
        />

        <Select
          label="Timezone"
          value={formData.general.timezone}
          onChange={(value) => handleInputChange("general", "timezone", value)}
          options={[
            { value: "America/New_York", label: "Eastern Time" },
            { value: "America/Chicago", label: "Central Time" },
            { value: "America/Denver", label: "Mountain Time" },
            { value: "America/Los_Angeles", label: "Pacific Time" },
          ]}
          required
        />

        <Select
          label="Date Format"
          value={formData.general.dateFormat}
          onChange={(value) =>
            handleInputChange("general", "dateFormat", value)
          }
          options={[
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
          ]}
          required
        />

        <Select
          label="Theme"
          value={formData.general.theme}
          onChange={(value) => handleInputChange("general", "theme", value)}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ]}
        />
      </div>
    </div>
  );

  const renderPurchaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Auto Approval Limit"
          type="number"
          value={formData.purchase.autoApprovalLimit}
          onChange={(e) =>
            handleInputChange(
              "purchase",
              "autoApprovalLimit",
              Number(e.target.value)
            )
          }
          errorMessage={errors.autoApprovalLimit}
          helperText="Orders below this amount will be auto-approved"
          min={0}
        />

        <Input
          label="Require Approval Above"
          type="number"
          value={formData.purchase.requireApprovalAbove}
          onChange={(e) =>
            handleInputChange(
              "purchase",
              "requireApprovalAbove",
              Number(e.target.value)
            )
          }
          errorMessage={errors.requireApprovalAbove}
          helperText="Orders above this amount require manual approval"
          min={0}
        />

        <Select
          label="Default Priority"
          value={formData.purchase.defaultPriority}
          onChange={(value) =>
            handleInputChange("purchase", "defaultPriority", value)
          }
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "urgent", label: "Urgent" },
          ]}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Allow Duplicate Orders
            </label>
            <p className="text-sm text-gray-500">
              Allow creating orders with duplicate order numbers
            </p>
          </div>
          <Switch
            checked={formData.purchase.allowDuplicateOrders}
            onChange={(checked) =>
              handleInputChange("purchase", "allowDuplicateOrders", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Notifications
            </label>
            <p className="text-sm text-gray-500">
              Send email notifications for order updates
            </p>
          </div>
          <Switch
            checked={formData.purchase.emailNotifications}
            onChange={(checked) =>
              handleInputChange("purchase", "emailNotifications", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderApprovalSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Approval Timeout (hours)"
          type="number"
          value={formData.approval.approvalTimeout}
          onChange={(e) =>
            handleInputChange(
              "approval",
              "approvalTimeout",
              Number(e.target.value)
            )
          }
          errorMessage={errors.approvalTimeout}
          helperText="Hours before approval request times out"
          min={1}
          max={168}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Multi-Level Approval
            </label>
            <p className="text-sm text-gray-500">
              Enable multi-level approval workflow
            </p>
          </div>
          <Switch
            checked={formData.approval.multiLevelApproval}
            onChange={(checked) =>
              handleInputChange("approval", "multiLevelApproval", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Escalation Rules
            </label>
            <p className="text-sm text-gray-500">
              Automatically escalate overdue approvals
            </p>
          </div>
          <Switch
            checked={formData.approval.escalationRules}
            onChange={(checked) =>
              handleInputChange("approval", "escalationRules", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Require Comments
            </label>
            <p className="text-sm text-gray-500">
              Require comments when rejecting orders
            </p>
          </div>
          <Switch
            checked={formData.approval.requireComments}
            onChange={(checked) =>
              handleInputChange("approval", "requireComments", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Digest Frequency"
          value={formData.notifications.digestFrequency}
          onChange={(value) =>
            handleInputChange("notifications", "digestFrequency", value)
          }
          options={[
            { value: "none", label: "No Digest" },
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Notifications
            </label>
            <p className="text-sm text-gray-500">Receive email notifications</p>
          </div>
          <Switch
            checked={formData.notifications.emailNotifications}
            onChange={(checked) =>
              handleInputChange("notifications", "emailNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              SMS Notifications
            </label>
            <p className="text-sm text-gray-500">
              Receive SMS notifications for urgent items
            </p>
          </div>
          <Switch
            checked={formData.notifications.smsNotifications}
            onChange={(checked) =>
              handleInputChange("notifications", "smsNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Push Notifications
            </label>
            <p className="text-sm text-gray-500">
              Receive browser push notifications
            </p>
          </div>
          <Switch
            checked={formData.notifications.pushNotifications}
            onChange={(checked) =>
              handleInputChange("notifications", "pushNotifications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status Change Notifications
            </label>
            <p className="text-sm text-gray-500">
              Notify when order status changes
            </p>
          </div>
          <Switch
            checked={formData.notifications.notifyOnStatusChange}
            onChange={(checked) =>
              handleInputChange(
                "notifications",
                "notifyOnStatusChange",
                checked
              )
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Approval Notifications
            </label>
            <p className="text-sm text-gray-500">
              Notify when approval is required
            </p>
          </div>
          <Switch
            checked={formData.notifications.notifyOnApproval}
            onChange={(checked) =>
              handleInputChange("notifications", "notifyOnApproval", checked)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "purchase":
        return renderPurchaseSettings();
      case "approval":
        return renderApprovalSettings();
      case "notifications":
        return renderNotificationSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure system preferences and purchase order settings
        </p>
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {Object.keys(errors).length > 0 && (
            <div className="mb-6">
              <Alert
                variant="error"
                title="Please fix the following errors:"
                description={Object.values(errors).join(", ")}
              />
            </div>
          )}

          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Settings can be updated and saved
            </div>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => {
                  // Reset form data to original settings
                  // Reset form data would go here
                  console.log("Reset form data");
                  setErrors({});
                }}
              >
                Reset
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          variant={toastMessage.includes("Error") ? "error" : "success"}
          title={toastMessage.includes("Error") ? "Error" : "Success"}
          description={toastMessage}
          onClose={() => setShowToast(false)}
          duration={3000}
          position="top-right"
        />
      )}
    </div>
  );
};

export default SettingsPage;
