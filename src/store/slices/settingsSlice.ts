import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SystemSettings {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
  };
  procurement: {
    autoApprovalLimit: number;
    requireMultipleApprovals: boolean;
    allowEmergencyOrders: boolean;
    defaultTaxRate: number;
    defaultPaymentTerms: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    approvalReminders: boolean;
    reminderFrequency: number;
  };
  security: {
    sessionTimeout: number;
    requireTwoFactor: boolean;
    allowedFileTypes: string[];
    maxFileSize: number;
  };
  customFields: Array<{
    id: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'select';
    required: boolean;
    options?: string[];
  }>;
}

interface SettingsState {
  settings: SystemSettings;
  loading: boolean;
  error: string | null;
  hasChanges: boolean;
}

const initialState: SettingsState = {
  settings: {
    company: {
      name: 'Acme Corporation',
      address: '123 Business St, Suite 100, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@acmecorp.com',
      logo: '',
    },
    procurement: {
      autoApprovalLimit: 1000,
      requireMultipleApprovals: true,
      allowEmergencyOrders: true,
      defaultTaxRate: 8.5,
      defaultPaymentTerms: 'Net 30',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      approvalReminders: true,
      reminderFrequency: 24,
    },
    security: {
      sessionTimeout: 30,
      requireTwoFactor: false,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
      maxFileSize: 10,
    },
    customFields: [
      {
        id: '1',
        name: 'Project Code',
        type: 'text',
        required: true,
      },
      {
        id: '2',
        name: 'Cost Center',
        type: 'select',
        required: true,
        options: ['Marketing', 'IT', 'Operations', 'HR', 'Finance'],
      },
    ],
  },
  loading: false,
  error: null,
  hasChanges: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<SystemSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      state.hasChanges = true;
    },
    updateCompanySettings: (state, action: PayloadAction<Partial<SystemSettings['company']>>) => {
      state.settings.company = { ...state.settings.company, ...action.payload };
      state.hasChanges = true;
    },
    updateProcurementSettings: (state, action: PayloadAction<Partial<SystemSettings['procurement']>>) => {
      state.settings.procurement = { ...state.settings.procurement, ...action.payload };
      state.hasChanges = true;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<SystemSettings['notifications']>>) => {
      state.settings.notifications = { ...state.settings.notifications, ...action.payload };
      state.hasChanges = true;
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<SystemSettings['security']>>) => {
      state.settings.security = { ...state.settings.security, ...action.payload };
      state.hasChanges = true;
    },
    addCustomField: (state, action: PayloadAction<SystemSettings['customFields'][0]>) => {
      state.settings.customFields.push(action.payload);
      state.hasChanges = true;
    },
    updateCustomField: (state, action: PayloadAction<{ id: string; field: Partial<SystemSettings['customFields'][0]> }>) => {
      const index = state.settings.customFields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.settings.customFields[index] = { ...state.settings.customFields[index], ...action.payload.field };
        state.hasChanges = true;
      }
    },
    removeCustomField: (state, action: PayloadAction<string>) => {
      state.settings.customFields = state.settings.customFields.filter(field => field.id !== action.payload);
      state.hasChanges = true;
    },
    saveSettingsSuccess: (state) => {
      state.hasChanges = false;
      state.loading = false;
      state.error = null;
    },
    resetChanges: (state) => {
      state.hasChanges = false;
    },
  },
});

export const {
  setLoading,
  setError,
  updateSettings,
  updateCompanySettings,
  updateProcurementSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  addCustomField,
  updateCustomField,
  removeCustomField,
  saveSettingsSuccess,
  resetChanges,
} = settingsSlice.actions;

export default settingsSlice.reducer;