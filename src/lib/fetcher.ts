import axios from 'axios';

const getFullUrl = (path: string) => {
    return window.location.origin + path;
};

const contentType = 'application/json';

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: contentType,
        'Content-Type': contentType,
    },
});

const fetcher = {
    post: async function (data: any, url: string) {
        const modUrl = getFullUrl(url);
        const res: Response = await fetch(modUrl, {
            method: 'POST',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('fetch failed');
        }
        return await res.json();
    },
    put: async function (data: any, url: string) {
        const modUrl = getFullUrl(url);
        const res: Response = await fetch(modUrl, {
            method: 'PUT',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify(data),
        });
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
            throw new Error('fetch failed');
        }
        return await res.json();
    },
    get: async function (url: string) {
        const modUrl = getFullUrl(url);
        const res: Response = await fetch(modUrl, {
            method: 'GET',
        });
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
            throw new Error('fetch failed');
        }
        return await res.json();
    },
    delete: async function (data: any, url: string) {
        const modUrl = getFullUrl(url);
        const res: Response = await fetch(modUrl, {
            method: 'DELETE',
            headers: {
                Accept: contentType,
                'Content-Type': contentType,
            },
            body: JSON.stringify(data),
        });
        // Throw error with status code in case Fetch API req failed
        if (!res.ok) {
            throw new Error('fetch failed');
        }
        return await res.json();
    },
};

export default fetcher;
