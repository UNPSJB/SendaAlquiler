'use server';

import { cookies } from 'next/headers';

import { OFFICE_COOKIE_NAME, YEAR_1_IN_SECONDS } from './server-action-constants';

export const setOfficeCookieAction = async (id: string) => {
    console.log('setOfficeCookieAction', id);
    cookies().set(OFFICE_COOKIE_NAME, id, {
        maxAge: YEAR_1_IN_SECONDS,
        sameSite: 'lax',
        httpOnly: true,
    });
};

export const clearOfficeCookieAction = async () => {
    console.log('clearOfficeCookieAction');
    cookies().set(OFFICE_COOKIE_NAME, '', {
        maxAge: 0,
        sameSite: 'lax',
        httpOnly: true,
    });
};

export const gettOfficeCookieAction = async () => {
    const value = cookies().get(OFFICE_COOKIE_NAME)?.value;
    return value || null;
};
