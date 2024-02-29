'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { DefaultValues, FieldValues, FormProvider, Path, useForm } from 'react-hook-form';

import NavigationButtons, {
    NavigationButtonsCancelProps,
} from './components/NavigationButtons';

import DashboardLayout from '../dashboard/DashboardLayout';

export type ModableFormLayoutComponentProps = {
    isEditing?: boolean;
};

export type ModableFormLayoutStep<T extends FieldValues> = {
    key: string;
    title: string;
    description: string | React.FC;
    Component: React.FC<ModableFormLayoutComponentProps>;
    fields: Path<T>[];
    isVisible?: (data: T) => boolean;
};

type ModableFormLayoutProps<T extends FieldValues> = {
    mutate: (data: T) => void;
    isMutating: boolean;
    defaultValues?: DefaultValues<T>;
    title: string;
    steps: ReadonlyArray<ModableFormLayoutStep<T>>;
} & NavigationButtonsCancelProps;

export type ModableFormComponentProps<T extends FieldValues> = Omit<
    ModableFormLayoutProps<T>,
    'steps' | 'title'
> &
    NavigationButtonsCancelProps;

const ModableFormLayout = <T extends FieldValues>({
    mutate,
    isMutating: _isMutating,
    defaultValues,
    title,
    steps,
    ...props
}: ModableFormLayoutProps<T>) => {
    const useFormMethods = useForm<T>({ defaultValues, reValidateMode: 'onChange' });
    const { handleSubmit, trigger } = useFormMethods;

    const [activeStep, setActiveStep] = useState(0);

    const handlePreviousStep = () => {
        if (activeStep === 0) {
            return;
        }

        setActiveStep(activeStep - 1);
    };

    const handleNextStep = async () => {
        if (activeStep === steps.length - 1) {
            return;
        }

        const currentStepFields = steps[activeStep].fields;
        const stepFieldsAreValid = await trigger(currentStepFields);

        if (stepFieldsAreValid) {
            setActiveStep(activeStep + 1);
        }
    };

    const watchedValues = useFormMethods.watch();
    const visibleSteps = steps.filter(
        ({ isVisible }) => typeof isVisible === 'undefined' || isVisible(watchedValues),
    );

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between px-8 py-6">
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <FormProvider {...useFormMethods}>
                {visibleSteps.map(
                    ({ title, description: Description, Component, key }, index) => (
                        <div
                            className={clsx(
                                'mb-20 px-8',
                                activeStep !== index && 'hidden',
                            )}
                            key={key}
                        >
                            {/* <h2 className="text-lg font-bold">{title}</h2>
                            <p className="mb-6 text-gray-600">
                                {typeof Description === 'string' ? (
                                    Description
                                ) : (
                                    <Description />
                                )}
                            </p> */}

                            <form className="space-y-4">
                                <Component isEditing={!!defaultValues} />
                            </form>
                        </div>
                    ),
                )}
            </FormProvider>

            <NavigationButtons
                isUniqueStep={visibleSteps.length === 1}
                isLastStep={activeStep === visibleSteps.length - 1}
                onPrevious={handlePreviousStep}
                onNext={handleNextStep}
                onSubmit={handleSubmit(mutate)}
                {...props}
            />
        </DashboardLayout>
    );
};

export default ModableFormLayout;
