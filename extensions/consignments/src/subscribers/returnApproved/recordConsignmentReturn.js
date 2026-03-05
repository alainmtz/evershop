import { select, insert, update } from '@evershop/postgres-query-builder';

/**
 * Subscriber: Cuando se procesa una devolución en un consignment,
 * actualiza el inventario devolviendo las unidades
 */
export default async (event, { pool }) => {
  try {
    const { consignmentId, consignmentItemId, quantity, reason } = event.data;

    // Obtener el item del consignment
    const items = await select()
      .from('consignment_items')
      .where('id', '=', consignmentItemId)
      .execute(pool);

    if (items.length === 0) return;

    const item = items[0];

    // Generar referencia de devolución
    const returnReference = `RET-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Registrar la devolución
    const result = await insert('consignment_returns')
      .given({
        consignment_id: consignmentId,
        consignment_item_id: consignmentItemId,
        return_reference: returnReference,
        quantity,
        reason,
        status: 'APPROVED',
        created_at: new Date()
      })
      .execute(pool);

    // Devolver cantidad al inventario del consignment
    const currentQty = await select()
      .from('consignment_items')
      .where('id', '=', consignmentItemId)
      .execute(pool);

    await update('consignment_items')
      .set({ quantity: currentQty[0].quantity + quantity })
      .where('id', '=', consignmentItemId)
      .execute(pool);

    // Devolver cantidad al inventario general
    const inventory = await select()
      .from('product_inventory')
      .where('product_variation_id', '=', item.product_variation_id)
      .execute(pool);

    if (inventory.length > 0) {
      await update('product_inventory')
        .set({ qty: inventory[0].qty + quantity })
        .where('product_variation_id', '=', item.product_variation_id)
        .execute(pool);
    }

    // Log
    await insert('consignment_logs')
      .given({
        consignment_id: consignmentId,
        action: 'RETURN_APPROVED',
        details: JSON.stringify({
          returnReference,
          consignmentItemId,
          quantity,
          reason
        }),
        created_at: new Date()
      })
      .execute(pool);

    console.log(`✓ Return approved: ${returnReference}, Item: ${consignmentItemId}, Qty: ${quantity}`);
  } catch (error) {
    console.error('Error in consignment returns subscriber:', error);
    throw error;
  }
};
