import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DownloadIcon } from '@radix-ui/react-icons';

interface PDFViewerProps {
    url: string;
    filename?: string;
    showPreviewButton?: boolean;
    className?: string;
}

export const PDFViewer = ({ 
    url, 
    filename = 'Documento PDF',
    showPreviewButton = true,
    className = "h-[600px] w-full max-w-3xl"
}: PDFViewerProps) => {
    if (showPreviewButton) {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <Dialog>
                    <DialogTrigger asChild>
                        <button 
                            className="flex items-center gap-2 rounded-md border border-gray-200 p-2 hover:bg-gray-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <DownloadIcon className="h-4 w-4" />
                            Ver PDF
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={url}
                            className={className}
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

    return (
        <iframe
            src={url}
            className={className}
            title={filename}
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="fullscreen"
        />
    );
}; 