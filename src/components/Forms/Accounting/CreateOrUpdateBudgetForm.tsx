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
import { NewBudgetPageProps } from '@/pages/accounting/budgets/new';

type FormValues = {
    client?: string | null;
    clientName?: string;
    branch?: string | null;
    business: string;
    description: string;
    price: number;
    businessName?: string;
    businessCUIT?: string;
    businessContactEmail?: string;
    businessBillingEmail?: string;
};

type Props = {
    defaultValues?: FormValues;
    budgetIdToUpdate?: string;
    businesses: { id: string; name: string }[];
    clients: { id: string; name: string }[];
    branches: { id: string; number: string; city: { name: string }; clientId: string }[];
} & NewBudgetPageProps;

const CreateOrUpdateBudgetForm = ({
    defaultValues,
    budgetIdToUpdate,
    businesses,
    clients,
    branches,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            description: '',
            price: 0,
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
            console.log('Creating budget:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El presupuesto fue creado correctamente',
            });
            router.push(routesBuilder.accounting.budgets.list());
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
            if (!budgetIdToUpdate) {
                throw new Error('No se pudo actualizar el presupuesto');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            // Aquí iría tu mutación GraphQL para actualizar
            console.log('Updating budget:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El presupuesto fue actualizado correctamente',
            });
            router.push(routesBuilder.accounting.budgets.list());
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (budgetIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main className="p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>{budgetIdToUpdate ? 'Editar Presupuesto' : 'Crear Presupuesto'}</h1>
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
                        <div className="space-y-4 rounded-lg border border-gray-200 p-4">
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

                            <FormField
                                name="businessCUIT"
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
                                name="businessContactEmail"
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
                                name="businessBillingEmail"
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
                        </div>
                    )}

                    <FormField
                        name="client"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione un cliente"
                                        searchPlaceholder="Buscar cliente"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={[
                                            {
                                                label: 'Otro',
                                                value: 'other',
                                            },
                                            ...clients.map((client) => ({
                                                label: client.name,
                                                value: client.id,
                                            })),
                                        ]}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.watch('client') === 'Otro' && (
                        <FormField
                            name="clientName"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del cliente</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nombre del cliente"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.watch('client') !== 'Otro' && (
                        <FormField
                            name="branch"
                            control={form.control}
                            rules={{
                                required: 'Este campo es requerido',
                            }}
                            disabled={form.watch('client') === undefined}
                            render={({ field }) => (
                                <FormItem
                                    className={
                                        field.disabled
                                            ? 'pointer-events-none opacity-30'
                                            : ''
                                    }
                                >
                                    <FormLabel>Sucursal</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una sucursal"
                                            searchPlaceholder="Buscar sucursal"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={branches
                                                .filter(
                                                    (branch) =>
                                                        branch.clientId ===
                                                        form.watch('client'),
                                                )
                                                .map((branch) => ({
                                                    label: `${branch.number}, ${branch.city.name}`,
                                                    value: branch.id,
                                                }))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        name="description"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 3,
                                message:
                                    'La descripción debe tener al menos 3 caracteres',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Descripción del presupuesto"
                                        type="text"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="price"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            min: {
                                value: 0,
                                message: 'El precio debe ser mayor a 0',
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Precio"
                                        type="number"
                                        {...field}
                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            field.onChange(value);
                                        }}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/accounting/budgets')}
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

export default CreateOrUpdateBudgetForm;
