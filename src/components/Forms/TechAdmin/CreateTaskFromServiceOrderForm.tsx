import { useRouter } from 'next/navigation';

import { TaskType } from '@prisma/client';
import { useForm } from 'react-hook-form';

import { type ServiceOrderQuery, type GetTaskQuery } from '@/api/graphql';
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
import { Textarea } from '@/components/ui/textarea';
import { TypographyH2 } from '@/components/ui/typography';
import useAlert from '@/context/alertContext/useAlert';
import { useCreateTaskFromServiceOrder } from '@/hooks/api/tasks/useCreateTaskFromServiceOrder';
import { useUpdateTaskFromServiceOrder } from '@/hooks/api/tasks/useUpdateTaskFromServiceOrder';
import { routesBuilder } from '@/lib/routes';
import {
    capitalizeFirstLetter,
    getCleanErrorMessage,
    pascalCaseToSpaces,
} from '@/lib/utils';

type FormValues = {
    description: string;
    taskType: TaskType;
    movitecTicket: string;
};

type Props = {
    serviceOrder: NonNullable<ServiceOrderQuery['serviceOrder']>;
    task?: NonNullable<GetTaskQuery['taskById']>;
    mode?: 'create' | 'edit';
};

const ServiceOrderTaskForm: React.FC<Props> = ({
    serviceOrder,
    task,
    mode = 'create',
}: Props): JSX.Element => {
    const router = useRouter();
    const isEditMode = mode === 'edit' && task;

    const form = useForm<FormValues>({
        defaultValues: {
            description: isEditMode ? task.description || '' : '',
            taskType: isEditMode ? task.taskType : TaskType.Correctivo,
            movitecTicket: isEditMode ? task.movitecTicket || '' : '',
        },
    });

    const { triggerAlert } = useAlert();

    const createTaskMutation = useCreateTaskFromServiceOrder(serviceOrder.id);
    const updateTaskMutation = useUpdateTaskFromServiceOrder(serviceOrder.id);

    // Verificar si la empresa es GIASA para mostrar el campo de Ticket Movitec
    const isGiasa = serviceOrder.business.name.toUpperCase().includes('GIASA');

    const mutation = isEditMode ? updateTaskMutation : createTaskMutation;

    const onSubmit = (formData: FormValues): void => {
        if (isEditMode) {
            updateTaskMutation.mutate(
                {
                    id: task.id,
                    input: {
                        // Campos editables
                        description: formData.description,
                        taskType: formData.taskType,
                        movitecTicket: formData.movitecTicket || null,
                        // Campos heredados de la orden de servicio (no modificables)
                        auditor: null,
                        branch: serviceOrder.branch?.id ?? null,
                        business: serviceOrder.business.id,
                        clientName: serviceOrder.clientName ?? null,
                        businessName: null,
                        actNumber: task.actNumber ?? null,
                        // Usar participants de la orden de servicio (contiene IDs y nombres externos)
                        assigned:
                            serviceOrder.assignedTechnicians.map((tech) => tech.id) || [],
                        serviceOrderId: serviceOrder.id,
                        customBranch: serviceOrder.customBranch
                            ? {
                                  name: serviceOrder.customBranch.name,
                                  number: serviceOrder.customBranch.number,
                              }
                            : null,
                    },
                },
                {
                    onSuccess: (data) => {
                        if (data.updateTask.success === false) {
                            triggerAlert({
                                type: 'Failure',
                                message:
                                    data.updateTask.message ??
                                    'Error al actualizar la tarea',
                            });
                            return;
                        }
                        triggerAlert({
                            type: 'Success',
                            message: 'La tarea fue actualizada correctamente',
                        });
                        router.push(routesBuilder.serviceOrders.details(serviceOrder.id));
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
            createTaskMutation.mutate(
                {
                    input: {
                        auditor: null,
                        branch: serviceOrder.branch?.id ?? null,
                        business: serviceOrder.business.id,
                        clientName: serviceOrder.clientName ?? null,
                        businessName: null,
                        description: formData.description,
                        taskType: formData.taskType,
                        actNumber: null, // Los técnicos lo completan desde la app móvil
                        assigned: serviceOrder.participants || [],
                        movitecTicket: formData.movitecTicket,
                        serviceOrderId: serviceOrder.id,
                        customBranch: serviceOrder.customBranch
                            ? {
                                  name: serviceOrder.customBranch.name,
                                  number: serviceOrder.customBranch.number,
                              }
                            : null,
                    },
                },
                {
                    onSuccess: (data) => {
                        if (data.createTask.success === false) {
                            triggerAlert({
                                type: 'Failure',
                                message:
                                    data.createTask.message ?? 'Error al crear la tarea',
                            });
                            return;
                        }
                        triggerAlert({
                            type: 'Success',
                            message: 'La tarea fue creada correctamente',
                        });
                        router.push(routesBuilder.serviceOrders.details(serviceOrder.id));
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

    // Determinar el nombre de la sucursal para mostrar
    const branchDisplay = serviceOrder.customBranch
        ? `${serviceOrder.customBranch.number ? `#${serviceOrder.customBranch.number} - ` : ''}${serviceOrder.customBranch.name || ''}`
        : serviceOrder.branch
          ? `${serviceOrder.branch.number ? `#${serviceOrder.branch.number} - ` : ''}${serviceOrder.branch.name || `${serviceOrder.branch.city?.name}, ${serviceOrder.branch.city?.province?.name}`}`
          : '-';

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>
                    {isEditMode
                        ? `Editar Tarea #${task.taskNumber}`
                        : 'Crear Tarea desde Orden de Servicio'}
                </h1>
            </TypographyH2>

            <div className="mb-6 space-y-3 rounded-md border border-accent bg-muted p-4">
                <h3 className="text-sm font-semibold text-primary">
                    Datos heredados de la Orden de Servicio
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Orden de Servicio:
                        </span>
                        <p className="mt-1">
                            OS-{String(serviceOrder.serviceOrderNumber).padStart(3, '0')}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Empresa:
                        </span>
                        <p className="mt-1">{serviceOrder.business.name}</p>
                    </div>
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Cliente:
                        </span>
                        <p className="mt-1">
                            {serviceOrder.clientName || serviceOrder.client?.name || '-'}
                        </p>
                    </div>
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Sucursal:
                        </span>
                        <p className="mt-1">{branchDisplay}</p>
                    </div>
                    {serviceOrder.subject && (
                        <div>
                            <span className="font-medium text-muted-foreground">
                                Asunto:
                            </span>
                            <p className="mt-1">{serviceOrder.subject}</p>
                        </div>
                    )}
                    <div>
                        <span className="font-medium text-muted-foreground">
                            Técnicos asignados:
                        </span>
                        <p className="mt-1">
                            {serviceOrder.participants.length > 0
                                ? serviceOrder.participants.map((tech) => tech).join(', ')
                                : 'Ninguno'}
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="taskType"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Tarea</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione un tipo"
                                        searchPlaceholder="Buscar tipo"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={Object.values(TaskType).map((type) => ({
                                            label: capitalizeFirstLetter(
                                                pascalCaseToSpaces(type),
                                            ),
                                            value: type,
                                        }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="description"
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción de la tarea"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {isGiasa && (
                        <FormField
                            name="movitecTicket"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ticket Movitec</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ticket de Movitec"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="flex flex-col justify-end gap-2 pt-4 sm:flex-row">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() =>
                                router.push(
                                    routesBuilder.serviceOrders.details(serviceOrder.id),
                                )
                            }
                        >
                            Cancelar
                        </Button>
                        <ButtonWithSpinner
                            type="submit"
                            showSpinner={mutation.isPending}
                            disabled={mutation.isPending}
                        >
                            {isEditMode ? 'Guardar Cambios' : 'Crear Tarea'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

export default ServiceOrderTaskForm;
// Alias para compatibilidad hacia atrás
export { ServiceOrderTaskForm as CreateTaskFromServiceOrderForm };
