import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Sale } from '../../types';
import { format } from 'date-fns';

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ sale, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, you would generate a PDF here
    alert('Download functionality would be implemented here');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Receipt</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        <div className="p-6 print:p-0">
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold text-gray-900 print:text-lg">Store Name</h1>
            <p className="text-gray-600 text-sm">123 Main Street, City, State 12345</p>
            <p className="text-gray-600 text-sm">Phone: (555) 123-4567</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-4 print:py-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Receipt #:</p>
                <p className="font-semibold">{sale.receiptNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Date & Time:</p>
                <p className="font-semibold">
                  {format(new Date(sale.timestamp), 'MMM dd, yyyy hh:mm aa')}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Cashier:</p>
                <p className="font-semibold">{sale.staffName}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment:</p>
                <p className="font-semibold capitalize">{sale.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-semibold">${sale.tax.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-emerald-600">
                  -${sale.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>

            {sale.paymentMethod === 'cash' && sale.cashReceived && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cash Received:</span>
                  <span className="font-semibold">${sale.cashReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Change:</span>
                  <span className="font-semibold">${(sale.change || 0).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-6 pt-4 border-t border-gray-200 print:mt-4">
            <p className="text-sm text-gray-600">Thank you for your business!</p>
            <p className="text-xs text-gray-500 mt-1">
              Please keep this receipt for your records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};