import { differenceInCalendarDays } from 'date-fns';
import { Trash } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { ProductServiceBillingTypeChoices } from '@/api/graphql';

import { calculateContractServiceItemSubtotal } from '@/modules/contract-utils';

import { ContractFormEditorDiscountType } from '@/app/(dashboard)/contratos/add/page';

import { ContractFormEditorValues } from './contract-form-editor';

import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    calculateDiscountAmountFromPercentage,
    calculateDiscountPercentageFromAmount,
    formatNumberAsPrice,
    inputToNumber,
} from '@/lib/utils';

type ServiceItemProps = {
    orderIndex: number;
    index: number;
    product: NonNullable<NonNullable<ContractFormEditorValues['orders']>[0]['product']>;
    onDelete: () => void;
};

export const ContractFormEditorOrderItemService = ({
    orderIndex,
    index,
    product,
    onDelete,
}: ServiceItemProps) => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const { setValue } = formMethods;

    const watchedField = formMethods.watch(`orders.${orderIndex}.services.${index}`);

    const price = watchedField?.service?.data.price;
    const billingType = watchedField?.service?.data.billingType;

    const serviceDiscountType = watchedField?.serviceDiscountType;
    const serviceDiscountAmount = watchedField?.serviceDiscountAmount;

    const startDatetime = formMethods.watch('startDatetime');
    const endDatetime = formMethods.watch('endDatetime');

    const watchesServices = formMethods.watch(`orders.${orderIndex}.services`) || [];
    const servicesNotSelectedYet = product?.data.services.filter((service) => {
        return !watchesServices.some((watchedService) => {
            return watchedService?.service?.value === service.id;
        });
    });

    const daysOfContract =
        startDatetime && endDatetime
            ? differenceInCalendarDays(new Date(endDatetime), new Date(startDatetime))
            : 0;
    let serviceSubtotal = 0;
    if (
        price &&
        watchedField?.service?.data &&
        (billingType === ProductServiceBillingTypeChoices.OneTime ||
            (startDatetime && endDatetime))
    ) {
        serviceSubtotal = calculateContractServiceItemSubtotal({
            billingPeriod: watchedField.service.data.billingPeriod || 0,
            billingType: watchedField.service.data.billingType,
            days: daysOfContract,
            unitPrice: price,
        });
    }

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">Servicio #{index + 1}</h3>

                <Button variant="outline" onClick={onDelete}>
                    <Trash className="size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <FormField
                    name={`orders.${orderIndex}.services.${index}.service`}
                    control={formMethods.control}
                    rules={{
                        required: 'Este campo es requerido',
                    }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Servicio</FormLabel>

                            <ComboboxSimple
                                options={[
                                    ...(field.value ? [field.value] : []),
                                    ...(servicesNotSelectedYet.map((service) => ({
                                        value: service.id,
                                        label: service.name,
                                        data: service,
                                    })) ?? []),
                                ]}
                                onChange={(next) => {
                                    field.onChange(next);
                                }}
                                value={field.value || null}
                                placeholder="Selecciona un servicio"
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
                        value={price ? formatNumberAsPrice(price) : ''}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tipo de facturación</Label>

                    <Input readOnly disabled value={billingType || ''} />
                </div>

                <div className="space-y-2">
                    <Label>Subtotal</Label>

                    <Input
                        readOnly
                        disabled
                        value={
                            serviceSubtotal ? formatNumberAsPrice(serviceSubtotal) : ''
                        }
                    />

                    {billingType &&
                        billingType !== ProductServiceBillingTypeChoices.OneTime && (
                            <>
                                {startDatetime && endDatetime ? (
                                    <p className="text-sm text-muted-foreground">
                                        El subtotal se calcula en base a las fechas de
                                        inicio y fin
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Selecciona fechas de inicio y fin para calcular el
                                        subtotal
                                    </p>
                                )}
                            </>
                        )}
                </div>

                <FormField
                    name={`orders.${orderIndex}.services.${index}.serviceDiscountType`}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-3">
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
                    name={`orders.${orderIndex}.services.${index}.serviceDiscountPercentage`}
                    control={formMethods.control}
                    rules={{
                        validate: (val) => {
                            if (
                                serviceDiscountType?.value ===
                                    ContractFormEditorDiscountType.PERCENTAGE &&
                                typeof val !== 'number'
                            ) {
                                return 'Este campo es requerido';
                            }

                            return true;
                        },
                    }}
                    disabled={!serviceSubtotal}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Descuento (%)</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={
                                        field.disabled ||
                                        serviceDiscountType?.value !==
                                            ContractFormEditorDiscountType.PERCENTAGE
                                    }
                                    readOnly={
                                        serviceDiscountType?.value !==
                                        ContractFormEditorDiscountType.PERCENTAGE
                                    }
                                    value={field.value ?? ''}
                                    onChange={(e) => {
                                        const val = inputToNumber(e.target.value, {
                                            min: 0,
                                            max: 100,
                                        });

                                        field.onChange(val);

                                        setValue(
                                            `orders.${orderIndex}.services.${index}.serviceDiscountAmount`,
                                            calculateDiscountAmountFromPercentage({
                                                subtotal: serviceSubtotal,
                                                percentage: val || 0,
                                            }),
                                        );
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name={`orders.${orderIndex}.services.${index}.serviceDiscountAmount`}
                    control={formMethods.control}
                    rules={{
                        validate: (val) => {
                            if (
                                serviceDiscountType?.value ===
                                    ContractFormEditorDiscountType.AMOUNT &&
                                !val
                            ) {
                                return 'Este campo es requerido';
                            }

                            return true;
                        },
                    }}
                    disabled={!serviceSubtotal}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Descuento ($)</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    disabled={
                                        field.disabled ||
                                        serviceDiscountType?.value !==
                                            ContractFormEditorDiscountType.AMOUNT
                                    }
                                    readOnly={
                                        serviceDiscountType?.value !==
                                        ContractFormEditorDiscountType.AMOUNT
                                    }
                                    value={
                                        typeof field.value === 'number'
                                            ? formatNumberAsPrice(field.value)
                                            : ''
                                    }
                                    onChange={(e) => {
                                        const val = inputToNumber(e.target.value, {
                                            min: 0,
                                            max: serviceSubtotal,
                                        });

                                        field.onChange(val);

                                        setValue(
                                            `orders.${orderIndex}.services.${index}.serviceDiscountPercentage`,
                                            calculateDiscountPercentageFromAmount({
                                                subtotal: serviceSubtotal,
                                                amount: val || 0,
                                            }),
                                        );
                                    }}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <Label>Total</Label>

                    <Input
                        readOnly
                        disabled
                        value={formatNumberAsPrice(
                            serviceSubtotal -
                                (serviceDiscountType?.value !==
                                ContractFormEditorDiscountType.NONE
                                    ? serviceDiscountAmount || 0
                                    : 0),
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
