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
                className,
            )}
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'hsl(var(--primary)) transparent',
            }}
        >
            {children}
        </div>
    );
}
