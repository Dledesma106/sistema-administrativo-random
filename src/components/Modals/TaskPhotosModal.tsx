import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download, AlertCircle } from 'lucide-react';
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

import { Progress } from '../ui/progress';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    businesses?: NonNullable<GetBusinessesQuery['businesses']>;
};

export function TaskPhotosModal({ isOpen, onClose, businesses = [] }: Props) {
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [selectedBusiness, setSelectedBusiness] = useState<string>();
    const [progress, setProgress] = useState<{
        stage:
            | 'idle'
            | 'fetching-keys'
            | 'downloading'
            | 'compressing'
            | 'completed'
            | 'error';
        message: string;
        progress: number;
        totalFiles?: number;
        processedFiles?: number;
    }>({
        stage: 'idle',
        message: '',
        progress: 0,
    });

    const downloadPhotosMutation = useDownloadTaskPhotos();

    const handleDownload = async () => {
        if (!startDate || !endDate || !selectedBusiness) {
            return;
        }

        try {
            setProgress({
                stage: 'fetching-keys',
                message: 'Obteniendo lista de fotos...',
                progress: 0,
            });

            await downloadPhotosMutation.mutateAsync({
                startDate: startDate,
                endDate: endDate,
                businessId: selectedBusiness,
                onProgress: (progressData) => {
                    setProgress({
                        stage:
                            progressData.percentage < 90 ? 'downloading' : 'compressing',
                        message: progressData.message,
                        progress: progressData.percentage,
                        totalFiles: progressData.total,
                        processedFiles: progressData.current,
                    });
                },
            });

            setProgress({
                stage: 'completed',
                message: 'Descarga completada exitosamente',
                progress: 100,
            });

            // Cerrar el modal después de un breve delay
            setTimeout(() => {
                onClose();
                setProgress({
                    stage: 'idle',
                    message: '',
                    progress: 0,
                });
            }, 2000);
        } catch (error) {
            setProgress({
                stage: 'error',
                message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                progress: 0,
            });
        }
    };

    const isDownloading = downloadPhotosMutation.isPending;
    const canDownload = startDate && endDate && selectedBusiness && !isDownloading;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md translate-y-[-200px] border-accent">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Descargar Fotos de Tareas
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Selecciona el rango de fechas y la empresa para las tareas cuyas fotos
                    quieres descargar
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Fecha Inicio</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start text-left font-normal"
                                    disabled={isDownloading}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
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
                                    onSelect={(date) => {
                                        setStartDate(date);
                                        // Si la fecha de fin es anterior a la nueva fecha de inicio, resetearla
                                        if (date && endDate && endDate < date) {
                                            setEndDate(undefined);
                                        }
                                    }}
                                    locale={es}
                                    disabled={{ after: new Date() }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Fecha Fin</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start text-left font-normal"
                                    disabled={isDownloading}
                                >
                                    <CalendarIcon className="mr-2 size-4" />
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
                                    disabled={{
                                        after: new Date(),
                                        before: startDate
                                            ? new Date(
                                                  startDate.getTime() -
                                                      24 * 60 * 60 * 1000,
                                              )
                                            : undefined,
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Empresa</label>
                    <Select
                        value={selectedBusiness}
                        onValueChange={setSelectedBusiness}
                        disabled={isDownloading}
                    >
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

                {/* Barra de progreso */}
                {progress.stage !== 'idle' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                {progress.stage === 'fetching-keys' &&
                                    'Obteniendo fotos...'}
                                {progress.stage === 'downloading' &&
                                    'Descargando fotos...'}
                                {progress.stage === 'compressing' &&
                                    'Comprimiendo archivos...'}
                                {progress.stage === 'completed' && 'Completado'}
                                {progress.stage === 'error' && 'Error'}
                            </span>
                            <span className="text-muted-foreground">
                                {progress.stage === 'downloading' &&
                                progress.totalFiles &&
                                progress.processedFiles
                                    ? `${progress.processedFiles}/${progress.totalFiles}`
                                    : `${Math.round(progress.progress)}%`}
                            </span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            {progress.message}
                        </p>
                        {progress.stage === 'error' && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4" />
                                <span>Hubo un error durante la descarga</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onClose} disabled={isDownloading}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleDownload}
                        disabled={!canDownload}
                        className="min-w-[140px]"
                    >
                        {isDownloading ? 'Procesando...' : 'Descargar Fotos'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
