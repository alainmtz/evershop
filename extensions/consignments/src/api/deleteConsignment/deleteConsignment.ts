import { del, select } from '@evershop/postgres-query-builder';

export default async (request, response, { pool }) => {
  if (request.method === 'DELETE') {
    try {
      const { id } = request.params;

      // Validar que el consignment existe
      const existing = await select()
        .from('consignments')
        .where('id', '=', id)
        .execute(pool);

      if (existing.length === 0) {
        return response.status(404).json({ error: 'Consignment no encontrado' });
      }

      // Validar que no tenga items activos
      const activeItems = await select()
        .from('consignment_items')
        .where('consignment_id', '=', id)
        .where('status', '!=', 'RETURNED')
        .execute(pool);

      if (activeItems.length > 0) {
        return response.status(400).json({
          error: 'No puedes eliminar un consignment con items activos'
        });
      }

      // Eliminar consignment
      await del('consignments')
        .where('id', '=', id)
        .execute(pool);

      response.json({
        success: true,
        message: 'Consignment eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting consignment:', error);
      response.status(500).json({ error: error.message });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
};
