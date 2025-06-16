import React from 'react';
import { AlertTriangle, Package } from 'lucide-react';
import { Product } from '../../types';

interface LowStockAlertsProps {
  products: Product[];
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Low Stock Alerts</h2>
          <p className="text-gray-600 text-sm">Products running low</p>
        </div>
        <AlertTriangle className="h-6 w-6 text-orange-500" />
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-6">
            <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">All products well stocked!</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                <p className="text-xs text-gray-600">{product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-orange-600">
                  {product.quantity} left
                </p>
                <p className="text-xs text-gray-500">
                  Min: {product.minStock}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};