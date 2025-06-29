import React, { useState, useEffect } from 'react';
import { User, Plus, Edit, Trash2, Shield, UserCheck, RefreshCw } from 'lucide-react';
import { authService } from '../../services/authService';
import { userService, UserProfile } from '../../services/userService';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff' as 'admin' | 'staff'
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      if (editingUser) {
        // Update user role
        await userService.updateUserRole(editingUser.id, formData.role);
        alert('User updated successfully!');
      } else {
        // Create new user
        await authService.signUp(formData.email, formData.password, formData.name, formData.role);
        alert('User created successfully!');
      }
      
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'staff' });
      await loadUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.message || 'Failed to save user');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        await userService.deleteUser(userId);
        alert('User deleted successfully!');
        await loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'staff' });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadUsers}
            className="bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 lg:px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 w-full lg:w-auto justify-center"
          >
            <Plus className="h-5 w-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first user account</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add First User</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-2 ${
                    user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {user.role === 'admin' ? (
                      <Shield className="h-5 w-5 text-purple-600" />
                    ) : (
                      <UserCheck className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors duration-200"
                    title="Edit user"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.name)}
                    className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors duration-200"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={formLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={editingUser || formLoading}
                />
                {editingUser && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>
              
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                    disabled={formLoading}
                    placeholder="Minimum 6 characters"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'staff' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={formLoading}
                >
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{editingUser ? 'Updating...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <span>{editingUser ? 'Update User' : 'Create User'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;