'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useState } from 'react';
import {
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateProductMutationVariables } from '@/api/graphql';
import { useCreateProduct } from '@/api/hooks';

import BrandField from '@/modules/create-forms/BrandField';
import ServiceField from '@/modules/create-forms/ServiceField';
import { RHFFormField } from '@/modules/forms/FormField';
import Input from '@/modules/forms/Input';

import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

type FormValues = CreateProductMutationVariables['productData'];

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
}


const ProductDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
    <>
        <RHFFormField
            className="flex-1"
            fieldID="sku"
            label="Sku"
            showRequired
        >
            <Input
                id="sku"
                placeholder="XYZ12345"
                hasError={!!formErrors.firstName}
                {...register('sku', { required: true })}
            />
        </RHFFormField>


        <RHFFormField
            className="flex-1"
            fieldID="name"
            label="Nombre"
            showRequired
        >
            <Input
                id="name"
                placeholder="Lavandina"
                hasError={!!formErrors.lastName}
                {...register('name', { required: true })}
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
                placeholder="Descripción"
                hasError={!!formErrors.lastName}
                {...register('description', { required: true })}
            />
        </RHFFormField>

        <RHFFormField
            // className="flex-1"
            fieldID="brand"
            label="Marca"
            showRequired
        >
            <BrandField />
        </RHFFormField>

        <RHFFormField
            className="flex-1"
            fieldID="type"
            label="Tipo"
            showRequired
        >
            {/* <Input
                id="type"
                placeholder="Ayudin"
                hasError={!!formErrors.lastName}
                {...register('brand', { required: true })}
            /> */}
            <select id="type" {...register('type', { required: true })}>
                <option value="ALQUILABLE">ALQUILABLE</option>
                <option value="COMERCIABLE">COMERCIABLE</option>
            </select>
        </RHFFormField>

        <RHFFormField
            //className="flex-1"
            fieldID="price"
            label="Precio"
            showRequired
        >
            <Input
                type="number"
                id="price"
                placeholder="0.00"
                hasError={!!formErrors.lastName}
                {...register('price', {
                    required: true,
                    maxLength: 1000000,
                })}
            />
        </RHFFormField>
    </>
);

const ProductExtraDataStep: React.FC<FieldsComponentProps> = ({ formErrors, register }) => (
    <>
        {/* Aca deberia ir algo de stock */}

        <RHFFormField fieldID="services" label="Servicios" showRequired>
            <ServiceField />
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
        fields: ['sku', 'name', 'description', 'brand', 'type', 'price'],
    },
    {
        key: 'product-extra-data',
        title: 'Información adicional',
        description: 'Información del stock y servicios del producto',
        Component: ProductExtraDataStep,
        fields: ['services',],
    },
];

const CreateProductForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger } = useFormMethods;
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
    });


// en este ver lo de localityId
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        mutate({
            productData: {
                ...data,
                localityId: (data.localityId as any).value,
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