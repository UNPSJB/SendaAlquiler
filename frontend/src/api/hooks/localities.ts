import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import {
    CreateLocalityDocument,
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    LocalitiesDocument,
    DeleteLocalityDocument,
    DeleteLocalityMutation,
    AllLocalitiesDocument,
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const useLocalities = () => {
    return usePaginatedQuery(
        queryKeys.localitiesPaginatedList,
        LocalitiesDocument,
        'localities',
        {
            page: 'number',
        },
    );
};

export const useAllLocalities = () => {
    return useQuery(queryKeys.localitiesNonPaginated, () => {
        return clientGraphqlQuery(AllLocalitiesDocument, {});
    });
};

export const useDeleteLocality = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteLocalityMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteLocalityMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteLocalityDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries([queryDomains.localities]);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
type UseCreateLocalityOptions = UseMutationOptions<
    CreateLocalityMutation,
    Error,
    CreateLocalityMutationVariables
>;

export const useCreateLocality = ({
    onSuccess,
    ...options
}: UseCreateLocalityOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateLocalityMutation, Error, CreateLocalityMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateLocalityDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const locality = data.createLocality?.locality;
                if (locality) {
                    client.invalidateQueries([queryDomains.localities]);
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
