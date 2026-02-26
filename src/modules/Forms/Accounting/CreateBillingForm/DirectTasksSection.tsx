import { TaskStatus } from '@prisma/client';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { BsPlus, BsTrash, BsEye } from 'react-icons/bs';

import { TaskDetailModal } from './TaskDetailModal';
import { TaskSelectionModal } from './TaskSelectionModal';
import { FormValues, SelectedTask } from './types';

import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    businessId?: string;
};

export const DirectTasksSection = ({ businessId }: Props) => {
    const form = useFormContext<FormValues>();
    const directTasks =
        useWatch({
            control: form.control,
            name: 'directTasks',
        }) || [];

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [viewingTask, setViewingTask] = useState<SelectedTask | null>(null);

    // Obtener IDs de tareas ya asociadas (en detalles o directamente)
    const getAlreadySelectedTaskIds = (): string[] => {
        const details = form.getValues('details') || [];
        const existingDirectTasks = form.getValues('directTasks') || [];

        const detailTaskIds = details
            .map((d) => d.taskId)
            .filter((id): id is string => !!id);
        const directTaskIds = existingDirectTasks.map((t) => t.id);

        return [...detailTaskIds, ...directTaskIds];
    };

    const handleSelectTasks = (tasks: SelectedTask[]) => {
        const currentTasks = form.getValues('directTasks') || [];
        form.setValue('directTasks', [...currentTasks, ...tasks], {
            shouldValidate: true,
        });
    };

    const handleRemoveTask = (taskId: string) => {
        const currentTasks = form.getValues('directTasks') || [];
        form.setValue(
            'directTasks',
            currentTasks.filter((t) => t.id !== taskId),
            { shouldValidate: true },
        );
    };

    return (
        <section className="space-y-4 rounded-lg border border-accent p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Tareas Asociadas</h3>
                    <p className="text-sm text-muted-foreground">
                        Tareas vinculadas directamente a la factura (sin detalle
                        específico)
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-1"
                >
                    <BsPlus size={20} />
                    Agregar tareas
                </Button>
            </div>

            {directTasks.length === 0 ? (
                <div className="rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                    No hay tareas asociadas directamente.
                    <br />
                    <span className="text-sm">
                        Las tareas pueden asociarse a detalles específicos o directamente
                        a la factura.
                    </span>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-accent">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-t-0 border-accent">
                                <TableHead>Número</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Sucursal</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-24"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {directTasks.map((task) => (
                                <TableRow
                                    key={task.id}
                                    className="border-t-0 border-accent"
                                >
                                    <TableCell className="font-medium">
                                        #{task.taskNumber}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {task.description || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {task.clientName ||
                                            task.branch?.client?.name ||
                                            '-'}
                                    </TableCell>
                                    <TableCell>
                                        {task.branch?.name && `${task.branch?.name} `}
                                        {task.branch?.number && `#${task.branch?.number}`}
                                        {task.customBranch?.name &&
                                            `${task.customBranch?.name} `}
                                        {task.customBranch?.number &&
                                            `#${task.customBranch?.number}`}
                                    </TableCell>
                                    <TableCell>
                                        <TaskStatusBadge
                                            status={task.status as TaskStatus}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setViewingTask(task)}
                                            >
                                                <BsEye size={16} />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRemoveTask(task.id)}
                                            >
                                                <BsTrash size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Modal de selección de tareas */}
            <TaskSelectionModal
                open={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSelect={handleSelectTasks}
                businessId={businessId}
                alreadySelectedTaskIds={getAlreadySelectedTaskIds()}
                multiSelect={true}
            />

            <TaskDetailModal
                open={!!viewingTask}
                task={viewingTask}
                onClose={() => setViewingTask(null)}
            />
        </section>
    );
};
