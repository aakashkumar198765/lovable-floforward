import React, { useState, useMemo, useCallback } from 'react';
import { UserManagerProps } from '../../../types';
import { Search } from 'lucide-react';
import Button from '../../atoms/form/Button';
import Input from '../../atoms/form/Input';
import Select from '../../atoms/form/Select';
import Checkbox from '../../atoms/form/Checkbox';
import Badge from '../../atoms/display/Badge';
import Icon from '../../atoms/display/Icon';
import Modal from '../../atoms/feedback/Modal';

export const UserManager: React.FC<UserManagerProps> = ({
  id,
  title = 'User Management',
  users = [],
  roles = [],
  permissions = [],
  layout = 'table',
  searchable = true,
  filterable = true,
  bulkActions = true,
  inviteUsers = true,
  importable = true,
  exportable = true,
  size = 'md',
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserInvite,
  onRoleAssign,
  onPermissionGrant,
  onStatusChange,
  className = '',
  style = {},
  allowedActions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'username' | 'email' | 'firstName' | 'lastName' | 'status' | 'lastLogin'>('username');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesRole = !roleFilter || user.roles?.includes(roleFilter);
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Sort users
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aValue: any = a[sortBy] || '';
      let bValue: any = b[sortBy] || '';

      if (sortBy === 'lastLogin') {
        const aTime = new Date(a.lastLogin || '').getTime();
        const bTime = new Date(b.lastLogin || '').getTime();
        aValue = aTime;
        bValue = bTime;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredUsers, sortBy, sortDirection]);

  const handleUserSelect = useCallback((userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedUsers(selected ? sortedUsers.map(u => u.id!).filter(Boolean) : []);
  }, [sortedUsers]);

  const handleBulkAction = useCallback((action: string) => {
    console.log(`Bulk action: ${action} on users:`, selectedUsers);
    
    switch (action) {
      case 'activate':
        selectedUsers.forEach(userId => {
          onStatusChange?.(userId, 'active');
        });
        break;
      case 'deactivate':
        selectedUsers.forEach(userId => {
          onStatusChange?.(userId, 'inactive');
        });
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
          selectedUsers.forEach(userId => {
            onUserDelete?.(userId);
          });
        }
        break;
    }
    
    setSelectedUsers([]);
  }, [selectedUsers, onStatusChange, onUserDelete]);

  const handleCreateUser = useCallback((userData: any) => {
    onUserCreate?.(userData);
    setShowCreateModal(false);
  }, [onUserCreate]);

  const handleUpdateUser = useCallback((userId: string, userData: any) => {
    onUserUpdate?.(userId, userData);
    setEditingUser(null);
  }, [onUserUpdate]);

  const handleInviteUser = useCallback((inviteData: any) => {
    onUserInvite?.(inviteData);
    setShowInviteModal(false);
  }, [onUserInvite]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderSearchAndFilters = () => {
    if (!searchable && !filterable) return null;

    return (
      <div className="mb-6 space-y-4">
        {searchable && (
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-gray-400" />}
              className="w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}

        {filterable && (
          <div className="flex flex-wrap gap-4">
            <Select
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as string)}
              options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'pending', label: 'Pending' }
              ]}
              size="sm"
            />

            <Select
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as string)}
              options={[
                { value: '', label: 'All Roles' },
                ...roles.map(role => ({ value: role.id!, label: role.name! }))
              ]}
              size="sm"
            />

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                options={[
                  { value: 'username', label: 'Username' },
                  { value: 'email', label: 'Email' },
                  { value: 'firstName', label: 'First Name' },
                  { value: 'lastName', label: 'Last Name' },
                  { value: 'status', label: 'Status' },
                  { value: 'lastLogin', label: 'Last Login' }
                ]}
                size="sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="text-gray-600 hover:text-gray-900"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBulkActions = () => {
    if (!bulkActions || selectedUsers.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex space-x-2">
            {allowedActions.includes('activate_users') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBulkAction('activate')}
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
              >
                Activate
              </Button>
            )}
            {allowedActions.includes('deactivate_users') && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBulkAction('deactivate')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
              >
                Deactivate
              </Button>
            )}
            {allowedActions.includes('delete_users') && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                Delete
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedUsers([])}
              className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderTableLayout = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {bulkActions && (
                <th className="px-6 py-3 text-left">
                  <Checkbox
                    checked={selectedUsers.length === sortedUsers.length && sortedUsers.length > 0}
                    onChange={(checked) => handleSelectAll(checked)}
                    size="sm"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                {bulkActions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedUsers.includes(user.id!)}
                      onChange={(checked) => handleUserSelect(user.id!, checked)}
                      size="sm"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={user.email}>{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="secondary" size="xs" className={getStatusColor(user.status || '')}>
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.slice(0, 2).map(roleId => {
                      const role = roles.find(r => r.id === roleId);
                      return role ? (
                        <Badge key={roleId} variant="primary" size="xs" className="bg-blue-100 text-blue-800 truncate max-w-24">
                          {role.name}
                        </Badge>
                      ) : null;
                    })}
                    {(user.roles?.length || 0) > 2 && (
                      <Badge variant="secondary" size="xs" className="bg-gray-100 text-gray-600">
                        +{(user.roles?.length || 0) - 2} more
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {allowedActions.includes('edit_users') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Button>
                    )}
                    {allowedActions.includes('change_user_status') && user.status !== 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange?.(user.id!, 'active')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Activate
                      </Button>
                    )}
                    {allowedActions.includes('change_user_status') && user.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStatusChange?.(user.id!, 'inactive')}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Deactivate
                      </Button>
                    )}
                    {allowedActions.includes('delete_users') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            onUserDelete?.(user.id!);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCardsLayout = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedUsers.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              {user.avatar ? (
                <img className="h-12 w-12 rounded-full" src={user.avatar} alt="" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-700">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
              </div>
              {bulkActions && (
                <Checkbox
                  checked={selectedUsers.includes(user.id!)}
                  onChange={(checked) => handleUserSelect(user.id!, checked)}
                  size="sm"
                />
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                <strong>Email:</strong> {user.email}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Status:</strong>
                <Badge variant="secondary" size="xs" className={`ml-2 ${getStatusColor(user.status || '')}`}>
                  {user.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Roles:</div>
              <div className="flex flex-wrap gap-1">
                {user.roles?.map(roleId => {
                  const role = roles.find(r => r.id === roleId);
                  return role ? (
                    <Badge key={roleId} variant="primary" size="xs" className="bg-blue-100 text-blue-800">
                      {role.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              {allowedActions.includes('edit_users') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditingUser(user)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                >
                  Edit
                </Button>
              )}
              {allowedActions.includes('change_user_status') && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStatusChange?.(user.id!, user.status === 'active' ? 'inactive' : 'active')}
                  className={`flex-1 text-white ${
                    user.status === 'active' 
                      ? 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600' 
                      : 'bg-green-600 hover:bg-green-700 border-green-600'
                  }`}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListLayout = () => {
    return (
      <div className="space-y-4">
        {sortedUsers.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {bulkActions && (
                  <Checkbox
                    checked={selectedUsers.includes(user.id!)}
                    onChange={(checked) => handleUserSelect(user.id!, checked)}
                    size="sm"
                  />
                )}
                {user.avatar ? (
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email} • @{user.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="secondary" size="xs" className={getStatusColor(user.status || '')}>
                  {user.status}
                </Badge>
                
                <div className="flex space-x-2">
                  {allowedActions.includes('edit_users') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (sortedUsers.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter || roleFilter 
              ? 'Try adjusting your search filters.' 
              : 'Get started by creating your first user.'}
          </p>
          {allowedActions.includes('create_users') && (
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            >
              Create User
            </Button>
          )}
        </div>
      );
    }

    switch (layout) {
      case 'cards': return renderCardsLayout();
      case 'list': return renderListLayout();
      default: return renderTableLayout();
    }
  };

  return (
    <div
      id={id}
      className={`user-manager ${sizeClasses[size]} ${className}`}
      style={style}
      role="region"
      aria-label="User Management"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          {exportable && <Button
            variant="primary"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            Export
          </Button>}
          {importable && <Button
            variant="primary"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
          >
            Import
          </Button>}
          {inviteUsers && allowedActions.includes('invite_users') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowInviteModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
            >
              Invite User
            </Button>
          )}
          {allowedActions.includes('create_users') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
            >
              Create User
            </Button>
          )}
        </div>
      </div>

      {renderSearchAndFilters()}
      {renderBulkActions()}
      {renderContent()}

      {/* Modals (simplified placeholders) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Create New User</h3>
            <p className="text-gray-600 mb-4">Create user form would go here...</p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleCreateUser({ username: 'newuser' })}
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;