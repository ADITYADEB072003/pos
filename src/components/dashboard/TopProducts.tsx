import React from 'react';
import { TrendingUp, Package } from 'lucide-react';

interface TopProductsProps {
  products: Array<{
    product: any;
    quantity: number;
    revenue: number;
  }>;
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Top Selling Products</h2>
          <p className="text-gray-600 text-sm">Best performers by quantity sold</p>
        </div>
        <TrendingUp className="h-6 w-6 text-blue-500" />
      </div>

      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No sales data available</p>
          </div>
        ) : (
          products.map((item, index) => (
            <div key={item.product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{item.quantity} sold</p>
                <p className="text-sm text-emerald-600">${item.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};