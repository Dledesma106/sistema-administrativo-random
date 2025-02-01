import { Button } from '@/components/ui/button';
import { TaskReportModal } from '@/components/Modals/TaskReportModal';

import { useState } from 'react';
import { Table } from '@tanstack/react-table';
import { TasksQuery } from '@/api/graphql';

type Props = {
    table: Table<NonNullable<TasksQuery['tasks']>[number]>;
};

export function TaskReportButton({ table }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Generar Reporte de Tareas
            </Button>

            <TaskReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                filters={table.getState().columnFilters}
            />
        </>
    );
}