import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/slices/authSlice';
import { Button, Input, Alert, Icon } from '../../atoms';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const mockUsers = [
    { email: 'admin@company.com', password: 'admin123', role: 'admin' as const, name: 'Admin User', department: 'IT' },
    { email: 'manager@company.com', password: 'manager123', role: 'manager' as const, name: 'John Manager', department: 'Procurement' },
    { email: 'employee@company.com', password: 'employee123', role: 'employee' as const, name: 'Jane Employee', department: 'Operations' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API delay
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        dispatch(loginSuccess({
          id: Math.random().toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
        }));
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (userType: string) => {
    const user = mockUsers.find(u => u.role === userType);
    if (user) {
      setLoading(true);
      setError('');
      
      // Set credentials and immediately authenticate
      setCredentials({ email: user.email, password: user.password });
      
      // Simulate API delay and authenticate
      setTimeout(() => {
        dispatch(loginSuccess({
          id: Math.random().toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department
        }));
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Icon name="document" size="xl" color="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Purchase Order System
          </h1>
          <p className="text-gray-600">
            Sign in to manage your purchase orders
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert
                variant="error"
                title="Login Failed"
                description={error}
                className="mb-4"
              />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Quick Login Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Quick login for demo:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                className="text-xs"
              >
                Admin
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickLogin('manager')}
                disabled={loading}
                className="text-xs"
              >
                Manager
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleQuickLogin('employee')}
                disabled={loading}
                className="text-xs"
              >
                Employee
              </Button>
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Demo Credentials:</strong><br />
              Admin: admin@company.com / admin123<br />
              Manager: manager@company.com / manager123<br />
              Employee: employee@company.com / employee123
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Purchase Order Management System v1.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;