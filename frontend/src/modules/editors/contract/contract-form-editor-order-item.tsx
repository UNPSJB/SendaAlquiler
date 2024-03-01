import { differenceInCalendarDays } from 'date-fns';
import { Trash } from 'lucide-react';
import { UseFieldArrayReturn, useFieldArray, useFormContext } from 'react-hook-form';

import { ProductTypeChoices } from '@/api/graphql';
import { useAllProducts, useProductStocksInDateRange } from '@/api/hooks';

import {
    ContractFormEditorDiscountType,
    ContractFormEditorValues,
} from './contract-form-editor';
import { ContractFormEditorOrderItemAllocation } from './contract-form-editor-order-item-allocation';
import { ContractFormEditorOrderItemService } from './contract-form-editor-order-item-service';

import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export const ContractFormEditorOrderItem = ({
    orderIndex,
    ordersFieldArray,
}: OrderItemProps) => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const { setValue } = formMethods;

    const productsQuery = useAllProducts();

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

    return (
        <div className="space-y-4 rounded-lg border border-muted p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-bold italic">Producto #{orderIndex + 1}</h3>

                <Button
                    variant="outline"
                    onClick={() => {
                        ordersFieldArray.remove(orderIndex);
                    }}
                >
                    <Trash className="h-4 w-4" />
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

                                        <ComboboxSimple
                                            options={
                                                productsQuery.data?.allProducts
                                                    .filter(
                                                        (product) =>
                                                            product.type ===
                                                            ProductTypeChoices.Alquilable,
                                                    )
                                                    .map((product) => ({
                                                        value: product.id,
                                                        label: product.name,
                                                        data: product,
                                                    })) ?? []
                                            }
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
                                            placeholder="Selecciona un producto"
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
                                        ContractFormEditorDiscountType.PERCENTAGE
                                    ) {
                                        return value ? true : 'Este campo es requerido';
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
                                        ContractFormEditorDiscountType.AMOUNT
                                    ) {
                                        return value ? true : 'Este campo es requerido';
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
                                                field.value
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
