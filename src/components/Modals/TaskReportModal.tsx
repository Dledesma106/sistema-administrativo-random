import { ColumnFiltersState } from '@tanstack/react-table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGenerateApprovedTasksReport } from '@/hooks/api/tasks/useGenerateApprovedTasksReport';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    filters: ColumnFiltersState;
};

export function TaskReportModal({ isOpen, onClose, filters }: Props) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const { generateReport, isGeneratingReport } = useGenerateApprovedTasksReport();

    const handleGenerate = async () => {
        if (!startDate || !endDate) {
            return;
        }

        await generateReport({
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(endDate, 'yyyy-MM-dd'),
            filters,
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="border-accent">
                <DialogHeader>
                    <DialogTitle>Generar Reporte de Tareas</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Selecciona el rango de fechas para las tareas que queres descargar
                    {filters.length > 0 && ' (se aplicarán los filtros actuales)'}
                </p>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label>Fecha Inicio</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? (
                                            format(startDate, 'PP', { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    side="bottom"
                                    align="start"
                                    avoidCollisions={false}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        locale={es}
                                        disabled={{ after: new Date() }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label>Fecha Fin</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? (
                                            format(endDate, 'PP', { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    side="bottom"
                                    align="start"
                                    avoidCollisions={false}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        locale={es}
                                        disabled={{ after: new Date() }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGeneratingReport || !startDate || !endDate}
                        >
                            {isGeneratingReport ? 'Generando...' : 'Generar Reporte'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
