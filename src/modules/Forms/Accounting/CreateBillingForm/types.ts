import { AlicuotaIva, ComprobanteType, BillConcepto, BillStatus } from '@/api/graphql';

// Tarea seleccionada para facturar
export type SelectedTask = {
    id: string;
    taskNumber: string;
    description?: string | null;
    status: string;
    closedAt?: Date | null;
    businessName?: string | null;
    clientName?: string | null;
    customBranch?: {
        name: string | null;
        number?: number | null;
    } | null;
    branch?: {
        id: string;
        name: string | null;
        number?: number | null;
        client?: {
            id: string;
            name: string;
        } | null;
    } | null;
};

// Detalle de factura con tarea opcional
export type BillingDetail = {
    id: string; // ID para identificar detalles existentes al actualizar
    description: string;
    quantity: number;
    unitPrice: number;
    alicuotaIVA: AlicuotaIva;
    // Subtotal sin IVA
    subtotal: number;
    // Importe de IVA
    ivaAmount: number;
    // Subtotal con IVA
    subtotalWithIva: number;
    // Tarea asociada a este detalle (opcional)
    taskId?: string | null;
    task?: SelectedTask | null;
};

// Condiciones de venta con días de pago
export type PaymentCondition =
    | 'Contado'
    | 'CuentaCorriente'
    | 'Cheque'
    | 'Transferencia'
    | '15Dias'
    | '30Dias'
    | '60Dias'
    | '90Dias'
    | 'TarjetaCredito'
    | 'Otros';

export const PaymentCondition = {
    Contado: 'Contado' as PaymentCondition,
    CuentaCorriente: 'CuentaCorriente' as PaymentCondition,
    Cheque: 'Cheque' as PaymentCondition,
    Transferencia: 'Transferencia' as PaymentCondition,
    '15Dias': '15Dias' as PaymentCondition,
    '30Dias': '30Dias' as PaymentCondition,
    '60Dias': '60Dias' as PaymentCondition,
    '90Dias': '90Dias' as PaymentCondition,
    TarjetaCredito: 'TarjetaCredito' as PaymentCondition,
    Otros: 'Otros' as PaymentCondition,
};

// Mapeo de condición de venta a días
// null = usuario selecciona manualmente la fecha
// number = calcula automáticamente la fecha sumando X días desde la fecha base
export const PAYMENT_CONDITION_DAYS: Record<string, number | null> = {
    Contado: null, // Usuario selecciona manualmente (puede ser inmediato o diferido)
    CuentaCorriente: null, // Usuario selecciona manualmente
    Cheque: null, // Usuario selecciona manualmente
    Transferencia: null, // Usuario selecciona manualmente
    '15Dias': 15, // Calcula automáticamente: fecha base + 15 días
    '30Dias': 30, // Calcula automáticamente: fecha base + 30 días
    '60Dias': 60, // Calcula automáticamente: fecha base + 60 días
    '90Dias': 90, // Calcula automáticamente: fecha base + 90 días
    TarjetaCredito: null, // Usuario selecciona manualmente
    Otros: null, // Usuario selecciona manualmente
};

// Valores del formulario
export type FormValues = {
    // Datos del cliente/perfil de facturación
    billingProfileId: string;
    legalName: string;
    cuit: string;
    businessAddress: string;
    ivaCondition: string;

    // Datos de la factura
    comprobanteType: ComprobanteType;
    paymentCondition: PaymentCondition;
    pointOfSale?: number | null;

    // Fechas
    dateFrom: Date;
    dateTo?: Date;
    isSingleService: boolean;
    dueDate: Date;

    // Concepto AFIP
    concepto?: BillConcepto;

    // Detalles
    details: BillingDetail[];

    // Tareas asociadas directamente a la factura (sin detalle específico)
    directTasks: SelectedTask[];

    // Observaciones
    observations?: string;

    // Retenciones
    withholdingAmount?: number;

    // Estado inicial
    status: BillStatus;

    // ID de orden de servicio asociada (opcional)
    serviceOrderId?: string | null;
};

