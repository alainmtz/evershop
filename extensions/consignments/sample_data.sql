-- Insert sample consignment data
INSERT INTO consignments (consignment_number, vendor_name, vendor_contact, vendor_email, status, commission_rate, margin_percentage, notes, created_at, updated_at)
VALUES 
  ('CONS-2026-001', 'Juan García', '+54 11 1234-5678', 'juan.garcia@example.com', 'active', 15.00, 35.00, 'Primer consignación - productos de electrónica', NOW(), NOW()),
  ('CONS-2026-002', 'María López', '+54 11 8765-4321', 'maria.lopez@example.com', 'active', 20.00, 40.00, 'Ropa y accesorios', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('CONS-2026-003', 'Carlos Rodríguez', '+54 11 2468-1357', 'carlos.rodriguez@example.com', 'completed', 12.50, 30.00, 'Consignación completada - productos deportivos', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),
  ('CONS-2026-004', 'Ana Silva', '+54 11 9876-5432', 'ana.silva@example.com', 'pending', 18.00, 38.00, 'Libros y material educativo', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Insert sample consignment items (linking to the consignments above)
-- Note: You'll need to adjust product_variation_id to match actual product IDs in your database
INSERT INTO consignment_items (consignment_id, product_variation_id, sku, product_name, quantity_received, quantity_sold, cost_price, selling_price, status, notes)
VALUES 
  -- Items for CONS-2026-001
  (1, 1, 'ELEC-001', 'Auriculares Bluetooth', 10, 3, 2500.00, 4500.00, 'available', 'Color negro, marca premium'),
  (1, 2, 'ELEC-002', 'Cargador USB-C', 20, 8, 800.00, 1500.00, 'available', 'Carga rápida 20W'),
  
  -- Items for CONS-2026-002
  (2, 3, 'ROPA-001', 'Remera estampada', 30, 15, 1200.00, 2800.00, 'available', 'Talles M, L, XL'),
  (2, 4, 'ROPA-002', 'Jean azul', 15, 5, 3500.00, 7000.00, 'available', 'Diversos talles'),
  
  -- Items for CONS-2026-003 (completed)
  (3, 5, 'DEP-001', 'Pelota de fútbol', 25, 25, 1500.00, 3200.00, 'sold', 'N°5 profesional - TODO VENDIDO'),
  (3, 6, 'DEP-002', 'Botines', 10, 10, 8000.00, 15000.00, 'sold', 'Diversos talles - TODO VENDIDO'),
  
  -- Items for CONS-2026-004
  (4, 7, 'LIB-001', 'Manual de matemáticas', 40, 0, 2000.00, 4500.00, 'available', 'Nivel secundario'),
  (4, 8, 'LIB-002', 'Novela de aventuras', 50, 0, 1500.00, 3000.00, 'available', 'Edición tapa blanda');

-- Insert sample sales records for sold items
INSERT INTO consignment_sales (consignment_item_id, order_id, quantity_sold, sale_price, sale_date, commission_amount, notes)
VALUES 
  -- Sales for CONS-2026-001
  (1, 1001, 3, 4500.00, NOW() - INTERVAL '3 days', 202.50, 'Venta online'),
  (2, 1002, 8, 1500.00, NOW() - INTERVAL '2 days', 172.80, 'Venta en tienda'),
  
  -- Sales for CONS-2026-002
  (3, 1003, 15, 2800.00, NOW() - INTERVAL '6 days', 840.00, 'Venta mayorista'),
  (4, 1004, 5, 7000.00, NOW() - INTERVAL '4 days', 700.00, 'Venta individual'),
  
  -- Sales for CONS-2026-003 (all items sold)
  (5, 1005, 25, 3200.00, NOW() - INTERVAL '15 days', 1000.00, 'Venta completa del lote'),
  (6, 1006, 10, 15000.00, NOW() - INTERVAL '10 days', 1875.00, 'Venta completa del lote');

-- View the results
SELECT 
  c.consignment_number,
  c.vendor_name,
  c.status,
  c.commission_rate,
  COUNT(ci.consignment_item_id) as total_items,
  SUM(ci.quantity_received) as total_qty_received,
  SUM(ci.quantity_sold) as total_qty_sold
FROM consignments c
LEFT JOIN consignment_items ci ON c.consignment_id = ci.consignment_id
GROUP BY c.consignment_id, c.consignment_number, c.vendor_name, c.status, c.commission_rate
ORDER BY c.created_at DESC;
