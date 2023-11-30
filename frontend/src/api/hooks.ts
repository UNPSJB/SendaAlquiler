import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
    UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import {
    BrandsDocument,
    BrandsQuery,
    ClientByIdDocument,
    ClientsDocument,
    ContractByIdDocument,
    ContractsDocument,
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
    CreateSupplierDocument,
    CreateSupplierMutation,
    CreateSupplierMutationVariables,
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
    LoginDocument,
    LoginMutation,
    LoginMutationVariables,
    OfficesDocument,
    PurchasesDocument,
    ProductsDocument,
    ProductsStocksByOfficeIdDocument,
    SupplierByIdDocument,
    SuppliersDocument,
    SupplierOrdersDocument,
    CreatePurchaseMutation,
    CreatePurchaseMutationVariables,
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables,
    CreateEmployeeDocument,
    PurchaseByIdDocument,
    CreatePurchaseDocument,
    SupplierOrderByIdDocument,
    ProductByIdDocument,
    ProductsQueryVariables,
    SupplierOrdersBySupplierIdDocument,
    ProductsSuppliedBySupplierIdDocument,
    AllSuppliersDocument,
    CreateSupplierOrderMutationVariables,
    CreateSupplierOrderDocument,
    CreateSupplierOrderMutation,
    DeletePurchaseDocument,
    DeleteSupplierDocument,
    DeleteSupplierOrderDocument,
    DeleteInternalOrderDocument,
    DeleteEmployeeDocument,
    DeleteClientDocument,
    DeleteProductDocument,
    DeleteRentalContractDocument,
    DeleteLocalityDocument,
    DeleteInternalOrderMutation,
    DeleteSupplierOrderMutation,
    DeleteSupplierMutation,
    DeleteEmployeeMutation,
    DeleteClientMutation,
    DeleteProductMutation,
    DeleteRentalContractMutation,
    DeleteLocalityMutation,
    DeletePurchaseMutation,
    AllLocalitiesDocument,
    AllProductsDocument,
    AllClientsDocument,
    UpdateClientMutation,
    UpdateClientMutationVariables,
    UpdateClientDocument,
    InternalOrderByIdDocument,
    ClientsCsvDocument,
    EmployeesCsvDocument,
    SuppliersCsvDocument,
    SuppliersOrdersCsvDocument,
    InternalOrdersCsvDocument,
    LocalitiesCsvDocument,
    ProductsCsvDocument,
    OfficesCsvDocument,
    PurchasesCsvDocument,
    RentalContractsCsvDocument,
} from './graphql';
import { clientGraphqlQuery } from './graphqlclient';

