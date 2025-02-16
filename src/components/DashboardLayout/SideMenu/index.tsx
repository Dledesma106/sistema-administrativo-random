import Link from 'next/link';
import { useRouter } from 'next/router';

import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

import { IDashboardMenuItem, dashboardMenuItems } from './constants';

import Logo from '@/components/Logo';
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
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import useAlert from '@/context/alertContext/useAlert';
import { useTheme } from '@/context/themeContext';
import { useUserContext } from '@/context/userContext/UserProvider';
import { useLogout } from '@/hooks/api/auth/useLogout';
import useLoading from '@/hooks/useLoading';

export default function SideMenu(): JSX.Element {
    const { user, logoutUser } = useUserContext();
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const [pathname, setPathname] = useState(router.pathname);
    const { triggerAlert } = useAlert();
    const logoutMutation = useLogout({});
    const { theme } = useTheme();
    useEffect(() => {
        const onRouteChangeStart = (url: string) => {
            setPathname(url);
        };

        router.events.on('routeChangeStart', onRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', onRouteChangeStart);
        };
    }, [startLoading, router, stopLoading]);

    const handleLogout = async () => {
        try {
            const result = await logoutMutation.mutateAsync();
            if (result.logout.success) {
                logoutUser();
                router.push('/login');
            } else {
                triggerAlert({
                    type: 'Failure',
                    message: result.logout.message || 'Falló al intentar cerrar sesión',
                });
            }
        } catch (error) {
            triggerAlert({
                type: 'Failure',
                message: 'Falló al intentar cerrar sesión',
            });
        }
    };

    return (
        <div className="flex h-screen w-80 flex-col border-r border-border bg-background-primary px-4">
            <div className="space-y-4 pt-7">
                <Logo light={theme !== 'light'} />

                <div className="space-y-2">
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
                                <Button
                                    variant={pathname === item.path ? 'default' : 'ghost'}
                                    onClick={() => {
                                        router.push(item.path);
                                    }}
                                    key={item.id}
                                    className="flex w-full items-center justify-start space-x-2"
                                >
                                    {item.icon}

                                    <span>{item.title}</span>
                                </Button>
                            );
                        })}
                    <ThemeToggle />
                </div>
            </div>

            <div className="mt-auto pb-6 pr-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="flex w-full items-center justify-start space-x-4"
                            variant="ghost"
                        >
                            <User className="h-6 w-6" />
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
                                onClick={handleLogout}
                                className="w-full cursor-pointer justify-start"
                                variant="ghost"
                                disabled={logoutMutation.isPending}
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
