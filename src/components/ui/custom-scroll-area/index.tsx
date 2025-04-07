import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CustomScrollAreaProps {
    children: ReactNode;
    className?: string;
    height?: string;
}

export function CustomScrollArea({
    children,
    className,
    height = 'h-[500px]',
}: CustomScrollAreaProps) {
    return (
        <div
            className={cn(
                'overflow-auto',
                'rounded-md border border-accent',
                height,
                'scrollbar-thin',
                'scrollbar-thumb-primary',
                'scrollbar-track-background',
                '[&::-webkit-scrollbar]:w-1.5',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-button]:bg-transparent',
                className,
            )}
        >
            {children}
        </div>
    );
}
