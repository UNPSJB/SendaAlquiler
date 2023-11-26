import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { Office, ProductsStocksByOfficeIdQuery } from '@/api/graphql';
import { useProductsStocksByOfficeId } from '@/api/hooks';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { RHFFormField } from '../../forms/FormField';
import Input from '../../forms/Input';
import RHFSelect from '../../forms/Select';

type Props = {
    office: Office['id'];
};

export type ProductsFromOfficeFieldValue = {
    products: {
        product?: {
            value: string;
            label: string;
            data: ProductsStocksByOfficeIdQuery['productsStocksByOfficeId'][0];
        };
        quantity: string;
    }[];
};

const ProductsFromOfficeField: React.FC<Props> = ({ office }) => {
    const { control, getValues, watch } = useFormContext<ProductsFromOfficeFieldValue>();
    const useProductsStocksByOfficeIdResult = useProductsStocksByOfficeId(office);
    const { data, isLoading } = useProductsStocksByOfficeIdResult;

    const [ordersToCreate, setOrdersToCreate] = useState(1);

    const handleAddOrder = () => {
        const productsStocksByOfficeId = data?.productsStocksByOfficeId;
        if (!productsStocksByOfficeId) return;

        const products = getValues('products') || [];
        if (
            (products.length === 0 || products[products.length - 1].product) &&
            ordersToCreate < productsStocksByOfficeId.length
        ) {
            setOrdersToCreate((orders) => orders + 1);
        }
    };

    const products = watch('products') || [];
    const selectedProductIds = products
        .filter((x) => x.product)
        .map((x) => x.product?.value);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {Array.from({ length: ordersToCreate }).map((_, index) => {
                    const currentData = products[index]?.product?.data;

                    return (
                        <div
                            className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                            key={index}
                        >
                            <RHFFormField
                                fieldID="products"
                                label="Producto"
                                className="flex-1"
                                showRequired
                            >
                                <RHFSelect<
                                    ProductsFromOfficeFieldValue,
                                    `products.${number}.product`
                                >
                                    options={(data?.productsStocksByOfficeId || [])
                                        .filter((x) => {
                                            const isSelected =
                                                selectedProductIds.includes(x.id);
                                            const isDisabled = x.stock === 0;
                                            const isSelectedInCurrentIndex =
                                                selectedProductIds[index] === x.id;

                                            return (
                                                !isDisabled &&
                                                (isSelectedInCurrentIndex || !isSelected)
                                            );
                                        })
                                        .map((stock) => ({
                                            label: stock.product.name,
                                            value: stock.product.id,
                                            data: stock,
                                        }))}
                                    control={control}
                                    name={`products.${index}.product`}
                                    rules={{
                                        required: true,
                                    }}
                                    isLoading={isLoading}
                                    placeholder="Selecciona un producto"
                                />
                            </RHFFormField>

                            <RHFFormField
                                fieldID={`products-${index}-quantity`}
                                label="Cantidad"
                                showRequired
                                helpText={
                                    currentData
                                        ? `Máximo: ${currentData.stock}`
                                        : undefined
                                }
                            >
                                <Input
                                    id={`products-${index}-quantity`}
                                    name={`products.${index}.quantity`}
                                    type="number"
                                    placeholder="1"
                                    min={1}
                                    max={currentData?.stock}
                                    control={control}
                                    rules={{
                                        required: true,
                                        min: 1,
                                        max: currentData?.stock,
                                        valueAsNumber: true,
                                    }}
                                />
                            </RHFFormField>
                        </div>
                    );
                })}
            </div>

            <FetchedDataRenderer
                {...useProductsStocksByOfficeIdResult}
                Loading={<Skeleton height={30} />}
                Error={null}
            >
                {({ productsStocksByOfficeId }) => {
                    if (ordersToCreate < productsStocksByOfficeId.length) {
                        return (
                            <Button
                                fullWidth
                                variant={ButtonVariant.OUTLINE_WHITE}
                                onClick={handleAddOrder}
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

export default ProductsFromOfficeField;
