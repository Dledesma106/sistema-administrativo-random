import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, onWheel, ...props }, ref) => {
        // Para inputs numéricos, desactivar el cambio de valor con scroll
        const handleWheel = React.useCallback(
            (e: React.WheelEvent<HTMLInputElement>) => {
                if (type === 'number') {
                    // Quitar el focus para evitar que el scroll cambie el valor
                    e.currentTarget.blur();
                }
                // Llamar al onWheel original si existe
                onWheel?.(e);
            },
            [type, onWheel],
        );

        return (
            <input
                type={type}
                className={cn(
                    'flex h-10 w-full rounded-md border border-accent bg-background px-3 py-2 text-sm',
                    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                    'placeholder:text-muted-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    type === 'number' && '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
                    className,
                )}
                ref={ref}
                onWheel={handleWheel}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };
