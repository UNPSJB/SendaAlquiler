import { TypedDocumentNode } from '@graphql-typed-document-node/core';
// eslint-disable-next-line import/order
import { print } from 'graphql/language/printer';

export { gql } from 'graphql-request';

import { getSession, signOut } from 'next-auth/react';

const url = `${process.env.NEXT_PUBLIC_API_HOST}/graphql`;

export async function fetchClient<T, V>(
    query: TypedDocumentNode<T, V>,
    variables: V,
    {
        token,
        ...options
    }: Omit<RequestInit, 'method' | 'headers' | 'body'> & {
        token?: string;
    } = {},
) {
    try {
        const session = await getSession();
        const accessToken = token || session?.accessToken;

        const fetchConfig: RequestInit = {
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
            credentials: 'include',
            ...options,
        };
        const response = await fetch(url, fetchConfig);

        if (!response.ok) {
            throw response;
        }

        const json = await response.json();

        if (json.errors && json.errors.length > 0) {
            const firstError = json.errors[0];
            let message = firstError.message;

            const firstErrorSplitted = firstError.message.split('Error: ');
            if (firstErrorSplitted.length > 1) {
                message = firstErrorSplitted.slice(1).join('');
            }

            if (message === 'Error decoding signature') {
                signOut();
                sessionStorage.removeItem('token');
                return fetchClient<T, V>(query, variables);
            } else {
                throw new Error(message);
            }
        }

        return json.data as T;
    } catch (error) {
        if (error instanceof Response) {
            if (error.status === 401) {
                signOut();
            }

            if (error.status === 409) {
                window.location.href = '/request-email-verification';
            }

            throw error;
        }

        throw error;
    }
}

export default fetchClient;
