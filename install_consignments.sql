-- Consignments table
CREATE TABLE IF NOT EXISTS consignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  reference VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  commission_type VARCHAR(20) DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed')),
  commission_value DECIMAL(10, 2) NOT NULL,
  margin_type VARCHAR(20) DEFAULT 'percentage' CHECK (margin_type IN ('percentage', 'fixed')),
  margin_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_products_sent INTEGER DEFAULT 0,
  total_products_sold INTEGER DEFAULT 0,
  total_products_returned INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(15, 2) DEFAULT 0,
  total_margin_earned DECIMAL(15, 2) DEFAULT 0,
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_consignments_vendor ON consignments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_consignments_status ON consignments(status);

-- Consignment items table (products in a consignment)
CREATE TABLE IF NOT EXISTS consignment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES consignments(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  quantity_sent INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,
  quantity_returned INTEGER DEFAULT 0,
  unit_cost DECIMAL(15, 2) NOT NULL,
  selling_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consignment_items_consignment ON consignment_items(consignment_id);
CREATE INDEX IF NOT EXISTS idx_consignment_items_product ON consignment_items(product_id);

-- Consignment sales table (track sales of consigned products)
CREATE TABLE IF NOT EXISTS consignment_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES consignments(id) ON DELETE CASCADE,
  consignment_item_id UUID NOT NULL REFERENCES consignment_items(id) ON DELETE CASCADE,
  order_id UUID,
  order_item_id UUID,
  quantity INTEGER NOT NULL,
  unit_selling_price DECIMAL(15, 2) NOT NULL,
  unit_cost DECIMAL(15, 2) NOT NULL,
  commission_amount DECIMAL(15, 2) NOT NULL,
  margin_amount DECIMAL(15, 2) NOT NULL,
  sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consignment_sales_consignment ON consignment_sales(consignment_id);
CREATE INDEX IF NOT EXISTS idx_consignment_sales_order ON consignment_sales(order_id);

-- Consignment returns table
CREATE TABLE IF NOT EXISTS consignment_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES consignments(id) ON DELETE CASCADE,
  consignment_item_id UUID NOT NULL REFERENCES consignment_items(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES consignment_sales(id) ON DELETE SET NULL,
  return_reference VARCHAR(50) NOT NULL UNIQUE,
  quantity INTEGER NOT NULL,
  reason VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  refund_amount DECIMAL(15, 2) NOT NULL,
  return_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_consignment_returns_consignment ON consignment_returns(consignment_id);
CREATE INDEX IF NOT EXISTS idx_consignment_returns_status ON consignment_returns(status);

-- Consignment payments table
CREATE TABLE IF NOT EXISTS consignment_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES consignments(id) ON DELETE CASCADE,
  payment_period_start DATE NOT NULL,
  payment_period_end DATE NOT NULL,
  total_sales DECIMAL(15, 2) NOT NULL,
  total_commission DECIMAL(15, 2) NOT NULL,
  total_margin DECIMAL(15, 2) NOT NULL,
  total_returns_refund DECIMAL(15, 2) DEFAULT 0,
  net_amount DECIMAL(15, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'cancelled')),
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consignment_payments_consignment ON consignment_payments(consignment_id);
CREATE INDEX IF NOT EXISTS idx_consignment_payments_status ON consignment_payments(status);

-- Audit log for consignments
CREATE TABLE IF NOT EXISTS consignment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consignment_id UUID NOT NULL REFERENCES consignments(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  actor_id UUID,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consignment_logs_consignment ON consignment_logs(consignment_id);
