import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    ClientsDocument,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    LocalitiesDocument,
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
    SuppliersDocument,
} from './graphql';
import { clientGraphqlQuery } from './graphqlclient';

const queryKeys = {
    clients: ['clients'],
    localities: ['localities'],
    suppliers: ['suppliers'],
};

/**
 * Type definition for the options when using the login hook.
 */
type UseLoginOptions = UseMutationOptions<LoginMutation, Error, LoginMutationVariables>;

/**
 * Custom hook to execute the login mutation.
 *
 * @param options - Options for the mutation.
 * @returns The result object from the useMutation hook.
 */
export const useLogin = (options: UseLoginOptions = {}) => {
    return useMutation<LoginMutation, Error, LoginMutationVariables>((data) => {
        return clientGraphqlQuery(LoginDocument, data);
    }, options);
};

export const useClients = () => {
    return useQuery(queryKeys.clients, () => {
        return clientGraphqlQuery(ClientsDocument, {});
    });
};

export const useLocalities = () => {
    return useQuery(queryKeys.localities, () => {
        return clientGraphqlQuery(LocalitiesDocument, {});
    });
};

export const useSuppliers = () => {
    return useQuery(queryKeys.suppliers, () => {
        return clientGraphqlQuery(SuppliersDocument, {});
    });
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
                    client.invalidateQueries(queryKeys.clients);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};
