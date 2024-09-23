import { NextResponse, type NextRequest } from 'next/server';

import { jwtVerify } from 'jose';

const someRouteMatchesStartWith = (pathname: string, routes: string[]) => {
    return routes.some((route) => {
        return pathname.startsWith(route);
    });
};

const routeHasFileExtension = (pathname: string) => {
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('.').length === 2;
};

export async function middleware(req: NextRequest): Promise<NextResponse> {
    console.log('Next JS middleware');
    const secret = process.env.SECRET;
    const { pathname } = req.nextUrl;
    const jwt = req.cookies.get('ras_access_token')?.value;

    if (
        someRouteMatchesStartWith(pathname, ['/_next']) ||
        someRouteMatchesStartWith(pathname, ['/api']) ||
        routeHasFileExtension(pathname)
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    let isLoggedIn = false;

    if (jwt) {
        try {
            await jwtVerify(jwt, new TextEncoder().encode(secret));
            isLoggedIn = true;
        } catch (error) {
            const url = new URL('/login', req.nextUrl.origin);
            return NextResponse.redirect(url);
        }
    }

    if (isLoggedIn && pathname === '/login') {
        const nextQueryReceived = req.nextUrl.searchParams.get('next');
        if (nextQueryReceived) {
            const url = new URL(nextQueryReceived, req.nextUrl.origin);
            return NextResponse.redirect(url);
        } else {
            const url = new URL('/', req.nextUrl.origin);
            return NextResponse.redirect(url);
        }
    }

    if (isLoggedIn || pathname === '/login') {
        return NextResponse.next();
    }

    const nextParam = new URLSearchParams({
        next: pathname,
    });

    const url = new URL(`/login?logout=true&${nextParam}`, req.nextUrl.origin);

    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - favicon.ico (favicon file)
         */
        '/((?!proxy|api|favicon.ico).*)',
    ],
};
