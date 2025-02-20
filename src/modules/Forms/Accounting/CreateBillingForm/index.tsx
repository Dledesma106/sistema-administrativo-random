import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';

import { ClientSection } from './ClientSection';
import { DetailsSection } from './DetailsSection';
import { InvoiceSection } from './InvoiceSection';
import { TotalsSection } from './TotalsSection';
import { FormValues } from './types';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { BillingProfile } from '@/modules/tables/BillingProfilesTable/columns';

type Props = {
    billingProfiles: BillingProfile[];
};

export const CreateBillingForm = ({ billingProfiles }: Props) => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: {
            isSingleService: false,
            details: [],
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            console.log('Valores del formulario:', values);
            // TODO: Implementar creación de factura
            triggerAlert({
                type: 'Success',
                message: 'La factura fue creada correctamente',
            });
            router.push(routesBuilder.accounting.billing.list());
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'No se pudo crear la factura',
            });
            console.error('Error:', error);
        }
    };

    return (
        <main className="flex flex-col gap-4 rounded-lg border border-accent bg-background-primary p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TypographyH2>Crear Factura</TypographyH2>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.push(routesBuilder.accounting.billing.list())
                                }
                            >
                                Cancelar
                            </Button>
                            <ButtonWithSpinner type="submit">Crear</ButtonWithSpinner>
                        </div>
                    </div>

                    <ClientSection billingProfiles={billingProfiles} />
                    <InvoiceSection />
                    <DetailsSection />
                    <TotalsSection />
                </form>
            </Form>
        </main>
    );
};
