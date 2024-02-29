import { UseFormReturn } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductsStocksByOfficeInDateRangeQuery } from '@/api/graphql';
import { useProductStocksInDateRange } from '@/api/hooks';

import { getNumericInputValue } from '@/modules/utils';

import { useOfficeContext } from '@/app/OfficeProvider';

import DeprecatedButton, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatNumberAsPrice } from '@/lib/utils';

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
    quantityByOffice: Record<string, number | null> | null;
    subtotal: number | null;
    discount: number | null;
};

const DEFAULT_PRODUCT_QUANTITY_PAIR: ContractProductFieldItemType = {
    product: null,
    service: null,
    quantityByOffice: null,
    subtotal: null,
    discount: null,
};

const calculateSubtotal = ({
    product,
    service,
    quantityByOffice,
    numberOfRentalDays,
}: ContractProductFieldItemType & {
    numberOfRentalDays: number;
}): number => {
    if (!product || !quantityByOffice) {
        return 0;
    }

    const productPrice = product?.data?.price || 0;
    const servicePrice = service?.data?.price || 0;
    const totalQuantity = Object.values(quantityByOffice).reduce(
        (acc: number, curr) => acc + (curr || 0),
        0,
    );

    return (productPrice + servicePrice) * totalQuantity * numberOfRentalDays;
};

export type ContractProductsFieldFormValues = {
    productsOrders?: ContractProductFieldItemType[];
};

type Props<FormValues extends ContractProductsFieldFormValues> = {
    formMethods: {
        control: UseFormReturn<FormValues>['control'];
        setValue: UseFormReturn<FormValues>['setValue'];
        getValues: UseFormReturn<FormValues>['getValues'];
        watch: UseFormReturn<FormValues>['watch'];
    };
    numberOfRentalDays: number;
    startDate: string | undefined;
    endDate: string | undefined;
};

/**
 * Component for managing a list of products and their quantities.
 * Allows adding, updating, and displaying products and quantities.
 */
export const ContractProductsField = <
    FormValues extends ContractProductsFieldFormValues,
