import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Button, { ButtonVariant } from '@/components/Button';

import { RHFFormField } from '../forms/FormField';
import Input from '../forms/Input';

export type ProductsServicesFieldFormValues = {
    services: {
        name: string;
        price: string;
    }[];
};

const ProductServicesField: React.FC = () => {
    const { register } = useFormContext<ProductsServicesFieldFormValues>();

    const [servicesToCreate, setServicesToCreate] = useState(1);

    const handleAddService = () => {
        setServicesToCreate((orders) => orders + 1);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {Array.from({ length: servicesToCreate }).map((_, index) => {
                    return (
                        <div
                            className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                            key={index}
                        >
                            <RHFFormField
                                fieldID={`service-${index}-name`}
                                label="Nombre"
                                className="flex-1"
                            >
                                <Input
                                    id={`service-${index}-name`}
                                    type="name"
                                    placeholder="1"
                                    min={1}
                                    {...register(`services.${index}.name`, {
                                        required: false,
                                    })}
                                />
                            </RHFFormField>

                            <RHFFormField
                                fieldID={`service-${index}-price`}
                                label="Precio"
                            >
                                <Input
                                    id={`service-${index}-price`}
                                    type="price"
                                    placeholder="1"
                                    min={1}
                                    {...register(`services.${index}.price`, {
                                        required: false,
                                        min: 1,
                                    })}
                                />
                            </RHFFormField>
                        </div>
                    );
                })}
            </div>

            <Button
                fullWidth
                variant={ButtonVariant.OUTLINE_WHITE}
                onClick={handleAddService}
            >
                + Añadir servicio
            </Button>
        </div>
    );
};

export default ProductServicesField;
