import { useQuery } from '@tanstack/react-query';

import { queryKeys } from './constants';

import { OfficesDocument } from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const useOffices = () => {
    return useQuery(queryKeys.officesNonPaginated, () => {
        return clientGraphqlQuery(OfficesDocument, {});
    });
};
