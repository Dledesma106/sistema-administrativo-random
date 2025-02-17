import { useRouter } from 'next/navigation';

import { TaskType } from '@prisma/client';
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

const taskTypeLabels: Record<TaskType, string> = {
    Preventivo: 'Preventivo',
    Correctivo: 'Correctivo',
    Instalacion: 'Instalación',
    Desmonte: 'Desmonte',
    Actualizacion: 'Actualización',
    InspeccionPolicial: 'Inspección Policial',
};

type FormValues = {
    business: string;
    taskType: TaskType;
    price: number;
};

type Props = {
    defaultValues?: FormValues;
    priceIdToUpdate?: string;
    businesses: { id: string; name: string }[];
};

const CreateOrUpdateTaskPriceForm = ({
    defaultValues,
    priceIdToUpdate,
    businesses,
}: Props): JSX.Element => {
    const router = useRouter();
    const { triggerAlert } = useAlert();

    const form = useForm<FormValues>({
        defaultValues: defaultValues || {
            price: 0,
        },
    });

    const postMutation = useMutation({
        mutationFn: async (form: FormValues) => {
            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            // Aquí iría tu mutación GraphQL para crear
            console.log('Creating task price:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El precio fue creado correctamente',
            });
            router.push('/accounting/task-prices');
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
            if (!priceIdToUpdate) {
                throw new Error('No se pudo actualizar el precio');
            }

            if (!form.business) {
                throw new Error('Debe seleccionar una empresa');
            }

            // Aquí iría tu mutación GraphQL para actualizar
            console.log('Updating task price:', form);
        },
        onSuccess: () => {
            triggerAlert({
                type: 'Success',
                message: 'El precio fue actualizado correctamente',
            });
            router.push('/accounting/task-prices');
        },
        onError: (error) => {
            triggerAlert({
                type: 'Failure',
                message: getCleanErrorMessage(error),
            });
        },
    });

    const onSubmit = (form: FormValues): void => {
        if (priceIdToUpdate) {
            putMutation.mutateAsync(form);
        } else {
            postMutation.mutateAsync(form);
        }
    };

    return (
        <main className="rounded-md border border-accent bg-background-primary p-4">
            <TypographyH2 asChild className="mb-4">
                <h1>
                    {priceIdToUpdate
                        ? 'Editar Precio por Tarea'
                        : 'Crear Precio por Tarea'}
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
                                        items={businesses.map((business) => ({
                                            label: business.name,
                                            value: business.id,
                                        }))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="taskType"
                        control={form.control}
                        rules={{
                            required: 'Este campo es requerido',
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Tarea</FormLabel>
                                <FormControl>
                                    <Combobox
                                        selectPlaceholder="Seleccione un tipo de tarea"
                                        searchPlaceholder="Buscar tipo de tarea"
                                        value={field.value ?? ''}
                                        onChange={field.onChange}
                                        items={Object.entries(taskTypeLabels).map(
                                            ([value, label]) => ({
                                                label,
                                                value,
                                            }),
                                        )}
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
                                        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        {...field}
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

                    <div className="flex flex-row justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.push(routesBuilder.accounting.taskPrices.list())
                            }
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

export default CreateOrUpdateTaskPriceForm;
