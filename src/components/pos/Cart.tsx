import React from 'react';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '../../types';

interface CartProps {
  items: CartItem[];
  total: {
    subtotal: number;
    tax: number;
    total: number;
  };
  onUpdateItem: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClear: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  total,
  onUpdateItem,
  onRemoveItem,
  onCheckout,
  onClear
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Current Order</h2>
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="flex items-center text-gray-600">
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span>{items.length} items</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Cart is empty</p>
            <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-600">{item.product.category}</p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateItem(item.product.id, item.quantity - 1)}
                      className="bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateItem(item.product.id, item.quantity + 1)}
                      className="bg-white border border-gray-300 rounded-md p-1 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${total.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (8%):</span>
              <span className="font-semibold">${total.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${total.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};