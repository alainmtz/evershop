import { select } from '@evershop/postgres-query-builder';

export default async (request, response, { pool }) => {
  if (request.method === 'GET') {
    try {
      const { id } = request.params;

      // Obtener consignment
      const consignments = await select()
        .from('consignments', 'c')
        .innerJoin('users', 'u')
        .on('c.vendor_id', '=', 'u.id')
        .where('c.id', '=', id)
        .fields(
          'c.id',
          'c.vendor_id',
          'c.description',
          'c.commission_rate',
          'c.commission_type',
          'c.return_window_days',
          'c.status',
          'c.created_at',
          'c.updated_at',
          'u.full_name as vendor_name',
          'u.email as vendor_email'
        )
        .execute(pool);

      if (consignments.length === 0) {
        return response.status(404).json({ error: 'Consignment no encontrado' });
      }

      const consignment = consignments[0];

      // Obtener items
      const items = await select()
        .from('consignment_items', 'ci')
        .innerJoin('product_variation', 'pv')
        .on('ci.product_variation_id', '=', 'pv.id')
        .where('ci.consignment_id', '=', id)
        .fields(
          'ci.id',
          'ci.quantity',
          'ci.unit_price',
          'ci.status',
          'pv.sku',
          'pv.name'
        )
        .execute(pool);

      // Obtener ventas
      const sales = await select()
        .from('consignment_sales')
        .where('consignment_id', '=', id)
        .execute(pool);

      // Obtener devoluciones
      const returns = await select()
        .from('consignment_returns')
        .where('consignment_id', '=', id)
        .execute(pool);

      // Obtener pagos
      const payments = await select()
        .from('consignment_payments')
        .where('consignment_id', '=', id)
        .execute(pool);

      response.json({
        consignment,
        items,
        sales,
        returns,
        payments
      });
    } catch (error) {
      console.error('Error fetching consignment detail:', error);
      response.status(500).json({ error: error.message });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
};
