import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth';
import 'server-only';

export async function getOptionalCurrentUser() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    return user;
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
        throw new Error('No user found');
    }

    return user;
}
