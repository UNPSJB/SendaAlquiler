import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import {
    BrandsDocument,
    BrandsQuery,
    ClientByIdDocument,
    ClientsDocument,
    ContractsDocument,
    ContractsQuery,
    CreateBrandDocument,
    CreateBrandMutation,
    CreateBrandMutationVariables,
    CreateClientDocument,
    CreateClientMutation,
    CreateClientMutationVariables,
    CreateInternalOrderDocument,
    CreateInternalOrderMutation,
    CreateInternalOrderMutationVariables,
    CreateLocalityDocument,
    CreateLocalityMutation,
    CreateLocalityMutationVariables,
    EmployeesDocument,
    EmployeeByIdDocument,
    CreateProductDocument,
    CreateProductMutation,
    CreateProductMutationVariables,
    CreateRentalContractDocument,
    CreateRentalContractMutation,
    CreateRentalContractMutationVariables,
    InternalOrdersDocument,
    LocalitiesDocument,
    LocalitiesQuery,
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
    OfficesDocument,
    PurchasesDocument,
    ProductByIdDocument,
    ProductsDocument,
    ProductsQuery,
    ProductsStocksByOfficeIdDocument,
    SupplierByIdDocument,
    SuppliersDocument,
    CreatePurchaseMutation,
    CreatePurchaseMutationVariables,
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables,
    CreateEmployeeDocument,
    PurchaseByIdDocument,
    PurchasesQuery,
    CreatePurchaseDocument,
} from './graphql';
import { clientGraphqlQuery } from './graphqlclient';

const queryKeys = {
    clients: ['clients'],
    clientById: (id: string | undefined) => [...queryKeys.clients, id],

    employees: ['employees'],
    employeeById: (id: string | undefined) => [...queryKeys.employees, id],

    brands: ['brands'],

    contracts: ['contracts'],

    localities: ['localities'],

    purchases: ['purchases'],
    purchaseById: (id: string | undefined) => [...queryKeys.purchases, id],

    suppliers: ['suppliers'],
    supplierById: (id: string | undefined) => [...queryKeys.suppliers, id],

    internalOrders: ['internal-orders'],
    internalOrderById: (id: string | undefined) => [...queryKeys.internalOrders, id],

    offices: ['offices'],

    products: ['products'],
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

export const useEmployees = () => {
    return useQuery(queryKeys.employees, () => {
        return clientGraphqlQuery(EmployeesDocument, {});
    });
};

type UseCreateEmployeeOptions = UseMutationOptions<
    CreateEmployeeMutation,
    Error,
    CreateEmployeeMutationVariables
>;

export const useCreateEmployee = ({
    onSuccess,
    ...options
}: UseCreateEmployeeOptions = {}) => {
    const employee = useQueryClient();

    return useMutation<CreateEmployeeMutation, Error, CreateEmployeeMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateEmployeeDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createEmployee?.employee) {
                    employee.invalidateQueries(queryKeys.employees);
                }

                if (onSuccess) {
                    onSuccess(data, context, variables);
                }
            },
            ...options,
        },
    );
};

export const useEmployeeById = (id: string | undefined) => {
    return useQuery(
        queryKeys.employeeById(id),
        () => {
            return clientGraphqlQuery(EmployeeByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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

type UseCreateProductOptions = UseMutationOptions<
    CreateProductMutation,
    Error,
    CreateProductMutationVariables
>;

export const useCreateProduct = ({
    onSuccess,
    ...options
}: UseCreateProductOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateProductMutation, Error, CreateProductMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateProductDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const product = data.createProduct?.product;

                if (product) {
                    client.setQueryData<ProductsQuery>(queryKeys.products, (prev) => {
                        const products = prev?.products;

                        if (!products) {
                            return prev;
                        }

                        const next: ProductsQuery = {
                            ...prev,
                            products: [...products, product],
                        };

                        return next;
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

type UseCreateBrandOptions = UseMutationOptions<
    CreateBrandMutation,
    Error,
    CreateBrandMutationVariables
>;

export const useCreateBrand = ({ onSuccess, ...options }: UseCreateBrandOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateBrandMutation, Error, CreateBrandMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateBrandDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const brand = data.createBrand?.brand;

                if (brand) {
                    client.setQueryData<BrandsQuery>(queryKeys.brands, (prev) => {
                        const brands = prev?.brands;

                        if (!brands) {
                            return prev;
                        }

                        const next: BrandsQuery = {
                            ...prev,
                            brands: [...brands, brand],
                        };

                        return next;
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

export const useBrands = () => {
    return useQuery(queryKeys.brands, () => {
        return clientGraphqlQuery(BrandsDocument, {});
    });
};

export const useContracts = () => {
    return useQuery(queryKeys.contracts, () => {
        return clientGraphqlQuery(ContractsDocument, {});
    });
};

type UseCreateRentalContractOptions = UseMutationOptions<
    CreateRentalContractMutation,
    Error,
    CreateRentalContractMutationVariables
>;

export const useCreateRentalContract = ({
    onSuccess,
    ...options
}: UseCreateRentalContractOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateRentalContractMutation,
        Error,
        CreateRentalContractMutationVariables
    >(
        (data) => {
            return clientGraphqlQuery(CreateRentalContractDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const rentalContract = data.createRentalContract?.rentalContract;

                if (rentalContract) {
                    client.setQueryData<ContractsQuery>(queryKeys.contracts, (prev) => {
                        const rentalContracts = prev?.rentalContracts;

                        if (!rentalContracts) {
                            return prev;
                        }

                        const next: ContractsQuery = {
                            ...prev,
                            rentalContracts: [...rentalContracts, rentalContract],
                        };

                        return next;
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

export const usePurchases = () => {
    return useQuery(queryKeys.purchases,() => {
       return clientGraphqlQuery(PurchasesDocument, {});
    });
};

export const usePurchaseById = (id: string | undefined) => {
    return useQuery(
        queryKeys.purchaseById(id),
        () => {
            return clientGraphqlQuery(PurchaseByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

type UseCreatePurchaseOptions = UseMutationOptions<
    CreatePurchaseMutation,
    Error,
    CreatePurchaseMutationVariables
>;

export const useCreatePurchase = ({ onSuccess, ...options }: UseCreatePurchaseOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreatePurchaseMutation, Error, CreatePurchaseMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreatePurchaseDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const purchase = data.createPurchase?.purchase;

                if (purchase) {
                    client.setQueryData<PurchasesQuery>(queryKeys.purchases, (prev) => {
                        const purchases = prev?.purchases;

                        if (!purchases) {
                            return prev;
                        }

                        const next: PurchasesQuery = {
                            ...prev,
                            purchases: [...purchases, purchase],
                        };

                        return next;
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