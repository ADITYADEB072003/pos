import React, { useState, useMemo } from 'react';
import { Sale } from '../../types';
import { calculateDailySales } from '../../utils/analytics';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Calendar, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

interface DailySalesViewProps {
  sales: Sale[];
}

export const DailySalesView: React.FC<DailySalesViewProps> = ({ sales }) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const dailySales = useMemo(() => 
    calculateDailySales(sales, new Date(selectedDate)), [sales, selectedDate]
  );

  const dayTransactions = useMemo(() => {
    const dayStart = startOfDay(new Date(selectedDate));
    const dayEnd = endOfDay(new Date(selectedDate));
    
    return sales.filter(sale => 
      isWithinInterval(new Date(sale.timestamp), { start: dayStart, end: dayEnd })
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sales, selectedDate]);

  const stats = [
    {
      label: 'Total Sales',
      value: `$${dailySales.totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500'
    },
    {
      label: 'Total Orders',
      value: dailySales.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      label: 'Average Order',
      value: `$${dailySales.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Daily Sales Report</h2>
            <p className="text-gray-600">Select a date to view sales performance</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Top Products */}
      {dailySales.topProducts.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products Today</h3>
          <div className="space-y-3">
            {dailySales.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.quantity} sold</p>
                  <p className="text-sm text-emerald-600">${product.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transactions ({dayTransactions.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {dayTransactions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No transactions found for this date</p>
            </div>
          ) : (
            dayTransactions.map((sale) => (
              <div key={sale.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Receipt #{sale.receiptNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(sale.timestamp), 'hh:mm aa')} • {sale.staffName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${sale.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 capitalize">{sale.paymentMethod}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {sale.items.map((item, index) => (
                    <span key={index}>
                      {item.quantity}× {item.product.name}
                      {index < sale.items.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};