// Totales calculados
export type BillTotals = {
    // Importe neto gravado (base imponible)
    taxableNetAmount: number;
    // Importe neto no gravado
    nonTaxableNetAmount: number;
    // Importe exento
    exemptAmount: number;
    // Importe IVA
    ivaAmount: number;
    // Importe tributos
    tributesAmount: number;
    // Importe total
    totalAmount: number;
    // Desglose de IVA por alícuota
    ivaBreakdown: {
        alicuota: AlicuotaIva;
        baseAmount: number;
        ivaAmount: number;
    }[];
};

// Función para calcular los totales
export function calculateBillTotals(details: BillingDetail[]): BillTotals {
    const ivaBreakdownMap = new Map<
        AlicuotaIva,
        { baseAmount: number; ivaAmount: number }
    >();

    let taxableNetAmount = 0;
    let nonTaxableNetAmount = 0;
    let exemptAmount = 0;
    let ivaAmount = 0;

    for (const detail of details) {
        const subtotal = detail.quantity * detail.unitPrice;

        // Clasificar según alícuota
        if (detail.alicuotaIVA === 'NoGravado') {
            nonTaxableNetAmount += subtotal;
        } else if (detail.alicuotaIVA === 'Exento') {
            exemptAmount += subtotal;
        } else {
            taxableNetAmount += subtotal;
            ivaAmount += detail.ivaAmount;

            // Agregar al desglose de IVA
            const existing = ivaBreakdownMap.get(detail.alicuotaIVA);
            if (existing) {
                existing.baseAmount += subtotal;
                existing.ivaAmount += detail.ivaAmount;
            } else {
                ivaBreakdownMap.set(detail.alicuotaIVA, {
                    baseAmount: subtotal,
                    ivaAmount: detail.ivaAmount,
                });
            }
        }
    }

    const ivaBreakdown = Array.from(ivaBreakdownMap.entries()).map(
        ([alicuota, amounts]) => ({
            alicuota,
            ...amounts,
        }),
    );

    const totalAmount = taxableNetAmount + nonTaxableNetAmount + exemptAmount + ivaAmount;

    return {
        taxableNetAmount,
        nonTaxableNetAmount,
        exemptAmount,
        ivaAmount,
        tributesAmount: 0, // Por ahora no manejamos tributos adicionales
        totalAmount,
        ivaBreakdown,
    };
}

// Porcentajes de IVA por alícuota
export const IVA_PERCENTAGES: Record<AlicuotaIva, number> = {
    NoGravado: 0,
    Exento: 0,
    IVA_0: 0,
    IVA_2_5: 2.5,
    IVA_5: 5,
    IVA_10_5: 10.5,
    IVA_21: 21,
    IVA_27: 27,
};

// Función para calcular el IVA de un detalle
export function calculateDetailIva(
    quantity: number,
    unitPrice: number,
    alicuotaIVA: AlicuotaIva,
): { subtotal: number; ivaAmount: number; subtotalWithIva: number } {
    const subtotal = quantity * unitPrice;
    const percentage = IVA_PERCENTAGES[alicuotaIVA] || 0;
    const ivaAmount = subtotal * (percentage / 100);
    const subtotalWithIva = subtotal + ivaAmount;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        ivaAmount: Math.round(ivaAmount * 100) / 100,
        subtotalWithIva: Math.round(subtotalWithIva * 100) / 100,
    };
}

// Función para calcular fecha de vencimiento según condición de pago
export function calculateDueDate(
    paymentCondition: PaymentCondition,
    baseDate: Date = new Date(),
): Date | null {
    const days = PAYMENT_CONDITION_DAYS[paymentCondition];

    if (days === null) {
        return null; // El usuario debe seleccionar manualmente
    }

    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
}
