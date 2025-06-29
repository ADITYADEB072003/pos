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

// Optimized loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
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
  const [dataError, setDataError] = useState('');

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
        setDataError('Failed to initialize authentication');
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

  // Optimized data synchronization - only sync when user is active
  useEffect(() => {
    if (!currentUser) return;

    let syncInterval: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadData(); // Sync when user returns to tab
        syncInterval = setInterval(loadData, 60000); // Sync every minute when active
      } else {
        clearInterval(syncInterval); // Stop syncing when tab is hidden
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    syncInterval = setInterval(loadData, 60000); // Initial sync interval

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(syncInterval);
    };
  }, [currentUser]);

  const loadData = async () => {
    try {
      setDataError('');
      const [productsData, salesData] = await Promise.all([
        productService.getProducts(),
        salesService.getSales()
      ]);
      setProducts(productsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setDataError('Failed to load data. Please check your connection and try again.');
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

  // Show error state if data failed to load
  if (dataError && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Retry
          </button>
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