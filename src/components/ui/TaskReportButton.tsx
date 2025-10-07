import { Button } from '@/components/ui/button';
import { TaskReportModal } from '@/components/Modals/TaskReportModal';

import { useState } from 'react';

export function TaskReportButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Generar Reporte de Tareas
            </Button>

            <TaskReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
