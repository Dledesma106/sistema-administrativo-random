import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CustomScrollAreaProps {
    children: ReactNode;
    className?: string;
    height?: string;
}

export function CustomScrollArea({ children, className, height = "h-[500px]" }: CustomScrollAreaProps) {
    return (
        <div className={cn(
            "overflow-auto",
            "rounded-md border border-primary/50",
            height,
            "scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent",
            "hover:scrollbar-thumb-primary/80",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-button]:hidden",
            className
        )}>
            {children}
        </div>
    );
} 