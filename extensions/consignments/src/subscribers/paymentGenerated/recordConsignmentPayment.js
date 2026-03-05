import { select, insert, update } from '@evershop/postgres-query-builder';
import { PaymentService } from '../../services/PaymentService.js';

/**
 * Subscriber: Cuando se genera un pago, calcula el monto neto
 * y registra el pago en el sistema
 */
export default async (event, { pool }) => {
  try {
    const { consignmentId, frequency = 'monthly' } = event.data;

    // Obtener todas las ventas del consignment no pagadas
    const sales = await select()
      .from('consignment_sales')
      .where('consignment_id', '=', consignmentId)
      .where('payment_status', '!=', 'PAID')
      .execute(pool);

    if (sales.length === 0) {
      console.log(`No unpaid sales for consignment ${consignmentId}`);
      return;
    }

    // Obtener datos del consignment
    const consignments = await select()
      .from('consignments')
      .where('id', '=', consignmentId)
      .execute(pool);

    const consignment = consignments[0];

    // Calcular totales
    const totalSales = sales.reduce((sum, sale) => sum + (sale.sale_price * sale.quantity), 0);
    const totalCommission = sales.reduce((sum, sale) => {
      if (consignment.commission_type === 'percentage') {
        return sum + ((sale.sale_price * consignment.commission_rate / 100) * sale.quantity);
      }
      return sum + (consignment.commission_rate * sale.quantity);
    }, 0);

    const netPayment = PaymentService.calculateNetPayment(totalSales, totalCommission);
    const paymentPeriod = PaymentService.generatePaymentPeriod(frequency);
    const paymentDate = PaymentService.calculatePaymentDate(frequency);

    // Crear registro de pago
    const paymentResult = await insert('consignment_payments')
      .given({
        consignment_id: consignmentId,
        amount: netPayment,
        commission_amount: totalCommission,
        sales_amount: totalSales,
        payment_period: paymentPeriod,
        payment_date: paymentDate,
        status: 'PENDING',
        created_at: new Date()
      })
      .execute(pool);

    // Marcar ventas como en pago pendiente
    await Promise.all(sales.map(sale =>
      update('consignment_sales')
        .set({ payment_status: 'PENDING' })
        .where('id', '=', sale.id)
        .execute(pool)
    ));

    // Log
    await insert('consignment_logs')
      .given({
        consignment_id: consignmentId,
        action: 'PAYMENT_GENERATED',
        details: JSON.stringify({
          paymentId: paymentResult.insertId,
          amount: netPayment,
          commission: totalCommission,
          period: paymentPeriod
        }),
        created_at: new Date()
      })
      .execute(pool);

    console.log(`✓ Payment generated: Consignment ${consignmentId}, Amount: $${netPayment.toFixed(2)}`);
  } catch (error) {
    console.error('Error in consignment payment subscriber:', error);
    throw error;
  }
};