>({
    numberOfRentalDays,
    formMethods: form,
    startDate,
    endDate,
}: Props<FormValues>) => {
    const formMethods =
        form as unknown as Props<ContractProductsFieldFormValues>['formMethods'];
    const useProductsResult = useProductStocksInDateRange({
        startDate: startDate,
        endDate: endDate,
    });

    const productsData = useProductsResult.data;
    const { office: contextOffice } = useOfficeContext();

    const addProductToOrder = () => {
        const prev = formMethods.getValues('productsOrders') || [];
        formMethods.setValue('productsOrders', [
            ...prev,
            { ...DEFAULT_PRODUCT_QUANTITY_PAIR },
        ]);
    };

    const removeProductFromOrder = (index: number) => {
        const prev = formMethods.getValues('productsOrders') || [];

        if (prev.length === 1) {
            formMethods.setValue('productsOrders', [
                { ...DEFAULT_PRODUCT_QUANTITY_PAIR },
            ]);
            return;
        } else {
            formMethods.setValue(
                'productsOrders',
                prev.filter((_, i) => i !== index),
            );
        }
    };

    const onProductChange = (index: number) => {
        formMethods.setValue(`productsOrders.${index}`, {
            ...formMethods.getValues(`productsOrders.${index}`),
            service: null,
            quantityByOffice: null,
            subtotal: null,
            discount: null,
        });
    };

    const onServiceChange = (index: number) => {
        formMethods.setValue(`productsOrders.${index}`, {
            ...formMethods.getValues(`productsOrders.${index}`),
            subtotal: calculateSubtotal({
                ...formMethods.getValues(`productsOrders.${index}`),
                numberOfRentalDays,
            }),
            discount: null,
        });
    };

    const onQuantityChange = (index: number) => {
        const next: NonNullable<ContractProductsFieldFormValues['productsOrders']>[0] = {
            ...formMethods.getValues(`productsOrders.${index}`),
            subtotal: calculateSubtotal({
                ...formMethods.getValues(`productsOrders.${index}`),
                numberOfRentalDays,
            }),
            discount: null,
        };

        formMethods.setValue(`productsOrders.${index}`, next, {
            shouldValidate: true,
        });
    };

    const orderedProducts = formMethods.watch('productsOrders') || [
        { ...DEFAULT_PRODUCT_QUANTITY_PAIR },
    ];

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
                            <div className="relative" key={index}>
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-bold">
                                                Producto #{index + 1}
                                            </h3>

                                            <button
                                                type="button"
                                                className="group"
                                                onClick={() =>
                                                    removeProductFromOrder(index)
                                                }
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="16"
                                                    width="14"
                                                    viewBox="0 0 448 512"
                                                >
                                                    <path
                                                        className="fill-gray-500 group-hover:fill-red-500"
                                                        d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-4">
                                            <FormField
                                                name={`productsOrders.${index}.product`}
                                                control={formMethods.control}
                                                rules={{
                                                    required:
                                                        'Debes seleccionar un producto',
                                                    validate: (_, formValues) => {
                                                        if (
                                                            !item.product ||
                                                            !formValues.productsOrders ||
                                                            formValues.productsOrders
                                                                .length <
                                                                index + 1
                                                        ) {
                                                            return true;
                                                        }

                                                        let stockWasAskedFromSomeOffice =
                                                            false;

                                                        const quantityByOffice =
                                                            formValues.productsOrders[
                                                                index
                                                            ].quantityByOffice;

                                                        if (!quantityByOffice) {
                                                            return 'Debes pedir stock de al menos una sucursal';
                                                        }

                                                        for (
                                                            let i = 0;
                                                            i <
                                                            item.product.data
                                                                .stocksByOffice.length;
                                                            i++
                                                        ) {
                                                            const officeId =
                                                                item.product.data
                                                                    .stocksByOffice[i]
                                                                    .office.id;

                                                            if (
                                                                officeId in
                                                                quantityByOffice
                                                            ) {
                                                                const amount =
                                                                    quantityByOffice[
                                                                        officeId
                                                                    ];
                                                                stockWasAskedFromSomeOffice =
                                                                    amount !== null &&
                                                                    amount > 0;

                                                                if (
                                                                    stockWasAskedFromSomeOffice
                                                                ) {
                                                                    break;
                                                                }
                                                            }
                                                        }

                                                        return (
                                                            stockWasAskedFromSomeOffice ||
                                                            'Debes pedir stock de al menos una sucursal'
                                                        );
                                                    },
                                                }}
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel required>
                                                                Producto
                                                            </FormLabel>

                                                            <FormControl>
                                                                <CustomSelect<
                                                                    {
                                                                        value: string;
                                                                        label: string;
                                                                        data: ProductDetails;
                                                                    },
                                                                    false
                                                                >
                                                                    {...field}
                                                                    onChange={(next) => {
                                                                        field.onChange(
                                                                            next,
                                                                        );

                                                                        onProductChange(
                                                                            index,
                                                                        );
                                                                    }}
                                                                    options={[
                                                                        ...(item?.product
                                                                            ? [
                                                                                  item.product,
                                                                              ]
                                                                            : []),
                                                                        ...selectableProductOptions,
                                                                    ]}
                                                                    placeholder="Selecciona un producto"
                                                                    isClearable
                                                                    formatOptionLabel={(
                                                                        option,
                                                                    ) => (
                                                                        <div>
                                                                            <p className="mb-1">
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </p>

                                                                            <div className="text-sm text-muted-foreground">
                                                                                <p>
                                                                                    <span className="font-bold">
                                                                                        Precio:
                                                                                    </span>{' '}
                                                                                    {
                                                                                        option
                                                                                            .data
                                                                                            .price
                                                                                    }
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-bold">
                                                                                        Stock:
                                                                                    </span>{' '}
                                                                                    {option.data.stocksByOffice
                                                                                        .map(
                                                                                            (
                                                                                                stock,
                                                                                            ) =>
                                                                                                stock.stock,
                                                                                        )
                                                                                        .reduce(
                                                                                            (
                                                                                                acc,
                                                                                                curr,
                                                                                            ) =>
                                                                                                acc +
                                                                                                curr,
                                                                                            0,
                                                                                        )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />

                                            <FormField
                                                name={`productsOrders.${index}.service`}
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Servicio
                                                            </FormLabel>

                                                            <FormControl>
                                                                <CustomSelect<
                                                                    {
                                                                        value: string;
                                                                        label: string;
                                                                        data: ServiceDetails;
                                                                    },
                                                                    false
                                                                >
                                                                    {...field}
                                                                    onChange={(next) => {
                                                                        field.onChange(
                                                                            next,
                                                                        );

                                                                        onServiceChange(
                                                                            index,
                                                                        );
                                                                    }}
                                                                    options={
                                                                        servicesOptions ||
                                                                        []
                                                                    }
                                                                    placeholder="Selecciona un servicio"
                                                                    isClearable
                                                                    formatOptionLabel={(
                                                                        option,
                                                                    ) => (
                                                                        <div>
                                                                            <p className="mb-1">
                                                                                {
                                                                                    option.label
                                                                                }
                                                                            </p>

                                                                            <div className="text-sm text-muted-foreground">
                                                                                <p>
                                                                                    <span className="font-bold">
                                                                                        Precio:
                                                                                    </span>{' '}
                                                                                    {
                                                                                        option
                                                                                            .data
                                                                                            .price
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    );
                                                }}
                                            />

                                            {item.product && (
                                                <p>
                                                    <strong>
                                                        Costo de producto y servicio por
                                                        día:
                                                    </strong>{' '}
                                                    $
                                                    {formatNumberAsPrice(
                                                        item.product.data.price +
                                                            (item.service?.data.price ||
                                                                0),
                                                    )}
                                                </p>
                                            )}

                                            <p className="font-bold">
                                                Cantidad por sucursal
                                            </p>

                                            {!item.product && (
                                                <p className="text-sm text-muted-foreground">
                                                    Selecciona un producto para ver su
                                                    stock por sucursal.
                                                </p>
                                            )}

                                            {item.product?.data.stocksByOffice.map(
                                                (stock) => {
                                                    const office = stock.office;

                                                    if (
                                                        stock.stock === 0 &&
                                                        office.id !== contextOffice?.id
                                                    ) {
                                                        return null;
                                                    }

                                                    return (
                                                        <FormField
                                                            key={office.id}
                                                            name={`productsOrders.${index}.quantityByOffice.${office.id}`}
                                                            control={formMethods.control}
                                                            rules={{
                                                                min: 0,
                                                                max: stock.stock,
                                                            }}
                                                            render={({ field }) => {
                                                                const max = stock.stock;
                                                                return (
                                                                    <FormItem>
                                                                        <FormLabel>
                                                                            {office.name}
                                                                        </FormLabel>

                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                onChange={(
                                                                                    e,
                                                                                ) => {
                                                                                    const next =
                                                                                        getNumericInputValue(
                                                                                            {
                                                                                                value: e
                                                                                                    .target
                                                                                                    .value,
                                                                                                max,
                                                                                                min: 0,
                                                                                            },
                                                                                        );

                                                                                    field.onChange(
                                                                                        next,
                                                                                    );
                                                                                    onQuantityChange(
                                                                                        index,
                                                                                    );
                                                                                }}
                                                                                placeholder="Ej. 10"
                                                                                min={0}
                                                                                max={
                                                                                    stock.stock
                                                                                }
                                                                                value={
                                                                                    field.value ??
                                                                                    ''
                                                                                }
                                                                            />
                                                                        </FormControl>

                                                                        <FormDescription>
                                                                            {stock.stock ===
                                                                            0
                                                                                ? 'No hay stock disponible'
                                                                                : `Stock disponible: ${stock.stock}`}
                                                                        </FormDescription>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    );
                                                },
                                            )}

                                            <p className="font-bold">Monto</p>

                                            <FormField
                                                name={`productsOrders.${index}.subtotal`}
                                                control={formMethods.control}
                                                rules={{
                                                    min: 0,
                                                    required: true,
                                                }}
                                                render={() => {
                                                    return (
                                                        <FormItem>
                                                            <FormLabel required>
                                                                Subtotal
                                                            </FormLabel>

                                                            <FormControl>
                                                                <Input
                                                                    placeholder="0"
                                                                    type="text"
                                                                    min={0}
                                                                    value={
                                                                        item.subtotal
                                                                            ? formatNumberAsPrice(
                                                                                  item.subtotal,
                                                                              )
                                                                            : '0'
                                                                    }
                                                                    disabled
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    );
                                                }}
                                            />

                                            <FormField
                                                name={`productsOrders.${index}.discount`}
                                                control={formMethods.control}
                                                rules={{
                                                    min: 0,
                                                    validate: (value) => {
                                                        if (!item.subtotal) {
                                                            return true;
                                                        }

                                                        return (
                                                            value === null ||
                                                            value <= item.subtotal ||
                                                            'El descuento no puede ser mayor al subtotal'
                                                        );
                                                    },
                                                }}
                                                render={({ field }) => {
                                                    const max = item.subtotal || 0;
                                                    return (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Descuento
                                                            </FormLabel>

                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        const next =
                                                                            getNumericInputValue(
                                                                                {
                                                                                    value: e
                                                                                        .target
                                                                                        .value,
                                                                                    max,
                                                                                    min: 0,
                                                                                },
                                                                            );

                                                                        field.onChange(
                                                                            next,
                                                                        );
                                                                    }}
                                                                    value={
                                                                        field.value
                                                                            ? formatNumberAsPrice(
                                                                                  field.value,
                                                                              )
                                                                            : ''
                                                                    }
                                                                    placeholder="0"
                                                                    type="text"
                                                                    min={0}
                                                                    max={max}
                                                                />
                                                            </FormControl>

                                                            <FormDescription>
                                                                Descuento del{' '}
                                                                {item.subtotal &&
                                                                item.discount &&
                                                                item.discount > 0
                                                                    ? (
                                                                          (item.discount /
                                                                              item.subtotal) *
                                                                          100
                                                                      ).toFixed(2)
                                                                    : '0'}
                                                                %
                                                            </FormDescription>
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>

                                        <p className="pt-4 font-bold">
                                            Total: $
                                            {formatNumberAsPrice(
                                                item.subtotal
                                                    ? item.subtotal -
                                                          (item.discount
                                                              ? item.discount
                                                              : 0)
                                                    : 0,
                                            )}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}

                    {canOrderMoreProducts && (
                        <DeprecatedButton
                            fullWidth
                            variant={ButtonVariant.OUTLINE_WHITE}
                            onClick={addProductToOrder}
                        >
                            + Añadir producto
                        </DeprecatedButton>
                    )}
                </div>
            )}
        </FetchedDataRenderer>
    );
};
