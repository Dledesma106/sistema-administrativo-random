/* eslint-disable prettier/prettier */
import { useRouter } from 'next/navigation';

import { TaskType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import {
    CreateTaskDocument,
    UpdateTaskDocument,
    GetBusinessesQuery,
    GetClientsQuery,
    GetTechniciansQuery,
    GetBranchesQuery,
} from '@/api/graphql';
import { ButtonWithSpinner } from '@/components/ButtonWithSpinner';
import Combobox from '@/components/Combobox';
import { FancyMultiSelect } from '@/components/MultiSelect';
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
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';

type FormValues = {
    client?: string | null;
    branch?: string | null;
    business?: string | null;
    clientName?: string;
    businessName?: string;
    assignedIDs: {
        label: string;
        value: string;
    }[];
    description: string;
    taskType: TaskType;
    actNumber: number | null;
    movitecTicket: string;
};

type Props = {
    defaultValues?: FormValues;
    taskIdToUpdate?: string;
    branches: NonNullable<GetBranchesQuery['branches']>;
    clients: NonNullable<GetClientsQuery['clients']>;
    technicians: NonNullable<GetTechniciansQuery['technicians']>;
    businesses: NonNullable<GetBusinessesQuery['businesses']>;
};

const CreateOrUpdateTaskForm: React.FC<Props> = ({
    defaultValues,
    taskIdToUpdate,
    branches,
    clients,
    technicians,
    businesses,
}: Props): JSX.Element => {
    const router = useRouter();
    const form = useForm<FormValues>({
        defaultValues,
    });

    const { watch, setValue } = form;
    useEffect(() => {
        const subscription = watch((value, { type, name }) => {
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

    useEffect(() => {
        if (taskIdToUpdate) {
            if (!defaultValues?.client) {
                setValue('client', 'Otro');
            }
            if (!defaultValues?.branch) {
                setValue('branch', null);
            }
            if (!defaultValues?.business) {
                setValue('business', 'Otro');
            }
        }
    }, [
        taskIdToUpdate,
        defaultValues?.client,
        defaultValues?.branch,
        defaultValues?.business,
        setValue,
    ]);

    const watchedBusiness = watch('business');
    const watchedBranch = watch('branch');
    const selectedBranch = watchedBranch
        ? branches.find((branch) => branch.id === watchedBranch)
        : null;
    const businessOptions = [
        {
            label: 'Otro',
            value: 'Otro',
        },
        ...(selectedBranch
            ? selectedBranch.businesses
            : watch('client') === 'Otro'
              ? businesses
              : []
        ).map((business) => ({
            label: business.name,
            value: business.id,
        })),
    ];
    const selectedBusiness =
        watchedBusiness && selectedBranch
            ? selectedBranch.businesses.find(
                  (business) => business.id === watchedBusiness
              )
            : null;

    const { triggerAlert } = useAlert();

    const postMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!form.client) {
                throw new Error('Debe seleccionar un cliente');
            }

            if (form.client !== 'Otro' && !form.branch) {
                throw new Error('Debe seleccionar una sucursal');
            }

            if (form.client === 'Otro' && !form.clientName) {
                throw new Error('Debe especificar el nombre del cliente');
            }

            if (!form.businessName && !form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            if (form.business === 'Otro' && !form.businessName) {
                throw new Error('Debe especificar el nombre de la empresa');
            }

            return fetchClient(CreateTaskDocument, {
                input: {
                    auditor: null,
                    branch: form.branch ?? null,
                    business: form.business === 'Otro' ? null : (form.business ?? null),
                    clientName: form.clientName ?? null,
                    businessName: (form.businessName ?? null),
                    description: form.description,
                    taskType: form.taskType,
                    actNumber: form.actNumber,
                    assigned: form.assignedIDs.map((technician) => technician.value),
                    movitecTicket: form.movitecTicket,
                },
            });
        },
        onSuccess: (data) => {
            if (data.createTask.message) {
                triggerAlert({
                    type: 'Failure',
                    message: data.createTask.message,
                });
                return;
            }

            triggerAlert({
                type: 'Success',
                message: `La tarea fue creada correctamente`,
            });
            router.push(routesBuilder.tasks.list());
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
            if (!taskIdToUpdate) {
                throw new Error('No se pudo actualizar la tarea');
            }

            if (!form.client) {
                throw new Error('Debe seleccionar un cliente');
            }

            if (form.client !== 'Otro' && !form.branch) {
                throw new Error('Debe seleccionar una sucursal');
            }

            if (form.client === 'Otro' && !form.clientName) {
                throw new Error('Debe especificar el nombre del cliente');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            if (form.business === 'Otro' && !form.businessName) {
                throw new Error('Debe especificar el nombre de la empresa');
            }

            return fetchClient(UpdateTaskDocument, {
                id: taskIdToUpdate,
                input: {
                    auditor: null,
                    branch: form.branch ?? null,
                    business: form.business === 'Otro' ? null : form.business ?? null,
                    clientName: form.clientName ?? null,
                    businessName: form.businessName ?? null,
                    description: form.description,
                    taskType: form.taskType,
                    actNumber: form.actNumber,
                    assigned: form.assignedIDs.map((technician) => technician.value),
                    movitecTicket: form.movitecTicket,
                },
            });
        },
        onSuccess: (data) => {
            if (data?.updateTask.message) {
                triggerAlert({
                    type: 'Failure',
                    message: data.updateTask.message,
                });
                return;
            }

            triggerAlert({
                type: 'Success',
                message: `La tarea fue actualizada correctamente`,
            });
            router.push(routesBuilder.tasks.list());
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (taskIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>{taskIdToUpdate ? 'Editar Tarea' : 'Agregar Tarea'}</h1>
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
                                            value={field.value ?? ''}
                                            onChange={field.onChange}
                                            items={[
                                                {
                                                    label: 'Otro',
                                                    value: 'Otro',
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
                            );
                        }}
                    />

                    {watch('client') !== 'Otro' && (
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
                                                            branch.client.id ===
                                                            form.watch('client')
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
                    )}
                    {watch('client') === 'Otro' && (
                        <FormField
                            name="clientName"
                            control={form.control}
                            render={({ field }) => {
                                return (
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
                                );
                            }}
                        />
                    )}

                    <FormField
                        name="business"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        disabled={
                            form.watch('branch') === undefined &&
                            form.watch('client') !== 'Otro'
                        }
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

                    {watch('business') === 'Otro' && (
                        <FormField
                            name="businessName"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Nombre de la empresa</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nombre de la empresa"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    )}

                    <FormField
                        name="assignedIDs"
                        control={form.control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
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
                        name="taskType"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Tipo de tarea</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione un tipo de tarea"
                                            searchPlaceholder="Buscar tipo de tarea"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={Object.entries(TaskType).map(
                                                ([key, value]) => ({
                                                    label: key,
                                                    value: value,
                                                })
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    {selectedBusiness?.name === 'GIASA' && (
                        <FormField
                            name="movitecTicket"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Numero de ticket de Giasa</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Numero de ticket de Giasa"
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
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
                                    'La descripcion debe tener al menos 3 caracteres',
                            },
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Descripcion</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Ingrese la descripcion"
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="mt-4 flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => {
                                router.push(routesBuilder.tasks.list());
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

export default CreateOrUpdateTaskForm;
