import { useRouter } from 'next/navigation';

import { TaskStatus, TaskType } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { CreateTaskDocument, UpdateTaskDocument } from '@/api/graphql';
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
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { routesBuilder } from '@/lib/routes';
import { getCleanErrorMessage } from '@/lib/utils';
import { NewTaskPageProps } from '@/pages/tasks/new';
import { taskStatusesOptions, taskTypesOptions } from 'backend/models/types';

type FormValues = {
    client: string;
    branch: string | null;
    business: string | null;
    assignedIDs: {
        label: string;
        value: string;
    }[];
    description: string;
    taskType: TaskType;
    status: TaskStatus;
    actNumber: number | null;
    movitecTicket: string;
};

type Props = {
    defaultValues?: FormValues;
    taskIdToUpdate?: string;
} & NewTaskPageProps;

const CreateOrUpdateTaskForm = ({
    defaultValues,
    taskIdToUpdate,
    branches,
    clients,
    technicians,
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

    const watchedBusiness = watch('business');
    const watchedBranch = watch('branch');
    const selectedBranch = watchedBranch
        ? branches.find((branch) => branch.id === watchedBranch)
        : null;
    const selectedBusiness =
        watchedBusiness && selectedBranch
            ? selectedBranch.businesses.find(
                  (business) => business.id === watchedBusiness,
              )
            : null;

    const { triggerAlert } = useAlert();

    const postMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!form.branch) {
                throw new Error('Debe seleccionar una sucursal');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            return fetchClient(CreateTaskDocument, {
                input: {
                    auditor: null,
                    branch: form.branch,
                    business: form.business,
                    description: form.description,
                    status: form.status,
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

            if (!form.branch) {
                throw new Error('Debe seleccionar una sucursal');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            return fetchClient(UpdateTaskDocument, {
                id: taskIdToUpdate,
                input: {
                    auditor: null,
                    branch: form.branch,
                    business: form.business,
                    description: form.description,
                    status: form.status,
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
        <main>
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
                        name="assignedIDs"
                        control={form.control}
                        rules={{
                            validate: (value) => {
                                if (value.length === 0) {
                                    if (form.watch('status') !== TaskStatus.SinAsignar) {
                                        return 'Debe seleccionar al menos un tecnico';
                                    }
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
                                            items={taskTypesOptions}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        name="status"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                            validate: (value) => {
                                if (value !== TaskStatus.SinAsignar) {
                                    if (form.watch('assignedIDs').length === 0) {
                                        return 'Debe seleccionar al menos un tecnico';
                                    }
                                }

                                return true;
                            },
                        }}
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            selectPlaceholder="Seleccione un estado"
                                            searchPlaceholder="Buscar estado"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={taskStatusesOptions}
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
                                        <Input
                                            type="text"
                                            placeholder="Descripcion"
                                            {...field}
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
                                    router.replace(routesBuilder.tasks.list());
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

export default CreateOrUpdateTaskForm;
