import React, { useState, useEffect, Suspense, lazy } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Sidebar } from './components/layout/Sidebar';
import { Product, Sale } from './types';
import { authService, AuthUser } from './services/authService';
import { productService } from './services/productService';
import { salesService } from './services/salesService';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const POSTerminal = lazy(() => import('./components/pos/POSTerminal').then(module => ({ default: module.POSTerminal })));
const InventoryManagement = lazy(() => import('./components/inventory/InventoryManagement').then(module => ({ default: module.InventoryManagement })));
const SalesReports = lazy(() => import('./components/sales/SalesReports').then(module => ({ default: module.SalesReports })));
const UserManagement = lazy(() => import('./components/users/UserManagement').then(module => ({ default: module.UserManagement })));
const Settings = lazy(() => import('./components/settings/Settings').then(module => ({ default: module.Settings })));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

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

  // Real-time data synchronization
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(async () => {
      try {
        const [productsData, salesData] = await Promise.all([
          productService.getProducts(),
          salesService.getSales()
        ]);
        setProducts(productsData);
        setSales(salesData);
      } catch (error) {
        console.error('Error syncing data:', error);
      }
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

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
      // Refresh products to get updated quantities
      const updatedProducts = await productService.getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error creating sale:', error);
      alert('Failed to process sale');
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userRole={currentUser.role}
      />
      
      <div className="flex-1 overflow-hidden lg:ml-0">
        <div className="h-full overflow-y-auto">
          <Suspense fallback={<LoadingSpinner />}>
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
            
            {activeTab === 'users' && currentUser.role === 'admin' && (
              <UserManagement />
            )}
            
            {activeTab === 'settings' && currentUser.role === 'admin' && (
              <Settings />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default App;