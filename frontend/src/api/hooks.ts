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
    CreateLocalityDocument,
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    LocalitiesDocument,
    LocalitiesQuery,
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
                    client.setQueryData<LocalitiesQuery>(queryKeys.localities, (prev) => {
                        if (!prev) {
                            return prev;
                        }

                        return {
                            ...prev,
                            localities: [
                                ...prev.localities,
                                {
                                    __typename: 'Locality',
                                    id: locality.id,
                                    name: locality.name,
                                    postalCode: variables.postalCode,
                                    state: variables.state,
                                },
                            ],
                        };
                    });
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
