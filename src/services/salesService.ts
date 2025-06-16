import { supabase } from '../lib/supabase';
import { Sale } from '../types';

export const salesService = {
  async getSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(sale => ({
        id: sale.id,
        items: sale.items,
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
      const { data, error } = await supabase
        .from('sales')
        .insert({
          items: sale.items,
          subtotal: sale.subtotal,
          tax: sale.tax,
          discount: sale.discount,
          total: sale.total,
          payment_method: sale.paymentMethod,
          cash_received: sale.cashReceived,
          change: sale.change,
          staff_id: sale.staffId,
          staff_name: sale.staffName,
          receipt_number: sale.receiptNumber,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        total: data.total,
        paymentMethod: data.payment_method,
        cashReceived: data.cash_received,
        change: data.change,
        staffId: data.staff_id,
        staffName: data.staff_name,
        timestamp: new Date(data.created_at),
        receiptNumber: data.receipt_number,
      };
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }
};