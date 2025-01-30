import { Role } from '@prisma/client';
import {
    RiDashboardFill,
    RiTaskLine,
    RiBuilding3Line,
    RiMapPinLine,
    RiMapPin2Fill,
    RiGroupLine,
    RiCustomerService2Line,
    RiCoinsLine,
    RiMoneyDollarCircleLine,
    RiFileListLine,
    RiFileUserLine,
    RiPriceTag3Line,
} from 'react-icons/ri';

import { routesBuilder } from '@/lib/routes';

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
        path: routesBuilder.tasks.list(),
        icon: <RiTaskLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico, Role.Auditor, Role.AdministrativoContable],
    },
    {
        id: 4,
        title: 'Gastos',
        path: routesBuilder.accounting.expenses.list(),
        icon: <RiCoinsLine />,
        toggle: false,
        roles: [Role.Auditor, Role.AdministrativoContable],
    },
    {
        id: 5,
        title: 'Presupuestos',
        path: routesBuilder.accounting.budgets.list(),
        icon: <RiMoneyDollarCircleLine />,
        toggle: false,
        roles: [Role.AdministrativoContable],
    },
    {
        id: 6,
        title: 'Perfiles de facturación',
        path: routesBuilder.accounting.billingProfiles.list(),
        icon: <RiFileUserLine />,
        toggle: false,
        roles: [Role.AdministrativoContable],
    },
    {
        id: 7,
        title: 'Precios por tarea',
        path: routesBuilder.accounting.taskPrices.list(),
        icon: <RiPriceTag3Line />,
        toggle: false,
        roles: [Role.AdministrativoContable],
    },
    {
        id: 8,
        title: 'Preventivos',
        path: routesBuilder.preventives.list(),
        icon: <RiFileListLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 9,
        title: 'Clientes',
        path: routesBuilder.clients.list(),
        icon: <RiCustomerService2Line />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 10,
        title: 'Empresas',
        path: routesBuilder.businesses.list(),
        icon: <RiBuilding3Line />,
        toggle: false,
        roles: [Role.AdministrativoTecnico, Role.AdministrativoContable],
    },
    {
        id: 11,
        title: 'Provincias',
        path: routesBuilder.provinces.list(),
        icon: <RiMapPinLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 12,
        title: 'Localidades',
        path: routesBuilder.cities.list(),
        icon: <RiMapPin2Fill />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
    {
        id: 13,
        title: 'Usuarios',
        path: routesBuilder.users.list(),
        icon: <RiGroupLine />,
        toggle: false,
        roles: [Role.AdministrativoTecnico],
    },
];
