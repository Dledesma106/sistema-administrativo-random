import { useRouter } from 'next/router';

import { PropsWithChildren, useEffect, useMemo } from 'react';

import SideMenu from './SideMenu';

import { useUserContext } from '@/context/userContext/UserProvider';
import useLoading from '@/hooks/useLoading';
import { cn } from '@/lib/utils';

import { LoadingSpinner } from '../ui/spinner';

type LoadingWrapperProps = PropsWithChildren<{
    isLoading: boolean;
}>;

function LoadingWrapper({ isLoading, children }: LoadingWrapperProps) {
    if (isLoading) {
        return (
            <div className="flex h-full flex-1 items-center justify-center bg-white">
                <LoadingSpinner />
            </div>
        );
    }

    return children;
}

type DashboardLayoutProps = PropsWithChildren & {
    className?: string;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    className,
}) => {
    const { isLoading, startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const { isLoggedIn } = useUserContext();

    useEffect(() => {
        const onRouteChangeStart = () => {
            startLoading();
        };

        const onRouteChangeComplete = () => {
            stopLoading();
        };

        router.events.on('routeChangeStart', onRouteChangeStart);

        router.events.on('routeChangeComplete', onRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart);
            router.events.off('routeChangeComplete', onRouteChangeComplete);
        };
    }, [startLoading, router, stopLoading]);

    function Main(): JSX.Element {
        return (
            <div className={cn('flex h-screen overflow-hidden pl-4')}>
                {isLoggedIn && <SideMenu />}

                <div className="flex flex-1 flex-col overflow-y-scroll">
                    <main className={cn('flex-1 px-4 py-3.5', className)}>
                        <LoadingWrapper isLoading={isLoading}>{children}</LoadingWrapper>
                    </main>
                </div>
            </div>
        );
    }

    return useMemo(Main, [children, className, isLoading, isLoggedIn]);
};
