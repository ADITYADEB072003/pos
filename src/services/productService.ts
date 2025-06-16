import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(product => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        price: product.price,
        cost: product.cost,
        category: product.category,
        quantity: product.quantity,
        minStock: product.min_stock,
        description: product.description,
        image: product.image_url,
        createdAt: new Date(product.created_at),
        updatedAt: new Date(product.updated_at),
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price,
          cost: product.cost,
          category: product.category,
          quantity: product.quantity,
          min_stock: product.minStock,
          description: product.description,
          image_url: product.image,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        cost: data.cost,
        category: data.category,
        quantity: data.quantity,
        minStock: data.min_stock,
        description: data.description,
        image: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(product: Product): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          price: product.price,
          cost: product.cost,
          category: product.category,
          quantity: product.quantity,
          min_stock: product.minStock,
          description: product.description,
          image_url: product.image,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        cost: data.cost,
        category: data.category,
        quantity: data.quantity,
        minStock: data.min_stock,
        description: data.description,
        image: data.image_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};