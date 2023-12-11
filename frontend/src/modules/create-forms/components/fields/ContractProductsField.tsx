import { useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductsStocksByOfficeInDateRangeQuery } from '@/api/graphql';
import { useProductsStocksByOfficeInDateRange } from '@/api/hooks';

import Label from '@/modules/forms/Label';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { FormField } from '../../../forms/FormField';
import { Input } from '../../../forms/Input';
import { CustomSelect } from '../../../forms/Select';

type ProductDetails =
    ProductsStocksByOfficeInDateRangeQuery['productsStocksByOfficeInDateRange'][0];
type ServiceDetails = ProductDetails['services'][0];

export type ContractProductFieldItemType = {
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
    value?: ContractProductFieldItemType[];
    onChange: (val: ContractProductFieldItemType[] | null) => void;
    startDate: string | undefined;
    endDate: string | undefined;
};

const DEFAULT_PRODUCT_QUANTITY_PAIR: ContractProductFieldItemType = {
    product: null,
    service: null,
    quantity: null,
};

/**
 * Component for managing a list of products and their quantities.
 * Allows adding, updating, and displaying products and quantities.
 */
const ContractProductsField: React.FC<Props> = ({
    numberOfRentalDays,
    onChange,
    value = [],
    startDate,
    endDate,
}) => {
    const useProductsResult = useProductsStocksByOfficeInDateRange({
        startDate: startDate,
        endDate: endDate,
    });

    const productsData = useProductsResult.data;

    const [orderedProducts, setOrderedProducts] = useState<
        ContractProductFieldItemType[]
    >(value.length ? value : [{ ...DEFAULT_PRODUCT_QUANTITY_PAIR }]);

    useEffect(() => {
        onChange(orderedProducts);
    }, [orderedProducts, onChange]);

    const addProductToOrder = () => {
        setOrderedProducts((prev) => [...prev, { ...DEFAULT_PRODUCT_QUANTITY_PAIR }]);
    };

    const updateSelectedProduct = (product: ProductDetails | null, index: number) => {
        setOrderedProducts((prev) => {
            const productWasSelected =
                prev.length > index + 1 &&
                prev[index].product?.data &&
                prev[index].product?.data.id === product?.id;

            const newProductsAndQuantity = [...prev];
            if (!product) {
                newProductsAndQuantity[index].product = null;
                newProductsAndQuantity[index].service = null;
            } else {
                newProductsAndQuantity[index].product = {
                    value: product.id,
                    label: product.name,
                    data: product,
                };
                newProductsAndQuantity[index].service = null;
            }

            if (productWasSelected) {
                newProductsAndQuantity[index].service = null;
            }

            return newProductsAndQuantity;
        });
    };

    const updateSelectedService = (service: ServiceDetails | null, index: number) => {
        setOrderedProducts((prev) => {
            const newProductsAndQuantity = [...prev];

            if (!service) {
                newProductsAndQuantity[index].service = null;
            } else {
                newProductsAndQuantity[index].service = {
                    value: service.id,
                    label: service.name,
                    data: service,
                };
            }

            return newProductsAndQuantity;
        });
    };

    const handleQuantityChange = (quantity: number, index: number) => {
        setOrderedProducts((prev) => {
            const newProductsAndQuantity = [...prev];
            newProductsAndQuantity[index].quantity = quantity;

            return newProductsAndQuantity;
        });
    };

    const selectableProductOptions = (
        productsData?.productsStocksByOfficeInDateRange
            .filter((product) =>
                orderedProducts.every((item) => item.product?.value !== product.id),
            )
            .map((product) => ({
                value: product.id,
                label: product.name,
                data: product,
            })) || []
    ).filter((product) => {
        return !orderedProducts.some(
            (orderedProduct) => orderedProduct.product?.value === product.value,
        );
    });

    const canOrderMoreProducts =
        orderedProducts.length <
        (productsData?.productsStocksByOfficeInDateRange.length || 0);

    return (
        <FetchedDataRenderer
            {...useProductsResult}
            Loading={<Skeleton height={30} />}
            Error={null}
        >
            {() => (
                <div className="space-y-4">
                    {orderedProducts.map((item, index) => {
                        let subtotal = null;
                        if (item.product && item.quantity) {
                            subtotal = item.product.data.price * item.quantity;
                        }

                        if (item.service && item.quantity) {
                            subtotal =
                                (subtotal || 0) + item.service.data.price * item.quantity;
                        }

                        subtotal = (subtotal || 0) * numberOfRentalDays;

                        const services = item.product?.data.services;
                        const servicesOptions =
                            services && services.length
                                ? services.map((service) => {
                                      return {
                                          value: service.id,
                                          label: service.name,
                                          data: service,
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
                                    <CustomSelect<
                                        {
                                            value: string;
                                            label: string;
                                            data: ProductDetails;
                                        },
                                        false
                                    >
                                        value={item.product}
                                        options={[
                                            ...(item?.product ? [item.product] : []),
                                            ...selectableProductOptions,
                                        ]}
                                        placeholder="Selecciona un producto"
                                        onChange={(next) => {
                                            updateSelectedProduct(
                                                next?.data ?? null,
                                                index,
                                            );
                                        }}
                                        isClearable
                                    />
                                </FormField>

                                <FormField
                                    fieldID={`productsAndQuantity-${index}-quantity`}
                                    label="Cantidad"
                                    showRequired
                                >
                                    <Input
                                        id={`productsAndQuantity-${index}-quantity`}
                                        type="number"
                                        name={`productsAndQuantity-${index}-quantity`}
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
                                    <CustomSelect<
                                        {
                                            value: string;
                                            label: string;
                                            data: ServiceDetails;
                                        },
                                        false
                                    >
                                        value={item.service}
                                        options={servicesOptions || []}
                                        placeholder="Selecciona un servicio"
                                        onChange={(next) => {
                                            updateSelectedService(
                                                next?.data ?? null,
                                                index,
                                            );
                                        }}
                                        isClearable
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
    startDate: string | undefined;
    endDate: string | undefined;
} & (TFieldValues[Extract<
    keyof TFieldValues,
    TName
>] extends ContractProductFieldItemType[]
    ? object
    : never);

const RHFProductOrderField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { name, control, numberOfRentalDays, ...rest } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <ContractProductsField
                    value={value}
                    onChange={onChange}
                    numberOfRentalDays={numberOfRentalDays}
                    {...rest}
                />
            )}
        />
    );
};

export default RHFProductOrderField;
