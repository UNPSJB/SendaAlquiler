import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { useFormContext } from 'react-hook-form';

import FormFieldError from './FormFieldError';
import FormFieldHelp from './FormFieldHelp';
import Label from './Label';
import { getReactHookFormFieldError } from './utils';

type FormFieldProps = PropsWithChildren<{
    fieldID: string;
    label: string;
    helpText?: string;
    errorMessage?: string | null | undefined;
    className?: string;
    showRequired?: boolean;
}>;

/**
 * FormField - A wrapper component that displays a form field with its label, error, and help text.
 */
export const FormField: React.FC<FormFieldProps> = (props) => {
    const { fieldID, errorMessage, helpText, label, className, showRequired, children } =
        props;

    return (
        <div className={clsx('space-y-2', className)} id={`${fieldID}-field`}>
            <Label label={label} htmlFor={fieldID} showRequired={showRequired}>
                {children}
            </Label>

            {errorMessage && (
                <FormFieldError fieldID={fieldID}>{errorMessage}</FormFieldError>
            )}

            {helpText && <FormFieldHelp fieldID={fieldID}>{helpText}</FormFieldHelp>}
        </div>
    );
};

type RHFFormField = Omit<FormFieldProps, 'errorMessage'>;

/**
 * RHFFormField - A FormField wrapper that automatically fetches the error message from react-hook-form's context.
 */
export const RHFFormField: React.FC<RHFFormField> = (props) => {
    const {
        formState: { errors },
    } = useFormContext();
    const errorMessage = getReactHookFormFieldError(errors[props.fieldID]);

    return <FormField {...props} errorMessage={errorMessage} />;
};
