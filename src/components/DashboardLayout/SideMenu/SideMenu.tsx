import Link from 'next/link';
import { useRouter } from 'next/router';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    RiDashboardFill,
    RiTaskLine,
    RiBuilding3Line,
    RiMapPinLine,
    RiMapPin2Fill,
    RiGroupLine,
    RiFileWarningLine,
    RiCustomerService2Line,
} from 'react-icons/ri';

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

interface IItem {
    id: number;
    title: string;
    path: string;
    icon: JSX.Element;
    toggle: boolean;
    role: string;
}

const items: IItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/',
        icon: <RiDashboardFill />,
        toggle: false,
        role: '',
    },
    {
        id: 3,
        title: 'Tareas',
        path: '/tech-admin/tasks',
        icon: <RiTaskLine />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 4,
        title: 'Preventivos',
        path: '/tech-admin/preventives',
        icon: <RiFileWarningLine />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 5,
        title: 'Clientes',
        path: '/tech-admin/clients',
        icon: <RiCustomerService2Line />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 6,
        title: 'Empresas',
        path: '/tech-admin/businesses',
        icon: <RiBuilding3Line />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 7,
        title: 'Provincias',
        path: '/tech-admin/provinces',
        icon: <RiMapPinLine />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 8,
        title: 'Localidades',
        path: '/tech-admin/cities',
        icon: <RiMapPin2Fill />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 9,
        title: 'Usuarios',
        path: '/tech-admin/users',
        icon: <RiGroupLine />,
        toggle: false,
        role: 'Administrativo Tecnico',
    },
    {
        id: 10,
        title: 'Gastos',
        path: '/tech-admin/expenses',
        toggle: false,
        role: 'Administrativo Tecnico',
        icon: <RiGroupLine />,
    },
];

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
            <div className="space-y-4 pt-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Random SRL
                </h2>

                <div className="space-y-2 pr-4">
                    {items.map((item: IItem) => {
                        return (
                            <Link className="block" href={item.path} key={item.id}>
                                <Button
                                    variant={pathname === item.path ? 'default' : 'ghost'}
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
