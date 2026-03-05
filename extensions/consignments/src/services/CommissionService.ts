// CommissionService.ts - Cálculo de comisiones y márgenes

export class CommissionService {
  /**
   * Calcula la comisión basada en el precio y tasa
   */
  static calculateCommission(
    salePrice: number,
    commissionRate: number,
    commissionType: 'percentage' | 'fixed' = 'percentage'
  ): number {
    if (commissionType === 'percentage') {
      return (salePrice * commissionRate) / 100;
    }
    return commissionRate; // cantidad fija
  }

  /**
   * Calcula el margen ganancia basado en precio de venta y costo
   */
  static calculateMargin(
    salePrice: number,
    costPrice: number,
    marginType: 'percentage' | 'fixed' = 'percentage'
  ): number {
    const profit = salePrice - costPrice;
    
    if (marginType === 'percentage') {
      return (profit / salePrice) * 100;
    }
    return profit;
  }

  /**
   * Calcula el precio neto al vendedor después de comisión
   */
  static calculateNetPrice(
    salePrice: number,
    commissionRate: number,
    commissionType: 'percentage' | 'fixed' = 'percentage'
  ): number {
    const commission = this.calculateCommission(salePrice, commissionRate, commissionType);
    return salePrice - commission;
  }

  /**
   * Calcula comisión total para múltiples items
   */
  static calculateTotalCommission(items: Array<{
    quantity: number;
    salePrice: number;
    commissionRate: number;
    commissionType?: 'percentage' | 'fixed';
  }>): number {
    return items.reduce((total, item) => {
      const itemTotal = item.quantity * item.salePrice;
      const commission = this.calculateCommission(itemTotal, item.commissionRate, item.commissionType || 'percentage');
      return total + commission;
    }, 0);
  }

  /**
   * Valida que los valores de comisión sean válidos
   */
  static validateCommissionRate(rate: number, type: 'percentage' | 'fixed' = 'percentage'): boolean {
    if (type === 'percentage') {
      return rate >= 0 && rate <= 100;
    }
    return rate >= 0;
  }
}
