import { differenceInDays, differenceInMonths, differenceInWeeks } from 'date-fns';
import { Trash } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { CoreProductServiceBillingTypeChoices } from '@/api/graphql';

import { ContractFormEditorValues } from './contract-form-editor';
import { ContractFormEditorDiscountType } from './contract-form-editor';

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

type CalculateServiceSubtotalOptions = {
    service: ServiceItemProps['product']['data']['services'][0];
    startDatetime: Date | undefined | null;
    endDatetime: Date | undefined | null;
};

const calculateServiceSubtotal = (props: CalculateServiceSubtotalOptions) => {
    const { service } = props;

    if (service.billingType === CoreProductServiceBillingTypeChoices.OneTime) {
        return service.price;
    }

    if (!props.startDatetime || !props.endDatetime) {
        return 0;
    }

    const days = differenceInDays(props.endDatetime, props.startDatetime);
    const weeks = differenceInWeeks(props.endDatetime, props.startDatetime);
    const months = differenceInMonths(props.endDatetime, props.startDatetime);

    let subtotal = 0;
    if (
        service.billingType === CoreProductServiceBillingTypeChoices.Custom &&
        service.billingPeriod
    ) {
        subtotal = service.price * (days / service.billingPeriod);
    }

    if (service.billingType === CoreProductServiceBillingTypeChoices.Weekly) {
        subtotal = service.price * weeks;
    }

    if (service.billingType === CoreProductServiceBillingTypeChoices.Monthly) {
        subtotal = service.price * months;
    }

    return subtotal;
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

    let serviceSubtotal = 0;
    if (
        price &&
        watchedField?.service?.data &&
        (billingType === CoreProductServiceBillingTypeChoices.OneTime ||
            (startDatetime && endDatetime))
    ) {
        serviceSubtotal = calculateServiceSubtotal({
            service: watchedField?.service?.data,
            startDatetime: startDatetime,
            endDatetime: endDatetime,
        });
    }

    return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold">Servicio #{index + 1}</h3>

                <Button variant="outline" onClick={onDelete}>
                    <Trash className="h-4 w-4" />
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
                        billingType !== CoreProductServiceBillingTypeChoices.OneTime && (
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
                                        field.value
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
