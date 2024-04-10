import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import fetchClient from '../fetch-client';
import {
    AdminReportMostSoldProductsDocument,
    AdminReportMostSoldProductsQuery,
    AdminReportMostSoldProductsQueryVariables,
} from '../graphql';

export const useReportMostSoldProducts = (
    variables: AdminReportMostSoldProductsQueryVariables,
): UseQueryResult<AdminReportMostSoldProductsQuery> => {
    return useQuery({
        queryKey: queryKeys.reportMostSoldProducts(variables),
        queryFn: () => {
            return fetchClient(AdminReportMostSoldProductsDocument, variables);
        },
    });
};
