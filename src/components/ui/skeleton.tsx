import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
    );
}

const TableSkeleton = () => {
    return (
        <div className="space-y-4 pb-8">
            <div className="flex justify-between">
                <div className="h-8 w-32 animate-pulse rounded-md bg-skeleton" />
                <div className="flex gap-2">
                    <div className="h-9 w-32 animate-pulse rounded-md bg-skeleton" />
                </div>
            </div>
            
            {/* Toolbar skeleton */}
            <div className="flex items-center space-x-2">
                <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton" />
                <div className="h-8 w-24 animate-pulse rounded-md bg-skeleton" />
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border border-border">
                <div className="border-b bg-background">
                    <div className="flex">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-10 flex-1 border-r border-border p-4"
                            >
                                <div className="h-4 w-20 animate-pulse rounded bg-skeleton" />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    {[...Array(5)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex border-b border-border transition-colors hover:bg-muted/50"
                        >
                            {[...Array(6)].map((_, cellIndex) => (
                                <div
                                    key={cellIndex}
                                    className="flex-1 border-r border-border p-4"
                                >
                                    <div className="h-4 w-full animate-pulse rounded bg-skeleton" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 animate-pulse rounded-md bg-skeleton" />
                <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-8 w-8 animate-pulse rounded-md bg-skeleton"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

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
