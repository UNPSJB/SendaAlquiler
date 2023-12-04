import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import { OfficesDocument } from '../graphql';

export const useOffices = () => {
    return useQuery(queryKeys.officesNonPaginated, () => {
        return fetchClient(OfficesDocument, {});
    });
};
