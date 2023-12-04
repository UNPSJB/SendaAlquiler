/* eslint-disable @typescript-eslint/no-unused-vars */
import { CurrentUserQuery } from '@api/graphql';
// eslint-disable-next-line import/order
import NextAuth from 'next-auth';

declare module 'next-auth' {
    type User = {
        user: CurrentUserQuery['user'];
        accessToken: string;
    };

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: CurrentUserQuery['user'];
        accessToken: string;
        error?: string | null | undefined;
    }
}

import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        user: CurrentUserQuery['user'];
        accessToken: string;
        error?: string | null | undefined;
    }
}
