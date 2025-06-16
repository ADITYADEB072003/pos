import React, { useState, useMemo } from 'react';
import { Sale } from '../../types';
import { format } from 'date-fns';
import { Search, Filter, Download, Eye } from 'lucide-react';

interface SalesHistoryProps {
  sales: Sale[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = useMemo(() => {
    return sales
      .filter(sale => {
        const matchesSearch = sale.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             sale.staffName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPayment = paymentFilter === 'All' || sale.paymentMethod === paymentFilter.toLowerCase();
        
        let matchesDate = true;
        if (dateFilter !== 'All') {
          const saleDate = new Date(sale.timestamp);
          const today = new Date();
          
          switch (dateFilter) {
            case 'Today':
              matchesDate = format(saleDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              break;
            case 'This Week':
              const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesDate = saleDate >= weekAgo;
              break;
            case 'This Month':
              matchesDate = saleDate.getMonth() === today.getMonth() && 
                           saleDate.getFullYear() === today.getFullYear();
              break;
          }
        }
        
        return matchesSearch && matchesPayment && matchesDate;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [sales, searchTerm, paymentFilter, dateFilter]);

  const handleExport = () => {
    // In a real application, you would generate a CSV/PDF export here
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Receipt # or staff name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Time</option>
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Sales History ({filteredSales.length} transactions)
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Receipt #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Staff</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {sale.receiptNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(sale.timestamp), 'MMM dd, yyyy hh:mm aa')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.staffName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sale.items.length} items
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    ${sale.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sales found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Sale Details Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sale Details</h3>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Receipt Number</p>
                <p className="font-semibold">{selectedSale.receiptNumber}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold">
                  {format(new Date(selectedSale.timestamp), 'MMM dd, yyyy hh:mm aa')}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Items</p>
                <div className="space-y-2 mt-1">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.quantity}× {item.product.name}</span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subtotal:</span>
                  <span>${selectedSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tax:</span>
                  <span>${selectedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${selectedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};