import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { differenceInCalendarDays } from 'date-fns';
import { PencilIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { UseFieldArrayReturn, useFieldArray, useFormContext } from 'react-hook-form';

import { ProductTypeChoices } from '@/api/graphql';
import { useInfiniteProducts, useProductStocksInDateRange } from '@/api/hooks';

import {
    calculateContractProductItemSubtotal,
    calculateContractProductItemTotal,
    calculateContractServiceItemSubtotal,
} from '@/modules/contract-utils';

import { ContractFormEditorDiscountType } from '@/app/(dashboard)/contratos/add/page';

import { ContractFormEditorValues } from './contract-form-editor';
import { ContractFormEditorOrderItemAllocation } from './contract-form-editor-order-item-allocation';
import { ContractFormEditorOrderItemService } from './contract-form-editor-order-item-service';

import { BaseTable } from '@/components/base-table';
import { ComboboxInfinite, ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    calculateDiscountAmountFromPercentage,
    calculateDiscountPercentageFromAmount,
    dateToInputValue,
    formatNumberAsPrice,
    inputToNumber,
} from '@/lib/utils';

type OrderItemProps = {
    orderIndex: number;
    ordersFieldArray: UseFieldArrayReturn<ContractFormEditorValues, 'orders', 'id'>;
};

type OrderRow = NonNullable<ContractFormEditorValues['orders']>[0] & {
    numberOfDays: number;
};

const productColumnsHelper = createColumnHelper<OrderRow>();
const productColumns: ColumnDef<OrderRow, any>[] = [
    productColumnsHelper.accessor('product.data.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                </div>
            );
        },
        size: 225,
    }),
    productColumnsHelper.accessor('allocations', {
        header: 'Cantidad',
        cell: (cell) => {
            const value = (cell.getValue() || []) as NonNullable<OrderRow['allocations']>;
            return value.reduce((acc, allocation) => acc + (allocation.quantity || 0), 0);
        },
    }),
    productColumnsHelper.accessor('product.data.price', {
        header: 'Precio u. x día',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.display({
        header: 'Subtotal',
        cell: (cell) => {
            const data = cell.row.original;

            if (
                !data.product?.data.price ||
                !data.allocations ||
                !data.allocations.length
            ) {
                return '-';
            }

            const total = calculateContractProductItemSubtotal({
                allocations: data.allocations.map((allocation) => ({
                    quantity: allocation.quantity || 0,
                })),
                days: data.numberOfDays,
                unitPricePerDay: data.product.data.price,
            });

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
    productColumnsHelper.accessor('productDiscountAmount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value || 0)}`;
        },
    }),
    productColumnsHelper.display({
        header: 'Total',
        cell: (cell) => {
            const data = cell.row.original;

            if (
                !data.product?.data.price ||
                !data.allocations ||
                !data.allocations.length
            ) {
                return '-';
            }

            const total = calculateContractProductItemTotal({
                allocations: data.allocations.map((allocation) => ({
                    quantity: allocation.quantity || 0,
                })),
                days: data.numberOfDays,
                discount: data.productDiscountAmount || 0,
                unitPricePerDay: data.product.data.price,
            });

            return `$${formatNumberAsPrice(total)}`;
        },
    }),
];

type ServiceRow = NonNullable<OrderRow['services']>[0] & {
    numberOfDays: number;
};

const serviceColumnsHelper = createColumnHelper<ServiceRow>();

const serviceColumns: ColumnDef<ServiceRow, any>[] = [
    serviceColumnsHelper.accessor('service.data.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                </div>
            );
        },
    }),
    serviceColumnsHelper.accessor('service.data.price', {
        header: 'Precio',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.accessor('service.data.billingType', {
        header: 'Tipo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value;
        },
    }),
    serviceColumnsHelper.accessor('service.data.billingPeriod', {
        header: 'Periodo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `${value} días` : '-';
        },
    }),
    serviceColumnsHelper.display({
        header: 'Subtotal',
        cell: (cell) => {
            const data = cell.row.original;

            if (!data?.service?.data.price) {
                return '-';
            }

            const subtotal = calculateContractServiceItemSubtotal({
                billingPeriod: data.service.data.billingPeriod || 0,
                billingType: data.service.data.billingType,
                days: data.numberOfDays,
                unitPrice: data.service.data.price,
            });

            return `$${formatNumberAsPrice(subtotal)}`;
        },
    }),
    serviceColumnsHelper.accessor('serviceDiscountAmount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.display({
        header: 'Total',
        cell: (cell) => {
            const data = cell.row.original;

            if (!data?.service?.data.price) {
                return '-';
            }

            const total = calculateContractServiceItemSubtotal({
                billingPeriod: data.service.data.billingPeriod || 0,
                billingType: data.service.data.billingType,
                days: data.numberOfDays,
                unitPrice: data.service.data.price,
            });

            return `$${formatNumberAsPrice(total - (data.serviceDiscountAmount || 0))}`;
        },
    }),
];

