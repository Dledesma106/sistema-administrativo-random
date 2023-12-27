import { Slot } from '@radix-ui/react-slot';
import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
    className?: string;
    asChild?: boolean;
}>;

export function TypographyH1({ children, className, asChild }: Props) {
    const Comp = asChild ? Slot : 'h1';

    return (
        <Comp
            className={cn(
                'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                className,
            )}
        >
            {children}
        </Comp>
    );
}

export function TypographyH2({ children, className, asChild }: Props) {
    const Comp = asChild ? Slot : 'h2';

    return (
        <Comp
            className={cn(
                'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
                className,
            )}
        >
            {children}
        </Comp>
    );
}