const queryKeys = {
    clients: ['clients'],
    allClients: ['allClients'],
    clientById: (id: string | undefined) => [...queryKeys.clients, id],

    employees: ['employees'],
    employeeById: (id: string | undefined) => [...queryKeys.employees, id],

    brands: ['brands'],

    contracts: ['contracts'],
    contractsById: (id: string | undefined) => [...queryKeys.contracts, id],

    localities: ['localities'],
    allLocalities: ['allLocalities'],

    purchases: ['purchases'],
    purchaseById: (id: string | undefined) => [...queryKeys.purchases, id],

    suppliers: ['suppliers'],
    supplierById: (id: string | undefined) => [...queryKeys.suppliers, id],

    supplierOrdersBySupplier: ['supplier-orders-by-supplier'],
    supplierOrderBySupplierId: (id: string | undefined) => [
        ...queryKeys.supplierOrdersBySupplier,
        id,
    ],

    supplierOrders: ['supplier-orders'],
    supplierOrderById: (id: string | undefined) => [...queryKeys.supplierOrders, id],

    internalOrders: ['internal-orders'],
    internalOrderById: (id: string | undefined) => [...queryKeys.internalOrders, id],

    offices: ['offices'],

    allProducts: ['all-products'],
    products: (variables: ProductsQueryVariables | null = null) =>
        variables ? ['products', variables] : ['products'],
    productById: (id: string | undefined) => [...queryKeys.products(), id],

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
    return usePaginatedQuery(queryKeys.employees, EmployeesDocument, 'employees', {
        page: 'number',
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
    const client = useQueryClient();

    return useMutation<CreateEmployeeMutation, Error, CreateEmployeeMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateEmployeeDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createEmployee?.employee) {
                    client.invalidateQueries(queryKeys.employees);
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
    return usePaginatedQuery(queryKeys.clients, ClientsDocument, 'clients', {
        page: 'number',
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

export const useSupplierOrders = () => {
    return usePaginatedQuery(
        queryKeys.supplierOrders,
        SupplierOrdersDocument,
        'supplierOrders',
        {
            page: 'number',
        },
    );
};

export const useInternalOrderById = (id: string | undefined) => {
    return useQuery(
        queryKeys.internalOrderById(id),
        () => {
            return clientGraphqlQuery(InternalOrderByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useSupplierOrderById = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierById(id),
        () => {
            return clientGraphqlQuery(SupplierOrderByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useSupplierOrdersBySupplierId = (id: string | undefined) => {
    return useQuery(
        queryKeys.supplierOrderBySupplierId(id),
        () => {
            return clientGraphqlQuery(SupplierOrdersBySupplierIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const useLocalities = () => {
    return usePaginatedQuery(queryKeys.localities, LocalitiesDocument, 'localities', {
        page: 'number',
    });
};

export const useAllLocalities = () => {
    return useQuery(queryKeys.allLocalities, () => {
        return clientGraphqlQuery(AllLocalitiesDocument, {});
    });
};

export const useAllProducts = () => {
    return useQuery(queryKeys.allProducts, () => {
        return clientGraphqlQuery(AllProductsDocument, {});
    });
};

export const useAllClients = () => {
    return useQuery(queryKeys.allClients, () => {
        return clientGraphqlQuery(AllClientsDocument, {});
    });
};

export const usePaginatedProducts = () => {
    return usePaginatedQuery(queryKeys.products, ProductsDocument, 'products', {
        page: 'number',
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

export const useAllSuppliers = () => {
    return useQuery(['all-suppliers'], () => {
        return clientGraphqlQuery(AllSuppliersDocument, {});
    });
};

export const usePaginatedSuppliers = () => {
    return usePaginatedQuery(queryKeys.suppliers, SuppliersDocument, 'suppliers', {
        page: 'number',
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

type UseCreateSupplierOptions = UseMutationOptions<
    CreateSupplierMutation,
    Error,
    CreateSupplierMutationVariables
>;

export const useCreateSupplier = ({
    onSuccess,
    ...options
}: UseCreateSupplierOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateSupplierMutation, Error, CreateSupplierMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreateSupplierDocument, data);
        },
        {
            onSuccess: (data, context, variables) => {
                if (data.createSupplier?.supplier) {
                    client.invalidateQueries(queryKeys.suppliers);
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
                    client.invalidateQueries(queryKeys.localities);
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const usePaginatedInternalOrders = () => {
    return usePaginatedQuery(
        queryKeys.internalOrders,
        InternalOrdersDocument,
        'internalOrders',
        {
            page: 'number',
        },
    );
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

type UseCreateSupplierOrderOptions = UseMutationOptions<
    CreateSupplierOrderMutation,
    Error,
    CreateSupplierOrderMutationVariables
>;

export const useCreateSupplierOrder = ({
    onSuccess,
    ...options
}: UseCreateSupplierOrderOptions = {}) => {
    const client = useQueryClient();

    return useMutation<
        CreateSupplierOrderMutation,
        Error,
        CreateSupplierOrderMutationVariables
    >(
        (data) => {
            return clientGraphqlQuery(CreateSupplierOrderDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                if (data.createSupplierOrder?.supplierOrder) {
                    client.invalidateQueries(queryKeys.supplierOrders);
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
                    client.invalidateQueries(queryKeys.products());
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
    return usePaginatedQuery(queryKeys.contracts, ContractsDocument, 'rentalContracts', {
        page: 'number',
    });
};

export const useContractById = (id: string | undefined) => {
    return useQuery(
        queryKeys.contractsById(id),
        () => {
            return clientGraphqlQuery(ContractByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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
                    client.invalidateQueries(queryKeys.contracts);
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
    return usePaginatedQuery(queryKeys.purchases, PurchasesDocument, 'purchases', {
        page: 'number',
    });
};

export const useProductsSuppliedBySupplierId = (id: string | undefined) => {
    return useQuery(
        ['ProductsSuppliedBySupplierId', id],
        () => {
            return clientGraphqlQuery(ProductsSuppliedBySupplierIdDocument, {
                supplierId: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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

export const useCreatePurchase = ({
    onSuccess,
    ...options
}: UseCreatePurchaseOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreatePurchaseMutation, Error, CreatePurchaseMutationVariables>(
        (data) => {
            return clientGraphqlQuery(CreatePurchaseDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const purchase = data.createPurchase?.purchase;

                if (purchase) {
                    client.invalidateQueries(queryKeys.purchases);
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeletePurchase = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeletePurchaseMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeletePurchaseMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeletePurchaseDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.purchases);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteSupplierOrder = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierOrderMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierOrderMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteSupplierOrderDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.supplierOrders);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteInternalOrder = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteInternalOrderMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteInternalOrderMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteInternalOrderDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.internalOrders);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteSupplier = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteSupplierMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteSupplierMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteSupplierDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.suppliers);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteEmployee = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteEmployeeMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteEmployeeMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteEmployeeDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.employees);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

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
                client.invalidateQueries(queryKeys.clients);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteProduct = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteProductMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteProductMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteProductDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.products());

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useDeleteRentalContract = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteRentalContractMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteRentalContractMutation, Error, string>(
        (id: string) => {
            return clientGraphqlQuery(DeleteRentalContractDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries(queryKeys.contracts);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
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
                client.invalidateQueries(queryKeys.localities);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

type UseCsvExporterOptions<TData extends Record<string, string>, TVariables> = {
    query: DocumentNode<TData, TVariables>;
    csvKey: keyof TData;
    variables: TVariables;
    filename: string;
};

const useCsvExporter = <TData extends Record<string, string>, TVariables>(
    options: UseCsvExporterOptions<TData, TVariables>,
) => {
    const { query, csvKey, variables, filename } = options;
    const { mutate, isLoading } = useMutation<TData, Error, TVariables>({
        mutationFn: () => {
            return clientGraphqlQuery(query, variables);
        },
        onSuccess: (data) => {
            const csv = data[csvKey];
            if (!csv) {
                toast.error('No se pudo exportar el CSV');
            }

            console.log(csv);
            const csvContent = `data:text/csv;charset=utf-8,${csv}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${filename}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Se exportó el CSV correctamente');
        },
    });

    return {
        exportCsv: mutate,
        isExporting: isLoading,
    };
};

export const useExportClientsCsv = () => {
    return useCsvExporter({
        query: ClientsCsvDocument,
        csvKey: 'clientsCsv',
        variables: {},
        filename: 'clientes',
    });
};

export const useExportEmployeesCsv = () => {
    return useCsvExporter({
        query: EmployeesCsvDocument,
        csvKey: 'employeesCsv',
        variables: {},
        filename: 'empleados',
    });
};

export const useExportSuppliersCsv = () => {
    return useCsvExporter({
        query: SuppliersCsvDocument,
        csvKey: 'suppliersCsv',
        variables: {},
        filename: 'proveedores',
    });
};

export const useExportSupplierOrdersCsv = () => {
    return useCsvExporter({
        query: SuppliersOrdersCsvDocument,
        csvKey: 'suppliersOrdersCsv',
        variables: {},
        filename: 'ordenes-a-proveedores',
    });
};

export const useExportInternalOrdersCsv = () => {
    return useCsvExporter({
        query: InternalOrdersCsvDocument,
        csvKey: 'internalOrdersCsv',
        variables: {},
        filename: 'ordenes-internas',
    });
};

export const useExportLocalitiesCsv = () => {
    return useCsvExporter({
        query: LocalitiesCsvDocument,
        csvKey: 'localitiesCsv',
        variables: {},
        filename: 'localidades',
    });
};

export const useExportProductsCsv = () => {
    return useCsvExporter({
        query: ProductsCsvDocument,
        csvKey: 'productsCsv',
        variables: {},
        filename: 'productos',
    });
};

export const useExportOfficesCsv = () => {
    return useCsvExporter({
        query: OfficesCsvDocument,
        csvKey: 'officesCsv',
        variables: {},
        filename: 'sucursales',
    });
};

export const useExportPurchasesCsv = () => {
    return useCsvExporter({
        query: PurchasesCsvDocument,
        csvKey: 'purchasesCsv',
        variables: {},
        filename: 'compras',
    });
};

export const useExportRentalContractsCsv = () => {
    return useCsvExporter({
        query: RentalContractsCsvDocument,
        csvKey: 'rentalContractsCsv',
        variables: {},
        filename: 'contratos-de-alquiler',
    });
};
