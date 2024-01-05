export const routesBuilder = {
    home: () => '/',
    login: () => '/login',
    tasks: {
        list: () => '/tasks',
        create: () => '/tasks/new',
        details: (id: string) => `/tasks/${id}`,
        edit: (id: string) => `/tasks/${id}/edit`,
    },
    preventives: {
        list: () => '/tech-admin/preventives',
        create: () => '/tech-admin/preventives/new',
        details: (id: string) => `/tech-admin/preventives/${id}`,
        edit: (id: string) => `/tech-admin/preventives/${id}/edit`,
    },
} as const;
