import { useCallback, useMemo } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductTypeChoices, ProductsQuery } from '@/api/graphql';
import { useAllProducts } from '@/api/hooks';

import Label from '@/modules/forms/Label';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { FormField } from '../../../forms/FormField';
import { Input } from '../../../forms/Input';
import { CustomSelect } from '../../../forms/Select';

type ProductDetails = ProductsQuery['products']['results'][0];

export type ProductQuantityAndService = {
    product: {
        value: string;
        label: string;
        data: ProductDetails;
    } | null;
    service: {
        value: string;
        label: string;
        data: ProductDetails['services'][0];
    } | null;
    quantity: number | null;
};

type Props = {
    numberOfRentalDays: number;
    value?: ProductQuantityAndService[];
    onChange: (val: ProductQuantityAndService[] | null) => void;
};

const DEFAULT_PRODUCT_QUANTITY_PAIR: ProductQuantityAndService = {
    product: null,
    service: null,
    quantity: null,
};

/**
 * Component for managing a list of products and their quantities.
 * Allows adding, updating, and displaying products and quantities.
 */
const ProductOrderField: React.FC<Props> = ({
    numberOfRentalDays,
    onChange,
    value = [],
}) => {
    const useProductsResult = useAllProducts();
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

    const updateSelectedService = useCallback(
        (service: { label: string; value: string }, index: number) => {
            const newProductsAndQuantity = [...orderedProducts];
            newProductsAndQuantity[index].service = {
                value: service.value,
                label: service.label,
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
    const selectableProductOptions = (
        productsData?.allProducts
            .filter((product) => product.type === ProductTypeChoices.Alquilable)
            .map((product) => ({
                value: product.id,
                label: product.name,
                data: product,
            })) || []
    ).filter((product) => {
        // Filter out products that are already selected
        return !orderedProducts.some(
            (orderedProduct) => orderedProduct.product?.value === product.value,
        );
    });

    const canOrderMoreProducts =
        orderedProducts.length < (productsData?.allProducts.length || 0);

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
                            subtotal = item.product.data.price * item.quantity;
                        }

                        // if (item.service && item.quantity) {
                        //     subtotal =
                        //         (subtotal || 0) + item.service.data. * item.quantity;
                        // }

                        subtotal = (subtotal || 0) * numberOfRentalDays;

                        const services = item.product?.data.services;
                        const servicesOptions =
                            services && services.length
                                ? services.map((service) => {
                                      return {
                                          value: service.id,
                                          label: service.name,
                                      };
                                  })
                                : null;

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
                                        options={[
                                            ...(item?.product ? [item.product] : []),
                                            ...selectableProductOptions,
                                        ]}
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

                                <FormField
                                    fieldID={`productsAndQuantity-${index}-service`}
                                    label="Servicio"
                                >
                                    <CustomSelect<{ label: string; value: string }, false>
                                        options={servicesOptions || []}
                                        name={`productsAndQuantity.${index}.service`}
                                        placeholder="Selecciona un servicio"
                                        onChange={(next) => {
                                            if (!next) return;
                                            updateSelectedService(next, index);
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
    numberOfRentalDays: number;
} & (TFieldValues[Extract<keyof TFieldValues, TName>] extends ProductQuantityAndService[]
    ? object
    : never);

const RHFProductOrderField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { name, control, numberOfRentalDays } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <ProductOrderField
                    value={value as ProductQuantityAndService[]}
                    onChange={onChange}
                    numberOfRentalDays={numberOfRentalDays}
                />
            )}
        />
    );
};

export default RHFProductOrderField;
