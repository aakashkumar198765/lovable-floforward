import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';
import { RootState } from '../../../store';
import { Button, Avatar, Badge, Icon } from '../../atoms';
import { Menu } from '../../atoms';

interface PurchaseOrderLayoutProps {
  children: React.ReactNode;
}

const PurchaseOrderLayout: React.FC<PurchaseOrderLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  })

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', path: 'dashboard' },
    { id: 'orders', label: 'Purchase Orders', icon: 'document', path: 'orders' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: 'settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavigation = (path: string) => {
    navigate(`/purchase-order/${path}`, { replace: true });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Icon name="document" size="md" color="#3B82F6" />
            <span className="ml-2 text-lg font-semibold text-gray-900">PO System</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <Icon name="close" size="sm" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname.endsWith(item.path) || 
                (item.path === 'orders' && location.pathname.includes('/purchase-order/orders'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon name={item.icon} size="sm" className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-2 border-t border-gray-200">
          <div className="flex items-center">
            <Avatar 
              name={user?.name || 'User'} 
              size="sm" 
              status="online"
            />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
              title="Logout"
            >
              <Icon name="logout" size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4"
            >
              <Icon name="menu" size="md" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Purchase Order Management
              </h1>
              <Badge variant="secondary" color="primary" size="sm">
                July 2025
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Icon name="bell" size="sm" />
            </button>
            <button 
              onClick={() => navigate('/home')}
              className="text-gray-400 hover:text-gray-600"
              title="Back to Main Simulator"
            >
              <Icon name="arrow-left" size="sm" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-7.5rem)]">
          <div className="p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>© 2025 Purchase Order Management System</span>
            <span>Version 1.0</span>
          </div>
        </footer>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderLayout;