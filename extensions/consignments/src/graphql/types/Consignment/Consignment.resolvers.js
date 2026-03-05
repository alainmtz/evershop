import { select, insert, update, del } from '@evershop/postgres-query-builder';

export default {
  Query: {
    /**
     * Obtener lista de consignments con filtros
     */
    consignments: async (_, { filters = [] }, { pool }) => {
      try {
        let query = select()
          .from('consignments', 'c')
          .leftJoin('users', 'u')
          .on('c.vendor_id', '=', 'u.id')
          .fields(
            'c.id',
            'c.vendor_id',
            'c.description',
            'c.commission_rate',
            'c.commission_type',
            'c.status',
            'c.created_at',
            'u.full_name as vendor_name'
          );

        // Aplicar filtros
        filters.forEach(filter => {
          if (filter.key === 'status') {
            query = query.where('c.status', '=', filter.value);
          }
          if (filter.key === 'vendorId') {
            query = query.where('c.vendor_id', '=', filter.value);
          }
        });

        const items = await query.orderBy('c.created_at', 'DESC').execute(pool);
        const total = items.length;

        return {
          items: items || [],
          total
        };
      } catch (error) {
        console.error('Error fetching consignments:', error);
        return { items: [], total: 0 };
      }
    },

    /**
     * Obtener detalle de un consignment
     */
    consignmentDetail: async (_, { id }, { pool }) => {
      try {
        const consignments = await select()
          .from('consignments')
          .where('id', '=', id)
          .execute(pool);

        if (consignments.length === 0) return null;

        return consignments[0];
      } catch (error) {
        console.error('Error fetching consignment detail:', error);
        return null;
      }
    },

    /**
     * Obtener items de un consignment
     */
    consignmentItems: async (_, { consignmentId }, { pool }) => {
      try {
        const items = await select()
          .from('consignment_items', 'ci')
          .innerJoin('product_variation', 'pv')
          .on('ci.product_variation_id', '=', 'pv.id')
          .where('ci.consignment_id', '=', consignmentId)
          .fields(
            'ci.id',
            'ci.quantity',
            'ci.unit_price',
            'ci.status',
            'pv.id as product_variation_id',
            'pv.sku',
            'pv.name'
          )
          .execute(pool);

        return items || [];
      } catch (error) {
        console.error('Error fetching consignment items:', error);
        return [];
      }
    },

    /**
     * Obtener ventas de un consignment
     */
    consignmentSales: async (_, { consignmentId }, { pool }) => {
      try {
        const sales = await select()
          .from('consignment_sales')
          .where('consignment_id', '=', consignmentId)
          .execute(pool);

        return sales || [];
      } catch (error) {
        console.error('Error fetching consignment sales:', error);
        return [];
      }
    },

    /**
     * Obtener devoluciones de un consignment
     */
    consignmentReturns: async (_, { consignmentId }, { pool }) => {
      try {
        const returns = await select()
          .from('consignment_returns')
          .where('consignment_id', '=', consignmentId)
          .execute(pool);

        return returns || [];
      } catch (error) {
        console.error('Error fetching consignment returns:', error);
        return [];
      }
    }
  }
};

