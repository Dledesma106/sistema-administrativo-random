import Link from 'next/link';
import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IDashboardMenuItem, dashboardMenuItems } from './constants';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserContext } from '@/context/userContext/UserProvider';
import useLoading from '@/hooks/useLoading';
import * as apiEndpoints from '@/lib/apiEndpoints';
import { axiosInstance } from '@/lib/fetcher';

export default function SideMenu(): JSX.Element {
    const { user, logoutUser } = useUserContext();
    const { startLoading, stopLoading } = useLoading();

    const router = useRouter();
    const [pathname, setPathname] = useState(router.pathname);

    useEffect(() => {
        const onRouteChangeStart = (url: string) => {
            setPathname(url);
        };

        router.events.on('routeChangeStart', onRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart);
        };
    }, [startLoading, router, stopLoading]);

    const logoutMutation = useMutation<unknown, AxiosError>({
        mutationFn: () => {
            return axiosInstance.post(apiEndpoints.logoutUrl);
        },
        onSuccess: () => {
            logoutUser();
            router.push('/login');
        },
        onError: (error) => {
            const { response } = error;
            const statusCode = response?.status;

            if (statusCode === 401) {
                logoutUser();
                router.push('/login');
            } else {
                alert('Falló al intentar desloguear al usuario');
            }
        },
        onMutate: () => {
            startLoading();
        },
        onSettled: () => {
            stopLoading();
        },
        retry: false,
    });

    const logout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="flex h-screen w-80 flex-col border-r border-gray-200">
            <div className="space-y-4 pt-7">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Random SRL
                </h2>

                <div className="space-y-2 pr-4">
                    {dashboardMenuItems
                        .filter(({ roles: sectionRoles }: IDashboardMenuItem) => {
                            if (sectionRoles === null) {
                                return true;
                            }

                            if (!user.roles) {
                                return false;
                            }

                            const userRoleIsInSectionRoles = sectionRoles.some((role) => {
                                return user.roles.includes(role);
                            });

                            return userRoleIsInSectionRoles;
                        })
                        .map((item: IDashboardMenuItem) => {
                            return (
                                <Link className="block" href={item.path} key={item.id}>
                                    <Button
                                        variant={
                                            pathname === item.path ? 'default' : 'ghost'
                                        }
                                        className="flex w-full items-center justify-start space-x-2"
                                    >
                                        {item.icon}

                                        <span>{item.title}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                </div>
            </div>

            <div className="mt-auto pb-6 pr-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="flex w-full items-center justify-start space-x-4"
                            variant="ghost"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                            >
                                <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
                            </svg>

                            <p className="text-sm">{user.email}</p>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    href="/edit-profile"
                                    className="flex w-full cursor-pointer"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Perfil</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Button
                                onClick={logout}
                                className="w-full cursor-pointer justify-start"
                                variant="ghost"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
