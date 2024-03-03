'use client';

import { useParams } from 'next/navigation';

import { useProductById } from '@/api/hooks';

import DashboardLayout from '@/modules/dashboard/DashboardLayout';
import { ProductFormEditor } from '@/modules/editors/product/product-form-editor';

const Page = () => {
    const { id } = useParams();
    const productByIdQuery = useProductById(id as string);

    if (productByIdQuery.isPending) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">Cargando...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (productByIdQuery.isError) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        Error al cargar el producto
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!productByIdQuery.data.productById) {
        return (
            <DashboardLayout>
                <div className="flex h-64 items-center justify-center">
                    <div className="text-2xl font-bold text-gray-500">
                        No se encontró el producto
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const product = productByIdQuery.data.productById;

    return (
        <DashboardLayout>
            <ProductFormEditor
                cancelHref={`/productos/${id}`}
                idToUpdate={id as string}
                defaultValues={{
                    sku: product.sku,
                    description: product.description,
                    name: product.name,
                    price: product.price,
                    brand: product.brand
                        ? {
                              value: product.brand.id,
                              label: product.brand.name,
                          }
                        : null,
                    type: {
                        value: product.type,
                        label: product.type,
                    },
                    stocks: product.stockItems.map((item) => {
                        return {
                            office: {
                                value: item.office.id,
                                label: item.office.name,
                            },
                            stock: item.quantity,
                        };
                    }),
                    suppliers: product.suppliers.map((item) => {
                        return {
                            supplier: {
                                value: item.supplier.id,
                                label: item.supplier.name,
                            },
                            price: item.price,
                        };
                    }),
                    services: product.services.map((service) => {
                        return {
                            price: service.price,
                            service: {
                                label: service.name,
                                value: service.id,
                            },
                        };
                    }),
                }}
            />
        </DashboardLayout>
    );
};

export default Page;
