import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { POSTerminal } from './components/pos/POSTerminal';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { SalesReports } from './components/sales/SalesReports';
import { Product, Sale } from './types';
import { authService, AuthUser } from './services/authService';
import { productService } from './services/productService';
import { salesService } from './services/salesService';

function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          await loadData();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setDataLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadData();
      } else {
        setProducts([]);
        setSales([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, salesData] = await Promise.all([
        productService.getProducts(),
        salesService.getSales()
      ]);
      setProducts(productsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      setActiveTab('dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (email: string, password: string, name: string, role: 'admin' | 'staff') => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const user = await authService.signUp(email, password, name, role);
      setCurrentUser(user);
      setActiveTab('dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setActiveTab('dashboard');
      setProducts([]);
      setSales([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const product = await productService.updateProduct(updatedProduct);
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleSale = async (saleData: Omit<Sale, 'id' | 'timestamp'>) => {
    try {
      const sale = await salesService.createSale(saleData);
      setSales(prev => [sale, ...prev]);
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Failed to process sale');
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show auth forms
  if (!currentUser) {
    if (authMode === 'signup') {
      return (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => {
            setAuthMode('login');
            setAuthError('');
          }}
          error={authError}
          loading={authLoading}
        />
      );
    }

    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => {
          setAuthMode('signup');
          setAuthError('');
        }}
        error={authError}
        loading={authLoading}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />
      
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <Dashboard 
            sales={sales}
            products={products}
            currentUser={{
              id: currentUser.id,
              username: currentUser.email,
              email: currentUser.email,
              role: currentUser.role,
              name: currentUser.name,
              createdAt: new Date()
            }}
          />
        )}
        
        {activeTab === 'pos' && (
          <POSTerminal
            products={products}
            onSale={handleSale}
            onUpdateProduct={handleUpdateProduct}
            currentUser={{
              id: currentUser.id,
              username: currentUser.email,
              email: currentUser.email,
              role: currentUser.role,
              name: currentUser.name,
              createdAt: new Date()
            }}
          />
        )}
        
        {activeTab === 'inventory' && currentUser.role === 'admin' && (
          <InventoryManagement
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            currentUser={{
              id: currentUser.id,
              username: currentUser.email,
              email: currentUser.email,
              role: currentUser.role,
              name: currentUser.name,
              createdAt: new Date()
            }}
          />
        )}
        
        {activeTab === 'sales' && (
          <SalesReports
            sales={sales}
            currentUser={{
              id: currentUser.id,
              username: currentUser.email,
              email: currentUser.email,
              role: currentUser.role,
              name: currentUser.name,
              createdAt: new Date()
            }}
          />
        )}
        
        {(activeTab === 'users' || activeTab === 'settings') && currentUser.role === 'admin' && (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {activeTab === 'users' ? 'User Management' : 'Settings'}
              </h2>
              <p className="text-gray-600">This feature will be implemented in the next version.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;