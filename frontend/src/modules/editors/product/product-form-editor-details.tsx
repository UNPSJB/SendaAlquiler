import { useFormContext } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { ProductExistsDocument, ProductTypeChoices } from '@/api/graphql';
import { useBrands, useCreateBrand } from '@/api/hooks';

import { ProductFormEditorValues } from './product-form-editor';

import { ComboboxCreatable, ComboboxSimple } from '@/components/combobox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatNumberAsPrice, inputToNumber } from '@/lib/utils';

const MAX_PRICE = 9999999999;

type Props = {
    originalSku?: string | null;
};

export const ProductFormEditorDetails = ({ originalSku }: Props) => {
    const formMethods = useFormContext<ProductFormEditorValues>();

    const brandsQuery = useBrands();
    const brandMutation = useCreateBrand();

    const onCreateBrand = (inputValue: string) => {
        brandMutation.mutate(
            {
                name: inputValue.trim(),
            },
            {
                onSuccess: (data) => {
                    const brand = data.createBrand?.brand;
                    if (!brand) return;

                    formMethods.setValue('brand', {
                        label: brand.name,
                        value: brand.id,
                    });
                },
            },
        );
    };

    const watchedType = formMethods.watch('type');

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Detalles del Producto</h2>
            <FormField
                name="sku"
                rules={{
                    required: 'El SKU es requerido',
                    validate: async (value) => {
                        if (value === originalSku || !value) {
                            return true;
                        }

                        const response = await fetchClient(ProductExistsDocument, {
                            sku: value,
                        });

                        return response.productExists
                            ? 'Ya existe un producto con ese SKU'
                            : true;
                    },
                }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>SKU</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="name"
                rules={{ required: 'El nombre es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Nombre</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="description"
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descripcion</FormLabel>

                        <FormControl>
                            <Textarea {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="brand"
                rules={{ required: 'La marca es requerida' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required>Marca</FormLabel>

                        <FormControl>
                            <ComboboxCreatable
                                placeholder={
                                    brandMutation.isPending || brandsQuery.isPending
                                        ? 'Cargando marcas...'
                                        : 'Selecciona una marca'
                                }
                                onChange={(option) => {
                                    field.onChange(option);
                                }}
                                onCreateOption={(inputValue) => {
                                    onCreateBrand(inputValue);
                                }}
                                options={(brandsQuery.data
                                    ? brandsQuery.data.brands
                                    : []
                                ).map((brand) => {
                                    return {
                                        label: brand.name,
                                        value: brand.id,
                                    };
                                })}
                                value={field.value || null}
                                isDisabled={
                                    brandsQuery.isPending || brandMutation.isPending
                                }
                                isLoading={
                                    brandsQuery.isPending || brandMutation.isPending
                                }
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                name="type"
                rules={{ required: 'El tipo es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required>Tipo</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                placeholder="Selecciona un tipo"
                                options={[
                                    {
                                        label: 'Comerciable',
                                        value: ProductTypeChoices.Comerciable,
                                    },
                                    {
                                        label: 'Alquilable',
                                        value: ProductTypeChoices.Alquilable,
                                    },
                                ]}
                                onChange={(option) => {
                                    field.onChange(option);
                                }}
                                value={field.value || null}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="price"
                rules={{
                    required: 'El precio es requerido',
                    validate: (value) => {
                        if (!value) {
                            return true;
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
                control={formMethods.control}
                render={({ field }) => {
                    const valueAsPrice = field.value
                        ? formatNumberAsPrice(field.value)
                        : '';

                    return (
                        <FormItem>
                            <FormLabel required>Precio</FormLabel>

                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            inputToNumber(e.target.value, {
                                                min: 0,
                                                max: MAX_PRICE,
                                            }),
                                        );
                                    }}
                                    value={valueAsPrice}
                                />
                            </FormControl>

                            {watchedType?.value === ProductTypeChoices.Alquilable && (
                                <p className="text-sm text-gray-500">El precio por día</p>
                            )}

                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
};
