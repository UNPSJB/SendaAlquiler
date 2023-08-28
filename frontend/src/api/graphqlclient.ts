import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql/language/printer';

export { gql } from 'graphql-request';

const url = process.env.NEXT_PUBLIC_API_HOST;

/**
 * Initialized GraphQL client instance.
 */
export const graphQLClient = new GraphQLClient(url, {
    credentials: 'include',
});

/**
 * Enum to define fetch cache options.
 */
export enum FetchCache {
    NO_STORE = 'no-store',
    FORCE_CACHE = 'force-cache',
}

/**
 * Generate the headers for GraphQL requests.
 *
 * @param token - The authorization token. Optional.
 * @returns An object containing the headers.
 */
const generateHeaders = (token?: string | null): HeadersInit => {
    const baseHeaders = {
        'Content-Type': 'application/json',
    };
    if (token) {
        return {
            ...baseHeaders,
            Authorization: `JWT ${token}`,
        };
    }
    return baseHeaders;
};

/**
 * Handle the GraphQL query response.
 *
 * @param response - The fetch API response object.
 * @returns The data from the GraphQL response.
 * @throws Will throw an error if the response contains errors.
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const data = await response.json();
    if (data.errors && data.errors.length > 0) {
        const firstError = data.errors[0];
        const message =
            firstError.message.split('Error: ').slice(1).join('') || firstError.message;
        throw new Error(message);
    }

    return data.data;
};

/**
 * Execute a GraphQL query on the server during server-side rendering.
 *
 * @param token - The authorization token. Could be undefined or null.
 * @param query - The GraphQL typed document.
 * @param variables - The variables for the GraphQL query.
 * @param cache - Cache settings for the fetch request.
 * @returns The data from the GraphQL response.
 */
export const ssrGraphqlQuery = <TResult, TVariables>(
    token: string | undefined | null,
    query: TypedDocumentNode<TResult, TVariables>,
    variables: TVariables,
    cache: FetchCache = FetchCache.FORCE_CACHE,
) => {
    return fetch(url, {
        cache,
        method: 'POST',
        headers: generateHeaders(token),
        body: JSON.stringify({
            query: print(query),
            variables: variables || undefined,
        }),
    }).then<TResult>(handleResponse);
};

/**
 * Execute a GraphQL query on the client side.
 *
 * @param query - The GraphQL typed document.
 * @param variables - The variables for the GraphQL query.
 * @returns The data from the GraphQL response.
 */
export const clientGraphqlQuery = <TResult, TVariables>(
    query: TypedDocumentNode<TResult, TVariables>,
    variables: TVariables,
) => {
    const token = sessionStorage.getItem('token');
    return fetch(url, {
        method: 'POST',
        headers: generateHeaders(token),
        body: JSON.stringify({
            query: print(query),
            variables,
        }),
    }).then<TResult>(handleResponse);
};
