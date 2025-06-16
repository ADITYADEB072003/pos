export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  category: string;
  quantity: number;
  minStock: number;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  cashReceived?: number;
  change?: number;
  customerId?: string;
  staffId: string;
  staffName: string;
  timestamp: Date;
  receiptNumber: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff';
  name: string;
  createdAt: Date;
}

export interface DailySales {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
}

export interface LowStockAlert {
  product: Product;
  currentStock: number;
  minStock: number;
  deficit: number;
}