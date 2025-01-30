import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
    );
}

function TableSkeleton() {
    return <Skeleton className="h-96 w-full" />;
}

function FormSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" /> {/* Título */}
            <div className="space-y-6">
                <Skeleton className="h-12 w-full" /> {/* Input */}
                <Skeleton className="h-12 w-full" /> {/* Input */}
                <Skeleton className="h-12 w-full" /> {/* Input */}
                <Skeleton className="h-10 w-[100px]" /> {/* Botón */}
            </div>
        </div>
    );
}

export { Skeleton, TableSkeleton, FormSkeleton };
