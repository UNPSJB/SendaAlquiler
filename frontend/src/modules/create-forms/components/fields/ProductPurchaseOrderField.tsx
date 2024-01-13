import { useCallback, useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductsQuery, ProductTypeChoices } from '@/api/graphql';
import { usePaginatedProducts } from '@/api/hooks';

import Label from '@/modules/forms/Label';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { Input } from '../../../forms/DeprecatedInput';
import { FormField } from '../../../forms/FormField';
import { CustomSelect } from '../../../forms/Select';

type ProductDetails = ProductsQuery['products']['results'][0];

export type ProductQuantityPair = {
    product: {
        value: string;
        label: string;
        data: ProductDetails;
    } | null;
    quantity: number | null;
};

type Props = {
    value?: ProductQuantityPair[];
    onChange: (val: ProductQuantityPair[] | null) => void;
};

const DEFAULT_PRODUCT_QUANTITY_PAIR: ProductQuantityPair = {
    product: null,
    quantity: null,
};

/**
 * Component for managing a list of products and their quantities.
 * Allows adding, updating, and displaying products and quantities.
 */
const ProductOrderField: React.FC<Props> = ({ onChange, value = [] }) => {
    const { queryResult: useProductsResult } = usePaginatedProducts();
    const productsData = useProductsResult.data;

    const orderedProducts = useMemo(
        () => (value.length ? value : [DEFAULT_PRODUCT_QUANTITY_PAIR]),
        [value],
    );

    const addProductToOrder = () => {
        onChange([...orderedProducts, DEFAULT_PRODUCT_QUANTITY_PAIR]);
    };

    const updateSelectedProduct = useCallback(
        (product: ProductDetails, index: number) => {
            const newProductsAndQuantity = [...orderedProducts];
            newProductsAndQuantity[index].product = {
                value: product.id,
                label: product.name,
                data: product,
            };
            onChange(newProductsAndQuantity);
        },
        [orderedProducts, onChange],
    );

    const handleQuantityChange = useCallback(
        (quantity: number, index: number) => {
            const newProductsAndQuantity = [...orderedProducts];
            newProductsAndQuantity[index].quantity = quantity;
            onChange(newProductsAndQuantity);
        },
        [orderedProducts, onChange],
    );

    // Products options for Select
    const selectableProductOptions = useMemo(() => {
        return (
            productsData?.products.results
                .filter((product) => {
                    return product.type === ProductTypeChoices.Comerciable;
                })
                .map((product) => ({
                    value: product.id,
                    label: product.name,
                    data: product,
                })) || []
        );
    }, [productsData]);

    const canOrderMoreProducts =
        orderedProducts.length < (productsData?.products.results.length || 0);

    return (
        <FetchedDataRenderer
            {...useProductsResult}
            Loading={<Skeleton height={30} />}
            Error={null}
        >
            {() => (
                <div>
                    {orderedProducts.map((item, index) => {
                        let subtotal = null;
                        if (item.product && item.quantity) {
                            subtotal = (item.product.data.price || 0) * item.quantity;
                        }

                        return (
                            <div
                                className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                                key={index}
                            >
                                <FormField
                                    fieldID={`productsAndQuantity-${index}-product`}
                                    label="Producto"
                                    className="flex-1"
                                    showRequired
                                >
                                    <CustomSelect
                                        options={selectableProductOptions}
                                        name={`productsAndQuantity.${index}.product`}
                                        placeholder="Selecciona un producto"
                                        onChange={({ data }: any) => {
                                            if (!data) return;
                                            updateSelectedProduct(data, index);
                                        }}
                                    />
                                </FormField>

                                <FormField
                                    fieldID={`productsAndQuantity-${index}-quantity`}
                                    label="Cantidad"
                                    showRequired
                                >
                                    <Input
                                        name={`productsAndQuantity.${index}.quantity`}
                                        id={`productsAndQuantity-${index}-quantity`}
                                        type="number"
                                        placeholder="1"
                                        onChange={(value) => {
                                            handleQuantityChange(
                                                parseInt(value, 10),
                                                index,
                                            );
                                        }}
                                    />
                                </FormField>

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
                                        value={subtotal?.toString() ?? '-'}
                                        readOnly
                                    />
                                </Label>
                            </div>
                        );
                    })}

                    {canOrderMoreProducts && (
                        <Button
                            fullWidth
                            variant={ButtonVariant.OUTLINE_WHITE}
                            onClick={addProductToOrder}
                        >
                            + Añadir producto
                        </Button>
                    )}
                </div>
            )}
        </FetchedDataRenderer>
    );
};

type RHFProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends ProductQuantityPair[]
    ? object
    : never);

const ProductPurchaseOrderField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { name, control } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <ProductOrderField
                    value={value as ProductQuantityPair[]}
                    onChange={onChange}
                />
            )}
        />
    );
};

export default ProductPurchaseOrderField;
