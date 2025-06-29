/*
  # Insert Sample Data for POS System

  1. Sample Products
    - Various categories of products
    - Different stock levels to test low stock alerts
    - Realistic pricing and SKUs

  2. Sample Admin User
    - Default admin account for testing
    - Note: This should be removed in production
*/

-- Insert sample products
INSERT INTO products (name, sku, barcode, price, cost, category, quantity, min_stock, description) VALUES
('Premium Coffee Beans', 'COF001', '1234567890123', 24.99, 12.00, 'Beverages', 50, 10, 'High-quality arabica coffee beans from Colombia'),
('Organic Green Tea', 'TEA001', '1234567890124', 15.99, 7.50, 'Beverages', 30, 5, 'Premium organic green tea leaves'),
('Artisan Chocolate Bar', 'CHO001', '1234567890125', 8.99, 4.50, 'Confectionery', 75, 15, 'Hand-crafted dark chocolate bar 70% cocoa'),
('Fresh Croissant', 'BAK001', '1234567890126', 3.50, 1.25, 'Bakery', 8, 20, 'Freshly baked butter croissant'),
('Gourmet Sandwich', 'SAN001', '1234567890127', 12.99, 6.00, 'Food', 25, 10, 'Premium deli sandwich with fresh ingredients'),
('Energy Drink', 'DRK001', '1234567890128', 4.99, 2.25, 'Beverages', 45, 15, 'Natural energy drink with vitamins'),
('Protein Bar', 'BAR001', '1234567890129', 6.99, 3.50, 'Health & Beauty', 60, 20, 'High-protein nutrition bar'),
('Wireless Earbuds', 'ELE001', '1234567890130', 89.99, 45.00, 'Electronics', 15, 5, 'Bluetooth wireless earbuds with noise cancellation'),
('Cotton T-Shirt', 'CLO001', '1234567890131', 19.99, 8.00, 'Clothing', 35, 10, '100% organic cotton t-shirt'),
('Notebook Set', 'BOO001', '1234567890132', 12.99, 5.50, 'Books', 40, 15, 'Premium lined notebook set of 3'),
('Hand Sanitizer', 'HEA001', '1234567890133', 3.99, 1.50, 'Health & Beauty', 80, 25, 'Antibacterial hand sanitizer 500ml'),
('Plant Pot', 'GAR001', '1234567890134', 15.99, 7.00, 'Home & Garden', 20, 8, 'Ceramic plant pot with drainage'),
('Yoga Mat', 'SPO001', '1234567890135', 29.99, 15.00, 'Sports & Outdoors', 12, 5, 'Non-slip yoga mat with carrying strap'),
('Scented Candle', 'HOM001', '1234567890136', 18.99, 8.50, 'Home & Garden', 25, 10, 'Lavender scented soy candle'),
('Phone Case', 'ELE002', '1234567890137', 24.99, 10.00, 'Electronics', 30, 12, 'Protective phone case with screen protector');

-- Note: In a real application, you would create the admin user through the signup process
-- This is just for demonstration purposes