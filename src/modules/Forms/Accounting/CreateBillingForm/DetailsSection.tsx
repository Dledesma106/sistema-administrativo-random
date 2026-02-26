import { useState, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { BsPlus, BsTrash, BsLink45Deg, BsX } from 'react-icons/bs';

import { TaskDetailModal } from './TaskDetailModal';
import { TaskSelectionModal } from './TaskSelectionModal';
import { FormValues, SelectedTask, BillingDetail, calculateDetailIva } from './types';

import { AlicuotaIva } from '@/api/graphql';
import Combobox from '@/components/Combobox';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlicuotaIVALabel } from '@/lib/utils';

const IVA_RATES: { value: AlicuotaIva; label: string }[] = Object.values(AlicuotaIva).map(
    (value) => {
        const label = AlicuotaIVALabel(value);
        return {
            value,
            label,
        };
    },
);

type Props = {
    businessId?: string;
    disabled?: boolean;
};

export const DetailsSection = ({ businessId, disabled }: Props) => {
    const form = useFormContext<FormValues>();
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: 'details',
    });

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null);
    const [viewingTask, setViewingTask] = useState<SelectedTask | null>(null);

    // Recalcular subtotales cuando cambian quantity, unitPrice o alicuotaIVA
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (
                name?.startsWith('details.') &&
                name?.match(/\.(quantity|unitPrice|alicuotaIVA)$/)
            ) {
                const match = name.match(/^details\.(\d+)\./);
                if (match) {
                    const index = parseInt(match[1]);
                    const detail = value.details?.[index];
                    if (
                        detail &&
                        typeof detail.quantity === 'number' &&
                        typeof detail.unitPrice === 'number' &&
                        detail.alicuotaIVA
                    ) {
                        const calculated = calculateDetailIva(
                            detail.quantity,
                            detail.unitPrice,
                            detail.alicuotaIVA as AlicuotaIva,
                        );
                        form.setValue(`details.${index}.subtotal`, calculated.subtotal);
                        form.setValue(`details.${index}.ivaAmount`, calculated.ivaAmount);
                        form.setValue(
                            `details.${index}.subtotalWithIva`,
                            calculated.subtotalWithIva,
                        );
                    }
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    // Obtener IDs de tareas ya asociadas (en detalles o directamente)
    const getAlreadySelectedTaskIds = (): string[] => {
        const details = form.getValues('details') || [];
        const directTasks = form.getValues('directTasks') || [];

        const detailTaskIds = details
            .map((d) => d.taskId)
            .filter((id): id is string => !!id);
        const directTaskIds = directTasks.map((t) => t.id);

        return [...detailTaskIds, ...directTaskIds];
    };

    const handleAddDetail = () => {
        const newDetail: Omit<BillingDetail, 'id'> = {
            description: '',
            quantity: 1,
            unitPrice: 0,
            alicuotaIVA: 'IVA_21',
            subtotal: 0,
            ivaAmount: 0,
            subtotalWithIva: 0,
            taskId: null,
            task: null,
        };
        append(newDetail);
    };

    const handleOpenTaskModal = (detailIndex: number) => {
        setSelectedDetailIndex(detailIndex);
        setIsTaskModalOpen(true);
    };

    const handleSelectTaskForDetail = (tasks: SelectedTask[]) => {
        if (selectedDetailIndex !== null && tasks.length > 0) {
            const task = tasks[0]; // Solo tomamos la primera tarea para un detalle
            const currentDetail = form.getValues(`details.${selectedDetailIndex}`);

            const updatedDetail: Omit<BillingDetail, 'id'> = {
                ...currentDetail,
                taskId: task.id,
                task: task,
                // Si la descripción está vacía, usar la de la tarea
                description:
                    currentDetail.description ||
                    task.description ||
                    `Tarea #${task.taskNumber}`,
            };

            update(selectedDetailIndex, updatedDetail);
        }
        setSelectedDetailIndex(null);
    };

    const handleRemoveTaskFromDetail = (index: number) => {
        const currentDetail = form.getValues(`details.${index}`);
        const updatedDetail: Omit<BillingDetail, 'id'> = {
            ...currentDetail,
            taskId: null,
            task: null,
        };
        update(index, updatedDetail);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(value);
    };

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detalles</h3>
                {!disabled && (
                    <Button
                        type="button"
                        onClick={handleAddDetail}
                        className="flex items-center gap-1"
                    >
                        <BsPlus size={20} />
                        Agregar detalle
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {fields.length === 0 && (
                    <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                        No hay detalles agregados. Haga clic en &quot;Agregar
                        detalle&quot; para comenzar.
                    </div>
                )}

                {fields.map((field, index) => {
                    const detail = form.watch(`details.${index}`);

                    return (
                        <div
                            key={field.id}
                            className="space-y-4 rounded-lg border border-accent p-4"
                        >
                            {/* Tarea asociada */}
                            {detail?.task ? (
                                <div
                                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-muted p-2 hover:bg-muted/80"
                                    onClick={() => setViewingTask(detail.task ?? null)}
                                >
                                    <BsLink45Deg className="text-primary" size={18} />
                                    <span className="text-sm">
                                        Tarea vinculada:{' '}
                                        <span className="font-medium">
                                            #{detail.task.taskNumber}
                                        </span>
                                        {detail.task.clientName && (
                                            <span className="text-muted-foreground">
                                                {' '}
                                                - {detail.task.clientName}
                                            </span>
                                        )}
                                        {detail.task.branch?.client?.name && (
                                            <span className="text-muted-foreground">
                                                {' '}
                                                - {detail.task.branch.client.name}
                                            </span>
                                        )}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="ml-auto size-6"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTaskFromDetail(index);
                                        }}
                                    >
                                        <BsX size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => handleOpenTaskModal(index)}
                                    title="Asociar una tarea a este detalle de factura"
                                >
                                    <BsLink45Deg size={16} />
                                    Vincular tarea
                                </Button>
                            )}

                            {/* Campos del detalle */}
                            <div className="grid grid-cols-12 gap-4">
                                <FormField
                                    disabled={disabled}
                                    control={form.control}
                                    name={`details.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-12">
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    disabled={disabled}
                                    name={`details.${index}.quantity`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Cantidad</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    min={1}
                                                    step={0.01}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(e.target.value) ||
                                                                0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    disabled={disabled}
                                    name={`details.${index}.unitPrice`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Precio unitario</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    min={0}
                                                    step={0.01}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(e.target.value) ||
                                                                0,
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`details.${index}.alicuotaIVA`}
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Alícuota IVA</FormLabel>
                                            <Combobox
                                                disabled={disabled}
                                                items={IVA_RATES}
                                                value={field.value || ''}
                                                onChange={(value) =>
                                                    field.onChange(value || undefined)
                                                }
                                                selectPlaceholder="Seleccione tipo"
                                                searchPlaceholder="Buscar tipo"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="col-span-2">
                                    <FormLabel>Subtotal</FormLabel>
                                    <div className="mt-2 h-10 rounded-md border border-accent bg-muted px-3 py-2 text-sm">
                                        {formatCurrency(detail?.subtotal || 0)}
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <FormLabel>IVA</FormLabel>
                                    <div className="mt-2 h-10 rounded-md border border-accent bg-muted px-3 py-2 text-sm">
                                        {formatCurrency(detail?.ivaAmount || 0)}
                                    </div>
                                </div>

                                <div className="col-span-1 flex items-end">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        disabled={disabled}
                                        onClick={() => remove(index)}
                                    >
                                        <BsTrash size={16} />
                                    </Button>
                                </div>
                            </div>

                            {/* Total del detalle */}
                            <div className="flex justify-end">
                                <div className="text-right">
                                    <span className="text-sm text-muted-foreground">
                                        Total con IVA:{' '}
                                    </span>
                                    <span className="font-semibold">
                                        {formatCurrency(detail?.subtotalWithIva || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de selección de tareas */}
            <TaskSelectionModal
                open={isTaskModalOpen}
                onClose={() => {
                    setIsTaskModalOpen(false);
                    setSelectedDetailIndex(null);
                }}
                onSelect={handleSelectTaskForDetail}
                businessId={businessId}
                alreadySelectedTaskIds={getAlreadySelectedTaskIds()}
                multiSelect={false}
            />
            <TaskDetailModal
                open={!!viewingTask}
                task={viewingTask}
                onClose={() => setViewingTask(null)}
                showSelectButton={false}
            />
        </section>
    );
};
