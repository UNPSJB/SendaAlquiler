'use server';

import { cookies } from 'next/headers';

import { OFFICE_COOKIE_NAME, YEAR_1_IN_SECONDS } from './server-action-constants';

export const setOfficeCookieAction = async (id: string) => {
    cookies().set(OFFICE_COOKIE_NAME, id, {
        maxAge: YEAR_1_IN_SECONDS,
        sameSite: 'lax',
        httpOnly: true,
    });
};

export const gettOfficeCookieAction = async () => {
    return cookies().get(OFFICE_COOKIE_NAME)?.value;
};
