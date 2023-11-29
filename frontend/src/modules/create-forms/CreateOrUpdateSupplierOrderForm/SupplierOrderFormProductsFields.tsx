import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';

import { CreateOrUpdateSupplierOrderFormValues } from '.';
import ProductsFromSupplierField from '../components/fields/ProductsFromSupplierField';

const SupplierOrderFormProductsFields: React.FC = () => {
    const { watch, setValue } = useFormContext<CreateOrUpdateSupplierOrderFormValues>();
    const supplier = watch('supplier')?.value;

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'supplier') {
                setValue('products', []);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    if (typeof supplier === 'undefined') {
        return (
            <FetchStatusMessageWithDescription
                title="Selecciona un proveedor"
                line1="Para continuar, selecciona un proveedor"
            />
        );
    }

    return <ProductsFromSupplierField office={supplier} />;
};

export default SupplierOrderFormProductsFields;
