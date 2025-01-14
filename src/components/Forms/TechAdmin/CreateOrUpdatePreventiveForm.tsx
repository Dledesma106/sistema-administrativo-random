import { useRouter } from 'next/navigation';

import { PreventiveStatus } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { CreatePreventiveDocument, UpdatePreventiveDocument } from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { FancyMultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage, cn } from '@/lib/utils';
import { EditPreventivePageProps } from '@/pages/tech-admin/preventives/[id]/edit';
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
    lastDoneAt: Date | null;
    batteryChangedAt: Date | null;
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
    const form = useForm<FormValues>({
        defaultValues,
        resolver: (values) => {
            const errors: Record<string, { type: string; message: string }> = {};

            // Validar que se use frequency O months, pero no ambos
            if (values.frequency && values.months?.length > 0) {
                errors.frequency = {
                    type: 'manual',
                    message: 'No puede especificar frecuencia y meses simultáneamente',
                };
                errors.months = {
                    type: 'manual',
                    message: 'No puede especificar frecuencia y meses simultáneamente',
                };
            }

            // Validar que al menos uno esté presente
            if (!values.frequency && (!values.months || values.months.length === 0)) {
                errors.frequency = {
                    type: 'manual',
                    message: 'Debe especificar una frecuencia o seleccionar meses',
                };
                errors.months = {
                    type: 'manual',
                    message: 'Debe especificar una frecuencia o seleccionar meses',
                };
            }

            return {
                values,
                errors,
            };
        },
    });
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

            return fetchClient(CreatePreventiveDocument, {
                data: {
                    assignedIDs: form.assigned.map((technician) => technician.value),
                    branchId: form.branch,
                    businessId: form.business,
                    lastDoneAt: form.lastDoneAt,
                    batteryChangedAt: form.batteryChangedAt,
                    frequency: form.frequency ?? 0,
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

            return fetchClient(UpdatePreventiveDocument, {
                id: preventiveIdToUpdate,
                data: {
                    assignedIDs: form.assigned.map((technician) => technician.value),
                    branchId: form.branch,
                    businessId: form.business,
                    frequency: form.frequency ?? 0,
                    lastDoneAt: form.lastDoneAt,
                    batteryChangedAt: form.batteryChangedAt,
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
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frecuencia (meses)</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione la frecuencia"
                                        searchPlaceholder="Buscar frecuencia"
                                        value={field.value?.toString() ?? ''}
                                        onChange={(value) => {
                                            const numValue = value
                                                ? parseInt(value)
                                                : null;
                                            field.onChange(numValue);
                                            if (numValue) {
                                                form.setValue('months', []);
                                            }
                                        }}
                                        items={Array.from({ length: 12 }, (_, i) => ({
                                            label: `${i + 1} ${
                                                i + 1 === 1 ? 'mes' : 'meses'
                                            }`,
                                            value: (i + 1).toString(),
                                        }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="months"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meses</FormLabel>
                                <FormControl>
                                    <FancyMultiSelect
                                        {...field}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            // Limpiar frecuencia si se seleccionan meses
                                            if (value.length > 0) {
                                                form.setValue('frequency', null);
                                            }
                                        }}
                                        options={types.months.map((month) => ({
                                            label: month,
                                            value: month,
                                        }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="lastDoneAt"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Última fecha realizado</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP', {
                                                        locale: es,
                                                    })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="batteryChangedAt"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Última fecha de cambio de batería</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, 'PPP', {
                                                        locale: es,
                                                    })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={field.onChange}
                                            disabled={(date) => date > new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="observations"
                        control={form.control}
                        render={({ field }) => (
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
                        )}
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
