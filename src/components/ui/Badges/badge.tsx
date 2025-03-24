import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-accent text-accent-foreground hover:bg-accent/80 m-2',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 m-2',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 m-2',
                outline:
                    'bg-background text-foreground hover:bg-accent hover:text-accent-foreground m-2',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div
            className={cn(
                badgeVariants({
                    variant,
                    className,
                }),
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
