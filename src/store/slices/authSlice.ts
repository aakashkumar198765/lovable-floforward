import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Thunk action for login
export const login = (userData: User) => {
  return (dispatch: any) => {
    dispatch(loginStart());
    // Simulate API call
    setTimeout(() => {
      dispatch(loginSuccess(userData));
    }, 500);
  };
};

export default authSlice.reducer;

// Mock users for authentication
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'John Admin',
    role: 'admin',
    department: 'IT',
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Sarah Manager',
    role: 'manager',
    department: 'Procurement',
  },
  {
    id: '3',
    email: 'employee@company.com',
    name: 'Mike Employee',
    role: 'employee',
    department: 'Operations',
  },
];