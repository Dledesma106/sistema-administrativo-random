import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ClientSection } from './ClientSection';
import { DetailsSection } from './DetailsSection';
import { DirectTasksSection } from './DirectTasksSection';
import { InvoiceSection } from './InvoiceSection';
import { billingFormSchema } from './schema';
import { TotalsSection } from './TotalsSection';
import { FormValues, calculateBillTotals } from './types';

import { BillConcepto, BillStatus, ComprobanteType } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useCreateBill, useEmitBill, useUpdateBill } from '@/hooks/api/bill';
import { routesBuilder } from '@/lib/routes';
import { ColumnBillingProfile } from '@/modules/tables/BillingProfilesTable/columns';

type Props = {
    billingProfiles: ColumnBillingProfile[];
    businessId?: string;
    // Para edición: valores iniciales y id de la factura a editar
    initialValues?: Partial<FormValues>;
    billId?: string;
};

export const CreateBillingForm = ({
    billingProfiles,
    businessId,
    initialValues,
    billId,
}: Props) => {
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEmitting, setIsEmitting] = useState(false);

    // Mutations
    const createBillMutation = useCreateBill();
    const updateBillMutation = useUpdateBill();
    const emitBillMutation = useEmitBill();

    const form = useForm<FormValues>({
        resolver: zodResolver(billingFormSchema),
        defaultValues: {
            isSingleService: false,
            details: [],
            directTasks: [],
            status: BillStatus.Borrador,
            comprobanteType: ComprobanteType.FacturaB,
            // Merge initial values when editing
            ...(initialValues || {}),
        },
    });

    // Obtener el businessId del primer perfil de facturación seleccionado
    const selectedProfileId = form.watch('billingProfileId');
    const selectedProfile = billingProfiles.find((p) => p.id === selectedProfileId);
    const effectiveBusinessId = businessId || selectedProfile?.business?.id;

    const isEmitted =
        initialValues?.status !== BillStatus.Borrador && !!initialValues?.status;
    // Preparar datos para enviar al backend
    const prepareFormData = (values: FormValues) => {
        const totals = calculateBillTotals(values.details);

        return {
            businessId: effectiveBusinessId!,
            billingProfileId: values.billingProfileId,
            comprobanteType: values.comprobanteType,
            saleCondition: values.paymentCondition,
            pointOfSale: values.pointOfSale ?? null,
            punctualService: values.isSingleService,
            serviceDate: values.isSingleService ? values.dateFrom : undefined,
            startDate: !values.isSingleService ? values.dateFrom : undefined,
            endDate: !values.isSingleService ? values.dateTo : undefined,
            dueDate: values.dueDate,
            concepto: BillConcepto.Servicios, // Siempre "Servicios" para este caso
            description: values.observations || '', // Descripción general de la factura
            observations: values.observations ?? null,
            withholdingAmount: values.withholdingAmount ?? null,
            status: values.status,
            serviceOrderId: values.serviceOrderId ?? null,
            details: values.details.map((detail) => ({
                id: detail.id ?? null, // Incluir ID para que el backend pueda identificar detalles existentes al actualizar
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
            data.status = values.status ? values.status : BillStatus.Borrador;
            if (billId) {
                const result = await updateBillMutation.mutateAsync({
                    id: billId,
                    input: data,
                });
                if (result.updateBill.success) {
                    triggerAlert({
                        type: 'Success',
                        message: 'La factura fue actualizada',
                    });
                    router.back();
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.updateBill.message ||
                            'No se pudo actualizar la factura',
                    });
                }
            } else {
                const result = await createBillMutation.mutateAsync({ input: data });

                if (result.createBill.success) {
                    triggerAlert({
                        type: 'Success',
                        message: 'La factura fue guardada como borrador',
                    });
                    router.back();
                } else {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            result.createBill.message || 'No se pudo guardar la factura',
                    });
                }
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
            if (billId) {
                // Actualizar la factura existente
                const updateResult = await updateBillMutation.mutateAsync({
                    id: billId,
                    input: data,
                });
                if (!updateResult.updateBill.success) {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            updateResult.updateBill.message ||
                            'No se pudo actualizar la factura antes de emitir',
                    });
                    return;
                }

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
            } else {
                // Primero crear la factura
                const createResult = await createBillMutation.mutateAsync({
                    input: data,
                });

                if (!createResult.createBill.success || !createResult.createBill.bill) {
                    triggerAlert({
                        type: 'Failure',
                        message:
                            createResult.createBill.message ||
                            'No se pudo crear la factura',
                    });
                    return;
                }

                // Luego emitir la factura (enviar a AFIP)
                const newBillId = createResult.createBill.bill.id;
                const emitResult = await emitBillMutation.mutateAsync({ id: newBillId });

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
                        <TypographyH2>
                            {billId ? 'Editar Factura' : 'Crear Factura'}
                        </TypographyH2>
                    </div>

                    <ClientSection
                        billingProfiles={billingProfiles}
                        disabled={isEmitted}
                    />
                    <InvoiceSection disabled={isEmitted} />
                    <DetailsSection
                        businessId={effectiveBusinessId}
                        disabled={isEmitted}
                    />
                    <DirectTasksSection businessId={effectiveBusinessId} />
                    <TotalsSection />

                    <div className="flex items-center justify-end gap-2 border-t border-accent pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancelar
                        </Button>
                        {!isEmitted && (
                            <ButtonWithSpinner
                                type="button"
                                variant="outline"
                                onClick={handleSave}
                                showSpinner={isSaving}
                                disabled={isSaving || isEmitting}
                            >
                                Guardar Borrador
                            </ButtonWithSpinner>
                        )}
                        {isEmitted && (
                            <ButtonWithSpinner
                                type="button"
                                onClick={handleSave}
                                showSpinner={isSaving}
                                disabled={isSaving || isEmitting}
                            >
                                Guardar Cambios
                            </ButtonWithSpinner>
                        )}
                        {!isEmitted && (
                            <ButtonWithSpinner
                                type="button"
                                onClick={handleEmitClick}
                                showSpinner={isEmitting}
                                disabled={isSaving || isEmitting}
                            >
                                Emitir Factura
                            </ButtonWithSpinner>
                        )}
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
