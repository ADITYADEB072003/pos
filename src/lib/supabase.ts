import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'staff';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'staff';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'staff';
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          sku: string;
          barcode: string;
          price: number;
          cost: number;
          category: string;
          quantity: number;
          min_stock: number;
          description: string;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sku: string;
          barcode: string;
          price: number;
          cost: number;
          category: string;
          quantity: number;
          min_stock: number;
          description: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sku?: string;
          barcode?: string;
          price?: number;
          cost?: number;
          category?: string;
          quantity?: number;
          min_stock?: number;
          description?: string;
          image_url?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          items: any;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          payment_method: 'cash' | 'card' | 'upi';
          cash_received?: number;
          change?: number;
          staff_id: string;
          staff_name: string;
          receipt_number: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          items: any;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          payment_method: 'cash' | 'card' | 'upi';
          cash_received?: number;
          change?: number;
          staff_id: string;
          staff_name: string;
          receipt_number: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          items?: any;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          payment_method?: 'cash' | 'card' | 'upi';
          cash_received?: number;
          change?: number;
          staff_id?: string;
          staff_name?: string;
          receipt_number?: string;
        };
      };
    };
  };
}