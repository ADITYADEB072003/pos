import React, { useState, useMemo } from 'react';
import { Search, Package, Plus, Barcode, Scan } from 'lucide-react';
import { Product } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { LazyImage } from '../common/LazyImage';

interface ProductSearchProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ 
  products, 
  onAddToCart 
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Debounce search input for better performance
  const debouncedSearch = useDebounce(searchInput, 300);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch && selectedCategory === 'All') {
      return products.slice(0, 20); // Show only first 20 products initially
    }

    return products.filter(product => {
      const matchesSearch = !debouncedSearch || 
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.sku.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.barcode.includes(debouncedSearch);
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).slice(0, 50); // Limit results to 50 for performance
  }, [products, debouncedSearch, selectedCategory]);

  const handleBarcodeSearch = () => {
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
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-40">
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
            className="bg-emerald-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2 justify-center"
          >
            <Scan className="h-5 w-5" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No products found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {!debouncedSearch && selectedCategory === 'All' && products.length > 20 && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Showing first 20 products. Use search to find specific items.
          </p>
        </div>
      )}
    </div>
  );
};

// Memoized product card component for better performance
const ProductCard = React.memo<{
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}>(({ product, onAddToCart }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center justify-between mb-2">
      <LazyImage
        src={product.image}
        alt={product.name}
        className="w-8 h-8"
        fallback={<Package className="h-5 w-5 text-gray-400" />}
      />
      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
        product.quantity > product.minStock 
          ? 'bg-emerald-100 text-emerald-700' 
          : product.quantity > 0
          ? 'bg-orange-100 text-orange-700'
          : 'bg-red-100 text-red-700'
      }`}>
        {product.quantity}
      </span>
    </div>
    
    <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2rem]">
      {product.name}
    </h3>
    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
    
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-bold text-gray-900">
        ${product.price.toFixed(2)}
      </span>
      <div className="flex items-center text-xs text-gray-500">
        <Barcode className="h-3 w-3 mr-1" />
        <span className="truncate max-w-[40px]">{product.sku}</span>
      </div>
    </div>
    
    <button
      onClick={() => onAddToCart(product, 1)}
      disabled={product.quantity === 0}
      className="w-full bg-blue-600 text-white py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-1"
    >
      <Plus className="h-3 w-3" />
      <span>{product.quantity === 0 ? 'Out' : 'Add'}</span>
    </button>
  </div>
));

ProductCard.displayName = 'ProductCard';