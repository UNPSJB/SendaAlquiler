import { Trash } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useAllProducts } from '@/api/hooks';

import { SaleFormEditorDiscountType, SaleFormEditorValues } from './sale-form-editor';

import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatNumberAsPrice, inputToNumber } from '@/lib/utils';

type CalculateDiscountFromPercentageOptions = {
    subtotal: number;
    percentage: number;
};

const calculateDiscountAmountFromPercentage = ({
    subtotal,
    percentage,
}: CalculateDiscountFromPercentageOptions) => {
    return subtotal * (percentage / 100);
};

type CalculateDiscountFromAmountOptions = {
    subtotal: number;
    amount: number;
};

const calculateDiscountPercentageFromAmount = ({
    subtotal,
    amount,
}: CalculateDiscountFromAmountOptions) => {
    const percentage = (amount / subtotal) * 100;
    return Math.round(percentage * 100) / 100;
};

export const SaleFormEditorOrders = () => {
    const formMethods = useFormContext<SaleFormEditorValues>();
    const { setValue } = formMethods;
    const productsQuery = useAllProducts();

    const ordersFieldArray = useFieldArray({
        control: formMethods.control,
        name: 'orders',
    });

    return (
        <section className="flex border-t border-gray-200 py-8">
            <h2 className="w-3/12 text-xl font-bold">Productos comprados</h2>

            <div className="w-9/12 space-y-6">
                {ordersFieldArray.fields.map((field, index) => {
                    const order = formMethods.watch(`orders.${index}`);
                    const product = order.product;
                    const quantity = order.quantity;

                    const discountType = order.discountType;

                    let subtotal = 0;
                    if (product && quantity) {
                        subtotal = (product.data.price || 0) * quantity;
                    }

                    return (
                        <div
                            className="space-y-4 rounded-lg border border-muted p-4 shadow-sm"
                            key={field.id}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Producto #{index + 1}</h3>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        ordersFieldArray.remove(index);
                                    }}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex space-x-4">
                                <FormField
                                    name={`orders.${index}.product`}
                                    control={formMethods.control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <FormItem className="flex w-6/12 flex-col">
                                            <FormLabel>Producto</FormLabel>

                                            <ComboboxSimple
                                                options={
                                                    productsQuery.data?.allProducts.map(
                                                        (product) => ({
                                                            value: product.id,
                                                            label: product.name,
                                                            data: product,
                                                        }),
                                                    ) ?? []
                                                }
                                                onChange={(next) => {
                                                    if (
                                                        next?.value !== field.value?.value
                                                    ) {
                                                        setValue(
                                                            `orders.${index}.quantity`,
                                                            null,
                                                        );
                                                        setValue(
                                                            `orders.${index}.discountPercentage`,
                                                            null,
                                                        );
                                                        setValue(
                                                            `orders.${index}.discountAmount`,
                                                            null,
                                                        );
                                                    }

                                                    field.onChange(next);
                                                }}
                                                value={field.value}
                                                placeholder="Selecciona un producto"
                                            />

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="w-6/12">
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
                            </div>

                            <div className="flex space-x-4">
                                <FormField
                                    name={`orders.${index}.quantity`}
                                    control={formMethods.control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <FormItem className="flex w-6/12 flex-col">
                                            <FormLabel>Cantidad</FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const val = inputToNumber(
                                                            e.target.value,
                                                            {
                                                                min: product ? 1 : 0,
                                                                // TODO: Get max from product stock
                                                                max: product ? 1000 : 0,
                                                            },
                                                        );

                                                        field.onChange(val);
                                                    }}
                                                />
                                            </FormControl>

                                            {/* 
                                            TODO: Get max from product stock
                                             */}
                                            <FormDescription>
                                                {product
                                                    ? `Stock disponible: ${product ? 1000 : 0}`
                                                    : ''}
                                            </FormDescription>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="w-6/12">
                                    <Label>Subtotal</Label>

                                    <Input
                                        readOnly
                                        disabled
                                        value={formatNumberAsPrice(subtotal)}
                                    />
                                </div>
                            </div>

                            <FormField
                                name={`orders.${index}.discountType`}
                                control={formMethods.control}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-3">
                                        <FormLabel>Tipo de descuento</FormLabel>

                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(next) => {
                                                    field.onChange(next);

                                                    const discountType =
                                                        next as SaleFormEditorDiscountType;

                                                    if (
                                                        discountType ===
                                                        SaleFormEditorDiscountType.PERCENTAGE
                                                    ) {
                                                        setValue(
                                                            `orders.${index}.discountAmount`,
                                                            calculateDiscountAmountFromPercentage(
                                                                {
                                                                    subtotal,
                                                                    percentage:
                                                                        order.discountPercentage ||
                                                                        0,
                                                                },
                                                            ),
                                                        );
                                                    }

                                                    if (
                                                        discountType ===
                                                        SaleFormEditorDiscountType.AMOUNT
                                                    ) {
                                                        setValue(
                                                            `orders.${index}.discountPercentage`,
                                                            calculateDiscountPercentageFromAmount(
                                                                {
                                                                    subtotal,
                                                                    amount:
                                                                        order.discountAmount ||
                                                                        0,
                                                                },
                                                            ),
                                                        );
                                                    }
                                                }}
                                                defaultValue={
                                                    SaleFormEditorDiscountType.NONE
                                                }
                                                className="flex space-x-2"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={
                                                                SaleFormEditorDiscountType.NONE
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Sin descuento
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={
                                                                SaleFormEditorDiscountType.PERCENTAGE
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Porcentaje (%)
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value={
                                                                SaleFormEditorDiscountType.AMOUNT
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        Monto fijo ($)
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex space-x-4">
                                <div className="w-6/12">
                                    <FormField
                                        name={`orders.${index}.discountPercentage`}
                                        control={formMethods.control}
                                        rules={{
                                            validate: (value) => {
                                                if (
                                                    discountType ===
                                                    SaleFormEditorDiscountType.PERCENTAGE
                                                ) {
                                                    if (!value) {
                                                        return 'Este campo es requerido';
                                                    }
                                                }

                                                return true;
                                            },
                                        }}
                                        disabled={!subtotal}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Descuento (%)</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={
                                                            field.disabled ||
                                                            discountType !==
                                                                SaleFormEditorDiscountType.PERCENTAGE
                                                        }
                                                        readOnly={
                                                            discountType !==
                                                            SaleFormEditorDiscountType.PERCENTAGE
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
                                                                `orders.${index}.discountAmount`,
                                                                calculateDiscountAmountFromPercentage(
                                                                    {
                                                                        subtotal,
                                                                        percentage:
                                                                            val || 0,
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

                                <div className="w-6/12">
                                    <FormField
                                        name={`orders.${index}.discountAmount`}
                                        control={formMethods.control}
                                        rules={{
                                            validate: (value) => {
                                                if (
                                                    discountType ===
                                                    SaleFormEditorDiscountType.AMOUNT
                                                ) {
                                                    if (!value) {
                                                        return 'Este campo es requerido';
                                                    }
                                                }

                                                return true;
                                            },
                                        }}
                                        disabled={!subtotal}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Descuento ($)</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={
                                                            field.disabled ||
                                                            discountType !==
                                                                SaleFormEditorDiscountType.AMOUNT
                                                        }
                                                        readOnly={
                                                            discountType !==
                                                            SaleFormEditorDiscountType.AMOUNT
                                                        }
                                                        value={
                                                            field.value
                                                                ? formatNumberAsPrice(
                                                                      field.value,
                                                                  )
                                                                : ''
                                                        }
                                                        onChange={(e) => {
                                                            const val = inputToNumber(
                                                                e.target.value,
                                                                {
                                                                    min: 0,
                                                                    max: subtotal,
                                                                },
                                                            );

                                                            field.onChange(val);

                                                            setValue(
                                                                `orders.${index}.discountPercentage`,
                                                                calculateDiscountPercentageFromAmount(
                                                                    {
                                                                        subtotal,
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
                            </div>

                            <div className="flex space-x-4">
                                <div className="w-6/12">
                                    <Label>Total</Label>

                                    <Input
                                        readOnly
                                        disabled
                                        value={formatNumberAsPrice(
                                            subtotal - (order.discountAmount || 0),
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                <Button
                    variant="outline"
                    onClick={() => {
                        ordersFieldArray.append({
                            product: null,
                            quantity: null,
                            discountAmount: null,
                            discountPercentage: null,
                            discountType: SaleFormEditorDiscountType.NONE,
                        });
                    }}
                >
                    + Añadir producto
                </Button>
            </div>
        </section>
    );
};
