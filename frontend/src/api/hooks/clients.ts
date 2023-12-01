import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import {
    ClientByIdDocument,
    ClientsDocument,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    DeleteClientDocument,
    DeleteClientMutation,
    AllClientsDocument,
    UpdateClientMutation,
    UpdateClientMutationVariables,
    UpdateClientDocument,
} from '../graphql';
import { clientGraphqlQuery } from '../graphqlclient';

export const useDeleteClient = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteClientMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteClientMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteClientDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries([queryDomains.clients]);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

type UseUpdateClientOptions = UseMutationOptions<
    UpdateClientMutation,
    Error,
    UpdateClientMutationVariables
>;

export const useUpdateClient = ({
    onSuccess,
    ...options
}: UseUpdateClientOptions = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateClientMutation, Error, UpdateClientMutationVariables>(
        (data) => {
            return clientGraphqlQuery(UpdateClientDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.updateClient?.client) {
                    client.invalidateQueries([queryDomains.clients]);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};

type UseCreateClientOptions = UseMutationOptions<
    CreateClientMutation,
    Error,
    CreateClientMutationVariables
>;

export const useCreateClient = ({
    onSuccess,
    ...options
}: UseCreateClientOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateClientMutation, Error, CreateClientMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateClientDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createClient?.client) {
                    client.invalidateQueries([queryDomains.clients]);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};

export const useAllClients = () => {
    return useQuery(queryKeys.clientsNonPaginated, () => {
        return clientGraphqlQuery(AllClientsDocument, {});
    });
};

export const useClients = () => {
    return usePaginatedQuery(queryKeys.clientsPaginatedList, ClientsDocument, 'clients', {
        page: 'number',
    });
};

export const useClientById = (id: string | undefined) => {
    return useQuery(
        queryKeys.clientDetailsById(id),
        () => {
            return clientGraphqlQuery(ClientByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};
