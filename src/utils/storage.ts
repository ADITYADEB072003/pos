import { Product, Sale, User } from '../types';

const STORAGE_KEYS = {
  products: 'pos_products',
  sales: 'pos_sales',
  users: 'pos_users',
  currentUser: 'pos_current_user',
};

// Sample data initialization
export const initializeSampleData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Coffee Beans',
        sku: 'COF001',
        barcode: '1234567890123',
        price: 24.99,
        cost: 12.00,
        category: 'Beverages',
        quantity: 50,
        minStock: 10,
        description: 'High-quality arabica coffee beans',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Organic Green Tea',
        sku: 'TEA001',
        barcode: '1234567890124',
        price: 15.99,
        cost: 7.50,
        category: 'Beverages',
        quantity: 30,
        minStock: 5,
        description: 'Premium organic green tea leaves',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Artisan Chocolate Bar',
        sku: 'CHO001',
        barcode: '1234567890125',
        price: 8.99,
        cost: 4.50,
        category: 'Confectionery',
        quantity: 75,
        minStock: 15,
        description: 'Hand-crafted dark chocolate bar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Fresh Croissant',
        sku: 'BAK001',
        barcode: '1234567890126',
        price: 3.50,
        cost: 1.25,
        category: 'Bakery',
        quantity: 12,
        minStock: 20,
        description: 'Freshly baked butter croissant',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '5',
        name: 'Gourmet Sandwich',
        sku: 'SAN001',
        barcode: '1234567890127',
        price: 12.99,
        cost: 6.00,
        category: 'Food',
        quantity: 25,
        minStock: 10,
        description: 'Premium deli sandwich with fresh ingredients',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(sampleProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    const sampleUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@posstore.com',
        role: 'admin',
        name: 'Store Manager',
        createdAt: new Date(),
      },
      {
        id: '2',
        username: 'staff1',
        email: 'staff1@posstore.com',
        role: 'staff',
        name: 'Sales Associate',
        createdAt: new Date(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(sampleUsers));
  }
};

export const getProducts = (): Product[] => {
  const products = localStorage.getItem(STORAGE_KEYS.products);
  return products ? JSON.parse(products) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
};

export const getSales = (): Sale[] => {
  const sales = localStorage.getItem(STORAGE_KEYS.sales);
  return sales ? JSON.parse(sales) : [];
};

export const saveSales = (sales: Sale[]) => {
  localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.users);
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.currentUser);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }
};