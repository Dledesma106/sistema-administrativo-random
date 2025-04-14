import { Button } from '@/components/ui/button';
import { ExpenseReportModal } from '@/components/Modals/ExpenseReportModal';
import { useState } from 'react';

export function ExpenseReportButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Generar Reporte de Gastos
            </Button>

            <ExpenseReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
