import React, { useState, useCallback } from 'react';
import { DashboardLayoutProps } from '../../../types';
import { ChevronRight, Menu, Bell } from 'lucide-react';

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  id,
  title = 'Dashboard',
  headerContent,
  sidebarContent,
  footerContent,
  sidebarPosition = 'left',
  sidebarWidth = 'w-64',
  sidebarCollapsible = true,
  headerHeight = 'h-16',
  footerHeight = 'h-12',
  showBreadcrumb = true,
  breadcrumbItems = [],
  metrics = [],
  quickActions = [],
  notifications = [],
  size = 'md',
  theme = 'light',
  responsive = true,
  onSidebarToggle,
  onNotificationClick,
  onQuickAction,
  onMetricClick,
  className = '',
  style = {},
  children,
  allowedActions = [],
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSidebarToggle = useCallback(() => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    onSidebarToggle?.(newCollapsed);
  }, [sidebarCollapsed, onSidebarToggle]);

  const handleNotificationClick = useCallback((notification: any) => {
    onNotificationClick?.(notification);
    setShowNotifications(false);
  }, [onNotificationClick]);

  const handleQuickAction = useCallback((action: any) => {
    onQuickAction?.(action);
  }, [onQuickAction]);

  const handleMetricClick = useCallback((metric: any) => {
    onMetricClick?.(metric);
  }, [onMetricClick]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const themeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    auto: 'bg-gray-50 dark:bg-gray-900 dark:text-white'
  };

  const getSidebarClasses = () => {
    const baseClasses = `fixed top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40`;
    const positionClasses = sidebarPosition === 'right' ? 'right-0' : 'left-0';
    const widthClasses = sidebarCollapsed ? 'w-16' : sidebarWidth;
    
    return `${baseClasses} ${positionClasses} ${widthClasses}`;
  };

  const getMainContentClasses = () => {
    const baseClasses = 'flex-1 flex flex-col min-h-screen transition-all duration-300';
    const marginClass = sidebarPosition === 'right' 
      ? (sidebarCollapsed ? 'mr-16' : `mr-64`) 
      // : (sidebarCollapsed ? 'ml-16' : `ml-64`); //comment for demo
      : (sidebarCollapsed ? 'ml-0' : `ml-64`);
    
    return responsive ? `${baseClasses} ${marginClass} md:${marginClass} lg:${marginClass}` : `${baseClasses} ${marginClass}`;
  };

  const renderBreadcrumb = () => {
    if (!showBreadcrumb || breadcrumbItems.length === 0) return null;

    return (
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight className="w-6 h-6 text-gray-400" />
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className={`${index === breadcrumbItems.length - 1 ? 'text-gray-500' : 'text-blue-600 hover:text-blue-800'} text-sm font-medium`}
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-500 text-sm font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const renderMetrics = () => {
    if (metrics.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleMetricClick(metric)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                {metric.change && (
                  <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </p>
                )}
              </div>
              {metric.icon && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">{metric.icon}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderQuickActions = () => {
    if (quickActions.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={action.disabled || !allowedActions.includes(action.id)}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <header className={`${headerHeight} bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm`}>
      <div className="flex items-center space-x-4">
        {sidebarCollapsible && (
          <button
            onClick={handleSidebarToggle}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white relative"
            >
              <Bell className="w-6 h-6" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                      {notification.timestamp && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom header content */}
        {headerContent}
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className={getSidebarClasses()}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {/* {sidebarContent || ( //comment for demo */} 
          {!sidebarCollapsed && (sidebarContent || (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                {sidebarCollapsed ? '☰' : 'Navigation'}
              </div>
              {/* Default navigation items would go here */}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );

  const renderFooter = () => {
    if (!footerContent) return null;

    return (
      <footer className={`${footerHeight} bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center px-6`}>
        {footerContent}
      </footer>
    );
  };

  return (
    <div
      id={id}
      className={`dashboard-layout ${sizeClasses[size]} ${themeClasses[theme]} ${className}`}
      style={style}
      role="main"
      aria-label="Dashboard Layout"
    >
      {/* Added !sidebarcollapsed for demo */}
      {!sidebarCollapsed && renderSidebar()}
      
      <div className={getMainContentClasses()}>
        {renderHeader()}
        
        <main className="flex-1 p-6 overflow-y-auto">
          {renderBreadcrumb()}
          {renderMetrics()}
          {renderQuickActions()}
          
          <div className="min-h-full">
            {children}
          </div>
        </main>
        
        {renderFooter()}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {responsive && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={handleSidebarToggle}
        />
      )}
    </div>
  );
};

export default DashboardLayout;