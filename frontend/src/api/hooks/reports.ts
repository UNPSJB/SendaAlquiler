import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import fetchClient from '../fetch-client';
import {
    ReportSalesQuery,
    ReportSalesDocument,
    ReportSalesQueryVariables,
} from '../graphql';

export const useReportSales = (
    variables: ReportSalesQueryVariables,
): UseQueryResult<ReportSalesQuery> => {
    return useQuery({
        queryKey: queryKeys.reportSales(variables),
        queryFn: () => {
            return fetchClient(ReportSalesDocument, variables);
        },
        enabled: variables.startDate !== null && variables.endDate !== null,
    });
};
