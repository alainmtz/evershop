import { select, insert, update } from '@evershop/postgres-query-builder';

/**
 * Subscriber: Cuando se registra una venta en un consignment,
 * actualiza el inventario del producto
 */
export default async (event, { pool }) => {
  try {
    const { consignmentItemId, quantity, salePrice, orderId } = event.data;

    // Obtener el item del consignment
    const items = await select()
      .from('consignment_items')
      .where('id', '=', consignmentItemId)
      .execute(pool);

    if (items.length === 0) return;

    const item = items[0];

    // Registrar la venta en consignment_sales
    await insert('consignment_sales')
      .given({
        consignment_id: item.consignment_id,
        consignment_item_id: consignmentItemId,
        order_id: orderId,
        quantity,
        sale_price: salePrice,
        status: 'SOLD',
        created_at: new Date()
      })
      .execute(pool);

    // Actualizar cantidad disponible en consignment_items
    const newQuantity = Math.max(0, item.quantity - quantity);
    await update('consignment_items')
      .set({ quantity: newQuantity })
      .where('id', '=', consignmentItemId)
      .execute(pool);

    // Actualizar inventario de producto
    const inventory = await select()
      .from('product_inventory')
      .where('product_variation_id', '=', item.product_variation_id)
      .execute(pool);

    if (inventory.length > 0) {
      const newInventoryQty = Math.max(0, inventory[0].qty - quantity);
      await update('product_inventory')
        .set({ qty: newInventoryQty })
        .where('product_variation_id', '=', item.product_variation_id)
        .execute(pool);
    }

    // Log
    await insert('consignment_logs')
      .given({
        consignment_id: item.consignment_id,
        action: 'SALE_RECORDED',
        details: JSON.stringify({
          consignmentItemId,
          quantity,
          salePrice,
          orderId
        }),
        created_at: new Date()
      })
      .execute(pool);

    console.log(`✓ Sale recorded: Item ${consignmentItemId}, Qty: ${quantity}, Order: ${orderId}`);
  } catch (error) {
    console.error('Error in consignment sales subscriber:', error);
    throw error;
  }
};
