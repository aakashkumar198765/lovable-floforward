import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactPerson: string;
  category: string[];
  rating: number;
  status: 'active' | 'inactive' | 'pending';
  paymentTerms: string;
  taxId: string;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    category: string[];
    rating: number | null;
  };
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Global Tech Solutions',
    email: 'contact@globaltech.com',
    phone: '+1-555-0101',
    address: {
      street: '123 Tech Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    contactPerson: 'John Smith',
    category: ['Technology', 'Software'],
    rating: 4.8,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US123456789',
    registrationNumber: 'REG001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-07-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Office Supplies Pro',
    email: 'orders@officesupplies.com',
    phone: '+1-555-0202',
    address: {
      street: '456 Business Park',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    contactPerson: 'Sarah Johnson',
    category: ['Office Supplies', 'Stationery'],
    rating: 4.5,
    status: 'active',
    paymentTerms: 'Net 15',
    taxId: 'US987654321',
    registrationNumber: 'REG002',
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-07-18T11:20:00Z'
  },
  {
    id: '3',
    name: 'Industrial Equipment Corp',
    email: 'sales@indequip.com',
    phone: '+1-555-0303',
    address: {
      street: '789 Manufacturing Dr',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA'
    },
    contactPerson: 'Mike Wilson',
    category: ['Industrial', 'Machinery'],
    rating: 4.2,
    status: 'active',
    paymentTerms: 'Net 45',
    taxId: 'US456789123',
    registrationNumber: 'REG003',
    createdAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-07-15T09:10:00Z'
  },
  {
    id: '4',
    name: 'Green Energy Solutions',
    email: 'info@greenenergy.com',
    phone: '+1-555-0404',
    address: {
      street: '321 Solar Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    },
    contactPerson: 'Lisa Chen',
    category: ['Energy', 'Sustainability'],
    rating: 4.9,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US789123456',
    registrationNumber: 'REG004',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-07-22T13:45:00Z'
  },
  {
    id: '5',
    name: 'Construction Materials Inc',
    email: 'orders@constructmat.com',
    phone: '+1-555-0505',
    address: {
      street: '654 Builder Blvd',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    contactPerson: 'Robert Brown',
    category: ['Construction', 'Materials'],
    rating: 4.1,
    status: 'active',
    paymentTerms: 'Net 60',
    taxId: 'US321654987',
    registrationNumber: 'REG005',
    createdAt: '2024-04-12T12:20:00Z',
    updatedAt: '2024-07-19T15:30:00Z'
  },
  {
    id: '6',
    name: 'Medical Supplies Direct',
    email: 'procurement@medsupplies.com',
    phone: '+1-555-0606',
    address: {
      street: '987 Healthcare Way',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    contactPerson: 'Dr. Emily Davis',
    category: ['Medical', 'Healthcare'],
    rating: 4.7,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US654987321',
    registrationNumber: 'REG006',
    createdAt: '2024-02-28T14:00:00Z',
    updatedAt: '2024-07-21T10:15:00Z'
  },
  {
    id: '7',
    name: 'Digital Marketing Agency',
    email: 'hello@digitalmarket.com',
    phone: '+1-555-0707',
    address: {
      street: '147 Creative Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    contactPerson: 'Alex Thompson',
    category: ['Marketing', 'Digital Services'],
    rating: 4.4,
    status: 'active',
    paymentTerms: 'Net 15',
    taxId: 'US147258369',
    registrationNumber: 'REG007',
    createdAt: '2024-05-08T11:30:00Z',
    updatedAt: '2024-07-20T16:45:00Z'
  },
  {
    id: '8',
    name: 'Logistics Express',
    email: 'shipping@logisticsexpress.com',
    phone: '+1-555-0808',
    address: {
      street: '258 Transport Hub',
      city: 'Memphis',
      state: 'TN',
      zipCode: '38101',
      country: 'USA'
    },
    contactPerson: 'David Lee',
    category: ['Logistics', 'Transportation'],
    rating: 4.3,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US258369147',
    registrationNumber: 'REG008',
    createdAt: '2024-03-15T09:45:00Z',
    updatedAt: '2024-07-17T12:00:00Z'
  },
  {
    id: '9',
    name: 'Food Service Distributors',
    email: 'orders@foodservice.com',
    phone: '+1-555-0909',
    address: {
      street: '369 Culinary Court',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    contactPerson: 'Maria Rodriguez',
    category: ['Food Service', 'Catering'],
    rating: 4.6,
    status: 'active',
    paymentTerms: 'Net 15',
    taxId: 'US369147258',
    registrationNumber: 'REG009',
    createdAt: '2024-06-01T13:15:00Z',
    updatedAt: '2024-07-23T08:30:00Z'
  },
  {
    id: '10',
    name: 'Security Systems Ltd',
    email: 'sales@securitysystems.com',
    phone: '+1-555-1010',
    address: {
      street: '741 Safety Street',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '89101',
      country: 'USA'
    },
    contactPerson: 'James Wilson',
    category: ['Security', 'Technology'],
    rating: 4.0,
    status: 'pending',
    paymentTerms: 'Net 45',
    taxId: 'US741852963',
    registrationNumber: 'REG010',
    createdAt: '2024-07-01T15:20:00Z',
    updatedAt: '2024-07-23T14:10:00Z'
  },
  {
    id: '11',
    name: 'Enterprise Software Partners',
    email: 'enterprise@softwarepartners.com',
    phone: '+1-555-1111',
    address: {
      street: '852 Enterprise Way',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    contactPerson: 'Rachel Green',
    category: ['Software', 'Technology'],
    rating: 4.8,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US852963741',
    registrationNumber: 'REG011',
    createdAt: '2024-04-15T10:30:00Z',
    updatedAt: '2024-07-22T16:45:00Z'
  },
  {
    id: '12',
    name: 'Healthcare Equipment Solutions',
    email: 'solutions@healthcare-equip.com',
    phone: '+1-555-1212',
    address: {
      street: '963 Medical Center Dr',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    contactPerson: 'Dr. Thomas Anderson',
    category: ['Medical', 'Healthcare', 'Equipment'],
    rating: 4.9,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US963741852',
    registrationNumber: 'REG012',
    createdAt: '2024-03-10T14:20:00Z',
    updatedAt: '2024-07-20T09:30:00Z'
  },
  {
    id: '13',
    name: 'Advanced Manufacturing Tools',
    email: 'sales@advancedmfg.com',
    phone: '+1-555-1313',
    address: {
      street: '174 Industrial Blvd',
      city: 'Cleveland',
      state: 'OH',
      zipCode: '44101',
      country: 'USA'
    },
    contactPerson: 'Mark Johnson',
    category: ['Industrial', 'Manufacturing', 'Tools'],
    rating: 4.3,
    status: 'active',
    paymentTerms: 'Net 45',
    taxId: 'US174852639',
    registrationNumber: 'REG013',
    createdAt: '2024-05-20T11:15:00Z',
    updatedAt: '2024-07-18T13:25:00Z'
  },
  {
    id: '14',
    name: 'Sustainable Facilities Management',
    email: 'green@sustainablefm.com',
    phone: '+1-555-1414',
    address: {
      street: '285 Green Valley Rd',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    contactPerson: 'Jennifer Martinez',
    category: ['Facilities', 'Sustainability', 'Maintenance'],
    rating: 4.6,
    status: 'active',
    paymentTerms: 'Net 30',
    taxId: 'US285639174',
    registrationNumber: 'REG014',
    createdAt: '2024-02-28T09:45:00Z',
    updatedAt: '2024-07-21T15:10:00Z'
  },
  {
    id: '15',
    name: 'Professional Services Group',
    email: 'contact@proservicesgroup.com',
    phone: '+1-555-1515',
    address: {
      street: '396 Business Center',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA'
    },
    contactPerson: 'Kevin White',
    category: ['Professional Services', 'Consulting'],
    rating: 4.4,
    status: 'active',
    paymentTerms: 'Net 15',
    taxId: 'US396174285',
    registrationNumber: 'REG015',
    createdAt: '2024-06-05T16:30:00Z',
    updatedAt: '2024-07-19T12:20:00Z'
  }
];

const initialState: VendorState = {
  vendors: mockVendors,
  currentVendor: null,
  loading: false,
  error: null,
  filters: {
    status: [],
    category: [],
    rating: null,
  },
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setLoading: (state: any, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: any, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setVendors: (state: any, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
    },
    addVendor: (state: any, action: PayloadAction<Vendor>) => {
      state.vendors.unshift(action.payload);
    },
    updateVendor: (state: any, action: PayloadAction<Vendor>) => {
      const index = state.vendors.findIndex((vendor: any) => vendor.id === action.payload.id);
      if (index !== -1) {
        state.vendors[index] = action.payload;
      }
    },
    deleteVendor: (state: any, action: PayloadAction<string>) => {
      state.vendors = state.vendors.filter((vendor: any) => vendor.id !== action.payload);
    },
    setCurrentVendor: (state: any, action: PayloadAction<Vendor | null>) => {
      state.currentVendor = action.payload;
    },
    setFilters: (state: any, action: PayloadAction<Partial<VendorState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state: any) => {
      state.filters = {
        status: [],
        category: [],
        rating: null,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setVendors,
  addVendor,
  updateVendor,
  deleteVendor,
  setCurrentVendor,
  setFilters,
  clearFilters,
} = vendorSlice.actions;

export default vendorSlice.reducer;