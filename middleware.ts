import { NextResponse, type NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
/**
 * Function that executes first whenever a request comes to the server.
 * Here you can validate JWT or other data when coming trough any specific route.
 * With this you're able to protect routes, requiring the request to contain a jwt in a cookie or a jwt alone(for mobile apps)
 * provided to the client when the user logged in.
 * In this way the controller doesn't worry about validating the user.
 *
 */

export async function middleware(req: NextRequest): Promise<NextResponse> {
    const secret = process.env.SECRET;
    const { pathname } = req.nextUrl;
    const jwt = req.cookies.get('ras_access_token');

    if (pathname.includes('/api') || pathname.includes('/login')) {
        return NextResponse.next();
    }
    if (jwt === undefined) {
        const url = new URL('/login', req.nextUrl.origin);

        return NextResponse.redirect(url);
    }
    try {
        await jwtVerify(jwt, new TextEncoder().encode(secret));
        return NextResponse.next();
    } catch (error) {
        console.error(error);

        return NextResponse.redirect(
            new URL('/login', /* apiEndpoints.baseUrl */ req.nextUrl.origin),
        );
    }
}
export const config = {
    matcher: ['/', '/tech-admin/:path*'],
};

/* export const config = {
    matcher: [
        '/((?!_next/static|favicon.ico|login|api|).*)',
    ]
} */
