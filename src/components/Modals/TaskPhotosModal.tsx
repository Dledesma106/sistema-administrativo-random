import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { GetBusinessesQuery } from '@/api/graphql';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useDownloadTaskPhotos } from '@/hooks/api/tasks/useDownloadTaskPhotos';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    businesses?: NonNullable<GetBusinessesQuery['businesses']>;
};

export function TaskPhotosModal({ isOpen, onClose, businesses = [] }: Props) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedBusiness, setSelectedBusiness] = useState<string>();

    const { downloadPhotos, isDownloading } = useDownloadTaskPhotos();

    const handleDownload = async () => {
        if (!startDate || !endDate || !selectedBusiness) {
            return;
        }

        await downloadPhotos({
            startDate: startDate,
            endDate: endDate,
            businessId: selectedBusiness,
        });

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="translate-y-[-200px] border-accent">
                <DialogHeader>
                    <DialogTitle>Descargar Fotos de Tareas</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Selecciona el rango de fechas y la empresa para las tareas cuyas fotos
                    quieres descargar
                </p>

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

                <div className="flex flex-col gap-2">
                    <label>Empresa</label>
                    <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar empresa" />
                        </SelectTrigger>
                        <SelectContent>
                            {businesses.map((business) => (
                                <SelectItem key={business.id} value={business.id}>
                                    {business.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading || !startDate || !endDate}
                    >
                        {isDownloading ? 'Descargando...' : 'Descargar Fotos'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
