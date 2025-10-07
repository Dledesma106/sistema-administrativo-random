import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev * 1.2, 5));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev / 1.2, 0.5));
    };

    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };
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
                        <div className="flex w-full items-center justify-between">
                            <h3 className="text-lg font-semibold">{filename || alt}</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleZoomOut}
                                    disabled={zoom <= 0.5}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleZoomIn}
                                    disabled={zoom >= 5}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleReset}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div
                            className="relative max-h-[80vh] w-full overflow-hidden rounded-md border"
                            onWheel={handleWheel}
                        >
                            <div
                                className="relative cursor-grab active:cursor-grabbing"
                                style={{
                                    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                                    transformOrigin: 'center center',
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={1200}
                                    height={800}
                                    className="max-h-[80vh] w-full object-contain"
                                    draggable={false}
                                />
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Usa la rueda del mouse para hacer zoom • Arrastra para mover
                            la imagen
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
