import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

type FormValues = {
    business: string;
    businessName?: string;
    cuit: string;
    contactName: string;
    contactEmail: string;
    billingEmail: string;
};

type Props = {
    defaultValues?: FormValues;
    profileIdToUpdate?: string;
    businesses: { id: string; name: string }[];
};

const CreateOrUpdateBillingProfileForm = ({
    defaultValues,
    profileIdToUpdate,
    businesses,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            cuit: '',
            contactName: '',
            contactEmail: '',
            billingEmail: '',
        },
    });

    const watchBusiness = form.watch('business');
    const isNewBusiness = watchBusiness === 'other';

    const postMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            // Aquí iría tu mutación GraphQL para crear
            console.log('Creating billing profile:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El perfil de facturación fue creado correctamente',
            });
            router.push(routesBuilder.accounting.billingProfiles.list());
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const putMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!profileIdToUpdate) {
                throw new Error('No se pudo actualizar el perfil de facturación');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            // Aquí iría tu mutación GraphQL para actualizar
            console.log('Updating billing profile:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El perfil de facturación fue actualizado correctamente',
            });
            router.push(routesBuilder.accounting.billingProfiles.list());
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (profileIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main className="p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>
                    {profileIdToUpdate
                        ? 'Editar Perfil de Facturación'
                        : 'Crear Perfil de Facturación'}
                </h1>
            </TypographyH2>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="business"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Empresa</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione una empresa"
                                        searchPlaceholder="Buscar empresa"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={[
                                            {
                                                label: 'Otro',
                                                value: 'other',
                                            },
                                            ...businesses.map((business) => ({
                                                label: business.name,
                                                value: business.id,
                                            })),
                                        ]}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isNewBusiness && (
                        <FormField
                            name="businessName"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Empresa</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nombre de la empresa"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="cuit"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[0-9]{11}$/,
                                message: 'El CUIT debe tener 11 dígitos',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CUIT</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="CUIT sin guiones"
                                        type="number"
                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="contactName"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de Contacto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nombre de contacto"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="contactEmail"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email de Contacto</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email de contacto"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="billingEmail"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email de Facturación</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Email de facturación"
                                        type="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/accounting/billing-profiles')}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <ButtonWithSpinner
                            showSpinner={postMutation.isPending || putMutation.isPending}
                        >
                            Guardar
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

export default CreateOrUpdateBillingProfileForm;
