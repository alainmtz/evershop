// ReturnService.ts - Gestión de devoluciones

import { v4 as uuid } from 'uuid';

export class ReturnService {
  /**
   * Genera una referencia única para la devolución
   */
  static generateReturnReference(): string {
    return `RET-${Date.now()}-${uuid().substring(0, 8)}`;
  }

  /**
   * Calcula el reembolso después de descontar comisión
   */
  static calculateRefund(
    salePrice: number,
    commissionRate: number,
    commissionType: 'percentage' | 'fixed' = 'percentage'
  ): number {
    if (commissionType === 'percentage') {
      const commission = (salePrice * commissionRate) / 100;
      return salePrice - commission;
    }
    return salePrice - commissionRate;
  }

  /**
   * Valida si el producto puede ser devuelto
   */
  static canReturnProduct(
    daysFromPurchase: number,
    returnWindowDays: number = 30
  ): boolean {
    return daysFromPurchase <= returnWindowDays;
  }

  /**
   * Calcula la ventana de devolución
   */
  static calculateReturnDeadline(purchaseDate: Date, windowDays: number = 30): Date {
    const deadline = new Date(purchaseDate);
    deadline.setDate(deadline.getDate() + windowDays);
    return deadline;
  }

  /**
   * Valida una solicitud de devolución
   */
  static validateReturnRequest(request: {
    quantity: number;
    reason: string;
    quantitySold: number;
  }): { valid: boolean; error?: string } {
    if (request.quantity <= 0) {
      return { valid: false, error: 'Cantidad debe ser mayor a 0' };
    }
    if (request.quantity > request.quantitySold) {
      return { valid: false, error: 'No puedes devolver más de lo vendido' };
    }
    if (!request.reason || request.reason.length < 3) {
      return { valid: false, error: 'Debes proporcionar una razón válida' };
    }
    return { valid: true };
  }
}
