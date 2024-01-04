import { useRouter } from 'next/navigation';

import { PreventiveStatus } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { CreatePreventiveDocument, UpdatePreventiveDocument } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { FancyMultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';
import { EditPreventivePageProps } from '@/pages/tech-admin/preventives/[id]';
import * as types from 'backend/models/types';

type FormValues = {
    client: string;
    branch: string | null;
    business: string | null;
    assigned: {
        label: string;
        value: string;
    }[];
    frequency?: number | null;
    observations: string | null;
    months: {
        label: string;
        value: types.Month;
    }[];
    status: PreventiveStatus;
};

type Props = {
    defaultValues?: FormValues;
    preventiveIdToUpdate?: string;
} & EditPreventivePageProps;

const CreateOrUpdatePreventiveForm = ({
    preventiveIdToUpdate,
    branches,
    clients,
    technicians,
    defaultValues,
}: Props): JSX.Element => {
    const router = useRouter();
    const form = useForm<FormValues>({ defaultValues });
    const { watch, setValue } = form;
    const { triggerAlert } = useAlert();

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (type === 'change') {
                if (name === 'client') {
                    setValue('branch', null);
                    setValue('business', null);
                }

                if (name === 'branch') {
                    setValue('business', null);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, setValue]);

    const postMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!form.branch || !form.business) {
                throw new Error('Branch and business are required');
            }

            if (typeof form.frequency !== 'number') {
                throw new Error('Frequency is required');
            }

            return fetchClient(CreatePreventiveDocument, {
                data: {
                    assignedIDs: form.assigned.map((technician) => technician.value),
                    branchId: form.branch,
                    businessId: form.business,
                    frequency: form.frequency,
                    months: form.months.map((month) => month.value),
                    observations: form.observations,
                    status: PreventiveStatus.Pendiente,
                },
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: `El preventivo fue creado correctamente`,
            });
            router.push(routesBuilder.preventives.list());
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
            if (!preventiveIdToUpdate) {
                return;
            }

            if (!form.branch || !form.business) {
                throw new Error('Branch and business are required');
            }

            if (typeof form.frequency !== 'number') {
                throw new Error('Frequency is required');
            }

            return fetchClient(UpdatePreventiveDocument, {
                id: preventiveIdToUpdate,
                data: {
                    assignedIDs: form.assigned.map((technician) => technician.value),
                    branchId: form.branch,
                    businessId: form.business,
                    frequency: form.frequency,
                    months: form.months.map((month) => month.value),
                    observations: form.observations,
                    status: form.status,
                },
            });
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: `El preventivo fue actualizado correctamente`,
            });
            router.push(routesBuilder.preventives.list());
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (preventiveIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main>
            <TypographyH2 asChild className="mb-4">
                <h1>{preventiveIdToUpdate ? 'Editar Preventivo' : 'Crear Preventivo'}</h1>
            </TypographyH2>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="client"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Cliente</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione un cliente"
                                            searchPlaceholder="Buscar cliente"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={clients.map((client) => ({
                                                label: client.name,
                                                value: client.id,
                                            }))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="branch"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        disabled={form.watch('client') === undefined}
                        render={({ field }) => {
                            return (
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
                            );
                        }}
                    />

                    <FormField
                        name="business"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        disabled={form.watch('branch') === undefined}
                        render={({ field }) => {
                            return (
                                <FormItem
                                    className={
                                        field.disabled
                                            ? 'pointer-events-none opacity-30'
                                            : ''
                                    }
                                >
                                    <FormLabel>Empresa</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una empresa"
                                            searchPlaceholder="Buscar empresa"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            items={
                                                branches
                                                    .find(
                                                        (branch) =>
                                                            branch.id ===
                                                            form.watch('branch'),
                                                    )
                                                    ?.businesses.map((business) => ({
                                                        label: business.name,
                                                        value: business.id,
                                                    })) || []
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="assigned"
                        control={form.control}
                        rules={{
                            validate: (value) => {
                                if (!value || value.length === 0) {
                                    return 'Debe seleccionar al menos un tecnico';
                                }

                                return true;
                            },
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Tecnicos</FormLabel>
                                    <FormControl>
                                        <FancyMultiSelect
                                            placeholder="Seleccione un tecnico"
                                            onChange={field.onChange}
                                            options={technicians.map((technician) => ({
                                                label: technician.fullName,
                                                value: technician.id,
                                            }))}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="frequency"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Frecuencia</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione una frecuencia"
                                            searchPlaceholder="Buscar frecuencia"
                                            value={field.value?.toString() || ''}
                                            onChange={(val) => {
                                                if (val.length === 0) {
                                                    field.onChange(null);
                                                } else {
                                                    field.onChange(parseInt(val, 10));
                                                }
                                            }}
                                            items={types.frequencies.map(
                                                (frequency, index) => {
                                                    if (index === 0) {
                                                        return {
                                                            label: 'Todos los meses',
                                                            value: index.toString(),
                                                        };
                                                    }

                                                    return {
                                                        label: `Cada ${frequency} meses`,
                                                        value: index.toString(),
                                                    };
                                                },
                                            )}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Frecuencia en la que se realizara el preventivo
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="months"
                        control={form.control}
                        rules={{
                            validate: (value) => {
                                if (!value || value.length === 0) {
                                    return 'Debe seleccionar al menos un mes';
                                }

                                return true;
                            },
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Meses</FormLabel>
                                    <FormControl>
                                        <FancyMultiSelect
                                            placeholder="Seleccione un mes"
                                            onChange={field.onChange}
                                            options={types.months.map((month) => ({
                                                label: month,
                                                value: month,
                                            }))}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Meses impuestos por el cliente
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="observations"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Observaciones (opcional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese las observaciones"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="mt-4 flex flex-row justify-between">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                if (window.history?.length) {
                                    router.back();
                                } else {
                                    router.replace(routesBuilder.preventives.list());
                                }
                            }}
                        >
                            Cancelar
                        </Button>

                        <ButtonWithSpinner
                            type="submit"
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

export default CreateOrUpdatePreventiveForm;
