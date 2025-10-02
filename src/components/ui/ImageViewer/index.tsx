import Image from 'next/image';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

interface ImageViewerProps {
    src: string;
    alt: string;
    filename?: string;
    showPreviewButton?: boolean;
    className?: string;
    previewClassName?: string;
    modalClassName?: string;
}

export const ImageViewer = ({
    src,
    alt,
    filename,
    showPreviewButton = true,
    className = 'h-64 w-48 object-cover',
    previewClassName = 'group cursor-pointer overflow-hidden rounded-md border border-accent',
    modalClassName = 'max-w-4xl border-accent',
}: ImageViewerProps) => {
    if (showPreviewButton) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className={`${previewClassName} relative inline-block`}>
                        <Image
                            src={src}
                            alt={alt}
                            width={300}
                            height={200}
                            className={`${className} transition-transform duration-200 group-hover:scale-105`}
                        />
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/30 opacity-0 transition-all duration-200 group-hover:bg-background/90 group-hover:opacity-100">
                            <Eye className="size-6" />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className={modalClassName}>
                    <div className="flex flex-col items-center space-y-4">
                        <h3 className="text-lg font-semibold">{filename || alt}</h3>
                        <div className="relative max-h-[80vh] w-full">
                            <Image
                                src={src}
                                alt={alt}
                                width={1200}
                                height={800}
                                className="max-h-[80vh] w-full object-contain"
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={0}
            height={0}
            sizes="100vw"
            className={className}
        />
    );
};
