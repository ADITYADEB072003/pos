import React, { useState } from 'react';
import { Product, User } from '../../types';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { Plus } from 'lucide-react';

interface InventoryManagementProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  currentUser: User;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct,
  currentUser
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddProduct(productData);
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        ...productData,
        updatedAt: new Date()
      });
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your products and stock levels</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={onDeleteProduct}
      />

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};