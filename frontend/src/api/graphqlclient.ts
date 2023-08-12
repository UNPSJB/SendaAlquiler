import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql/language/printer';

export { gql } from 'graphql-request';

const url = process.env.NEXT_PUBLIC_API_HOST;

export const graphQLClient = new GraphQLClient(url, {
    credentials: 'include',
});

export enum FetchCache {
    NO_STORE = 'no-store',
    FORCE_CACHE = 'force-cache',
}

export const ssrGraphqlQuery = <T, V>(
    token: string | undefined | null,
    query: TypedDocumentNode<T, V>,
    variables: V,
    cache: FetchCache = FetchCache.FORCE_CACHE,
) =>
    fetch(url, {
        cache,
        method: 'POST',
        headers: token
            ? {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${token}`,
              }
            : {
                  'Content-Type': 'application/json',
              },
        body: JSON.stringify({
            query: print(query),
            variables: variables || undefined,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .then<T>((data) => {
            return data.data;
        })
        .catch((error) => {
            throw new Error(error);
        });

export const clientGraphqlQuery = <T, V>(query: TypedDocumentNode<T, V>, variables: V) =>
    fetch(url, {
        method: 'POST',
        headers: sessionStorage.getItem('token')
            ? {
                  'Content-Type': 'application/json',
                  Authorization: `JWT ${sessionStorage.getItem('token')}`,
              }
            : {
                  'Content-Type': 'application/json',
              },
        body: JSON.stringify({
            query: print(query),
            variables,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            return response.json();
        })
        .then<T>((data) => {
            if (data.errors && data.errors.length > 0) {
                const firstError = data.errors[0];
                let message = firstError.message;

                const firstErrorSplitted = firstError.message.split('Error: ');
                if (firstErrorSplitted.length > 1) {
                    message = firstErrorSplitted.slice(1).join('');
                }

                throw new Error(message);
            }

            return data.data;
        })
        .catch((error) => {
            throw new Error(error);
        });
