import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    ClientByIdDocument,
    ClientsDocument,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    CreateInternalOrderDocument,
    CreateInternalOrderMutation,
    CreateInternalOrderMutationVariables,
    CreateLocalityDocument,
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    InternalOrdersDocument,
    LocalitiesDocument,
    LocalitiesQuery,
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
    OfficesDocument,
    ProductByIdDocument,
    ProductsDocument,
    ProductsStocksByOfficeIdDocument,
    SupplierByIdDocument,
    SuppliersDocument,
} from './graphql';
import { clientGraphqlQuery } from './graphqlclient';

const queryKeys = {
    clients: ['clients'],
    clientById: (id: string | undefined) => [...queryKeys.clients, id],

    localities: ['localities'],

    suppliers: ['suppliers'],
    supplierById: (id: string | undefined) => [...queryKeys.suppliers, id],

    internalOrders: ['internal-orders'],
    internalOrderById: (id: string | undefined) => [...queryKeys.internalOrders, id],

    offices: ['offices'],

    products:['products'],
    productById: (id: string | undefined) => [...queryKeys.products, id],

    productsStocksByOfficeId: (id: string) => ['products-stocks-by-office-id', id],
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

export const useClientById = (id: string | undefined) => {
    return useQuery(
        queryKeys.clientById(id),
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

export const useLocalities = () => {
    return useQuery(queryKeys.localities, () => {
        return clientGraphqlQuery(LocalitiesDocument, {});
    });
};

export const useProducts = () => {
    return useQuery(queryKeys.products, () => {
        return clientGraphqlQuery(ProductsDocument, {});
    });
};

export const useProductById = (id: string | undefined) => {
    return useQuery(
        queryKeys.productById(id),
        () => {
            return clientGraphqlQuery(ProductByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useSuppliers = () => {
    return useQuery(queryKeys.suppliers, () => {
        return clientGraphqlQuery(SuppliersDocument, {});
    });
};

export const useSupplierById = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierById(id),
        () => {
            return clientGraphqlQuery(SupplierByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
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

export const useInternalOrders = () => {
    return useQuery(queryKeys.internalOrders, () => {
        return clientGraphqlQuery(InternalOrdersDocument, {});
    });
};

type UseCreateInternalOrderOptions = UseMutationOptions<
    CreateInternalOrderMutation,
    Error,
    CreateInternalOrderMutationVariables
>;

export const useCreateInternalOrder = ({
    onSuccess,
    ...options
}: UseCreateInternalOrderOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateInternalOrderMutation,
        Error,
        CreateInternalOrderMutationVariables
    >(
        (data) => {
            return clientGraphqlQuery(CreateInternalOrderDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                if (data.createInternalOrder?.internalOrder) {
                    client.invalidateQueries(queryKeys.internalOrders);
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useOffices = () => {
    return useQuery(queryKeys.offices, () => {
        return clientGraphqlQuery(OfficesDocument, {});
    });
};

export const useProductsStocksByOfficeId = (officeId: string) => {
    return useQuery(queryKeys.productsStocksByOfficeId(officeId), () => {
        return clientGraphqlQuery(ProductsStocksByOfficeIdDocument, {
            officeId,
        });
    });
};
