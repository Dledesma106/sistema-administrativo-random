import { Role } from '@prisma/client';
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

export interface IDashboardMenuItem {
    id: number;
    title: string;
    path: string;
    icon: JSX.Element;
    toggle: boolean;
    roles: Role[] | null;
}

export const dashboardMenuItems: IDashboardMenuItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/',
        icon: <RiDashboardFill />,
        toggle: false,
        roles: null,
    },
    {
        id: 3,
        title: 'Tareas',
        path: '/tech-admin/tasks',
        icon: <RiTaskLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico, Role.Auditor],
    },
    {
        id: 4,
        title: 'Preventivos',
        path: '/tech-admin/preventives',
        icon: <RiFileWarningLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 5,
        title: 'Clientes',
        path: '/tech-admin/clients',
        icon: <RiCustomerService2Line />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 6,
        title: 'Empresas',
        path: '/tech-admin/businesses',
        icon: <RiBuilding3Line />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 7,
        title: 'Provincias',
        path: '/tech-admin/provinces',
        icon: <RiMapPinLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 8,
        title: 'Localidades',
        path: '/tech-admin/cities',
        icon: <RiMapPin2Fill />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 9,
        title: 'Usuarios',
        path: '/tech-admin/users',
        icon: <RiGroupLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 10,
        title: 'Gastos',
        path: '/tech-admin/expenses',
        toggle: false,
        roles: [Role.AdministrativoTecnico],
        icon: <RiGroupLine />,
    },
];