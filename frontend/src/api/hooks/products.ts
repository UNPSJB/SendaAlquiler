import {
    InfiniteData,
    UseMutationOptions,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import usePaginatedQuery from '@/modules/usePaginatedQuery';

import { queryDomains, queryKeys } from './constants';

import { fetchClient } from '../fetch-client';
import {
    BrandsDocument,
    BrandsQuery,
    CreateBrandDocument,
    CreateBrandMutation,
    CreateBrandMutationVariables,
    CreateProductDocument,
    CreateProductMutation,
    CreateProductMutationVariables,
    ProductsDocument,
    ProductsStocksByOfficeIdDocument,
    ProductByIdDocument,
    ProductsSuppliedBySupplierIdDocument,
    DeleteProductDocument,
    DeleteProductMutation,
    UpdateProductDocument,
    UpdateProductMutation,
    UpdateProductMutationVariables,
    ProductStocksInDateRangeDocument,
    ProductsQueryVariables,
    ProductsQuery,
} from '../graphql';

export const useProductById = (id: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.productDetailsById(id),
        queryFn: () => {
            return fetchClient(ProductByIdDocument, {
                id: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

export const usePaginatedProducts = () => {
    return usePaginatedQuery(
        queryKeys.productsPaginatedList,
        ProductsDocument,
        'products',
        {
            query: null,
            type: null,
            officeId: null,
        },
        {
            page: {
                type: 'int',
            },
            query: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            officeId: {
                type: 'string',
            },
        },
    );
};

export const useInfiniteProducts = (filters: ProductsQueryVariables) => {
    return useInfiniteQuery<
        ProductsQuery,
        Error,
        InfiniteData<ProductsQuery>,
        unknown[],
        number | null
    >({
        queryKey: queryKeys.clientsInfiniteList(filters),
        queryFn: (props) => {
            return fetchClient(ProductsDocument, {
                page: props.pageParam,
                query: filters.query && filters.query.length >= 3 ? filters.query : null,
                type: filters.type,
                officeId: filters.officeId,
            });
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.products.currentPage <= 1) {
                return null;
            }

            return firstPage.products.currentPage - 1;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.products.currentPage >= lastPage.products.numPages) {
                return null;
            }

            return lastPage.products.currentPage + 1;
        },
        initialPageParam: 1,
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

    return useMutation<CreateProductMutation, Error, CreateProductMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateProductDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const product = data.createProduct?.product;

            if (product) {
                client.invalidateQueries({
                    queryKey: [queryDomains.products],
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

type UseCreateBrandOptions = UseMutationOptions<
    CreateBrandMutation,
    Error,
    CreateBrandMutationVariables
>;

export const useCreateBrand = ({ onSuccess, ...options }: UseCreateBrandOptions = {}) => {
    const client = useQueryClient();

    return useMutation<CreateBrandMutation, Error, CreateBrandMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(CreateBrandDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const brand = data.createBrand?.brand;

            if (brand) {
                client.setQueryData<BrandsQuery>(queryKeys.brandsNonPaginated, (prev) => {
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
    });
};

export const useBrands = () => {
    return useQuery({
        queryKey: queryKeys.brandsNonPaginated,
        queryFn: () => {
            return fetchClient(BrandsDocument, {});
        },
    });
};

export const useDeleteProduct = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteProductMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteProductMutation, Error, string>({
        mutationFn: (id: string) => {
            return fetchClient(DeleteProductDocument, {
                id,
            });
        },
        onSuccess: (data, variables, context) => {
            client.invalidateQueries({
                queryKey: [queryDomains.products],
                type: 'all',
                refetchType: 'all',
            });

            if (onSuccess) {
                onSuccess(data, variables, context);
            }
        },
        ...options,
    });
};

export const useProductsStocksByOfficeId = (officeId: string | undefined) => {
    return useQuery({
        queryKey: queryKeys.productsStocksByOfficeId(officeId),
        queryFn: () => {
            return fetchClient(ProductsStocksByOfficeIdDocument, {
                officeId: officeId as string,
            });
        },
        enabled: typeof officeId === 'string',
    });
};

export const useProductsSuppliedBySupplierId = (id: string | undefined) => {
    return useQuery({
        queryKey: ['ProductsSuppliedBySupplierId', id],
        queryFn: () => {
            return fetchClient(ProductsSuppliedBySupplierIdDocument, {
                supplierId: id as string,
            });
        },
        enabled: typeof id === 'string',
    });
};

export const useProductStocksInDateRange = ({
    productId,
    startDate,
    endDate,
}: {
    productId: string | undefined | null;
    startDate: string | undefined | null;
    endDate: string | undefined | null;
}) => {
    return useQuery({
        queryKey: queryKeys.productStocksInDateRange({ productId, startDate, endDate }),
        queryFn: () => {
            return fetchClient(ProductStocksInDateRangeDocument, {
                productId: productId as string,
                startDate: startDate as string,
                endDate: endDate as string,
            });
        },
        enabled:
            typeof startDate === 'string' &&
            typeof endDate === 'string' &&
            typeof productId === 'string',
    });
};

export const useUpdateProduct = ({
    onSuccess,
    ...options
}: UseMutationOptions<
    UpdateProductMutation,
    Error,
    UpdateProductMutationVariables
> = {}) => {
    const client = useQueryClient();

    return useMutation<UpdateProductMutation, Error, UpdateProductMutationVariables>({
        mutationFn: (data) => {
            return fetchClient(UpdateProductDocument, data);
        },
        onSuccess: (data, variables, context) => {
            const product = data.updateProduct?.product;

            if (product) {
                client.invalidateQueries({
                    queryKey: [queryDomains.products],
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
