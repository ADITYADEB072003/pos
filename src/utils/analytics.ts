import { Sale, DailySales, Product } from '../types';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

export const calculateDailySales = (sales: Sale[], date: Date): DailySales => {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  
  const daySales = sales.filter(sale => 
    isWithinInterval(new Date(sale.timestamp), { start: dayStart, end: dayEnd })
  );

  const totalSales = daySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = daySales.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Calculate top products
  const productMap = new Map();
  daySales.forEach(sale => {
    sale.items.forEach(item => {
      const key = item.product.name;
      if (productMap.has(key)) {
        const existing = productMap.get(key);
        productMap.set(key, {
          name: key,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.subtotal,
        });
      } else {
        productMap.set(key, {
          name: key,
          quantity: item.quantity,
          revenue: item.subtotal,
        });
      }
    });
  });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    date: format(date, 'yyyy-MM-dd'),
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts,
  };
};

export const getWeeklySales = (sales: Sale[]): { date: string; sales: number }[] => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse();

  return last7Days.map(date => ({
    date: format(date, 'MMM dd'),
    sales: calculateDailySales(sales, date).totalSales,
  }));
};

export const getMonthlySales = (sales: Sale[]): { month: string; sales: number }[] => {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  }).reverse();

  return last6Months.map(date => {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthSales = sales.filter(sale => 
      isWithinInterval(new Date(sale.timestamp), { start: monthStart, end: monthEnd })
    );

    return {
      month: format(date, 'MMM yyyy'),
      sales: monthSales.reduce((sum, sale) => sum + sale.total, 0),
    };
  });
};

export const getLowStockProducts = (products: Product[]) => {
  return products.filter(product => product.quantity <= product.minStock);
};

export const getTopSellingProducts = (sales: Sale[], limit = 10) => {
  const productMap = new Map();
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const key = item.product.id;
      if (productMap.has(key)) {
        const existing = productMap.get(key);
        productMap.set(key, {
          ...existing,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + item.subtotal,
        });
      } else {
        productMap.set(key, {
          product: item.product,
          quantity: item.quantity,
          revenue: item.subtotal,
        });
      }
    });
  });

  return Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
};