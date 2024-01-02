export const routesBuilder = {
    home: () => '/',
    login: () => '/login',
    tasks: {
        list: () => '/tasks',
        create: () => '/tasks/new',
        details: (id: string) => `/tasks/${id}`,
        edit: (id: string) => `/tasks/${id}/edit`,
    },
} as const;
