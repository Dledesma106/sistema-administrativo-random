import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ClientSection } from './ClientSection';
import { DetailsSection } from './DetailsSection';
import { DirectTasksSection } from './DirectTasksSection';
import { InvoiceSection } from './InvoiceSection';
import { TotalsSection } from './TotalsSection';
import { FormValues, calculateBillTotals } from './types';

import { AlicuotaIva, BillConcepto, BillStatus, ComprobanteType } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useCreateBill, useEmitBill } from '@/hooks/api/bill';
import { routesBuilder } from '@/lib/routes';
import { ColumnBillingProfile } from '@/modules/tables/BillingProfilesTable/columns';

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
const billingFormSchema = z.object({
    billingProfileId: z.string().min(1, 'Debe seleccionar un perfil de facturación'),
    legalName: z.string().min(1, 'El nombre legal es requerido'),
    cuit: z
        .string()
        .min(1, 'El CUIT es requerido')
        .regex(/^\d{2}-\d{8}-\d{1}$/, 'El CUIT debe tener el formato XX-XXXXXXXX-X'),
    businessAddress: z.string().min(1, 'La dirección comercial es requerida'),
    ivaCondition: z.string().min(1, 'La condición IVA es requerida'),
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
    dueDate: z.date({
        required_error: 'La fecha de vencimiento es requerida',
    }),
    concepto: z.nativeEnum(BillConcepto).optional(),
    details: z
        .array(billingDetailSchema)
        .min(1, 'Debe agregar al menos un detalle a la factura'),
    directTasks: z.array(z.any()).optional(),
    observations: z.string().optional(),
    withholdingAmount: z.number().optional(),
    status: z.nativeEnum(BillStatus),
    serviceOrderId: z.string().nullable().optional(),
});

type Props = {
    billingProfiles: ColumnBillingProfile[];
    businessId?: string;
};

