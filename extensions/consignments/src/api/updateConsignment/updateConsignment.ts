import { select, update } from '@evershop/postgres-query-builder';
import { CommissionService } from '../../services/CommissionService.js';

export default async (request, response, { pool }) => {
  if (request.method === 'PUT') {
    try {
      const { id } = request.params;
      const {
        description,
        commissionRate,
        commissionType,
        returnWindowDays,
        status
      } = request.body;

      // Validar que el consignment existe
      const existing = await select()
        .from('consignments')
        .where('id', '=', id)
        .execute(pool);

      if (existing.length === 0) {
        return response.status(404).json({ error: 'Consignment no encontrado' });
      }

      // Validaciones
      if (commissionRate !== undefined) {
        if (!CommissionService.validateCommissionRate(commissionRate, commissionType || 'percentage')) {
          return response.status(400).json({
            error: 'Tasa de comisión inválida'
          });
        }
      }

      // Actualizar
      await update('consignments')
        .set({
          ...(description && { description }),
          ...(commissionRate !== undefined && { commission_rate: commissionRate }),
          ...(commissionType && { commission_type: commissionType }),
          ...(returnWindowDays !== undefined && { return_window_days: returnWindowDays }),
          ...(status && { status }),
          updated_at: new Date()
        })
        .where('id', '=', id)
        .execute(pool);

      response.json({
        success: true,
        message: 'Consignment actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error updating consignment:', error);
      response.status(500).json({ error: error.message });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
};
