'use client';

import { CreateProductMutationVariables, ProductTypeChoices } from '@/api/graphql';

import { BrandFieldValue } from '@/modules/create-forms/components/fields/BrandField';

import ProductFormBasicFields from './ProductFormBasicFields';
import ProductFormServicesFields from './ProductFormServicesFields';
import ProductFormSupplierAndStockFields from './ProductFormSupplierAndStockFields';

import { ProductsServicesFieldFormValues } from '../components/fields/ProductServicesField';
import { ProductsStockFieldFormValues } from '../components/fields/ProductsStockField';
import { ProductsSuppliersFieldFormValues } from '../components/fields/ProductsSuppliersField';
import ModableFormLayout, {
    ModableFormComponentProps,
    ModableFormLayoutStep,
} from '../ModableFormLayout';

export type CreateOrUpdateProductFormValues = Omit<
    CreateProductMutationVariables['productData'],
    'brandId' | 'stock' | 'type' | 'suppliers'
> & {
    brand: BrandFieldValue | undefined;
    type:
        | {
              value: ProductTypeChoices;
              label: string;
          }
        | undefined;
    suppliers?: ProductsSuppliersFieldFormValues['suppliers'] | undefined;
    stock?: ProductsStockFieldFormValues['stock'] | undefined;
    services?: ProductsServicesFieldFormValues['services'] | undefined;
};

const STEPS: ModableFormLayoutStep<CreateOrUpdateProductFormValues>[] = [
    {
        key: 'product-data',
        title: 'Información de Producto',
        description: 'Información basica del producto',
        Component: ProductFormBasicFields,
        fields: ['sku', 'name', 'description', 'brand', 'type', 'price'],
    },
    {
        key: 'product-services',
        title: 'Servicios',
        description:
            'Crea los servicios asociados al producto si los tiene. Los servicios son exclusivos entre sí.',
        Component: ProductFormServicesFields,
        fields: ['services'],
        isVisible: (values) => values.type?.value === ProductTypeChoices.Alquilable,
    },
    {
        key: 'product-suppliers',
        title: 'Proveedores y stock',
        description: 'Añade los proveedores del producto si los tiene',
        Component: ProductFormSupplierAndStockFields,
        fields: ['suppliers', 'stock'],
    },
];

type Props = ModableFormComponentProps<CreateOrUpdateProductFormValues>;

const CreateOrUpdateProductForm: React.FC<Props> = ({ defaultValues, ...props }) => {
    return (
        <ModableFormLayout
            steps={STEPS}
            title={defaultValues ? 'Editar producto' : 'Crear producto'}
            {...props}
        />
    );
};

export default CreateOrUpdateProductForm;
