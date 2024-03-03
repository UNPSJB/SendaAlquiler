import { redirect } from 'next/navigation';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { print } from 'graphql/language/printer';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/auth';

const url = process.env.NEXT_PUBLIC_API_HOST;

export async function fetchServer<T, V>(
    query: TypedDocumentNode<T, V>,
    variables: V,
    options: Omit<RequestInit, 'method' | 'headers' | 'body'> = {},
    token?: string,
) {
    try {
        let accessToken = token;
        if (!accessToken) {
            accessToken = (await getServerSession(authOptions))?.accessToken;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(accessToken
                    ? {
                          Authorization: `JWT ${accessToken}`,
                      }
                    : {}),
            },
            body: JSON.stringify({
                query: print(query),
                variables: variables || undefined,
            }),
            ...options,
        });

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();
        return json.data as T;
    } catch (error) {
        console.error(error);
        if (error instanceof Response) {
            if (error.status === 401) {
                return redirect('/login');
            }

            if (error.status === 409) {
                return redirect('/request-email-verification');
            }
        }

        throw new Error('Failed to fetch data from the server', { cause: error });
    }
}

type FetchDataResult<T> = {
    data: T | null;
    error: Error | null;
};

export const fetchServerInitialData = async <T, V>(
    document: DocumentNode<T, V>,
    variables: V,
    init: RequestInit = {},
): Promise<FetchDataResult<T>> => {
    let data = null;
    let error = null;

    try {
        data = await fetchServer(document, variables, init);
    } catch (e) {
        error = e as Error;
    }

    return { data, error };
};

export default fetchServer;
