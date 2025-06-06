import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGenerateApprovedExpensesReport } from '@/hooks/api/expenses/useGenerateApprovedExpensesReport';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export function ExpenseReportModal({ isOpen, onClose }: Props) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const { generateReport, isGeneratingReport } = useGenerateApprovedExpensesReport();

    const handleGenerate = async () => {
        if (!startDate || !endDate) {
            return;
        }

        await generateReport({
            startDate: startDate,
            endDate: endDate,
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="translate-y-[-200px] border-accent">
                <DialogHeader>
                    <DialogTitle>Generar Reporte de Gastos</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Selecciona el rango de fechas para los gastos que queres descargar
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
                                        <CalendarIcon className="size-4 mr-2" />
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
                                        <CalendarIcon className="size-4 mr-2" />
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
