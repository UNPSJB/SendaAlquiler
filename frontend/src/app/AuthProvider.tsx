'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

interface AuthProviderProps {
    children: React.ReactNode;
    session: Session | null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
