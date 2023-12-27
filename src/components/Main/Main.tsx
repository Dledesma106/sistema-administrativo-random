import { Spinner } from 'flowbite-react';
import { PropsWithChildren, useMemo } from 'react';

import SideMenu from './SideMenu';

import { useUserContext } from '@/context/userContext/UserProvider';
import useLoading from '@/hooks/useLoading';
import { cn } from '@/lib/utils';

type LoadingWrapperProps = PropsWithChildren<{
    isLoading: boolean;
}>;

function LoadingWrapper({ isLoading, children }: LoadingWrapperProps): JSX.Element {
    return (
        <div className="mx-auto h-full ">
            {isLoading ? (
                <div className="flex h-full items-center justify-center bg-white">
                    <Spinner />
                </div>
            ) : (
                children
            )}
        </div>
    );
}

const Main: React.FC<PropsWithChildren> = ({ children }) => {
    const { isLoggedIn } = useUserContext();
    const { isLoading } = useLoading();

    function Main(): JSX.Element {
        return (
            <div className={cn('container h-screen', isLoggedIn && 'flex')}>
                {isLoggedIn && (
                    <>
                        <SideMenu />

                        <div className="flex-1 pl-4 pt-4">
                            <LoadingWrapper isLoading={isLoading}>
                                {children}
                            </LoadingWrapper>
                        </div>
                    </>
                )}

                {!isLoggedIn && (
                    <LoadingWrapper isLoading={isLoading}>{children}</LoadingWrapper>
                )}
            </div>
        );
    }

    return useMemo(Main, [children, isLoggedIn, isLoading]);
};

export default Main;
