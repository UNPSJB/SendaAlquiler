import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';

import { CreateOrUpdateInternalOrderFormValues } from '.';
import ProductsFromOfficeField from '../components/fields/ProductsFromOfficeField';

const InternalOrderFormProductsFields: React.FC = () => {
    const { watch, setValue } = useFormContext<CreateOrUpdateInternalOrderFormValues>();
    const sourceOffice = watch('sourceOffice')?.value;

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'sourceOffice') {
                setValue('products', []);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    if (typeof sourceOffice === 'undefined') {
        return (
            <FetchStatusMessageWithDescription
                title="Selecciona una sucursal de origen"
                line1="Para continuar, selecciona una sucursal de origen"
            />
        );
    }

    return <ProductsFromOfficeField office={sourceOffice} />;
};

export default InternalOrderFormProductsFields;
