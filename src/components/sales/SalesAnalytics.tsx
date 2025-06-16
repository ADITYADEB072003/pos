import React, { useMemo } from 'react';
import { Sale } from '../../types';
import { getWeeklySales, getMonthlySales, getTopSellingProducts } from '../../utils/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SalesAnalyticsProps {
  sales: Sale[];
}

export const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ sales }) => {
  const weeklySales = useMemo(() => getWeeklySales(sales), [sales]);
  const monthlySales = useMemo(() => getMonthlySales(sales), [sales]);
  const topProducts = useMemo(() => getTopSellingProducts(sales, 10), [sales]);

  const paymentMethodData = useMemo(() => {
    const methods = sales.reduce((acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(methods).map(([method, count]) => ({
      name: method.charAt(0).toUpperCase() + method.slice(1),
      value: count,
    }));
  }, [sales]);

  const COLORS = ['#2563eb', '#10b981', '#f97316', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Sales Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-3">
          {topProducts.map((item, index) => (
            <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-600">{item.product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.quantity} units sold</p>
                <p className="text-sm text-emerald-600">${item.revenue.toFixed(2)} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};