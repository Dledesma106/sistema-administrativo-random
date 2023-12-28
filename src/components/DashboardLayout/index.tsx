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

function LoadingWrapper({ isLoading, children }: LoadingWrapperProps): JSX.Element {
    return (
        <div className="mx-auto h-full">
            {isLoading ? (
                <div className="flex h-full items-center justify-center bg-white">
                    <LoadingSpinner />
                </div>
            ) : (
                children
            )}
        </div>
    );
}

export const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { isLoggedIn } = useUserContext();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const router = useRouter();

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
            <div className={cn('container flex h-screen')}>
                <SideMenu />

                <div className="flex-1 pl-4 pt-4">
                    <LoadingWrapper isLoading={isLoading}>{children}</LoadingWrapper>
                </div>
            </div>
        );
    }

    return useMemo(Main, [children, isLoggedIn, isLoading]);
};
