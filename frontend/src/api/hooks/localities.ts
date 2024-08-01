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
    LocalityByIdDocument,
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
    return useQuery({
        queryKey: queryKeys.localitiesNonPaginated,
        queryFn: () => {
            return fetchClient(AllLocalitiesDocument, {});
        },
    });
};

export const useDeleteLocality = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteLocalityMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteLocalityMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteLocalityDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.localities],
                type: 'all',
                refetchType: 'all',
                stale: true,
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
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

    return useMutation<CreateLocalityMutation, Error, CreateLocalityMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateLocalityDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const locality = data.createLocality?.locality;
            if (locality) {
                client.invalidateQueries({
                    queryKey: [queryDomains.localities],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
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

    return useMutation<UpdateLocalityMutation, Error, UpdateLocalityMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(UpdateLocalityDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const locality = data.updateLocality?.locality;
            if (locality) {
                client.invalidateQueries({
                    queryKey: [queryDomains.localities],
                    type: 'all',
                    refetchType: 'all',
                });
            }

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

export const useLocalityById = (id: string) => {
    return useQuery({
        queryKey: [queryDomains.localities, id],
        queryFn: () => {
            return fetchClient(LocalityByIdDocument, { id });
        },
    });
};
