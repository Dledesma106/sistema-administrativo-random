import { useRouter } from 'next/navigation';

import { PreventiveStatus } from '@prisma/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { PreventiveFrequency } from '@/api/graphql';
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
import { useGetClientsWithBranches } from '@/hooks/api/client/useGetClientsWithBranches';
import { useCreatePreventive } from '@/hooks/api/preventive/useCreatePreventive';
import { useUpdatePreventive } from '@/hooks/api/preventive/useUpdatePreventive';
import { useGetTechnicians } from '@/hooks/api/user/useGetTechnicians';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage, cn } from '@/lib/utils';

export type Month =
    | 'Enero'
    | 'Febrero'
    | 'Marzo'
    | 'Abril'
    | 'Mayo'
    | 'Junio'
    | 'Julio'
    | 'Agosto'
    | 'Septiembre'
    | 'Octubre'
    | 'Noviembre'
    | 'Diciembre';

type FormValues = {
    client: string;
    branch: string | null;
    business: string | null;
    assigned: {
        label: string;
        value: string;
    }[];
    frequency?: PreventiveFrequency | null;
    observations: string | null;
    months: {
        label: string;
        value: Month;
    }[];
    status: PreventiveStatus;
    lastDoneAt: Date | null;
    batteryChangedAt: Date | null;
};

type Props = {
    defaultValues?: FormValues;
    preventiveIdToUpdate?: string;
    clients: NonNullable<ReturnType<typeof useGetClientsWithBranches>['data']>['clients'];
    technicians: NonNullable<ReturnType<typeof useGetTechnicians>['data']>['technicians'];
};

export const MONTHS: Month[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

const CreateOrUpdatePreventiveForm = ({
    preventiveIdToUpdate,
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
    // Reemplazar las mutaciones existentes con los hooks personalizados
    const createPreventive = useCreatePreventive();
    const updatePreventive = useUpdatePreventive();

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

    const onSubmit = (form: FormValues): void => {
        // Validar que las fechas no sean futuras
        const now = new Date();
        if (form.lastDoneAt && new Date(form.lastDoneAt) > now) {
            triggerAlert({
                type: 'Failure',
                message: 'La fecha de último mantenimiento no puede ser futura',
            });
            return;
        }

        if (form.batteryChangedAt && new Date(form.batteryChangedAt) > now) {
            triggerAlert({
                type: 'Failure',
                message: 'La fecha de cambio de batería no puede ser futura',
            });
            return;
        }

        const input = {
            assignedIds: form.assigned.map((technician) => technician.value),
            branchId: form.branch ?? '',
            businessId: form.business ?? '',
            frequency: form.frequency ?? null,
            lastDoneAt: form.lastDoneAt ? form.lastDoneAt : null,
            batteryChangedAt: form.batteryChangedAt ? form.batteryChangedAt : null,
            months: form.months.map((month) => month.value),
            observations: form.observations,
            status: preventiveIdToUpdate ? form.status : PreventiveStatus.Pendiente,
        };

        if (preventiveIdToUpdate) {
            updatePreventive.mutate(
                {
                    id: preventiveIdToUpdate,
                    input,
                },
                {
                    onSuccess: () => {
                        triggerAlert({
                            type: 'Success',
                            message: 'El preventivo fue actualizado correctamente',
                        });
                        router.push(routesBuilder.preventives.list());
                    },
                    onError: (error) => {
                        triggerAlert({
                            type: 'Failure',
                            message: getCleanErrorMessage(error),
                        });
                    },
                },
            );
        } else {
            createPreventive.mutate(
                {
                    input: {
                        ...input,
                        status: PreventiveStatus.Pendiente,
                    },
                },
                {
                    onSuccess: () => {
                        triggerAlert({
                            type: 'Success',
                            message: 'El preventivo fue creado correctamente',
                        });
                        router.push(routesBuilder.preventives.list());
                    },
                    onError: (error) => {
                        triggerAlert({
                            type: 'Failure',
                            message: getCleanErrorMessage(error),
                        });
                    },
                },
            );
        }
    };

    const branchOptions =
        clients
            .find((client) => client.id === form.watch('client'))
            ?.branches.map((branch) => ({
                label: `${branch.number ? `${branch.number} - ` : ''}${
                    branch.name ? `${branch.name} - ` : ''
                }${branch.city.name}`,
                value: branch.id,
            })) || [];

    const businessOptions =
        clients
            .find((client) => client.id === form.watch('client'))
            ?.branches.find((branch) => branch.id === form.watch('branch'))
            ?.businesses.map((business) => ({
                label: business.name,
                value: business.id,
            })) || [];

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
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
                                            items={branchOptions}
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
                                            items={businessOptions}
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
                                <FormLabel>Frecuencia</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione la frecuencia"
                                        searchPlaceholder="Buscar frecuencia"
                                        value={field.value ?? ''}
                                        onChange={(value) => {
                                            field.onChange(
                                                value
                                                    ? (value as PreventiveFrequency)
                                                    : null,
                                            );
                                            if (value) {
                                                form.setValue('months', []);
                                            }
                                        }}
                                        items={[
                                            {
                                                label: 'Mensual',
                                                value: PreventiveFrequency.Mensual,
                                            },
                                            {
                                                label: 'Bimestral',
                                                value: PreventiveFrequency.Bimestral,
                                            },
                                            {
                                                label: 'Trimestral',
                                                value: PreventiveFrequency.Trimestral,
                                            },
                                            {
                                                label: 'Cuatrimestral',
                                                value: PreventiveFrequency.Cuatrimestral,
                                            },
                                            {
                                                label: 'Semestral',
                                                value: PreventiveFrequency.Semestral,
                                            },
                                        ]}
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
                                            if (value.length > 0) {
                                                form.setValue('frequency', null);
                                            }
                                        }}
                                        options={MONTHS.map((month) => ({
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
                                                <CalendarIcon className="size-4 ml-auto opacity-50" />
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
                                                <CalendarIcon className="size-4 ml-auto opacity-50" />
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

                    <div className="mt-4 flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                router.push(routesBuilder.preventives.list());
                            }}
                        >
                            Cancelar
                        </Button>

                        <ButtonWithSpinner
                            type="submit"
                            showSpinner={
                                createPreventive.isPending || updatePreventive.isPending
                            }
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
