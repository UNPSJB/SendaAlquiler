import { redirect } from 'next/navigation';

import fetchServer from '@/api/fetch-server';
import { ValidateTokenDocument } from '@/api/graphql';

import ReestablishPasswordPage from './ReestablishPasswordPage';

import { PageProps } from '@/types/next';

type PageSearchParams = Partial<{
    token: string;
}>;

const getData = async (token: PageSearchParams['token']) => {
    if (!token) {
        return {
            error: 'El link es inválido',
            isValid: false,
        };
    }

    try {
        const res = await fetchServer(ValidateTokenDocument, {
            token: token,
        });

        return {
            error: res.validateToken?.error,
            isValid: res.validateToken?.isValid,
        };
    } catch (e) {
        return {
            error: 'El link es inválido',
            isValid: false,
        };
    }
};

const Page = async ({ searchParams }: PageProps<unknown, PageSearchParams>) => {
    const token = searchParams.token;
    const { isValid, error } = await getData(token);

    if (isValid === false || !token) {
        redirect(`/login?msg=${encodeURIComponent(error || 'El link es inválido')}`);
    }

    return <ReestablishPasswordPage token={token} />;
};

export default Page;
