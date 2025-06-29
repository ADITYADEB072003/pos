import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userRole: 'admin' | 'staff';
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff'] },
  { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['admin', 'staff'] },
  { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin'] },
  { id: 'sales', label: 'Sales Reports', icon: BarChart3, roles: ['admin', 'staff'] },
  { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  userRole 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white border-r border-gray-200 w-64 flex flex-col h-full
        fixed lg:relative z-40 lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">POS System</h1>
              <p className="text-sm text-gray-500 capitalize">{userRole} Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};