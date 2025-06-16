import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  total: number;
  onPayment: (paymentData: {
    method: 'cash' | 'card' | 'upi';
    cashReceived?: number;
    change?: number;
  }) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  onPayment,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    let paymentData: any = { method: paymentMethod };
    
    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived);
      if (received < total) {
        alert('Insufficient cash received!');
        setIsProcessing(false);
        return;
      }
      paymentData.cashReceived = received;
      paymentData.change = received - total;
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onPayment(paymentData);
    setIsProcessing(false);
  };

  const quickCashAmounts = [
    Math.ceil(total),
    Math.ceil(total / 5) * 5,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
  ].filter((amount, index, array) => array.indexOf(amount) === index);

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: DollarSign, color: 'bg-emerald-500' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'upi', label: 'UPI/Digital', icon: Smartphone, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-gray-900">${total.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`${method.color} rounded-lg p-2 w-8 h-8 mx-auto mb-2`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{method.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {paymentMethod === 'cash' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash Received
            </label>
            <input
              type="number"
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              step="0.01"
              min={total}
              placeholder={total.toFixed(2)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              {quickCashAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setCashReceived(amount.toString())}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {cashReceived && parseFloat(cashReceived) >= total && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700">
                  Change: <span className="font-bold">
                    ${(parseFloat(cashReceived) - total).toFixed(2)}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing || (paymentMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total))}
          className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Complete Payment - $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};