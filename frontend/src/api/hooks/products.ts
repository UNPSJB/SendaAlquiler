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
    AllProductsDocument,
    UpdateProductDocument,
    UpdateProductMutation,
    UpdateProductMutationVariables,
} from '../graphql';

export const useAllProducts = () => {
    return useQuery(queryKeys.productsNonPaginated, () => {
        return fetchClient(AllProductsDocument, {});
    });
};

export const useProductById = (id: string | undefined) => {
    return useQuery(
        queryKeys.productDetailsById(id),
        () => {
            return fetchClient(ProductByIdDocument, {
                id: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
};

export const usePaginatedProducts = () => {
    return usePaginatedQuery(
        queryKeys.productsPaginatedList,
        ProductsDocument,
        'products',
        {
            page: 'number',
            query: 'string',
        },
    );
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
            return fetchClient(CreateProductDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const product = data.createProduct?.product;

                if (product) {
                    client.invalidateQueries([queryDomains.products]);
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
            return fetchClient(CreateBrandDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const brand = data.createBrand?.brand;

                if (brand) {
                    client.setQueryData<BrandsQuery>(
                        queryKeys.brandsNonPaginated,
                        (prev) => {
                            const brands = prev?.brands;

                            if (!brands) {
                                return prev;
                            }

                            const next: BrandsQuery = {
                                ...prev,
                                brands: [...brands, brand],
                            };

                            return next;
                        },
                    );
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
    return useQuery(queryKeys.brandsNonPaginated, () => {
        return fetchClient(BrandsDocument, {});
    });
};

export const useDeleteProduct = ({
    onSuccess,
    ...options
}: UseMutationOptions<DeleteProductMutation, Error, string> = {}) => {
    const client = useQueryClient();

    return useMutation<DeleteProductMutation, Error, string>(
        (id: string) => {
            return fetchClient(DeleteProductDocument, {
                id,
            });
        },
        {
            onSuccess: (data, variables, context) => {
                client.invalidateQueries([queryDomains.products]);

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};

export const useProductsStocksByOfficeId = (officeId: string) => {
    return useQuery(queryKeys.productsStocksByOfficeId(officeId), () => {
        return fetchClient(ProductsStocksByOfficeIdDocument, {
            officeId,
        });
    });
};

export const useProductsSuppliedBySupplierId = (id: string | undefined) => {
    return useQuery(
        ['ProductsSuppliedBySupplierId', id],
        () => {
            return fetchClient(ProductsSuppliedBySupplierIdDocument, {
                supplierId: id as string,
            });
        },
        {
            enabled: typeof id === 'string',
        },
    );
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

    return useMutation<UpdateProductMutation, Error, UpdateProductMutationVariables>(
        (data) => {
            return fetchClient(UpdateProductDocument, data);
        },
        {
            onSuccess: (data, variables, context) => {
                const product = data.updateProduct?.product;

                if (product) {
                    client.invalidateQueries([queryDomains.products]);
                }

                if (onSuccess) {
                    onSuccess(data, variables, context);
                }
            },
            ...options,
        },
    );
};
