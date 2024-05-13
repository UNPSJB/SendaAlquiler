import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

import { CurrentUserQuery } from '@/api/graphql';

declare module 'next-auth' {
    interface Session {
        token: string;
        error: string;
        user: CurrentUserQuery['user'];
    }

    interface User {
        token: string;
        user: CurrentUserQuery['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        token: string;
        error: string;
        user: CurrentUserQuery['user'];
    }
}
