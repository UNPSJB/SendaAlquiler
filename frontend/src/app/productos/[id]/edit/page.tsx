'use client';

import { useParams, useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { useProductById, useUpdateProduct } from '@/api/hooks';

import CreateOrUpdateProductForm from '@/modules/create-forms/CreateOrUpdateProductForm';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import Spinner from '@/components/Spinner/Spinner';

const Page = () => {
    const { id } = useParams();
    const useEmployeeByIdResult = useProductById(id as string);

    const router = useRouter();
    const { mutate, isLoading } = useUpdateProduct({
        onSuccess: (data) => {
            const error = data.updateProduct?.error;
            const product = data.updateProduct?.product;
            if (error) {
                toast.error(error);
            }

            if (product) {
                toast.success('Producto actualizado exitosamente');
                router.push(`/productos/${id}`);
            }
        },
    });

    return (
        <FetchedDataRenderer
            {...useEmployeeByIdResult}
            Error={
                <FetchStatusMessageWithButton
                    message="Hubo un error al cargar el producto"
                    btnText="Volver a intentar"
                    btnHref={`/productos/${id}`}
                />
            }
            Loading={
                <div className="flex min-h-screen w-full flex-1 items-center justify-center">
                    <Spinner />
                </div>
            }
        >
            {({ productById }) => {
                if (!productById) {
                    return (
                        <FetchStatusMessageWithButton
                            message="Parece que el empleado que buscas no existe."
                            btnHref="/clientes"
                            btnText='Volver a "Empleados"'
                        />
                    );
                }

                return (
                    <CreateOrUpdateProductForm
                        defaultValues={{
                            description: productById.description,
                            brand: productById.brand
                                ? {
                                      label: productById.brand.name,
                                      value: productById.brand.id,
                                  }
                                : undefined,
                            name: productById.name,
                            price: productById.price,
                            sku: productById.sku,
                            type: {
                                value: productById.type,
                                label: productById.type,
                            },
                            stock: productById.stock
                                .filter((stock) => {
                                    return stock.stock && stock.office;
                                })
                                .map((stock) => {
                                    return {
                                        office: {
                                            value: stock.office.id,
                                            label: stock.office.name,
                                            data: stock.office,
                                        },
                                        stock: parseInt(stock.stock as any, 10),
                                    };
                                }),
                            services: productById.services.filter(
                                (service) => service.name,
                            ).length
                                ? productById.services.map((service) => {
                                      return {
                                          id: service.id,
                                          name: service.name,
                                          price: service.price,
                                      };
                                  })
                                : [],
                            suppliers: productById.suppliers.map((data) => {
                                return {
                                    supplier: {
                                        value: data.supplier.id,
                                        label: data.supplier.name,
                                        data: data.supplier,
                                    },
                                    price: data.price.toString(),
                                };
                            }),
                        }}
                        mutate={(data) => {
                            const { brand, type, stock, suppliers } = data;
                            if (!brand || !type || !stock || !suppliers) return;

                            mutate({
                                id: id as string,
                                productData: {
                                    description: data.description,
                                    brandId: brand.value,
                                    name: data.name,
                                    price: data.price,
                                    sku: data.sku,
                                    type: type.value,
                                    stock: stock
                                        .filter((stock) => {
                                            return stock.stock && stock.office;
                                        })
                                        .map((stock) => {
                                            return {
                                                stock: parseInt(stock.stock as any, 10),
                                                officeId: stock.office.value,
                                            };
                                        }),
                                    services:
                                        data.services &&
                                        data.services.filter((service) => service.name)
                                            .length
                                            ? data.services.map((service) => {
                                                  return {
                                                      id: service.id,
                                                      name: service.name,
                                                      price: service.price,
                                                  };
                                              })
                                            : [],
                                    suppliers: suppliers.map((data) => {
                                        return {
                                            supplierId: data.supplier.value,
                                            price: data.price.toString(),
                                        };
                                    }),
                                },
                            });
                        }}
                        cancelHref={`/empleados/${id}`}
                        isMutating={isLoading}
                        isUpdate
                    />
                );
            }}
        </FetchedDataRenderer>
    );
};

export default Page;
