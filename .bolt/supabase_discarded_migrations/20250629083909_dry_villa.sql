/*
  # Complete POS System Database Schema

  1. New Tables
    - `profiles` - User profiles with roles and permissions
    - `products` - Product inventory with stock management
    - `sales` - Sales transactions with detailed items
    - `sale_items` - Individual items in each sale (normalized)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access between admin and staff users

  3. Features
    - Automatic timestamps
    - UUID primary keys
    - Proper foreign key relationships
    - Stock tracking and low stock alerts
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  barcode text DEFAULT '',
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  cost decimal(10,2) NOT NULL CHECK (cost >= 0),
  category text NOT NULL,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  min_stock integer NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
  description text DEFAULT '',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number text UNIQUE NOT NULL,
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0),
  tax decimal(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount decimal(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total decimal(10,2) NOT NULL CHECK (total >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi')),
  cash_received decimal(10,2),
  change decimal(10,2),
  staff_id uuid NOT NULL REFERENCES profiles(id),
  staff_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sale_items table for normalized sale items
CREATE TABLE IF NOT EXISTS sale_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  product_sku text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price decimal(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products policies
CREATE POLICY "All authenticated users can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sales policies
CREATE POLICY "Users can read all sales"
  ON sales FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sales"
  ON sales FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = staff_id);

-- Sale items policies
CREATE POLICY "Users can read all sale items"
  ON sale_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sale items"
  ON sale_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sales
      WHERE id = sale_id AND staff_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_quantity ON products(quantity);
CREATE INDEX IF NOT EXISTS idx_sales_receipt_number ON sales(receipt_number);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_staff_id ON sales(staff_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();