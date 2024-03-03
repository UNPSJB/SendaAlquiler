'use client';

import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { fetchClient } from '@/api/fetch-client';

import { URLFiltersConfig, useUrlFilters } from './useUrlFilters';

type ParamConfig = 'number' | 'boolean' | 'array' | 'string';

export type ParamsConfig<K extends string> = Record<K, ParamConfig>;
type PageConfig = {
    page: {
        type: 'int';
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usePaginatedQuery = <
    T,
    V extends Record<string, any>,
    FiltersConfig extends URLFiltersConfig<Omit<keyof V, 'page'> & string> & PageConfig,
>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key: ((variables: any) => any[]) | string[],
    document: TypedDocumentNode<T, V>,
    dataKey: keyof T,
    defaultVariables: Omit<V, 'page'>,
    filtersConfig: FiltersConfig,
) => {
    const filtersMethods = useUrlFilters(filtersConfig);
    const prevRef = useRef(filtersMethods.filters);

    const limit = 20;
    const activePage = (filtersMethods.filters.page || 1) as number;
    const variables = {
        ...defaultVariables,
        ...filtersMethods.filters,
        limit,
        page: activePage,
    } as unknown as V;

    const queryResult = useQuery<unknown, Error, T>({
        queryKey: [typeof key === 'function' ? key(variables) : key, variables],
        queryFn: () => {
            return fetchClient<T, V>(document, variables);
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const count = queryResult.data ? (queryResult.data[dataKey] as any)['count'] : null;
    const noPages = queryResult.data
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (queryResult.data[dataKey] as any)['numPages']
        : null;

    useEffect(() => {
        const nextRef = filtersMethods.filters;
        delete nextRef.page;

        if (JSON.stringify(prevRef.current) !== JSON.stringify(nextRef)) {
            prevRef.current = nextRef;
            (filtersMethods as any).setFilter('page', 1);
        }
    }, [filtersMethods, defaultVariables]);

    return {
        limit,
        activePage,
        hasNextPage: noPages !== null && activePage < noPages,
        hasPreviousPage: noPages !== null && activePage > 1,
        count,
        noPages,
        queryResult,
        variables: filtersMethods.filters,
        setVariables: filtersMethods.setFilter,
    };
};

export default usePaginatedQuery;
