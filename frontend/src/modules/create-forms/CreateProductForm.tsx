'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    Control,
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateProductMutationVariables } from '@/api/graphql';
import { useCreateProduct } from '@/api/hooks';

import BrandField from '@/modules/create-forms/fields/BrandField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import ProductServicesField, {
    ProductsServicesFieldFormValues,
} from './fields/ProductServicesField';
import ProductsStockField, {
    ProductsStockFieldFormValues,
} from './fields/ProductsStockField';
import ProductsSuppliersField, {
    ProductsSuppliersFieldFormValues,
} from './fields/ProductsSuppliersField';
import ProductTypeField from './fields/ProductTypeField';
import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreateProductMutationVariables['productData'];

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
    control: Control<FormValues>;
};

const ProductDataStep: React.FC<FieldsComponentProps> = ({ formErrors, control }) => (
    <>
        <RHFFormField className="flex-1" fieldID="sku" label="Sku" showRequired>
            <Input
                id="sku"
                name="sku"
                placeholder="XYZ12345"
                hasError={!!formErrors.sku}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField className="flex-1" fieldID="name" label="Nombre" showRequired>
            <Input
                id="name"
                name="name"
                placeholder="Lavandina"
                hasError={!!formErrors.name}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField
            className="flex-1"
            fieldID="description"
            label="Descripcion"
            showRequired
        >
            <Input
                id="description"
                name="description"
                placeholder="Descripción"
                hasError={!!formErrors.description}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>

        <RHFFormField fieldID="brand" label="Marca" showRequired>
            <BrandField />
        </RHFFormField>

        <RHFFormField className="flex-1" fieldID="type" label="Tipo" showRequired>
            <ProductTypeField />
        </RHFFormField>

        <RHFFormField fieldID="price" label="Precio" showRequired>
            <Input
                type="price"
                id="price"
                name="price"
                placeholder="0.00"
                hasError={!!formErrors.price}
                control={control}
                rules={{ required: true }}
            />
        </RHFFormField>
    </>
);

const ProductServicesStep: React.FC = () => (
    <>
        <RHFFormField fieldID="services" label="Servicios">
            <ProductServicesField />
        </RHFFormField>
    </>
);

const ProductSuppliersStep: React.FC = () => (
    <>
        <RHFFormField fieldID="suppliers" label="Proveedores">
            <ProductsSuppliersField />
        </RHFFormField>
    </>
);

const ProductsStockStep: React.FC = () => (
    <>
        <RHFFormField fieldID="stock" label="Stock">
            <ProductsStockField />
        </RHFFormField>
    </>
);

type Step = {
    key: string;
    title: string;
    description: string;
    Component: React.FC<FieldsComponentProps>;
    fields: (keyof FormValues)[];
};

const STEPS: Step[] = [
    {
        key: 'product-data',
        title: 'Información de Producto',
        description: 'Información basica del producto',
        Component: ProductDataStep,
        fields: ['sku', 'name', 'description', 'brandId', 'type', 'price'],
    },
    {
        key: 'product-services',
        title: 'Servicios',
        description: 'Crea los servicios asociados al producto si los tiene',
        Component: ProductServicesStep,
        fields: ['services'],
    },
    {
        key: 'product-suppliers',
        title: 'Proveedores',
        description: 'Añade los proveedores del producto si los tiene',
        Component: ProductSuppliersStep,
        fields: ['suppliers'],
    },
    {
        key: 'product-stock',
        title: 'Stock',
        description: 'Añade el stock del producto si es que tiene',
        Component: ProductsStockStep,
        fields: ['stock'],
    },
];

const CreateProductForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger, control } = useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

    const { mutate } = useCreateProduct({
        onSuccess: (data) => {
            const error = data.createProduct?.error;
            const product = data.createProduct?.product;
            if (error) {
                toast.error(error);
            }

            if (product) {
                toast.success('Producto creado exitosamente');
                router.push('/productos');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al crear el producto');
        },
    });

    // en este ver lo de localityId
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({
            productData: {
                ...data,
                brandId: (data.brandId as any).value,
                type: (data.type as any).value,
                stock: (
                    data.stock as unknown as ProductsStockFieldFormValues['stock']
                ).map((stock) => {
                    return {
                        stock: parseInt(stock.stock as unknown as string, 10),
                        officeId: stock.office.value,
                    };
                }),
                services: (
                    data.services as unknown as ProductsServicesFieldFormValues['services']
                ).map((service) => {
                    return {
                        name: service.name,
                        price: service.price,
                    };
                }),
                suppliers: (
                    data.suppliers as unknown as ProductsSuppliersFieldFormValues['suppliers']
                ).map((data) => {
                    return {
                        supplierId: data.supplier.value,
                        price: data.price.toString(),
                    };
                }),
            },
        });
    };

    const handlePreviousStep = () => {
        if (activeStep === 0) {
            return;
        }

        setActiveStep(activeStep - 1);
    };

    const handleNextStep = async () => {
        if (activeStep === STEPS.length - 1) {
            return;
        }

        const currentStepFields = STEPS[activeStep].fields;
        const stepFieldsAreValid = await trigger(currentStepFields);

        if (stepFieldsAreValid) {
            setActiveStep(activeStep + 1);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 py-14">
            <div className="container flex flex-1">
                <div className="w-3/12 rounded-l-xl bg-gray-300 pl-8 pt-6">
                    <Link
                        href="/"
                        className="block font-headings text-3xl font-black tracking-widest text-gray-700"
                    >
                        SENDA
                    </Link>
                </div>
                <div className="flex w-9/12 flex-col rounded-r-xl bg-white px-14 pt-6">
                    <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                        <h1 className="text-2xl font-bold">Crea un producto</h1>

                        <span className="text-xs text-gray-500">
                            Paso {activeStep + 1} de {STEPS.length}
                        </span>
                    </div>

                    <FormProvider {...useFormMethods}>
                        {STEPS.map(({ title, description, Component, key }, index) => (
                            <div
                                className={clsx(
                                    'mb-20 w-9/12',
                                    activeStep !== index && 'hidden',
                                )}
                                key={key}
                            >
                                <h2 className="text-lg font-bold">{title}</h2>
                                <p className="mb-6 text-gray-600">{description}</p>

                                <form className="space-y-4">
                                    <Component
                                        formErrors={formErrors}
                                        register={register}
                                        control={control}
                                    />
                                </form>
                            </div>
                        ))}
                    </FormProvider>

                    <NavigationButtons
                        isLastStep={activeStep === STEPS.length - 1}
                        onPrevious={handlePreviousStep}
                        onNext={handleNextStep}
                        onSubmit={handleSubmit(onSubmit)}
                        {...props}
                    />
                </div>
            </div>
        </main>
    );
};

export default CreateProductForm;
