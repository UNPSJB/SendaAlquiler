'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {
    FormProvider,
    FormState,
    SubmitHandler,
    UseFormRegister,
    useForm,
    useFormContext,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { useCreateInternalOrder } from '@/api/hooks';

import RHFOfficesField, { OfficesFieldValue } from './fields/OfficesField';
import ProductsFromOfficeField from './fields/ProductsFromOfficeField';
import NavigationButtons, { NavigationButtonsCancelProps } from './NavigationButtons';

import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';

import { RHFFormField } from '../forms/FormField';

type FormValues = {
    officeBranch: OfficesFieldValue;
    officeDestination: OfficesFieldValue;
    products: {
        product: {
            value: string;
            label: string;
        };
        quantity: number;
    }[];
};

type FieldsComponentProps = {
    formErrors: FormState<FormValues>['errors'];
    register: UseFormRegister<FormValues>;
};

const OfficesDataStep: React.FC<FieldsComponentProps> = () => {
    const { watch, control } = useFormContext<FormValues>();
    const officeBranch = watch('officeBranch');
    const officeDestination = watch('officeDestination');

    return (
        <>
            <RHFFormField fieldID="officeBranch" label="Sucursal de origen" showRequired>
                <RHFOfficesField<FormValues, 'officeBranch'>
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="officeBranch"
                    officeToExclude={officeDestination?.value}
                />
            </RHFFormField>

            <RHFFormField
                fieldID="officeDestination"
                label="Sucursal de destino"
                showRequired
            >
                <RHFOfficesField
                    control={control}
                    placeholder="Selecciona una sucursal"
                    name="officeDestination"
                    officeToExclude={officeBranch?.value}
                />
            </RHFFormField>
        </>
    );
};

const ProductsDataStep: React.FC<FieldsComponentProps> = () => {
    const { watch } = useFormContext<FormValues>();
    const officeBranch = watch('officeBranch')?.value;

    if (typeof officeBranch === 'undefined') {
        return (
            <FetchStatusMessageWithDescription
                title="Selecciona una sucursal de origen"
                line1="Para continuar, selecciona una sucursal de origen"
            />
        );
    }

    return <ProductsFromOfficeField office={officeBranch} />;
};

type Step = {
    key: string;
    title: string;
    Description: React.FC;
    Component: React.FC<FieldsComponentProps>;
    fields: (keyof FormValues)[];
};

const ProductsDataStepDescription = () => {
    const { watch } = useFormContext<FormValues>();
    const originOffice = watch('officeBranch');
    const destinationOffice = watch('officeDestination');

    return (
        <>
            Lista de productos a pedir desde{' '}
            <b>
                <em>{originOffice?.label}</em>
            </b>{' '}
            a{' '}
            <b>
                <em>{destinationOffice?.label}</em>
            </b>
        </>
    );
};

const STEPS: Step[] = [
    {
        key: 'suppliers-data',
        title: 'Origen y destino',
        Description: () => 'Información de origen y destino del pedido',
        Component: OfficesDataStep,
        fields: ['officeBranch', 'officeDestination'],
    },
    {
        key: 'products-data',
        title: 'Productos',
        Description: ProductsDataStepDescription,
        Component: ProductsDataStep,
        fields: ['products'],
    },
];

const CreateInternalOrderForm: React.FC<NavigationButtonsCancelProps> = (props) => {
    const useFormMethods = useForm<FormValues>();
    const { register, handleSubmit, formState, trigger, watch, setValue } =
        useFormMethods;
    const formErrors = formState.errors;

    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'officeBranch') {
                setValue('products', []);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const { mutate } = useCreateInternalOrder({
        onSuccess: (data) => {
            const error = data.createInternalOrder?.error;
            const internalOrder = data.createInternalOrder?.internalOrder;

            if (error) {
                toast.error(error);
            }

            if (internalOrder) {
                toast.success('Pedido creado exitosamente');
                router.push('/pedidos-internos');
            }
        },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const { officeBranch, officeDestination, products } = data;
        if (!officeBranch || !officeDestination || !products) return;

        mutate({
            data: {
                officeBranchId: officeBranch.value,
                officeDestinationId: officeDestination.value,
                products: products.map((product) => {
                    return {
                        id: product.product.value,
                        quantity: product.quantity,
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
                        <h1 className="text-2xl font-bold">Crea un pedido interno</h1>

                        <span className="text-xs text-gray-500">
                            Paso {activeStep + 1} de {STEPS.length}
                        </span>
                    </div>

                    <FormProvider {...useFormMethods}>
                        {STEPS.map(({ title, Description, Component, key }, index) => (
                            <div
                                className={clsx(
                                    'mb-20 w-9/12',
                                    activeStep !== index && 'hidden',
                                )}
                                key={key}
                            >
                                <h2 className="text-lg font-bold">{title}</h2>
                                <p className="mb-6 text-gray-600">
                                    <Description />
                                </p>

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

export default CreateInternalOrderForm;
