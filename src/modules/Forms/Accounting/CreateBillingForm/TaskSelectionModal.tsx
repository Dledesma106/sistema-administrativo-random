import { TaskStatus } from '@prisma/client';
import { useState, useMemo } from 'react';
import { BsSearch, BsCheck2, BsEye } from 'react-icons/bs';

import { TaskDetailModal } from './TaskDetailModal';
import { SelectedTask } from './types';

import { Badge } from '@/components/ui/Badges/badge';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useGetTasksWithoutBill } from '@/hooks/api/bill';

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (tasks: SelectedTask[]) => void;
    businessId?: string;
    // Tareas ya seleccionadas (para evitar duplicados)
    alreadySelectedTaskIds?: string[];
    // Si es true, permite selección múltiple
    multiSelect?: boolean;
};

export const TaskSelectionModal = ({
    open,
    onClose,
    onSelect,
    businessId,
    alreadySelectedTaskIds = [],
    multiSelect = true,
}: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([]);
    const [viewingTask, setViewingTask] = useState<SelectedTask | null>(null);

    console.log('Renderizando TaskSelectionModal con props:', {
        open,
        businessId,
        alreadySelectedTaskIds,
        multiSelect,
    });

    // Obtener tareas sin factura (solo cuando el modal está abierto)
    const { data, isLoading } = useGetTasksWithoutBill({
        // Solo pasar businessId si existe y no es undefined
        ...(businessId && { businessId }),
        // Solo pasar status si no es "all"
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
        take: 100,
        enabled: open, // Solo ejecutar cuando el modal está abierto
    });

    // Filtrar tareas por búsqueda y excluir las ya seleccionadas
    const filteredTasks = useMemo(() => {
        const tasks = data?.tasksWithoutBill || [];
        return tasks.filter((task) => {
            // Excluir tareas ya seleccionadas
            if (alreadySelectedTaskIds.includes(task.id)) {
                return false;
            }

            // Filtrar por término de búsqueda
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesNumber = task.taskNumber
                    ?.toLowerCase()
                    .includes(searchLower);
                const matchesDescription = task.description
                    ?.toLowerCase()
                    .includes(searchLower);
                const matchesClient = task.clientName
                    ?.toLowerCase()
                    .includes(searchLower);
                const matchesBranch = task.branch?.name
                    ?.toLowerCase()
                    .includes(searchLower);

                return (
                    matchesNumber || matchesDescription || matchesClient || matchesBranch
                );
            }

            return true;
        });
    }, [data?.tasksWithoutBill, searchTerm, alreadySelectedTaskIds]);

    const handleToggleTask = (task: SelectedTask) => {
        if (multiSelect) {
            const isSelected = selectedTasks.some((t) => t.id === task.id);
            if (isSelected) {
                setSelectedTasks(selectedTasks.filter((t) => t.id !== task.id));
            } else {
                setSelectedTasks([...selectedTasks, task]);
            }
        } else {
            setSelectedTasks([task]);
        }
    };

    const handleConfirm = () => {
        onSelect(selectedTasks);
        setSelectedTasks([]);
        onClose();
    };

    const handleClose = () => {
        setSelectedTasks([]);
        setViewingTask(null);
        onClose();
    };

    const isTaskSelected = (taskId: string) => {
        return selectedTasks.some((t) => t.id === taskId);
    };

    // Vista de detalle de tarea
    if (viewingTask) {
        return (
            <TaskDetailModal
                open={open}
                task={viewingTask}
                onClose={handleClose}
                onSelect={() => {
                    handleToggleTask(viewingTask);
                    setViewingTask(null);
                }}
                isSelected={isTaskSelected(viewingTask.id)}
                showSelectButton={true}
            />
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col">
                <DialogHeader>
                    <DialogTitle>Seleccionar Tareas</DialogTitle>
                    <DialogDescription>
                        Seleccione las tareas que desea asociar a la factura
                        {filteredTasks.length > 0 && (
                            <span className="ml-2 font-semibold text-foreground">
                                ({filteredTasks.length} tarea
                                {filteredTasks.length !== 1 ? 's' : ''} encontrada
                                {filteredTasks.length !== 1 ? 's' : ''})
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Filtros */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por número, descripción, cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="Aprobada">Aprobada</SelectItem>
                            <SelectItem value="Finalizada">Finalizada</SelectItem>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="SinAsignar">Sin Asignar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Información de tareas */}
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {(selectedTasks.length > 1 ||
                            (selectedTasks.length > 0 && multiSelect)) && (
                            <>
                                <span className="text-sm font-medium text-foreground">
                                    Seleccionadas:
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {selectedTasks.length} de {filteredTasks.length}
                                </span>
                                {selectedTasks.map((task) => (
                                    <Badge
                                        key={task.id}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => handleToggleTask(task)}
                                    >
                                        #{task.taskNumber} ✕
                                    </Badge>
                                ))}
                            </>
                        )}
                        {(!multiSelect ||
                            (multiSelect && selectedTasks.length === 0)) && (
                            <span className="text-sm text-muted-foreground">
                                {filteredTasks.length} tarea
                                {filteredTasks.length !== 1 ? 's' : ''} disponible
                                {filteredTasks.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabla de tareas */}
                <div className="flex-1 overflow-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Número</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Sucursal</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!businessId ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        Por favor seleccione un perfil de facturación
                                        primero para ver las tareas disponibles
                                    </TableCell>
                                </TableRow>
                            ) : isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center">
                                        Cargando tareas...
                                    </TableCell>
                                </TableRow>
                            ) : filteredTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-8 text-center">
                                        No hay tareas disponibles para facturar
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTasks.map((task) => {
                                    const selected = isTaskSelected(task.id);
                                    const taskData: SelectedTask = {
                                        id: task.id,
                                        taskNumber: task.taskNumber,
                                        description: task.description,
                                        status: task.status,
                                        closedAt: task.closedAt
                                            ? new Date(task.closedAt)
                                            : null,
                                        businessName: task.businessName,
                                        clientName:
                                            task.clientName ??
                                            task.branch?.client?.name ??
                                            null,
                                        branch: task.branch,
                                        customBranch: task.customBranch,
                                    };

                                    return (
                                        <TableRow
                                            key={task.id}
                                            className={`cursor-pointer ${selected ? 'bg-primary/10' : ''}`}
                                            onClick={() => handleToggleTask(taskData)}
                                        >
                                            <TableCell>
                                                <div
                                                    className={`flex size-5 items-center justify-center rounded border ${
                                                        selected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-input'
                                                    }`}
                                                >
                                                    {selected && <BsCheck2 size={14} />}
                                                </div>
                                            </TableCell>
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
                                                {task.branch?.name &&
                                                    `${task.branch?.name} `}
                                                {task.branch?.number &&
                                                    `#${task.branch?.number}`}
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setViewingTask(taskData);
                                                    }}
                                                >
                                                    <BsEye size={16} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedTasks.length === 0}>
                        Agregar{' '}
                        {selectedTasks.length > 0 ? `(${selectedTasks.length})` : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
