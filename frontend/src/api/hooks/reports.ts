import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import { dateToInputValue } from '@/lib/utils';

import fetchClient from '../fetch-client';
import {
    ReportSalesQuery,
    ReportSalesDocument,
    ReportSalesQueryVariables,
} from '../graphql';

export const useReportSales = (
    variables: Omit<ReportSalesQueryVariables, 'startDate' | 'endDate'> & {
        startDate: Date | null | undefined;
        endDate: Date | null | undefined;
    },
): UseQueryResult<ReportSalesQuery> => {
    return useQuery({
        queryKey: queryKeys.reportSales(
            variables as unknown as ReportSalesQueryVariables,
        ),
        queryFn: () => {
            return fetchClient(ReportSalesDocument, {
                ...variables,
                startDate: dateToInputValue(variables.startDate as Date),
                endDate: dateToInputValue(variables.endDate as Date),
            });
        },
        enabled: !!variables.startDate && !!variables.endDate,
    });
};
