import * as z from 'zod';

import { AlicuotaIva, BillConcepto, BillStatus, ComprobanteType } from '@/api/graphql';

// Esquema de validación del detalle
const billingDetailSchema = z.object({
    description: z.string().min(1, 'La descripción es requerida'),
    quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
    unitPrice: z.number().min(0.01, 'El precio unitario debe ser mayor a 0'),
    alicuotaIVA: z.nativeEnum(AlicuotaIva),
    subtotal: z.number(),
    ivaAmount: z.number(),
    subtotalWithIva: z.number(),
    taskId: z.string().nullable().optional(),
    task: z.any().nullable().optional(),
});

// Esquema de validación principal
export const billingFormSchema = z
    .object({
        billingProfileId: z.string().min(1, 'Debe seleccionar un perfil de facturación'),
        // Estos campos se completan automáticamente desde el perfil de facturación.
        // Solo `billingProfileId` debe ser obligatorio. Los demás quedan opcionales
        // y se validan solo si están presentes (por ejemplo el formato de CUIT).
        legalName: z.string().optional(),
        cuit: z
            .string()
            .optional()
            .refine(
                (val) => {
                    if (!val) {
                        return true;
                    }
                    // Aceptar CUIT con o sin separadores; comprobar que tenga 11 dígitos al limpiar
                    const cleaned = val.replace(/[-.\s]/g, '');
                    return /^\d{11}$/.test(cleaned);
                },
                {
                    message: 'El CUIT debe tener 11 dígitos (con o sin guiones)',
                },
            ),
        businessAddress: z.string().optional(),
        ivaCondition: z.string().optional(),
        comprobanteType: z.nativeEnum(ComprobanteType, {
            required_error: 'Debe seleccionar un tipo de factura',
        }),
        paymentCondition: z.string().min(1, 'La condición de pago es requerida'),
        pointOfSale: z.number().nullable().optional(),
        dateFrom: z.date({
            required_error: 'La fecha desde es requerida',
        }),
        dateTo: z.date().optional(),
        isSingleService: z.boolean(),
        // `dueDate` será opcional por defecto; validamos su presencia
        // condicionalmente en el `superRefine` del objeto.
        dueDate: z.date().nullable().optional(),
        concepto: z.nativeEnum(BillConcepto).optional(),
        details: z
            .array(billingDetailSchema)
            .min(1, 'Debe agregar al menos un detalle a la factura'),
        directTasks: z.array(z.any()).optional(),
        observations: z.string().optional(),
        withholdingAmount: z.number().optional(),
        status: z.nativeEnum(BillStatus),
        serviceOrderId: z.string().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        const conditionsThatDontRequireDueDate = ['15Dias', '30Dias', '60Dias', '90Dias'];

        if (
            data.paymentCondition &&
            !conditionsThatDontRequireDueDate.includes(data.paymentCondition)
        ) {
            if (!data.dueDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['dueDate'],
                    message:
                        'La fecha de vencimiento es requerida para la condición de pago seleccionada',
                });
            }
        }
    });
