import React, { useState, useMemo } from 'react';
import { Product, CartItem, Sale, User } from '../../types';
import { ProductSearch } from './ProductSearch';
import { Cart } from './Cart';
import { PaymentModal } from './PaymentModal';
import { Receipt } from './Receipt';

interface POSTerminalProps {
  products: Product[];
  onSale: (sale: Omit<Sale, 'id' | 'timestamp'>) => void;
  onUpdateProduct: (product: Product) => void;
  currentUser: User;
}

export const POSTerminal: React.FC<POSTerminalProps> = ({ 
  products, 
  onSale, 
  onUpdateProduct,
  currentUser 
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.08; // 8% tax
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.quantity < quantity) {
      alert('Insufficient stock!');
      return;
    }

    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.quantity) {
        alert('Insufficient stock!');
        return;
      }
      
      setCart(cart.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              subtotal: (item.quantity + quantity) * item.product.price
            }
          : item
      ));
    } else {
      setCart([...cart, {
        product,
        quantity,
        subtotal: quantity * product.price
      }]);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product || quantity > product.quantity) {
      alert('Insufficient stock!');
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            subtotal: quantity * item.product.price
          }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = (paymentData: any) => {
    const sale: Sale = {
      id: Date.now().toString(),
      items: cart,
      subtotal: cartTotal.subtotal,
      tax: cartTotal.tax,
      discount: 0,
      total: cartTotal.total,
      paymentMethod: paymentData.method,
      cashReceived: paymentData.cashReceived,
      change: paymentData.change,
      staffId: currentUser.id,
      staffName: currentUser.name,
      timestamp: new Date(),
      receiptNumber: `RCP-${Date.now()}`,
    };

    // Update product quantities
    cart.forEach(item => {
      const updatedProduct = {
        ...item.product,
        quantity: item.product.quantity - item.quantity,
        updatedAt: new Date()
      };
      onUpdateProduct(updatedProduct);
    });

    onSale(sale);
    setLastSale(sale);
    setCart([]);
    setShowPayment(false);
    setShowReceipt(true);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-50">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">POS Terminal</h1>
          <p className="text-gray-600">Scan or search for products to add to cart</p>
        </div>
        
        <ProductSearch 
          products={products} 
          onAddToCart={addToCart}
        />
      </div>

      <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex-shrink-0">
        <Cart
          items={cart}
          total={cartTotal}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          onClear={clearCart}
        />
      </div>

      {showPayment && (
        <PaymentModal
          total={cartTotal.total}
          onPayment={handlePayment}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showReceipt && lastSale && (
        <Receipt
          sale={lastSale}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default POSTerminal;