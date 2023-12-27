export const baseApiUrl = '/api';
export const authUrl = `${baseApiUrl}/auth`;
export const logoutUrl = `${authUrl}/logout`;
export const registerUrl = `${authUrl}/register`;
export const loggedInUser = `${authUrl}/user`;
export const checkPassword = `${authUrl}/check-password`;
export const changePassword = `${authUrl}/change-password`;

const accAdminBase = `${baseApiUrl}/acc-admin/`;

export const accAdmin = {
    tasks: `${accAdminBase}/tasks/`,
    expenses: `${accAdminBase}/expenses/`,
};

const auditorBase = `${baseApiUrl}/auditor/`;

export const auditor = {
    tasks: `${auditorBase}/tasks/`,
    expenses: `${auditorBase}/expenses/`,
};

const techAdminBase = `${baseApiUrl}/tech-admin/`;

export const techAdmin = {
    tasks: `${techAdminBase}/tasks/`,
    provinces: `${techAdminBase}/provinces/`,
    cities: `${techAdminBase}/cities/`,
    branches: `${techAdminBase}/branches/`,
    businesses: `${techAdminBase}/businesses/`,
    clients: `${techAdminBase}/clients/`,
    preventives: `${techAdminBase}/preventives/`,
    users: `${techAdminBase}/users/`,
};
