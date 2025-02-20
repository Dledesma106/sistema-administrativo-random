export const routesBuilder = {
    home: () => '/',
    login: () => '/login',
    tasks: {
        list: () => '/tasks',
        create: () => '/tasks/new',
        details: (id: string) => `/tasks/${id}`,
        edit: (id: string) => `/tasks/${id}/edit`,
    },
    serviceOrders: {
        list: () => '/service-orders',
        details: (id: string) => `/service-orders/${id}`,
        edit: (id: string) => `/service-orders/${id}/edit`,
    },
    preventives: {
        list: () => '/tech-admin/preventives',
        create: () => '/tech-admin/preventives/new',
        details: (id: string) => `/tech-admin/preventives/${id}`,
        edit: (id: string) => `/tech-admin/preventives/${id}/edit`,
    },
    provinces: {
        list: () => '/tech-admin/provinces',
        create: () => '/tech-admin/provinces/new',
        edit: (id: string) => `/tech-admin/provinces/${id}/edit`,
    },
    cities: {
        list: () => '/tech-admin/cities',
        create: () => '/tech-admin/cities/new',
        edit: (id: string) => `/tech-admin/cities/${id}/edit`,
    },
    branches: {
        list: (clientId: string) => `/tech-admin/clients/${clientId}/branches`,
        create: (clientId: string) => `/tech-admin/clients/${clientId}/branches/new`,
        edit: (clientId: string, branchId: string) =>
            `/tech-admin/clients/${clientId}/branches/${branchId}/edit`,
    },
    clients: {
        list: () => '/tech-admin/clients',
        create: () => '/tech-admin/clients/new',
        edit: (id: string) => `/tech-admin/clients/${id}/edit`,
    },
    users: {
        list: () => '/tech-admin/users',
        create: () => '/tech-admin/users/new',
        edit: (id: string) => `/tech-admin/users/${id}/edit`,
    },
    businesses: {
        list: () => '/tech-admin/businesses',
        create: () => '/tech-admin/businesses/new',
        details: (id: string) => `/tech-admin/businesses/${id}`,
        edit: (id: string) => `/tech-admin/businesses/${id}/edit`,
    },
    accounting: {
        budgets: {
            list: () => '/accounting/budgets',
            create: () => '/accounting/budgets/new',
            details: (id: string) => `/accounting/budgets/${id}`,
            edit: (id: string) => `/accounting/budgets/${id}/edit`,
        },
        billing: {
            list: () => '/accounting/billing',
            create: () => '/accounting/billing/new',
            details: (id: string) => `/accounting/billing/${id}`,
            edit: (id: string) => `/accounting/billing/${id}/edit`,
        },
        billingProfiles: {
            list: () => '/accounting/billing-profiles',
            create: () => '/accounting/billing-profiles/new',
            edit: (id: string) => `/accounting/billing-profiles/${id}/edit`,
        },
        expenses: {
            list: () => '/accounting/expenses',
            details: (id: string) => `/accounting/expenses/${id}`,
        },
        taskPrices: {
            list: () => '/accounting/task-prices',
            create: () => '/accounting/task-prices/new',
            edit: (id: string) => `/accounting/task-prices/${id}/edit`,
        },
    },
} as const;
