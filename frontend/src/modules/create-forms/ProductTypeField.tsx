import { Controller, useFormContext } from 'react-hook-form';
import ReactSelect from 'react-select';

import { ProductTypeChoices } from '@/api/graphql';

const ProductTypeField: React.FC = () => {
    const { control: contextControl } = useFormContext();

    return (
        <Controller
            name="type"
            control={contextControl}
            render={({ field: { onChange, value } }) => (
                <ReactSelect
                    classNamePrefix="react-select"
                    options={[
                        {
                            label: 'Alquilable',
                            value: ProductTypeChoices.Alquilable,
                        },
                        {
                            label: 'Comerciable',
                            value: ProductTypeChoices.Comerciable,
                        },
                    ]}
                    placeholder="Selecciona un tipo de producto"
                    value={value}
                    onChange={(val) => {
                        if (!val) return;

                        onChange({
                            value: val.value,
                            label: val.label,
                        });
                    }}
                />
            )}
        />
    );
};

export default ProductTypeField;
