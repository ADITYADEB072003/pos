import React from 'react';
import { X, Printer, Download, Share2 } from 'lucide-react';
import { Sale } from '../../types';
import { format } from 'date-fns';

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({ sale, onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${sale.receiptNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.4;
              max-width: 300px;
              margin: 0 auto;
              padding: 10px;
            }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
            .store-name { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
            .store-info { font-size: 10px; }
            .receipt-info { margin: 10px 0; font-size: 10px; }
            .items { margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 2px 0; }
            .item-name { flex: 1; }
            .item-qty { width: 30px; text-align: center; }
            .item-price { width: 60px; text-align: right; }
            .totals { border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; margin: 2px 0; }
            .total-final { font-weight: bold; border-top: 1px solid #000; padding-top: 3px; margin-top: 3px; }
            .footer { text-align: center; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px; font-size: 10px; }
            @media print {
              body { margin: 0; padding: 5px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleDownload = () => {
    const receiptData = {
      receiptNumber: sale.receiptNumber,
      date: format(new Date(sale.timestamp), 'MMM dd, yyyy hh:mm aa'),
      items: sale.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.subtotal
      })),
      subtotal: sale.subtotal,
      tax: sale.tax,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      cashReceived: sale.cashReceived,
      change: sale.change
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${sale.receiptNumber}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${sale.receiptNumber}`,
          text: `Receipt for $${sale.total.toFixed(2)} - ${format(new Date(sale.timestamp), 'MMM dd, yyyy')}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const receiptText = `
Receipt #${sale.receiptNumber}
Date: ${format(new Date(sale.timestamp), 'MMM dd, yyyy hh:mm aa')}
Cashier: ${sale.staffName}

Items:
${sale.items.map(item => `${item.quantity}x ${item.product.name} - $${item.subtotal.toFixed(2)}`).join('\n')}

Subtotal: $${sale.subtotal.toFixed(2)}
Tax: $${sale.tax.toFixed(2)}
Total: $${sale.total.toFixed(2)}

Payment: ${sale.paymentMethod.toUpperCase()}
${sale.cashReceived ? `Cash Received: $${sale.cashReceived.toFixed(2)}` : ''}
${sale.change ? `Change: $${sale.change.toFixed(2)}` : ''}

Thank you for your business!
      `;
      
      navigator.clipboard.writeText(receiptText).then(() => {
        alert('Receipt copied to clipboard!');
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Receipt</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-gray-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleShare}
              className="bg-emerald-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-1 text-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div id="receipt-content" className="p-6">
          <div className="header text-center mb-6">
            <div className="store-name text-2xl font-bold text-gray-900 mb-2">Your Store Name</div>
            <div className="store-info text-gray-600 text-sm">
              <div>123 Main Street, City, State 12345</div>
              <div>Phone: (555) 123-4567</div>
              <div>Email: info@yourstore.com</div>
            </div>
          </div>

          <div className="receipt-info border-t border-b border-gray-200 py-4 mb-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600">Receipt #:</div>
                <div className="font-semibold">{sale.receiptNumber}</div>
              </div>
              <div>
                <div className="text-gray-600">Date & Time:</div>
                <div className="font-semibold">
                  {format(new Date(sale.timestamp), 'MMM dd, yyyy hh:mm aa')}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Cashier:</div>
                <div className="font-semibold">{sale.staffName}</div>
              </div>
              <div>
                <div className="text-gray-600">Payment:</div>
                <div className="font-semibold capitalize">{sale.paymentMethod}</div>
              </div>
            </div>
          </div>

          <div className="items mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-center border-b border-gray-200 pb-2">ITEMS</h3>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="item flex justify-between items-start text-sm">
                  <div className="item-name flex-1 pr-2">
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-xs text-gray-600">
                      {item.quantity} × ${item.product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="item-price font-semibold text-gray-900">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="totals border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="total-line flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line flex justify-between">
              <span className="text-gray-600">Tax (8%):</span>
              <span className="font-semibold">${sale.tax.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="total-line flex justify-between">
                <span className="text-gray-600">Discount:</span>
                <span className="font-semibold text-emerald-600">
                  -${sale.discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="total-final flex justify-between text-lg font-bold border-t border-gray-900 pt-2 mt-2">
              <span>TOTAL:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>

            {sale.paymentMethod === 'cash' && sale.cashReceived && (
              <div className="mt-4 pt-2 border-t border-gray-200">
                <div className="total-line flex justify-between text-sm">
                  <span className="text-gray-600">Cash Received:</span>
                  <span className="font-semibold">${sale.cashReceived.toFixed(2)}</span>
                </div>
                <div className="total-line flex justify-between text-sm">
                  <span className="text-gray-600">Change:</span>
                  <span className="font-semibold">${(sale.change || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="footer text-center mt-6 pt-4 border-t border-gray-200 text-sm">
            <div className="text-gray-900 font-semibold mb-2">Thank you for your business!</div>
            <div className="text-gray-600 text-xs">
              <div>Please keep this receipt for your records</div>
              <div className="mt-1">Visit us again soon!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};