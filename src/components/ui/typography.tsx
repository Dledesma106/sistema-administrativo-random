import { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
    className?: string;
}>;

export function TypographyH1({ children, className }: Props) {
    return (
        <h1
            className={cn(
                'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
                className,
            )}
        >
            {children}
        </h1>
    );
}
