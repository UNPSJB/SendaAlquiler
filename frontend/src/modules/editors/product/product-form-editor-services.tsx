import { Trash } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ProductServiceBillingTypeChoices } from '@/api/graphql';

import { ProductFormEditorValues } from './product-form-editor';

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
import { formatNumberAsPrice, inputToNumber } from '@/lib/utils';

const MAX_PRICE = 9999999999;

export const ProductFormEditorServices = () => {
    const formMethods = useFormContext<ProductFormEditorValues>();

    const servicesFieldArray = useFieldArray({
        name: 'services',
        control: formMethods.control,
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Servicios</h2>

            {servicesFieldArray.fields.map((field, index) => {
                return (
                    <div
                        className="space-y-4 rounded-lg border border-muted p-4 shadow-sm"
                        key={field.id}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold">Servicio #{index + 1}</h3>

                            <Button
                                variant="outline"
                                onClick={() => {
                                    servicesFieldArray.remove(index);
                                }}
                            >
                                <Trash className="size-4" />
                            </Button>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex space-x-4">
                                <FormField
                                    name={`services.${index}.service.label`}
                                    control={formMethods.control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => (
                                        <FormItem className="flex w-1/2 flex-col">
                                            <FormLabel required>Nombre</FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name={`services.${index}.price`}
                                    control={formMethods.control}
                                    rules={{
                                        validate: (value) => {
                                            if (!value) {
                                                return 'El precio es requerido';
                                            }

                                            if (value < 0) {
                                                return 'El precio no puede ser negativo';
                                            }

                                            if (value > MAX_PRICE) {
                                                return 'El precio no puede ser mayor a 99.999.999,99';
                                            }

                                            return true;
                                        },
                                    }}
                                    render={({ field }) => {
                                        const valueAsPrice = field.value
                                            ? formatNumberAsPrice(field.value)
                                            : '';

                                        return (
                                            <FormItem className="flex w-1/2 flex-col">
                                                <FormLabel required>Precio</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(
                                                                inputToNumber(
                                                                    e.target.value,
                                                                    {
                                                                        min: 0,
                                                                        max: MAX_PRICE,
                                                                    },
                                                                ),
                                                            );
                                                        }}
                                                        value={valueAsPrice}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                            </div>

                            <div className="flex space-x-4">
                                <FormField
                                    name={`services.${index}.billingType`}
                                    control={formMethods.control}
                                    rules={{
                                        required: 'Este campo es requerido',
                                    }}
                                    render={({ field }) => (
                                        <FormItem className="flex w-1/2 flex-col">
                                            <FormLabel required>
                                                Tipo de facturación
                                            </FormLabel>

                                            <FormControl>
                                                <ComboboxSimple
                                                    onChange={field.onChange}
                                                    options={[
                                                        {
                                                            value: ProductServiceBillingTypeChoices.Custom,
                                                            label: 'Personalizado',
                                                        },
                                                        {
                                                            value: ProductServiceBillingTypeChoices.Monthly,
                                                            label: 'Mensual',
                                                        },
                                                        {
                                                            value: ProductServiceBillingTypeChoices.OneTime,
                                                            label: 'Una vez',
                                                        },
                                                        {
                                                            value: ProductServiceBillingTypeChoices.Weekly,
                                                            label: 'Semanal',
                                                        },
                                                    ]}
                                                    value={field.value || null}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name={`services.${index}.billingPeriod`}
                                    control={formMethods.control}
                                    disabled={
                                        formMethods.watch(`services.${index}.billingType`)
                                            ?.value !==
                                        ProductServiceBillingTypeChoices.Custom
                                    }
                                    rules={{
                                        validate: (value) => {
                                            if (
                                                formMethods.getValues(
                                                    `services.${index}.billingType`,
                                                )?.value ===
                                                    ProductServiceBillingTypeChoices.Custom &&
                                                !value
                                            ) {
                                                return 'Este campo es requerido';
                                            }

                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem className="flex w-1/2 flex-col">
                                            <FormLabel required>
                                                Periodo de facturación
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            inputToNumber(
                                                                e.target.value,
                                                                {
                                                                    min: 0,
                                                                    max: 999,
                                                                },
                                                            ),
                                                        );
                                                    }}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>

                                            <FormDescription>
                                                Cada cuantos días se facturará este
                                                servicio (aplicable para tipo de
                                                facturación &ldquo;Personalizado&rdquo;)
                                            </FormDescription>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            <Button
                type="button"
                variant="outline"
                onClick={() => {
                    servicesFieldArray.append({
                        service: {
                            label: '',
                            value: null,
                        },
                        price: null,
                    });
                }}
            >
                + Agregar servicio
            </Button>
        </div>
    );
};
