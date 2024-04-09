import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import fetchClient from '../fetch-client';
import {
    AdminReportMostSoldProductsDocument,
    AdminReportMostSoldProductsQuery,
} from '../graphql';

export const useReportMostSoldProducts =
    (): UseQueryResult<AdminReportMostSoldProductsQuery> => {
        return useQuery({
            queryKey: queryKeys.reportMostSoldProducts,
            queryFn: () => {
                return fetchClient(AdminReportMostSoldProductsDocument, {});
            },
        });
    };
