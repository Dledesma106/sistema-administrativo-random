import { TaskStatus } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';

import { TasksQuery } from '@/api/graphql';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import useAlert from '@/context/alertContext/useAlert';
import { techAdmin } from '@/lib/apiEndpoints';
import fetcher from '@/lib/fetcher';
import { TASKS_LIST_QUERY_KEY } from '@/modules/TasksDataTable/queries';

interface Props {
    task: TasksQuery['tasks'][0];
    status: TaskStatus;
}

const options = [
    {
        label: 'Sin asignar',
        value: TaskStatus.SinAsignar,
    },
    {
        label: 'Pendiente',
        value: TaskStatus.Pendiente,
    },
    {
        label: 'Finalizada',
        value: TaskStatus.Finalizada,
    },
    {
        label: 'Aprobada',
        value: TaskStatus.Aprobada,
    },
];

const TasksDataTableStatusDropdown = ({ task, status }: Props): JSX.Element => {
    const queryClient = useQueryClient();

    const { triggerAlert } = useAlert();

    const changeTaskStatus = async (status: TaskStatus): Promise<void> => {
        try {
            await fetcher.put(
                {
                    ...task,
                    status,
                },
                techAdmin.tasks,
            );

            queryClient.setQueryData<TasksQuery>(TASKS_LIST_QUERY_KEY, (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                const newData: TasksQuery = {
                    ...oldData,
                    tasks: oldData.tasks.map((someTask) =>
                        someTask.id === task.id
                            ? {
                                  ...someTask,
                                  status: status,
                              }
                            : someTask,
                    ),
                };

                return newData;
            });

            triggerAlert({
                type: 'Success',
                message: 'El estado de la tarea fue actualizado correctamente',
            });
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'No se pudo actualizar el estado de la tarea',
            });
        }
    };

    return (
        <Select
            onValueChange={(value) => {
                changeTaskStatus(value as TaskStatus);
            }}
            value={status}
        >
            <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default TasksDataTableStatusDropdown;
