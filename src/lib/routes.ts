export const routesBuilder = {
    home: () => '/',
    login: () => '/login',
    tasks: {
        list: () => '/tasks',
        create: () => '/tasks/new',
        details: (id: string) => `/tasks/${id}`,
        edit: (id: string) => `/tasks/${id}/edit`,
    },
    expenses: {
        list: () => '/expenses',
        details: (id: string) => `/expenses/${id}`,
    },
    preventives: {
        list: () => '/tech-admin/preventives',
        create: () => '/tech-admin/preventives/new',
        details: (id: string) => `/tech-admin/preventives/${id}`,
        edit: (id: string) => `/tech-admin/preventives/${id}/edit`,
    },
    accounting: {
        budgets: {
            list: () => '/accounting/budgets',
            new: () => '/accounting/budgets/new',
            details: (id: string) => `/accounting/budgets/${id}`,
            edit: (id: string) => `/accounting/budgets/${id}/edit`,
        },

        billingProfiles: {
            list: () => '/accounting/billing-profiles',
            new: () => '/accounting/billing-profiles/new',
            edit: (id: string) => `/accounting/billing-profiles/${id}/edit`,
        },
        taskPrices: {
            list: () => '/accounting/task-prices',
            new: () => '/accounting/task-prices/new',
            edit: (id: string) => `/accounting/task-prices/${id}/edit`,
        },
    },
} as const;
