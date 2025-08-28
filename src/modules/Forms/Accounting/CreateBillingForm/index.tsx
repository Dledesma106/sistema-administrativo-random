import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { ClientSection } from './ClientSection';
import { DetailsSection } from './DetailsSection';
import { InvoiceSection } from './InvoiceSection';
import { TotalsSection } from './TotalsSection';
import { FormValues } from './types';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { BillingProfile } from '@/modules/tables/BillingProfilesTable/columns';

// Esquema de validación
const billingFormSchema = z.object({
    billingProfileId: z.string().min(1, 'Debe seleccionar un perfil de facturación'),
    legalName: z.string().min(1, 'El nombre legal es requerido'),
    cuit: z
        .string()
        .min(1, 'El CUIT es requerido')
        .regex(/^\d{2}-\d{8}-\d{1}$/, 'El CUIT debe tener el formato XX-XXXXXXXX-X'),
    businessAddress: z.string().min(1, 'La dirección comercial es requerida'),
    ivaCondition: z.string().min(1, 'La condición IVA es requerida'),
    invoiceType: z.enum(['A', 'B', 'C'], {
        required_error: 'Debe seleccionar un tipo de factura',
    }),
    paymentCondition: z.string().min(1, 'La condición de pago es requerida'),
    dateFrom: z.date({
        required_error: 'La fecha desde es requerida',
    }),
    dateTo: z.date().optional(),
    isSingleService: z.boolean(),
    dueDate: z.date({
        required_error: 'La fecha de vencimiento es requerida',
    }),
    details: z
        .array(
            z.object({
                description: z.string().min(1, 'La descripción es requerida'),
                quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
                unitPrice: z.number().min(0.01, 'El precio unitario debe ser mayor a 0'),
                ivaRate: z.number(),
                subtotal: z.number(),
                subtotalWithIva: z.number(),
            }),
        )
        .min(1, 'Debe agregar al menos un detalle a la factura'),
});

type Props = {
    billingProfiles: BillingProfile[];
};

export const CreateBillingForm = ({ billingProfiles }: Props) => {
    const router = useRouter();
    const { triggerAlert } = useAlert();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(billingFormSchema),
        defaultValues: {
            isSingleService: false,
            details: [],
        },
    });

    const handleEmitClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Validar el formulario usando React Hook Form
        const isValid = await form.trigger();

        if (!isValid) {
            // Mostrar mensaje general de error
            triggerAlert({
                type: 'Failure',
                message: 'Por favor revise el formulario y corrija los errores marcados',
            });
            return;
        }

        // Si la validación pasa, abrir el modal
        setIsConfirmModalOpen(true);
    };

    const handleConfirmEmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        const values = form.getValues();
        try {
            console.log('Valores del formulario:', values);
            // TODO: Implementar creación de factura
            triggerAlert({
                type: 'Success',
                message: 'La factura fue emitida correctamente',
            });
            router.push(routesBuilder.accounting.billing.list());
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'No se pudo emitir la factura',
            });
            console.error('Error:', error);
        }
    };

    const handleSave = () => {
        // Por ahora es igual que cancelar
        router.push(routesBuilder.accounting.billing.list());
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
                    <DetailsSection />
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
                        <Button type="button" variant="outline" onClick={handleSave}>
                            Guardar
                        </Button>
                        <ButtonWithSpinner type="button" onClick={handleEmitClick}>
                            Emitir
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>

            <Modal
                openModal={isConfirmModalOpen}
                handleToggleModal={() => setIsConfirmModalOpen(false)}
                action={handleConfirmEmit}
                msg="¿Estás seguro que deseas emitir esta factura? Esta acción no se puede deshacer."
            />
        </main>
    );
};
