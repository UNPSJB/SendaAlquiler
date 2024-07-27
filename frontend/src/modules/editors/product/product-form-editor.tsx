'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
    ProductTypeChoices,
    ProductServiceInput,
    ProductServiceBillingTypeChoices,
    ProductStockItemInput,
    ProductSupplierInput,
} from '@/api/graphql';
import { useCreateProduct, useUpdateProduct } from '@/api/hooks';

import { ProductFormEditorDetails } from './product-form-editor-details';
import { ProductFormEditorServices } from './product-form-editor-services';
import { ProductFormEditorStocks } from './product-form-editor-stocks';
import { ProductFormEditorSuppliers } from './product-form-editor-suppliers';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export type ProductFormEditorValues = {
    name?: string | null;
    description?: string | null;
    sku?: string | null;
    price?: number | null;
    brand?: {
        value: string;
        label: string;
    } | null;
    type:
        | {
              value: ProductTypeChoices;
              label: string;
          }
        | undefined;
    suppliers?:
        | {
              supplier: {
                  value: string;
                  label: string;
              } | null;
              price?: number | null;
          }[]
        | null;
    stocks?:
        | {
              office: {
                  value: string;
                  label: string;
              } | null;
              quantity?: number | null;
          }[]
        | null;
    services?:
        | {
              service: {
                  value: string | null;
                  label: string;
              } | null;
              price?: number | null;
              billingType?: {
                  value: ProductServiceBillingTypeChoices;
                  label: string;
              };
              billingPeriod?: number | null;
          }[]
        | undefined;
    servicesIdsToDelete?: string[];
    suppliersIdsToDelete?: string[];
    stockIdsToDelete?: string[];
};

type Props = {
    cancelHref?: string;
    idToUpdate?: string;
    defaultValues?: ProductFormEditorValues;
};

export const ProductFormEditor = ({ cancelHref, defaultValues, idToUpdate }: Props) => {
    const router = useRouter();

    const formMethods = useForm<ProductFormEditorValues>({
        defaultValues,
    });

    const createProductMutation = useCreateProduct({
        onSuccess: (data) => {
            const error = data.createProduct?.error;
            const product = data.createProduct?.product;
            if (error) {
                toast.error(error);
            }

            if (product) {
                toast.success('Producto creado exitosamente');
                router.push('/productos');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al crear el producto');
        },
    });

    const updateProductMutation = useUpdateProduct({
        onSuccess: (data) => {
            const error = data.updateProduct?.error;
            const product = data.updateProduct?.product;
            if (error) {
                toast.error(error);
            }

            if (product) {
                toast.success('Producto actualizado exitosamente');
                router.push('/productos');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al actualizar el producto');
        },
    });

    const onSubmit: SubmitHandler<ProductFormEditorValues> = (data) => {
        if (
            !data.name ||
            !data.brand ||
            !data.type ||
            !data.price ||
            !data.sku ||
            isCreatingOrUpdating
        ) {
            return;
        }

        const services = (data.services || [])
            .filter((service) => service.service && service.price)
            .map((service) => {
                const next: ProductServiceInput = {
                    serviceId: service.service!.value,
                    price: service.price!,
                    name: service.service!.label,
                    billingPeriod: service.billingPeriod!,
                    billingType: service.billingType!.value,
                };

                return next;
            });
        const stockItems = (data.stocks || [])
            .filter((stock) => stock.office && stock.quantity)
            .map((stock) => {
                const next: ProductStockItemInput = {
                    officeId: stock.office!.value,
                    quantity: stock.quantity!,
                };

                return next;
            });
        const suppliers = (data.suppliers || [])
            .filter((supplier) => supplier.supplier && supplier.price)
            .map((supplier) => {
                const next: ProductSupplierInput = {
                    price: supplier.price!,
                    supplierId: supplier.supplier!.value,
                };

                return next;
            });

        if (!idToUpdate) {
            createProductMutation.mutate({
                productData: {
                    brandId: data.brand.value,
                    description: data.description || null,
                    name: data.name,
                    price: data.price,
                    sku: data.sku,
                    type: data.type.value,
                },
                services,
                stockItems,
                suppliers,
            });
        } else {
            updateProductMutation.mutate({
                id: idToUpdate,
                productData: {
                    brandId: data.brand.value,
                    description: data.description || null,
                    name: data.name,
                    price: data.price,
                    sku: data.sku,
                    type: data.type.value,
                },
                services,
                stockItems,
                suppliers,
                servicesIdsToDelete: data.servicesIdsToDelete || [],
                suppliersIdsToDelete: data.suppliersIdsToDelete || [],
                stockItemsIdsToDelete: data.stockIdsToDelete || [],
            });
        }
    };

    const isCreatingOrUpdating =
        createProductMutation.isPending || updateProductMutation.isPending;

    return (
        <main className="px-8 pb-12">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Producto' : 'Crear Producto'}
                </h1>

                <a
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-500"
                    href="#"
                >
                    <span>Tutorial</span>
                    <Book className="size-5" />
                </a>
            </div>

            <Form {...formMethods}>
                <form
                    className="space-y-12 pb-24"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <ProductFormEditorDetails originalSku={defaultValues?.sku} />

                    {formMethods.watch('type')?.value ===
                        ProductTypeChoices.Alquilable && <ProductFormEditorServices />}

                    <ProductFormEditorSuppliers />

                    <ProductFormEditorStocks />

                    <div className="fixed bottom-0 right-0 flex justify-end space-x-4 border-t border-muted bg-background px-8 py-3 shadow-sm lg:left-[20%]">
                        {cancelHref && (
                            <Button variant="secondary" type="button" asChild>
                                <Link href={cancelHref}>Cancelar</Link>
                            </Button>
                        )}

                        <ButtonWithSpinner
                            showSpinner={isCreatingOrUpdating}
                            size="lg"
                            type="submit"
                        >
                            {idToUpdate ? 'Guardar Producto' : 'Crear Producto'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};
