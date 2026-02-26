import { TaskStatus } from '@prisma/client';

import { SelectedTask } from './types';

import { TaskStatusBadge } from '@/components/ui/Badges/TaskStatusBadge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface TaskDetailModalProps {
    open: boolean;
    task: SelectedTask | null;
    onClose: () => void;
    onSelect?: (task: SelectedTask) => void;
    isSelected?: boolean;
    showSelectButton?: boolean;
}

export const TaskDetailModal = ({
    open,
    task,
    onClose,
    onSelect,
    isSelected = false,
    showSelectButton = false,
}: TaskDetailModalProps) => {
    if (!task) {
        return null;
    }

    console.log('task in modal', task);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Detalle de Tarea #{task.taskNumber}</DialogTitle>
                    <DialogDescription>
                        Información detallada de la tarea seleccionada
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Número de Tarea
                            </label>
                            <p className="text-lg font-semibold">#{task.taskNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Estado
                            </label>
                            <div>
                                <TaskStatusBadge status={task.status as TaskStatus} />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Descripción
                            </label>
                            <p>{task.description || 'Sin descripción'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Cliente
                            </label>
                            <p>{task.clientName || task.branch?.client?.name || '-'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Sucursal
                            </label>
                            <p>
                                {task.branch?.name && `${task.branch?.name} `}
                                {task.branch?.number && `#${task.branch?.number}`}
                                {task.customBranch?.name && `${task.customBranch?.name} `}
                                {task.customBranch?.number &&
                                    `#${task.customBranch?.number}`}
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Volver
                    </Button>
                    {showSelectButton && onSelect && (
                        <Button onClick={() => onSelect(task)}>
                            {isSelected ? 'Deseleccionar' : 'Seleccionar'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
