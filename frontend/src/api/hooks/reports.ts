import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import fetchClient from '../fetch-client';
import { ReportMostSoldProductsDocument } from '../graphql';

export const useReportMostSoldProducts = () => {
    return useQuery({
        queryKey: queryKeys.reportMostSoldProducts,
        queryFn: () => {
            return fetchClient(ReportMostSoldProductsDocument, {});
        },
    });
};
