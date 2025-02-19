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
    RiFileTextLine,
} from 'react-icons/ri';

import { routesBuilder } from '@/lib/routes';

export interface NavItem {
    id: number;
    title: string;
    path: string;
    icon: JSX.Element;
}

interface NavSection {
    role: Role;
    title: string;
    items: NavItem[];
}

export const navSections: NavSection[] = [
    {
        role: Role.AdministrativoTecnico,
        title: 'Administrativo Técnico',
        items: [
            {
                id: 8,
                title: 'Preventivos',
                path: routesBuilder.preventives.list(),
                icon: <RiFileListLine />,
            },
            {
                id: 9,
                title: 'Clientes',
                path: routesBuilder.clients.list(),
                icon: <RiCustomerService2Line />,
            },
            {
                id: 10,
                title: 'Empresas',
                path: routesBuilder.businesses.list(),
                icon: <RiBuilding3Line />,
            },
            {
                id: 11,
                title: 'Provincias',
                path: routesBuilder.provinces.list(),
                icon: <RiMapPinLine />,
            },
            {
                id: 12,
                title: 'Localidades',
                path: routesBuilder.cities.list(),
                icon: <RiMapPin2Fill />,
            },
            {
                id: 13,
                title: 'Usuarios',
                path: routesBuilder.users.list(),
                icon: <RiGroupLine />,
            },
        ],
    },
    {
        role: Role.AdministrativoContable,
        title: 'Administrativo Contable',
        items: [
            {
                id: 4,
                title: 'Gastos',
                path: routesBuilder.accounting.expenses.list(),
                icon: <RiCoinsLine />,
            },
            {
                id: 5,
                title: 'Presupuestos',
                path: routesBuilder.accounting.budgets.list(),
                icon: <RiMoneyDollarCircleLine />,
            },
            {
                id: 6,
                title: 'Perfiles de facturación',
                path: routesBuilder.accounting.billingProfiles.list(),
                icon: <RiFileUserLine />,
            },
            {
                id: 7,
                title: 'Precios por tarea',
                path: routesBuilder.accounting.taskPrices.list(),
                icon: <RiPriceTag3Line />,
            },
        ],
    },
];

export const commonItems: NavItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        path: '/',
        icon: <RiDashboardFill />,
    },
    {
        id: 2,
        title: 'Órdenes de Servicio',
        path: routesBuilder.serviceOrders.list(),
        icon: <RiFileTextLine />,
    },
    {
        id: 3,
        title: 'Tareas',
        path: routesBuilder.tasks.list(),
        icon: <RiTaskLine />,
    },
];
