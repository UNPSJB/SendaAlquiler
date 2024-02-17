'use client';

import { useRouter } from 'next/navigation';

import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateProduct } from '@/api/hooks';

import CreateOrUpdateProductForm, {
    CreateOrUpdateProductFormValues,
} from '@/modules/create-forms/CreateOrUpdateProductForm';

const Page = () => {
    const router = useRouter();

    const { mutate, isLoading } = useCreateProduct({
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

    // en este ver lo de localityId
    const onSubmit: SubmitHandler<CreateOrUpdateProductFormValues> = (data) => {
        const { brand, type, stock, suppliers } = data;

        if (!brand || !type || !stock || !suppliers) return;
        console.log(stock);
        console.log(data);

        mutate({
            productData: {
                description: data.description,
                brandId: brand.value,
                name: data.name,
                price: parseInt(data.price, 10),
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
                    data.services.filter((service) => service.name).length
                        ? data.services.map((service) => {
                              return {
                                  name: service.name,
                                  price: parseInt(service.price, 10),
                              };
                          })
                        : [],
                suppliers: suppliers.map((data) => {
                    return {
                        supplierId: data.supplier.value,
                        price: parseInt(data.price.toString(), 10),
                    };
                }),
            },
        });
    };

    return (
        <CreateOrUpdateProductForm
            cancelHref="/productos"
            mutate={onSubmit}
            isMutating={isLoading}
        />
    );
};

export default Page;
