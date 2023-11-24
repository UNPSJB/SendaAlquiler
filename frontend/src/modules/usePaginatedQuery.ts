'use client';

import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { clientGraphqlQuery } from '@/api/graphqlclient';

const useSetSearchParam = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setParams = useCallback(
        (values: { key: string; value: string | null }[]) => {
            // now you got a read/write object
            const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

            values.forEach(({ key, value }) => {
                if (!value) {
                    current.delete(key);
                } else {
                    current.set(key, value);
                }
            });

            // cast to string
            const search = current.toString();
            // or const query = `${'?'.repeat(search.length && 1)}${search}`;
            const query = search ? `?${search}` : '';

            router.push(`${pathname}${query}`);
        },
        [searchParams, pathname, router],
    );

    const setParam = useCallback(
        (key: string, newValue: string | null) => {
            setParams([{ key, value: newValue }]);
        },
        [setParams],
    );

    return { setParam, setParams };
};

function deserializeParams(
    searchParams: ReadonlyURLSearchParams,
    paramConfig: ParamsConfig<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: { [key: string]: any } = {};

    searchParams.forEach((value, key) => {
        if (key in paramConfig) {
            const type = paramConfig[key];
            switch (type) {
                case 'number':
                    result[key] = Number(value);
                    break;
                case 'array':
                    result[key] = value.split(',');
                    break;
                case 'boolean':
                    result[key] = value === 'true';
                    break;
                default:
                    result[key] = value;
            }
        }
    });

    return result;
}

function serializeParams(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: { [key: string]: any },
    paramConfig: ParamsConfig<string>,
): {
    [key: string]: string | null;
} {
    const result: { [key: string]: string | null } = {};

    for (const [key, value] of Object.entries(variables)) {
        if (key in paramConfig) {
            if (value === null || value === undefined) {
                result[key] = null;
                continue;
            }

            const type = paramConfig[key];
            switch (type) {
                case 'number':
                    result[key] = String(value);
                    break;
                case 'array':
                    result[key] = value.join(',');
                    break;
                case 'boolean':
                    result[key] = value ? 'true' : 'false';
                    break;
                default:
                    result[key] = value;
            }
        }
    }

    return result;
}

type ParamConfig = 'number' | 'boolean' | 'array' | 'string';

export type ParamsConfig<K extends string> = Record<K, ParamConfig>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePaginatedQuery = <T, V extends Record<string, any>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: ((variables: any) => any[]) | string[],
    document: TypedDocumentNode<T, V>,
    dataKey: keyof T,
    paramsConfig: ParamsConfig<keyof V & string>,
    defaultVariables: Partial<V> = {},
) => {
    const searchParams = useSearchParams();
    const { setParams } = useSetSearchParam();

    const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;

    const initialVariables = {
        ...defaultVariables,
        ...deserializeParams(searchParams, paramsConfig),
    };
    const [variables, setVariables] = useState<V>(initialVariables);
    const prevVariablesRef = useRef<V | null>(null);

    const limit = 20;
    const activePage = pageParam;

    const queryResult = useQuery<unknown, Error, T>(
        [typeof key === 'function' ? key(variables) : key, { ...variables, activePage }],
        () => {
            return clientGraphqlQuery<T, V>(document, {
                ...variables,
                limit,
                page: activePage,
            } as V);
        },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const count = queryResult.data ? (queryResult.data[dataKey] as any)['count'] : null;
    const noPages = queryResult.data
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (queryResult.data[dataKey] as any)['numPages']
        : null;

    useEffect(() => {
        if (prevVariablesRef.current === null && variables !== prevVariablesRef.current) {
            const serialized = serializeParams(variables, paramsConfig);
            prevVariablesRef.current = variables;

            const entries = Object.entries(serialized).map(([key, value]) => ({
                key,
                value,
            }));

            setParams(entries);
        }
    }, [variables, paramsConfig, setParams]);

    useEffect(() => {
        if (noPages !== null && noPages < activePage) {
            setVariables((prev) => ({
                ...prev,
                page: noPages,
            }));
        }
    }, [setVariables, activePage, noPages]);

    return {
        limit,
        activePage,
        hasNextPage: noPages !== null && activePage < noPages,
        hasPreviousPage: noPages !== null && activePage > 1,
        count,
        noPages,
        variables,
        setVariables,
        queryResult,
    };
};

export default usePaginatedQuery;
