import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import fetchClient from '@/api/fetch-client';
import fetchServer from '@/api/fetch-server';
import { CurrentUserDocument, LoginDocument } from '@/api/graphql';

import { getCleanErrorMessage } from '../utils';

export const authOptions: AuthOptions = {
    // Configure JWT
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@example.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
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
                        id: '',
                        user: user,
                        token: token,
                    };
                } catch (error) {
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
        jwt: async ({ token, user }) => {
            // Initial sign in
            if (user) {
                token.token = user.token;
                token.user = user.user;
            }

            try {
                const { user } = await fetchServer(
                    CurrentUserDocument,
                    {},
                    {},
                    token.token,
                );

                if (!user) {
                    return {
                        ...token,
                        user: null,
                        error: 'TOKEN_EXPIRED',
                    };
                }

                token.user = user;
            } catch (error) {
                return {
                    ...token,
                    user: null,
                    error: 'TOKEN_EXPIRED',
                };
            }

            return token;
        },
        session: async ({ session, token }) => {
            session.token = token.token;
            session.error = token.error;
            session.user = token.user;

            return session;
        },
    },
    pages: {
        signIn: '/login', // You should create this custom sign-in page if you need it
    },
};
