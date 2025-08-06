import React, { useState, useMemo, useCallback } from 'react';
import { RoleManagerProps } from '../../../types';
import { Search } from 'lucide-react';

export const RoleManager: React.FC<RoleManagerProps> = ({
  id,
  title = 'Role Management',
  roles = [],
  permissions = [],
  layout = 'table',
  hierarchical = false,
  searchable = true,
  cloneable = true,
  size = 'md',
  showPermissionMatrix = false,
  onRoleCreate,
  onRoleUpdate,
  onRoleDelete,
  onRoleClone,
  onPermissionChange,
  className = '',
  style = {},
  allowedActions = [],
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [expandedRoles, setExpandedRoles] = useState<Set<string>>(new Set());
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'userCount' | 'createdAt' | 'updatedAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Group permissions by category
  const permissionsByCategory = useMemo(() => {
    const groups: { [category: string]: typeof permissions } = {};
    permissions.forEach(permission => {
      const category = permission.category || 'General';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });
    return groups;
  }, [permissions]);

  // Filter roles based on search and filters
  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch = !searchTerm || 
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !typeFilter || role.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [roles, searchTerm, typeFilter]);

  // Sort roles
  const sortedRoles = useMemo(() => {
    return [...filteredRoles].sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        const aTime = new Date(a[sortBy] || '').getTime();
        const bTime = new Date(b[sortBy] || '').getTime();
        aValue = aTime;
        bValue = bTime;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredRoles, sortBy, sortDirection]);

  const handleRoleSelect = useCallback((roleId: string, selected: boolean) => {
    setSelectedRoles(prev => 
      selected 
        ? [...prev, roleId]
        : prev.filter(id => id !== roleId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedRoles(selected ? sortedRoles.map(r => r.id!).filter(Boolean) : []);
  }, [sortedRoles]);

  const handleCreateRole = useCallback((roleData: any) => {
    onRoleCreate?.(roleData);
    setShowCreateModal(false);
  }, [onRoleCreate]);

  const handleUpdateRole = useCallback((roleId: string, roleData: any) => {
    onRoleUpdate?.(roleId, roleData);
    setEditingRole(null);
  }, [onRoleUpdate]);

  const handleCloneRole = useCallback((roleId: string, newName: string) => {
    onRoleClone?.(roleId, newName);
  }, [onRoleClone]);

  const handlePermissionToggle = useCallback((roleId: string, permissionId: string, granted: boolean) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const currentPermissions = role.permissions || [];
    const newPermissions = granted
      ? [...currentPermissions, permissionId]
      : currentPermissions.filter(id => id !== permissionId);

    onPermissionChange?.(roleId, newPermissions);
  }, [roles, onPermissionChange]);

  const toggleRoleExpansion = useCallback((roleId: string) => {
    setExpandedRoles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roleId)) {
        newSet.delete(roleId);
      } else {
        newSet.add(roleId);
      }
      return newSet;
    });
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-blue-600 bg-blue-100';
      case 'custom': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPermissionTypeColor = (type: string) => {
    switch (type) {
      case 'read': return 'text-green-600 bg-green-100';
      case 'write': return 'text-yellow-600 bg-yellow-100';
      case 'delete': return 'text-red-600 bg-red-100';
      case 'admin': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderSearchAndFilters = () => {
    if (!searchable) return null;

    return (
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="system">System</option>
            <option value="custom">Custom</option>
          </select>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="userCount">User Count</option>
              <option value="createdAt">Created</option>
              <option value="updatedAt">Updated</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-2 text-gray-600 hover:text-gray-900"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {showPermissionMatrix && (
            <button
              onClick={() => setShowMatrixModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              📊 Permission Matrix
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderRolePermissions = (role: any) => {
    const rolePermissions = role.permissions || [];
    
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Permissions ({rolePermissions.length})</h4>
        
        {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
          <div key={category} className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">{category}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {categoryPermissions.map(permission => {
                const isGranted = rolePermissions.includes(permission.id!);
                return (
                  <label key={permission.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isGranted}
                      onChange={(e) => handlePermissionToggle(role.id!, permission.id!, e.target.checked)}
                      disabled={!allowedActions.includes('manage_permissions') || role.type === 'system'}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{permission.name}</span>
                    <span className={`px-1 py-0.5 text-xs rounded ${getPermissionTypeColor(permission.type || '')}`}>
                      {permission.type}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableLayout = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRoles.length === sortedRoles.length && sortedRoles.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRoles.map((role) => (
              <React.Fragment key={role.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id!)}
                      onChange={(e) => handleRoleSelect(role.id!, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{role.name}</div>
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(role.type || '')}`}>
                      {role.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="truncate">{role.userCount || 0}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <span className="truncate">{(role.permissions || []).length} permissions</span>
                      <button
                        onClick={() => toggleRoleExpansion(role.id!)}
                        className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                      >
                        {expandedRoles.has(role.id!) ? '▼' : '▶'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {allowedActions.includes('edit_roles') && (
                        <button
                          onClick={() => setEditingRole(role)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      )}
                      {cloneable && allowedActions.includes('clone_roles') && (
                        <button
                          onClick={() => {
                            const newName = prompt('Enter new role name:', `${role.name} (Copy)`);
                            if (newName) handleCloneRole(role.id!, newName);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Clone
                        </button>
                      )}
                      {allowedActions.includes('delete_roles') && role.type !== 'system' && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this role?')) {
                              onRoleDelete?.(role.id!);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                
                {expandedRoles.has(role.id!) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      {renderRolePermissions(role)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCardsLayout = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRoles.map((role) => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(role.type || '')}`}>
                    {role.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
              </div>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.id!)}
                onChange={(e) => handleRoleSelect(role.id!, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">
                <strong>Users:</strong> {role.userCount || 0}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Permissions:</strong> {(role.permissions || []).length}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Created:</strong> {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => toggleRoleExpansion(role.id!)}
                className="w-full text-left text-sm text-blue-600 hover:text-blue-800 mb-3"
              >
                {expandedRoles.has(role.id!) ? '▼ Hide Permissions' : '▶ Show Permissions'}
              </button>
              
              {expandedRoles.has(role.id!) && renderRolePermissions(role)}
            </div>

            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              {allowedActions.includes('edit_roles') && (
                <button
                  onClick={() => setEditingRole(role)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
              {cloneable && allowedActions.includes('clone_roles') && (
                <button
                  onClick={() => {
                    const newName = prompt('Enter new role name:', `${role.name} (Copy)`);
                    if (newName) handleCloneRole(role.id!, newName);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Clone
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTreeLayout = () => {
    // Simplified tree view - in a real implementation, this would handle hierarchical relationships
    return (
      <div className="space-y-4">
        {sortedRoles.map((role, index) => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">├─</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(role.type || '')}`}>
                    {role.type}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{role.userCount || 0} users</span>
                <span className="text-sm text-gray-600">{(role.permissions || []).length} permissions</span>
                
                <div className="flex space-x-2">
                  {allowedActions.includes('edit_roles') && (
                    <button
                      onClick={() => setEditingRole(role)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPermissionMatrix = () => {
    if (!showMatrixModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl max-h-[80vh] overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Permission Matrix</h3>
            <button
              onClick={() => setShowMatrixModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Permission
                  </th>
                  {roles.map(role => (
                    <th key={role.id} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map(permission => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{permission.name}</div>
                        <div className="text-xs text-gray-500">{permission.category}</div>
                      </div>
                    </td>
                    {roles.map(role => {
                      const hasPermission = (role.permissions || []).includes(permission.id!);
                      return (
                        <td key={`${role.id}-${permission.id}`} className="px-3 py-4 whitespace-nowrap text-center">
                          <span className={`inline-block w-4 h-4 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-gray-200'}`} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (sortedRoles.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛡️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || typeFilter 
              ? 'Try adjusting your search filters.' 
              : 'Get started by creating your first role.'}
          </p>
          {allowedActions.includes('create_roles') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Role
            </button>
          )}
        </div>
      );
    }

    switch (layout) {
      case 'cards': return renderCardsLayout();
      case 'tree': return renderTreeLayout();
      default: return renderTableLayout();
    }
  };

  return (
    <div
      id={id}
      className={`role-manager ${sizeClasses[size]} ${className}`}
      style={style}
      role="region"
      aria-label="Role Management"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-2">
          {/* Action buttons */}
          {allowedActions.includes('create_roles') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Create Role
            </button>
          )}
        </div>
      </div>

      {renderSearchAndFilters()}
      {renderContent()}
      {renderPermissionMatrix()}

      {/* Create Role Modal (simplified placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Create New Role</h3>
            <p className="text-gray-600 mb-4">Create role form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateRole({ name: 'New Role', type: 'custom' })}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManager;