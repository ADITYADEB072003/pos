import { supabase } from '../lib/supabase';
import { Sale, CartItem } from '../types';

export const salesService = {
  async getSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_id,
            product_name,
            product_sku,
            quantity,
            unit_price,
            subtotal
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(sale => ({
        id: sale.id,
        items: sale.sale_items.map((item: any) => ({
          product: {
            id: item.product_id,
            name: item.product_name,
            sku: item.product_sku,
            price: item.unit_price,
            // Add other required product fields with defaults
            barcode: '',
            cost: 0,
            category: '',
            quantity: 0,
            minStock: 0,
            description: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: item.quantity,
          subtotal: item.subtotal,
        })) as CartItem[],
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        total: sale.total,
        paymentMethod: sale.payment_method,
        cashReceived: sale.cash_received,
        change: sale.change,
        staffId: sale.staff_id,
        staffName: sale.staff_name,
        timestamp: new Date(sale.created_at),
        receiptNumber: sale.receipt_number,
      }));
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  },

  async createSale(sale: Omit<Sale, 'id' | 'timestamp'>): Promise<Sale> {
    try {
      // Start a transaction
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert({
          receipt_number: sale.receiptNumber,
          subtotal: sale.subtotal,
          tax: sale.tax,
          discount: sale.discount,
          total: sale.total,
          payment_method: sale.paymentMethod,
          cash_received: sale.cashReceived,
          change: sale.change,
          staff_id: sale.staffId,
          staff_name: sale.staffName,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Insert sale items
      const saleItems = sale.items.map(item => ({
        sale_id: saleData.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_sku: item.product.sku,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.subtotal,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update product quantities
      for (const item of sale.items) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            quantity: item.product.quantity - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product.id);

        if (updateError) throw updateError;
      }

      return {
        id: saleData.id,
        items: sale.items,
        subtotal: saleData.subtotal,
        tax: saleData.tax,
        discount: saleData.discount,
        total: saleData.total,
        paymentMethod: saleData.payment_method,
        cashReceived: saleData.cash_received,
        change: saleData.change,
        staffId: saleData.staff_id,
        staffName: saleData.staff_name,
        timestamp: new Date(saleData.created_at),
        receiptNumber: saleData.receipt_number,
      };
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }
};