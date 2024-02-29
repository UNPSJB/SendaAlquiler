import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    CreateLocalityDocument,
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    UpdateLocalityDocument,
    UpdateLocalityMutation,
    UpdateLocalityMutationVariables,
    LocalitiesDocument,
    DeleteLocalityDocument,
    DeleteLocalityMutation,
    AllLocalitiesDocument,
} from '../graphql';

export const useLocalities = () => {
    return usePaginatedQuery(
        queryKeys.localitiesPaginatedList,
        LocalitiesDocument,
        'localities',
        {},
        {
            page: { type: 'int' },
        },
    );
};

export const useAllLocalities = () => {
    return useQuery(queryKeys.localitiesNonPaginated, () => {
        return fetchClient(AllLocalitiesDocument, {});
    });
};

export const useDeleteLocality = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteLocalityMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteLocalityMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteLocalityDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.removeQueries([queryDomains.localities]);
                client.invalidateQueries([queryDomains.localities]);
                client.refetchQueries([queryDomains.localities]);

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
            return fetchClient(CreateLocalityDocument, data);
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

type UseUpdateLocalityOptions = UseMutationOptions<
    UpdateLocalityMutation,
    Error,
    UpdateLocalityMutationVariables
>;

export const useUpdateLocality = ({
    onSuccess,
    ...options
}: UseUpdateLocalityOptions = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateLocalityMutation, Error, UpdateLocalityMutationVariables>(
        (data) => {
            return fetchClient(UpdateLocalityDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const locality = data.updateLocality?.locality;
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
