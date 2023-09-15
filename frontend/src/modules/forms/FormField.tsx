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
}>;

/**
 * FormField - A wrapper component that displays a form field with its label, error, and help text.
 */
const FormField: React.FC<FormFieldProps> = (props) => {
    const { fieldID, errorMessage, helpText, label, children } = props;

    return (
        <div className="form-field space-y-2" id={`${fieldID}-field`}>
            <Label label={label} htmlFor={fieldID}>
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
