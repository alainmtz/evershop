import { select, insert, update } from '@evershop/postgres-query-builder';
import { CommissionService } from '../../services/CommissionService.js';

export default async (request, response, { pool }) => {
  if (request.method === 'POST') {
    try {
      const {
        vendorId,
        description,
        commissionRate,
        commissionType = 'percentage',
        returnWindowDays = 30,
      } = request.body;

      // Validaciones
      if (!vendorId || !description) {
        return response.status(400).json({
          error: 'vendorId y description son requeridos'
        });
      }

      if (!CommissionService.validateCommissionRate(commissionRate, commissionType)) {
        return response.status(400).json({
          error: 'Tasa de comisión inválida'
        });
      }

      // Crear consignment
      const result = await insert('consignments')
        .given({
          vendor_id: vendorId,
          description,
          commission_rate: commissionRate,
          commission_type: commissionType,
          return_window_days: returnWindowDays,
          status: 'ACTIVE',
          created_by: request.user?.id || null
        })
        .execute(pool);

      response.json({
        success: true,
        consignmentId: result.insertId,
        message: 'Consignment creado exitosamente'
      });
    } catch (error) {
      console.error('Error creating consignment:', error);
      response.status(500).json({ error: error.message });
    }
  } else {
    response.status(405).json({ error: 'Method not allowed' });
  }
};
