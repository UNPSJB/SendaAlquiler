import { useFormContext } from 'react-hook-form';

import { fetchClient } from '@/api/fetch-client';
import { ProductExistsDocument } from '@/api/graphql';

import { RHFFormField } from '@/modules/forms/FormField';
import RHFInput from '@/modules/forms/Input';

import { CreateOrUpdateProductFormValues } from '.';
import BrandField from '../components/fields/BrandField';
import ProductTypeField from '../components/fields/ProductTypeField';

const ProductFormBasicFields: React.FC = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext<CreateOrUpdateProductFormValues>();

    return (
        <>
            <RHFFormField className="flex-1" fieldID="sku" label="Sku" showRequired>
                <RHFInput
                    id="sku"
                    name="sku"
                    placeholder="XYZ12345"
                    hasError={!!errors.sku}
                    control={control}
                    rules={{
                        required: true,
                        validate: async (value) => {
                            const response = await fetchClient(ProductExistsDocument, {
                                sku: value,
                            });

                            return response.productExists
                                ? 'Ya existe un producto con ese SKU'
                                : true;
                        },
                    }}
                />
            </RHFFormField>

            <RHFFormField className="flex-1" fieldID="name" label="Nombre" showRequired>
                <RHFInput
                    id="name"
                    name="name"
                    placeholder="Lavandina"
                    hasError={!!errors.name}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>

            <RHFFormField className="flex-1" fieldID="description" label="Descripcion">
                <RHFInput
                    id="description"
                    name="description"
                    placeholder="Descripción"
                    hasError={!!errors.description}
                    control={control}
                />
            </RHFFormField>

            <RHFFormField fieldID="brand" label="Marca" showRequired>
                <BrandField<CreateOrUpdateProductFormValues, 'brand'>
                    name="brand"
                    control={control}
                    placeholder="Selecciona una marca"
                />
            </RHFFormField>

            <RHFFormField className="flex-1" fieldID="type" label="Tipo" showRequired>
                <ProductTypeField />
            </RHFFormField>

            <RHFFormField fieldID="price" label="Precio" showRequired>
                <RHFInput
                    type="price"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    hasError={!!errors.price}
                    control={control}
                    rules={{ required: true }}
                />
            </RHFFormField>
        </>
    );
};

export default ProductFormBasicFields;
