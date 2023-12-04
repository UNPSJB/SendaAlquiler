import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import fetchClient from '@/api/fetch-client';
import fetchServer from '@/api/fetch-server';
import { CurrentUserDocument, LoginDocument, RefreshTokenDocument } from '@/api/graphql';
import { clearOfficeCookieAction } from '@/api/server-actions';

import { jwt } from './jwt-utils';
import { CurrentUser } from './user-utils';

import { getCleanErrorMessage } from '../utils';

const MAX_AGE_14_DAYS_IN_SECONDS = 60 * 60 * 24 * 14;

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: MAX_AGE_14_DAYS_IN_SECONDS,
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials) {
                try {
                    const email = credentials?.email;
                    const password = credentials?.password;
                    if (!email || !password) {
                        throw new Error('Credenciales inválidas');
                    }

                    const response = await fetchClient(LoginDocument, {
                        email,
                        password,
                    });

                    if (!response.login) {
                        throw new Error('Ocurrió un error al iniciar sesión');
                    }

                    const { token, user } = response.login;

                    return {
                        user: user,
                        accessToken: token,
                    };
                } catch (error) {
                    console.error(error);
                    if (error instanceof Response) {
                        return null;
                    }

                    const msg = getCleanErrorMessage(error as Error);
                    throw new Error(msg);
                }
            },
        }),
    ],
    callbacks: {
        async session(params) {
            const { session, token } = params;

            if (token.error) {
                return {
                    user: null,
                    error: token.error,
                    accessToken: token.accessToken,
                    expires: session.expires,
                };
            }

            let updatedUser = token.user as CurrentUser;

            try {
                const { user } = await fetchServer(
                    CurrentUserDocument,
                    {},
                    {},
                    token.accessToken,
                );

                if (!user) {
                    return {
                        user: null,
                        error: 'TOKEN_EXPIRED',
                        accessToken: token.accessToken,
                        expires: session.expires,
                    };
                }

                updatedUser = user;
            } catch (error) {}

            const newSession = {
                user: updatedUser,
                accessToken: token.accessToken,
                expires: session.expires,
            };

            return newSession;
        },
        async jwt(params) {
            const { token, user, trigger } = params;
            if (trigger === 'update') {
                const { user } = await fetchClient(
                    CurrentUserDocument,
                    {},
                    { token: token.accessToken },
                );

                return { ...token, ...user };
            }

            if (user) {
                return { ...token, ...user };
            }

            const { exp: accessTokenExpires } = jwt.decode(token.accessToken);
            if (!accessTokenExpires) {
                return {
                    ...token,
                    error: 'AccessTokenError',
                };
            }

            const currentUnixTimestamp = Math.floor(Date.now() / 1000);
            const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

            if (accessTokenHasExpired) {
                const res = await refreshAccessToken(token);
                return res;
            }

            return token;
        },
    },
    events: {
        async signOut() {
            clearOfficeCookieAction();
        },
    },
};

async function refreshAccessToken(token: JWT) {
    try {
        const response = await fetchClient(RefreshTokenDocument, {
            token: token.accessToken,
        });

        if (!response.refreshToken) {
            throw new Error(encodeURIComponent('Hubo un error al refrescar el token'));
        }

        const refreshedAccessToken = response.refreshToken.token;
        const { exp } = jwt.decode(refreshedAccessToken);

        return {
            ...token,
            accessToken: refreshedAccessToken,
            exp,
        };
    } catch (error) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}
