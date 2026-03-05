// PaymentService.ts - Gestión de pagos

export type PaymentFrequency = 'weekly' | 'monthly' | 'quarterly';

export class PaymentService {
  /**
   * Calcula el pago neto después de comisiones y fees
   */
  static calculateNetPayment(
    totalSales: number,
    totalCommissions: number,
    administrativeFee: number = 0
  ): number {
    return totalSales - totalCommissions - administrativeFee;
  }

  /**
   * Calcula fecha de próximo pago
   */
  static calculatePaymentDate(frequency: PaymentFrequency, baseDate: Date = new Date()): Date {
    const date = new Date(baseDate);
    
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
    }
    
    return date;
  }

  /**
   * Genera período de pago (ej: "01 Mar - 31 Mar 2026")
   */
  static generatePaymentPeriod(frequency: PaymentFrequency): string {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (frequency) {
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'quarterly':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
        break;
    }

    const formatDate = (d: Date) => {
      return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('es', { month: 'short' })} ${d.getFullYear()}`;
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }

  /**
   * Valida una solicitud de pago
   */
  static validatePaymentRequest(request: {
    consignmentId: number;
    amount: number;
    minimumPaymentThreshold?: number;
  }): { valid: boolean; error?: string } {
    const minThreshold = request.minimumPaymentThreshold || 100;
    
    if (request.amount < minThreshold) {
      return {
        valid: false,
        error: `El monto mínimo para solicitar pago es ${minThreshold}`
      };
    }
    
    if (request.amount <= 0) {
      return { valid: false, error: 'El monto debe ser mayor a 0' };
    }
    
    return { valid: true };
  }

  /**
   * Calcula información de próximo pago
   */
  static getPaymentInfo(frequency: PaymentFrequency) {
    return {
      frequency,
      period: this.generatePaymentPeriod(frequency),
      nextPaymentDate: this.calculatePaymentDate(frequency)
    };
  }
}
