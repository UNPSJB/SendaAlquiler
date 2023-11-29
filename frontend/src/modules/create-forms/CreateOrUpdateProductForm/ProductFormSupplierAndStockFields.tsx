import { RHFFormField } from '@/modules/forms/FormField';

import ProductsStockField from '../components/fields/ProductsStockField';
import ProductsSuppliersField from '../components/fields/ProductsSuppliersField';

const ProductFormSupplierAndStockFields: React.FC = () => {
    return (
        <>
            <RHFFormField fieldID="suppliers" label="Proveedores">
                <ProductsSuppliersField />
            </RHFFormField>

            <RHFFormField fieldID="stock" label="Stock">
                <ProductsStockField />
            </RHFFormField>
        </>
    );
};

export default ProductFormSupplierAndStockFields;
