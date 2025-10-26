import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Button } from '../button';

interface PDFViewerProps {
    url: string;
    filename?: string;
    showPreviewButton?: boolean;
    className?: string;
    deletable?: boolean;
    onDelete?: () => void;
}

export const PDFViewer = ({
    url,
    filename = 'Documento PDF',
    showPreviewButton = true,
    className = 'h-[400px] w-full max-w-3xl',
    deletable = false,
    onDelete,
}: PDFViewerProps) => {
    if (showPreviewButton) {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="secondary"
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DownloadIcon className="h-4 w-4" />
                            Ver PDF
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="max-h-[90vh] max-w-6xl border-accent"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={url}
                            className="h-[80vh] w-full"
                            title={filename}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            allow="fullscreen"
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Cuando showPreviewButton=false, mostrar PDF con botón para modal
    return (
        <div className="group relative">
            <iframe
                src={url}
                className={className}
                title={filename}
                loading="lazy"
                referrerPolicy="no-referrer"
                allow="fullscreen"
            />
            {deletable && onDelete && (
                <Button
                    size="sm"
                    variant="destructive"
                    className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <TrashIcon className="size-4" />
                </Button>
            )}
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Ver en pantalla completa
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-6xl border-accent">
                    <iframe
                        src={url}
                        className="h-[80vh] w-full"
                        title={filename}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        allow="fullscreen"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};
