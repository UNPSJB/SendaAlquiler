import { NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

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

const isValidInternalURL = (url: string, domain: string) => {
    try {
        const targetURL = new URL(url);
        return targetURL.hostname === domain;
    } catch (e) {
        // The URL constructor will throw an error for invalid URLs
        return false;
    }
};

export default withAuth(
    async function middleware(request) {
        const host = process.env.NEXT_PUBLIC_HOST;
        const pathname = request.nextUrl.pathname;

        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        const isGuestRoute = guestRoutes.some((route) => pathname.startsWith(route));

        if (
            someRouteMatchesStartWith(pathname, ['/_next']) ||
            routeHasFileExtension(pathname)
        ) {
            return NextResponse.next();
        }

        const user = token?.user;
        const isEmployee = !!user?.employee?.offices;
        const userExists = !token?.error && isEmployee;

        if (!token || !userExists) {
            if (!isGuestRoute) {
                const redirectUrl = new URL(`${host}/login`);
                const next = `${host}/${request.nextUrl.pathname}`;
                redirectUrl.searchParams.set('next', next);
                return NextResponse.redirect(redirectUrl);
            }
        }

        if (token && userExists) {
            const nextURL = request.nextUrl.searchParams.get('next');
            if (pathname === '/login' && nextURL) {
                if (isValidInternalURL(nextURL, 'localhost')) {
                    const redirectUrl = new URL(nextURL);
                    redirectUrl.searchParams.set('logged', 'true');

                    return NextResponse.redirect(redirectUrl);
                }

                return NextResponse.redirect(new URL('/'));
            }

            if (isGuestRoute) {
                return NextResponse.redirect(new URL(`${host}/`));
            }

            if (isEmployee) {
                return NextResponse.next();
            }
        }
    },
    {
        callbacks: {
            authorized: () => {
                return true;
            },
        },
        secret: process.env.NEXTAUTH_SECRET,
    },
);

const guestRoutes = ['/login'];
