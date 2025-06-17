import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Sale, Product, User } from '../../types';
import { 
  calculateDailySales, 
  getWeeklySales, 
  getLowStockProducts,
  getTopSellingProducts 
} from '../../utils/analytics';
import { SalesChart } from './SalesChart';
import { TopProducts } from './TopProducts';
import { LowStockAlerts } from './LowStockAlerts';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  currentUser: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  sales, 
  products, 
  currentUser 
}) => {
  const todaysSales = useMemo(() => 
    calculateDailySales(sales, new Date()), [sales]
  );
  
  const weeklySales = useMemo(() => getWeeklySales(sales), [sales]);
  const lowStockProducts = useMemo(() => getLowStockProducts(products), [products]);
  const topProducts = useMemo(() => getTopSellingProducts(sales, 5), [sales]);

  const totalInventoryValue = useMemo(() => 
    products.reduce((sum, product) => sum + (product.price * product.quantity), 0),
    [products]
  );

  const stats = [
    {
      label: "Today's Sales",
      value: `$${todaysSales.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      change: '+12.5%'
    },
    {
      label: 'Orders Today',
      value: todaysSales.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      label: 'Products in Stock',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-purple-500',
      change: '+2.1%'
    },
    {
      label: 'Inventory Value',
      value: `$${totalInventoryValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+5.7%'
    },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} rounded-lg p-2 lg:p-3`}>
                  <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <span className="text-emerald-500 text-xs lg:text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="lg:col-span-2">
          <SalesChart data={weeklySales} />
        </div>
        <div>
          <LowStockAlerts products={lowStockProducts} />
        </div>
      </div>

      {/* Top Products */}
      <TopProducts products={topProducts} />
    </div>
  );
};

export default Dashboard;