export const CreateBillingForm = ({ billingProfiles, businessId }: Props) => {
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEmitting, setIsEmitting] = useState(false);

    // Mutations
    const createBillMutation = useCreateBill();
    const emitBillMutation = useEmitBill();

    const form = useForm<FormValues>({
        resolver: zodResolver(billingFormSchema),
        defaultValues: {
            isSingleService: false,
            details: [],
            directTasks: [],
            status: BillStatus.Borrador,
            comprobanteType: ComprobanteType.FacturaB,
        },
    });

    // Obtener el businessId del primer perfil de facturación seleccionado
    const selectedProfileId = form.watch('billingProfileId');
    const selectedProfile = billingProfiles.find((p) => p.id === selectedProfileId);
    const effectiveBusinessId = businessId || selectedProfile?.business?.id;

    // Debug: Verificar businessId
    console.log('CreateBillingForm - selectedProfileId:', selectedProfileId);
    console.log('CreateBillingForm - selectedProfile:', selectedProfile);
    console.log('CreateBillingForm - effectiveBusinessId:', effectiveBusinessId);

    // Preparar datos para enviar al backend
    const prepareFormData = (values: FormValues) => {
        const totals = calculateBillTotals(values.details);

        // Determinar el concepto AFIP basado en las fechas
        let concepto: BillConcepto = BillConcepto.Servicios;
        if (values.isSingleService) {
            concepto = BillConcepto.Productos;
        }

        return {
            businessId: effectiveBusinessId!,
            billingProfileId: values.billingProfileId,
            legalName: values.legalName,
            CUIT: values.cuit,
            billingAddress: values.businessAddress,
            IVACondition: values.ivaCondition,
            comprobanteType: values.comprobanteType,
            saleCondition: values.paymentCondition,
            pointOfSale: values.pointOfSale ?? null,
            punctualService: values.isSingleService,
            serviceDate: values.isSingleService ? values.dateFrom : undefined,
            startDate: !values.isSingleService ? values.dateFrom : undefined,
            endDate: !values.isSingleService ? values.dateTo : undefined,
            dueDate: values.dueDate,
            concepto,
            description: values.observations || '', // Descripción general de la factura
            observations: values.observations ?? null,
            withholdingAmount: values.withholdingAmount ?? null,
            status: values.status,
            serviceOrderId: values.serviceOrderId ?? null,
            details: values.details.map((detail) => ({
                description: detail.description,
                quantity: detail.quantity,
                unitPrice: detail.unitPrice,
                alicuotaIVA: detail.alicuotaIVA,
                taskId: detail.taskId ?? null,
            })),
            // IDs de tareas asociadas directamente
            taskIds: values.directTasks?.map((t) => t.id) || [],
            // Importes calculados
            totalAmount: totals.totalAmount,
            taxableNetAmount: totals.taxableNetAmount,
            nonTaxableNetAmount: totals.nonTaxableNetAmount,
            exemptAmount: totals.exemptAmount,
            ivaAmount: totals.ivaAmount,
            tributesAmount: totals.tributesAmount,
        };
    };

    // Guardar como borrador
    const handleSave = async () => {
        const isValid = await form.trigger();
        if (!isValid) {
            triggerAlert({
                type: 'Failure',
                message: 'Por favor revise el formulario y corrija los errores marcados',
            });
            return;
        }

        setIsSaving(true);
        try {
            const values = form.getValues();
            const data = prepareFormData(values);
            data.status = BillStatus.Borrador;

            const result = await createBillMutation.mutateAsync({ input: data });

            if (result.createBill.success) {
                triggerAlert({
                    type: 'Success',
                    message: 'La factura fue guardada como borrador',
                });
                router.push(routesBuilder.accounting.billing.list());
            } else {
                triggerAlert({
                    type: 'Failure',
                    message: result.createBill.message || 'No se pudo guardar la factura',
                });
            }
        } catch (error) {
            console.error('Error guardando factura:', error);
            triggerAlert({
                type: 'Failure',
                message: 'Error al guardar la factura',
            });
        } finally {
            setIsSaving(false);
        }
    };

    // Abrir modal de confirmación de emisión
    const handleEmitClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Validar el formulario
        const isValid = await form.trigger();
        if (!isValid) {
            triggerAlert({
                type: 'Failure',
                message: 'Por favor revise el formulario y corrija los errores marcados',
            });
            return;
        }

        // Validar punto de venta
        const pointOfSale = form.getValues('pointOfSale');
        if (!pointOfSale) {
            triggerAlert({
                type: 'Failure',
                message: 'Debe seleccionar un punto de venta para emitir la factura',
            });
            return;
        }

        setIsConfirmModalOpen(true);
    };

    // Confirmar y emitir factura
    const handleConfirmEmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsConfirmModalOpen(false);
        setIsEmitting(true);

        try {
            const values = form.getValues();
            const data = prepareFormData(values);
            data.status = BillStatus.Pendiente;

            // Primero crear la factura
            const createResult = await createBillMutation.mutateAsync({ input: data });

            if (!createResult.createBill.success || !createResult.createBill.bill) {
                triggerAlert({
                    type: 'Failure',
                    message:
                        createResult.createBill.message || 'No se pudo crear la factura',
                });
                return;
            }

            // Luego emitir la factura (enviar a AFIP)
            const billId = createResult.createBill.bill.id;
            const emitResult = await emitBillMutation.mutateAsync({ id: billId });

            if (emitResult.emitBill.success) {
                triggerAlert({
                    type: 'Success',
                    message: 'La factura fue emitida correctamente',
                });
                router.push(routesBuilder.accounting.billing.list());
            } else {
                triggerAlert({
                    type: 'Failure',
                    message:
                        emitResult.emitBill.message || 'No se pudo emitir la factura',
                });
            }
        } catch (error) {
            console.error('Error emitiendo factura:', error);
            triggerAlert({
                type: 'Failure',
                message: 'Error al emitir la factura',
            });
        } finally {
            setIsEmitting(false);
        }
    };

    return (
        <main className="flex flex-col gap-4 rounded-lg border border-accent bg-background-primary p-4">
            <Form {...form}>
                <form className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TypographyH2>Crear Factura</TypographyH2>
                    </div>

                    <ClientSection billingProfiles={billingProfiles} />
                    <InvoiceSection />
                    <DetailsSection businessId={effectiveBusinessId} />
                    <DirectTasksSection businessId={effectiveBusinessId} />
                    <TotalsSection />

                    <div className="flex items-center justify-end gap-2 border-t pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push(routesBuilder.accounting.billing.list())
                            }
                        >
                            Cancelar
                        </Button>
                        <ButtonWithSpinner
                            type="button"
                            variant="outline"
                            onClick={handleSave}
                            showSpinner={isSaving}
                            disabled={isSaving || isEmitting}
                        >
                            Guardar Borrador
                        </ButtonWithSpinner>
                        <ButtonWithSpinner
                            type="button"
                            onClick={handleEmitClick}
                            showSpinner={isEmitting}
                            disabled={isSaving || isEmitting}
                        >
                            Emitir Factura
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>

            <Modal
                openModal={isConfirmModalOpen}
                handleToggleModal={() => setIsConfirmModalOpen(false)}
                action={handleConfirmEmit}
                msg="¿Estás seguro que deseas emitir esta factura? Esta acción enviará la factura a la AFIP y no se puede deshacer."
            />
        </main>
    );
};
