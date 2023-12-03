'use client';

import { useSearchParams } from 'next/navigation';

import { SessionContextValue, signOut, useSession } from 'next-auth/react';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { CurrentUser, isEmployee } from '@/modules/auth/user-utils';

type UserProviderData<T extends CurrentUser | null = CurrentUser | null> = {
    user: T;
    isUpdating: boolean;
    update: () => ReturnType<SessionContextValue['update']>;
};

const UserContext = createContext<UserProviderData>({
    user: null,
    isUpdating: false,
    update: () => {
        return Promise.resolve(null);
    },
});

type Props = PropsWithChildren<{
    user: CurrentUser | null;
}>;

const VERSION = '1.0.1';
const FORCED_LOGOUT_VERSION_KEY = 'FORCED_LOGOUT_VERSION';

const hasForcedLogout = () => {
    const FORCED_LOGOUT_VERSION = localStorage.getItem(FORCED_LOGOUT_VERSION_KEY) || null;
    return FORCED_LOGOUT_VERSION === VERSION;
};

const setLogoutAsForced = () => {
    localStorage.setItem(FORCED_LOGOUT_VERSION_KEY, VERSION);
};

const forceLogout = () => {
    if (hasForcedLogout()) return;
    signOut();
    setLogoutAsForced();
};

const UserProvider: React.FC<Props> = ({ children }) => {
    const { data: session, update, status } = useSession();
    const [isUpdating, setIsUpdating] = useState(false);
    const user = session?.user || null;
    const searchParams = useSearchParams();
    const loggedParam = searchParams.get('logged');
    const isLoggedParam = loggedParam === 'true';

    const handleUpdate = async () => {
        setIsUpdating(true);
        const data = await update();
        setIsUpdating(false);
        return data;
    };

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) return;

        if (session?.error) {
            signOut();
            setLogoutAsForced();
        }
    }, [session, status]);

    useEffect(() => {
        if (status === 'loading') return;
        if (!user) {
            if (isLoggedParam) {
                forceLogout();
                return;
            }

            setLogoutAsForced();
            return;
        }

        const isValidUser = isEmployee(user);
        if (!isValidUser) {
            forceLogout();
            return;
        }

        setLogoutAsForced();
    }, [user, status, isLoggedParam]);

    return (
        <UserContext.Provider value={{ user, isUpdating, update: handleUpdate }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = <T extends CurrentUser | null = CurrentUser | null>() => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUserContext must be used within an UserProvider');
    }

    return context as UserProviderData<T>;
};

export default UserProvider;
