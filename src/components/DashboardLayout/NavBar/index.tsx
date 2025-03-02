import Link from 'next/link';
import { useRouter } from 'next/router';

import { LogOut, User } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';

import { commonItems, NavItem, navSections } from './constants';

import { LoginMutation } from '@/api/graphql';
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

interface NavBarProps {
    user: NonNullable<LoginMutation['login']['user']>;
}

function UserMenu({ user }: NavBarProps) {
    const router = useRouter();
    const { logoutUser } = useUserContext();
    const { triggerAlert } = useAlert();
    const logoutMutation = useLogout({});

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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/edit-profile" className="flex w-full cursor-pointer">
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
    );
}

function NavTabs({
    items,
    currentPath,
    onItemClick,
}: {
    items: NavItem[];
    currentPath: string;
    onItemClick: (path: string) => void;
}) {
    return (
        <div className="flex h-10 items-center">
            {items.map((item) => {
                const isActive = currentPath === item.path;
                return (
                    <button
                        key={item.id}
                        onClick={() => onItemClick(item.path)}
                        className={`
                            flex h-full items-center gap-2 px-4 text-sm font-medium
                            transition-colors hover:text-foreground
                            ${
                                isActive
                                    ? 'border-b-2 border-primary text-foreground'
                                    : 'text-muted-foreground'
                            }
                        `}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                    </button>
                );
            })}
        </div>
    );
}

function SimpleNavBar() {
    const { theme } = useTheme();

    return (
        <nav className="absolute inset-x-0 top-0 w-full border-b border-accent bg-background-primary">
            <div className="flex items-center justify-between px-4 py-2">
                <Logo light={theme !== 'light'} />
                <ThemeToggle />
            </div>
        </nav>
    );
}

export default function NavBar() {
    const { user, isLoggedIn } = useUserContext();
    const router = useRouter();
    const { theme } = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Record<string, string>>({});

    const userSections = useMemo(
        () =>
            isLoggedIn
                ? navSections.filter((section) => user.roles.includes(section.role))
                : [],
        [isLoggedIn, user?.roles],
    );

    useEffect(() => {
        if (userSections.length > 0 && !activeSection) {
            setActiveSection(userSections[0].title);
        }
    }, [userSections, activeSection]);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }

        const currentPath = router.pathname;
        for (const section of userSections) {
            const matchingItem = section.items.find((item) => item.path === currentPath);
            if (matchingItem) {
                if (activeSection !== section.title) {
                    setActiveSection(section.title);
                    setSelectedItems((prev) => ({
                        ...prev,
                        [section.title]: currentPath,
                    }));
                }
                break;
            }
        }
    }, [router.pathname, userSections, activeSection, isLoggedIn]);

    if (!isLoggedIn) {
        return <SimpleNavBar />;
    }

    const isCommonRoute = (path: string) => {
        return commonItems.some((item) => item.path === path);
    };

    const handleSectionClick = (sectionTitle: string) => {
        if (activeSection === sectionTitle) {
            return;
        }

        setActiveSection(sectionTitle);

        if (isCommonRoute(router.pathname)) {
            return;
        }

        const section = userSections.find((s) => s.title === sectionTitle);
        if (section) {
            const path = selectedItems[sectionTitle] || section.items[0].path;
            router.push(path);
        }
    };

    const handleItemClick = (path: string) => {
        if (activeSection) {
            setSelectedItems((prev) => ({
                ...prev,
                [activeSection]: path,
            }));
        }
        router.push(path);
    };

    return (
        <nav className="w-full bg-background-primary">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2">
                <Logo light={theme !== 'light'} />
                <div className="flex items-center gap-4">
                    {userSections.length > 1 && (
                        <div className="flex items-center gap-2">
                            {userSections.map((section) => (
                                <Button
                                    key={section.role}
                                    variant={
                                        activeSection === section.title
                                            ? 'default'
                                            : 'ghost'
                                    }
                                    onClick={() => handleSectionClick(section.title)}
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <span>{section.title}</span>
                                </Button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <UserMenu user={user} />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-accent px-4">
                {/* Common items */}
                <NavTabs
                    items={commonItems}
                    currentPath={router.pathname}
                    onItemClick={(path) => router.push(path)}
                />

                {/* Items de la sección activa */}
                {activeSection && (
                    <NavTabs
                        items={
                            userSections.find(
                                (section) => section.title === activeSection,
                            )?.items || []
                        }
                        currentPath={router.pathname}
                        onItemClick={handleItemClick}
                    />
                )}
            </div>
        </nav>
    );
}