type OrderEditorProps = {
    orderIndex: number;
    ordersFieldArray: UseFieldArrayReturn<ContractFormEditorValues, 'orders', 'id'>;
};

const OrderEditor = ({ orderIndex, ordersFieldArray }: OrderEditorProps) => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const { setValue } = formMethods;

    const [query, setQuery] = useState<string>('');
    const productsQuery = useInfiniteProducts({
        officeId: null,
        page: 1,
        query: query,
        type: ProductTypeChoices.Alquilable,
    });

    const startDatetime = formMethods.watch('startDatetime');
    const endDatetime = formMethods.watch('endDatetime');
    let contractDurationInDays = 0;
    if (startDatetime && endDatetime) {
        contractDurationInDays = differenceInCalendarDays(endDatetime, startDatetime);
    }

    const watchedField = formMethods.watch(`orders.${orderIndex}`);
    const product = watchedField.product;

    const stocksQuery = useProductStocksInDateRange({
        productId: product?.data.id,
        startDate: startDatetime ? dateToInputValue(startDatetime) : undefined,
        endDate: endDatetime ? dateToInputValue(endDatetime) : undefined,
    });

    const globalStock = stocksQuery.data?.productStocksInDateRange.reduce(
        (acc, stock) => {
            return acc + stock.quantity;
        },
        0,
    );

    const servicesFieldArray = useFieldArray({
        control: formMethods.control,
        name: `orders.${orderIndex}.services`,
    });
    const allocationFieldArray = useFieldArray({
        control: formMethods.control,
        name: `orders.${orderIndex}.allocations`,
    });

    const requestedQuantity = (watchedField.allocations || []).reduce(
        (acc, allocation) => {
            return acc + (allocation.quantity || 0);
        },
        0,
    );
    const productDiscountType = watchedField.productDiscountType;

    let productSubtotal = 0;
    if (product && requestedQuantity) {
        productSubtotal =
            (product.data.price || 0) * requestedQuantity * contractDurationInDays;
    }

    const existentOrders = formMethods.watch('orders') || [];
    const productOptions = (productsQuery.data ? productsQuery.data.pages : []).flatMap(
        (page) => {
            return page.products.results
                .filter((someProduct) => {
                    const alreadySelected = existentOrders.some((order, index) => {
                        return (
                            index !== orderIndex &&
                            order.product?.value === someProduct.id
                        );
                    });

                    return !alreadySelected;
                })
                .map((product) => ({
                    value: product.id,
                    label: product.name,
                    data: product,
                }));
        },
    );

    return (
        <div className="space-y-4 p-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold italic">Producto #{orderIndex + 1}</h3>

                <Button
                    variant="outline"
                    onClick={() => {
                        ordersFieldArray.remove(orderIndex);
                    }}
                >
                    <Trash className="size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2">
                <div className="space-y-8 pr-4">
                    <div className="space-y-4">
                        <h2 className="font-medium">Selecciona un producto</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                name={`orders.${orderIndex}.product`}
                                control={formMethods.control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-2">
                                        <FormLabel>Producto</FormLabel>

                                        <ComboboxInfinite
                                            placeholder="Selecciona un producto"
                                            isLoading={productsQuery.isPending}
                                            options={productOptions}
                                            queryValue={query}
                                            setQueryValue={setQuery}
                                            onChange={(next) => {
                                                if (next?.value !== field.value?.value) {
                                                    setValue(
                                                        `orders.${orderIndex}.productDiscountPercentage`,
                                                        null,
                                                    );
                                                    setValue(
                                                        `orders.${orderIndex}.productDiscountAmount`,
                                                        null,
                                                    );
                                                    setValue(
                                                        `orders.${orderIndex}.services`,
                                                        [],
                                                    );
                                                    setValue(
                                                        `orders.${orderIndex}.allocations`,
                                                        [],
                                                    );
                                                }

                                                field.onChange(next);
                                            }}
                                            value={field.value || null}
                                            fetchNextPage={productsQuery.fetchNextPage}
                                            hasNextPage={productsQuery.hasNextPage}
                                            isFetchingNextPage={
                                                productsQuery.isFetchingNextPage
                                            }
                                        />

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <Label>Precio U.</Label>

                                <Input
                                    readOnly
                                    disabled
                                    value={
                                        product?.data.price
                                            ? formatNumberAsPrice(product.data.price)
                                            : ''
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Stock global disponible</Label>
                                <Input readOnly disabled value={globalStock || ''} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-medium">
                            ¿Desde qué sucursales se alquilará este producto?
                        </h2>

                        {product ? (
                            <>
                                {allocationFieldArray.fields.map(
                                    (allocationFormField, index) => {
                                        return (
                                            <ContractFormEditorOrderItemAllocation
                                                key={allocationFormField.id}
                                                product={product}
                                                orderIndex={orderIndex}
                                                index={index}
                                                allocationsFieldArray={
                                                    allocationFieldArray
                                                }
                                            />
                                        );
                                    },
                                )}

                                <Button
                                    onClick={() => {
                                        allocationFieldArray.append({
                                            office: null,
                                            quantity: null,
                                            shippingCost: null,
                                            shippingDiscount: null,
                                        });
                                    }}
                                    variant="outline"
                                >
                                    + Añadir sucursal
                                </Button>
                            </>
                        ) : (
                            <p>Selecciona un producto para asignar</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4 border-l border-gray-200 pl-4">
                    <h2 className="font-medium">Precio y descuentos del producto</h2>

                    <div className="space-y-2">
                        <Label>Subtotal</Label>

                        <Input
                            readOnly
                            disabled
                            value={formatNumberAsPrice(productSubtotal)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            name={`orders.${orderIndex}.productDiscountType`}
                            control={formMethods.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel>Tipo de descuento</FormLabel>

                                    <FormControl>
                                        <ComboboxSimple
                                            options={[
                                                {
                                                    value: ContractFormEditorDiscountType.NONE,
                                                    label: 'Sin descuento',
                                                },
                                                {
                                                    value: ContractFormEditorDiscountType.PERCENTAGE,
                                                    label: 'Porcentaje (%)',
                                                },
                                                {
                                                    value: ContractFormEditorDiscountType.AMOUNT,
                                                    label: 'Monto fijo ($)',
                                                },
                                            ]}
                                            onChange={(next) => {
                                                field.onChange(next);
                                            }}
                                            value={field.value || null}
                                            placeholder="Selecciona un tipo de descuento"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name={`orders.${orderIndex}.productDiscountPercentage`}
                            control={formMethods.control}
                            rules={{
                                validate: (value) => {
                                    if (
                                        productDiscountType?.value ===
                                            ContractFormEditorDiscountType.PERCENTAGE &&
                                        typeof value !== 'number'
                                    ) {
                                        return 'Este campo es requerido';
                                    }

                                    return true;
                                },
                            }}
                            disabled={!productSubtotal}
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel>Descuento (%)</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={
                                                field.disabled ||
                                                productDiscountType?.value !==
                                                    ContractFormEditorDiscountType.PERCENTAGE
                                            }
                                            readOnly={
                                                productDiscountType?.value !==
                                                ContractFormEditorDiscountType.PERCENTAGE
                                            }
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const val = inputToNumber(
                                                    e.target.value,
                                                    {
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                );

                                                field.onChange(val);

                                                setValue(
                                                    `orders.${orderIndex}.productDiscountAmount`,
                                                    calculateDiscountAmountFromPercentage(
                                                        {
                                                            subtotal: productSubtotal,
                                                            percentage: val || 0,
                                                        },
                                                    ),
                                                );
                                            }}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name={`orders.${orderIndex}.productDiscountAmount`}
                            control={formMethods.control}
                            rules={{
                                validate: (value) => {
                                    if (
                                        productDiscountType?.value ===
                                            ContractFormEditorDiscountType.AMOUNT &&
                                        typeof value !== 'number'
                                    ) {
                                        return 'Este campo es requerido';
                                    }

                                    return true;
                                },
                            }}
                            disabled={!productSubtotal}
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-2">
                                    <FormLabel>Descuento ($)</FormLabel>

                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={
                                                field.disabled ||
                                                productDiscountType?.value !==
                                                    ContractFormEditorDiscountType.AMOUNT
                                            }
                                            readOnly={
                                                productDiscountType?.value !==
                                                ContractFormEditorDiscountType.AMOUNT
                                            }
                                            value={
                                                typeof field.value === 'number'
                                                    ? formatNumberAsPrice(field.value)
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                const val = inputToNumber(
                                                    e.target.value,
                                                    {
                                                        min: 0,
                                                        max: productSubtotal,
                                                    },
                                                );

                                                field.onChange(val);

                                                setValue(
                                                    `orders.${orderIndex}.productDiscountPercentage`,
                                                    calculateDiscountPercentageFromAmount(
                                                        {
                                                            subtotal: productSubtotal,
                                                            amount: val || 0,
                                                        },
                                                    ),
                                                );
                                            }}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Total</Label>

                        <Input
                            readOnly
                            disabled
                            value={formatNumberAsPrice(
                                productSubtotal -
                                    (watchedField.productDiscountType?.value !==
                                    ContractFormEditorDiscountType.NONE
                                        ? watchedField.productDiscountAmount || 0
                                        : 0),
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4 rounded-lg bg-gray-100 p-4">
                <h2 className="text-xl font-bold">Servicios</h2>

                {product ? (
                    <>
                        {servicesFieldArray.fields.map((serviceFormField, index) => {
                            return (
                                <ContractFormEditorOrderItemService
                                    key={serviceFormField.id}
                                    product={product}
                                    orderIndex={orderIndex}
                                    index={index}
                                    onDelete={() => {
                                        servicesFieldArray.remove(index);
                                    }}
                                />
                            );
                        })}

                        <Button
                            onClick={() => {
                                servicesFieldArray.append({
                                    service: null,
                                    serviceDiscountAmount: null,
                                    serviceDiscountPercentage: null,
                                    serviceDiscountType: {
                                        value: ContractFormEditorDiscountType.NONE,
                                        label: 'Sin descuento',
                                    },
                                });
                            }}
                            variant="outline"
                        >
                            + Añadir servicio
                        </Button>
                    </>
                ) : (
                    <p>Selecciona un producto para añadir servicios</p>
                )}
            </div>
        </div>
    );
};

export const ContractFormEditorOrderItem = ({
    orderIndex,
    ordersFieldArray,
}: OrderItemProps) => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const watchedField = formMethods.watch(`orders.${orderIndex}`);
    const watchedEndDate = formMethods.watch('endDatetime');
    const watchedStartDate = formMethods.watch('startDatetime');

    const numberOfDays =
        watchedEndDate && watchedStartDate
            ? differenceInCalendarDays(watchedEndDate, watchedStartDate)
            : 0;

    return (
        <div className="space-y-4 rounded-lg border border-gray-400 p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold italic">Producto #{orderIndex + 1}</h3>

                <div className="space-x-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={'outline'}>
                                <PencilIcon className="size-4" />
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="w-10/12 max-w-full p-0 pt-12">
                            <div className="h-[70vh] overflow-scroll border-y border-border">
                                <OrderEditor
                                    orderIndex={orderIndex}
                                    ordersFieldArray={ordersFieldArray}
                                />
                            </div>

                            <DialogFooter className="pb-4 pr-6 pt-0">
                                <DialogClose>
                                    <Button>Cerrar</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="outline"
                        onClick={() => {
                            ordersFieldArray.remove(orderIndex);
                        }}
                    >
                        <Trash className="size-4" />
                    </Button>
                </div>
            </div>

            <BaseTable
                columns={productColumns}
                data={[
                    {
                        ...watchedField,
                        numberOfDays: numberOfDays,
                    },
                ]}
            />

            <Separator />

            <h2 className="font-medium">Servicios</h2>

            {watchedField.services && watchedField.services.length ? (
                <BaseTable
                    columns={serviceColumns as any}
                    data={watchedField.services.map((service) => ({
                        ...service,
                        numberOfDays: numberOfDays,
                    }))}
                />
            ) : (
                <p>No hay servicios añadidos</p>
            )}
        </div>
    );
};
