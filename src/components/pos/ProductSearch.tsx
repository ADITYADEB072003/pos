import React, { useState, useMemo, useCallback } from 'react';
import { Search, Package, Plus, Barcode, Scan } from 'lucide-react';
import { Product } from '../../types';

interface ProductSearchProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ 
  products, 
  onAddToCart 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Debounced search for better performance
  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
    
    setSearchTimeout(timeout);
  }, [searchTimeout]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleBarcodeSearch = () => {
    // In a real app, this would integrate with a barcode scanner
    const barcode = prompt('Enter barcode:');
    if (barcode) {
      const product = products.find(p => p.barcode === barcode);
      if (product) {
        onAddToCart(product, 1);
      } else {
        alert('Product not found');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, SKU, or barcode..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleBarcodeSearch}
            className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 justify-center lg:w-auto"
          >
            <Scan className="h-5 w-5" />
            <span className="hidden lg:inline">Scan</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-gray-100 rounded-lg p-2">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.quantity > product.minStock 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : product.quantity > 0
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.quantity} in stock
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm lg:text-base min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{product.category}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center text-xs text-gray-500">
                <Barcode className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[60px]">{product.sku}</span>
              </div>
            </div>
            
            <button
              onClick={() => onAddToCart(product, 1)}
              disabled={product.quantity === 0}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};