import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductsQuery } from '@/api/graphql';
import { useProducts } from '@/api/hooks';

import Label from '@/modules/forms/Label';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { RHFFormField } from '../../forms/FormField';
import Input from '../../forms/Input';
import RHFSelect from '../../forms/Select';

export type ProductsAndQuantityFieldFormValues = {
    productsAndQuantity: {
        product: {
            value: string;
            label: string;
            data: ProductsQuery['products'][0];
        };
        quantity: number;
    }[];
};

const ProductsAndQuantityField: React.FC = () => {
    const { register, control, getValues, watch } =
        useFormContext<ProductsAndQuantityFieldFormValues>();
    const productsResult = useProducts();
    const { data, isLoading } = productsResult;

    const [productsToOrder, setProductsToOrder] = useState(1);

    const handleAddProduct = () => {
        const products = data?.products;
        if (!products) return;

        const createdStocks = getValues('productsAndQuantity') || [];
        if (products.length > createdStocks.length) {
            setProductsToOrder((orders) => orders + 1);
        }
    };

    const productsAndQuantity = watch('productsAndQuantity') || [];
    const selectedProductIds = productsAndQuantity
        .filter((x) => x.product)
        .map((x) => x.product?.value);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {Array.from({ length: productsToOrder }).map((_, index) => {
                    const selectedProduct = productsAndQuantity[index]?.product?.data;
                    const quantity = productsAndQuantity[index]?.quantity;
                    const subtotal =
                        quantity && selectedProduct?.price
                            ? quantity * selectedProduct.price
                            : null;

                    return (
                        <div
                            className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                            key={index}
                        >
                            <RHFFormField
                                fieldID={`productsAndQuantity-${index}-product`}
                                label="Producto"
                                className="flex-1"
                                showRequired
                            >
                                <RHFSelect
                                    options={(data?.products || [])
                                        .filter((x) => {
                                            const isSelected =
                                                selectedProductIds.includes(x.id);
                                            const isSelectedInCurrentIndex =
                                                selectedProduct?.id === x.id;

                                            return (
                                                isSelectedInCurrentIndex || !isSelected
                                            );
                                        })
                                        .map((stock) => ({
                                            label: stock.name,
                                            value: stock.id,
                                            data: stock,
                                        }))}
                                    control={control}
                                    id={`productsAndQuantity.${index}.product`}
                                    rules={{
                                        required: true,
                                    }}
                                    isLoading={isLoading}
                                    placeholder="Selecciona un producto"
                                />
                            </RHFFormField>

                            <RHFFormField
                                fieldID={`productsAndQuantity-${index}-quantity`}
                                label="Cantidad"
                                showRequired
                            >
                                <Input
                                    id={`productsAndQuantity-${index}-quantity`}
                                    type="price"
                                    placeholder="1"
                                    {...register(
                                        `productsAndQuantity.${index}.quantity`,
                                        {
                                            required: true,
                                        },
                                    )}
                                />
                            </RHFFormField>

                            <Label
                                htmlFor={`productsAndQuantity-${index}-subtotal`}
                                label="Subtotal"
                                readOnly
                            >
                                <Input
                                    id={`productsAndQuantity-${index}-subtotal`}
                                    name={`productsAndQuantity-${index}-subtotal`}
                                    type="price"
                                    placeholder="-"
                                    value={subtotal ?? '-'}
                                    readOnly
                                />
                            </Label>
                        </div>
                    );
                })}
            </div>

            <FetchedDataRenderer
                {...productsResult}
                Loading={<Skeleton height={30} />}
                Error={null}
            >
                {({ products }) => {
                    if (productsToOrder < products.length) {
                        return (
                            <Button
                                fullWidth
                                variant={ButtonVariant.OUTLINE_WHITE}
                                onClick={handleAddProduct}
                            >
                                + Añadir producto
                            </Button>
                        );
                    }

                    return null;
                }}
            </FetchedDataRenderer>
        </div>
    );
};

export default ProductsAndQuantityField;
