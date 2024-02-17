'use client';

import Link from 'next/link';

import clsx from 'clsx';
import { useState } from 'react';
import { DefaultValues, FieldValues, FormProvider, Path, useForm } from 'react-hook-form';

import NavigationButtons, {
    NavigationButtonsCancelProps,
} from './components/NavigationButtons';

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
                        <h1 className="text-2xl font-bold">{title}</h1>

                        <span className="text-xs text-muted-foreground">
                            Paso {activeStep + 1} de {visibleSteps.length}
                        </span>
                    </div>

                    <FormProvider {...useFormMethods}>
                        {visibleSteps.map(
                            (
                                { title, description: Description, Component, key },
                                index,
                            ) => (
                                <div
                                    className={clsx(
                                        'mb-20 w-9/12',
                                        activeStep !== index && 'hidden',
                                    )}
                                    key={key}
                                >
                                    <h2 className="text-lg font-bold">{title}</h2>
                                    <p className="mb-6 text-gray-600">
                                        {typeof Description === 'string' ? (
                                            Description
                                        ) : (
                                            <Description />
                                        )}
                                    </p>

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
                </div>
            </div>
        </main>
    );
};

export default ModableFormLayout;
