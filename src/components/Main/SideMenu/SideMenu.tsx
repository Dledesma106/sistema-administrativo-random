import Link from 'next/link';
import { useRouter } from 'next/router'

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
import { useUserContext } from '@/context/userContext/UserProvider';

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
];



export default function SideMenu(): JSX.Element {
    const router = useRouter()
    const { user } = useUserContext();
console.log(router.asPath)
    return (
        <div className="flex h-screen w-80 flex-col border-r border-gray-200">
            <div className="space-y-4 pt-4">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                    Random SRL
                </h2>

                <div className="space-y-1">
                    {items.map((item: IItem) => {
                        return (
                            <Link className="block" href={item.path} key={item.id}>
                                <Button
                                    variant= {router.asPath === item.path? "default" : "ghost"}
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

            <div className="mt-auto flex items-center space-x-4 px-4 pb-6">
                <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                >
                    <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
                </svg>

                <p className="text-sm">{user.email}</p>
            </div>
        </div>
    );
}
