import { RHFFormField } from '@/modules/forms/FormField';

import ProductServicesField from '../components/fields/ProductServicesField';

const ProductFormServicesFields: React.FC = () => {
    return (
        <>
            <RHFFormField fieldID="services" label="Servicios">
                <ProductServicesField />
            </RHFFormField>
        </>
    );
};

export default ProductFormServicesFields;
