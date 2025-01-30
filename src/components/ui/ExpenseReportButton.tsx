import { Button } from '@/components/ui/button';
import { ExpenseReportModal } from '@/components/Modals/ExpenseReportModal';
import { Table } from '@tanstack/react-table';
import { GetExpensesQuery } from '@/api/graphql';
import { useState } from 'react';

type Props = {
    table: Table<NonNullable<GetExpensesQuery['expenses']>[number]>;
};

export function ExpenseReportButton({ table }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                Generar Reporte de Gastos
            </Button>

            <ExpenseReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                filters={table.getState().columnFilters}
            />
        </>
    );
}