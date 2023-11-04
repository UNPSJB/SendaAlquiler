import { FieldErrors, RegisterOptions } from 'react-hook-form';

type DefaultErrors = Record<keyof Pick<RegisterOptions, 'required' | 'pattern'>, string>;

/**
 * Define the default error messages for specified field error types.
 */
const defaultErrors: DefaultErrors = {
    required: 'Este campo es requerido',
    pattern: 'El valor no es válido',
};

/**
 * Returns the error message for a given react-hook-form field error.
 * @param fieldError - The error object from react-hook-form.
 * @returns - The appropriate error message or null if none found.
 */
export const getReactHookFormFieldError = (
    fieldError: FieldErrors[string],
): string | null => {
    if (!fieldError) {
        return null;
    }

    const { type, message } = fieldError;
    console.log('fieldError', fieldError);
    console.log('type', type);
    console.log('message', message);

    if (message && typeof message === 'string') {
        return message;
    }

    if (type && typeof type === 'string' && type in defaultErrors) {
        return defaultErrors[type as keyof DefaultErrors];
    }

    return 'El valor del campo no es válido';
};

/**
 * Generates the unique ID for the help text element of a form field.
 * @param fieldID - The ID of the related form field.
 * @returns - The generated help text element ID.
 */
export const getFormFieldHelpElementID = (fieldID: string) => {
    return `${fieldID}-help`;
};

/**
 * Generates the unique ID for the error message element of a form field.
 * @param fieldID - The ID of the related form field.
 * @returns - The generated error message element ID.
 */
export const getFormFieldErrorElementID = (fieldID: string) => {
    return `${fieldID}-error`;
};

type GetFormFieldAriaPropsOptions = {
    fieldID: string;
    hasError: boolean;
    hasHelp: boolean;
};

/**
 * Generates ARIA properties for a form field to improve accessibility.
 * @param options - The options containing field ID, and indicators for help and error presence.
 * @returns - ARIA properties to be spread onto a form field element.
 */
export const getFormFieldAriaProps = ({
    fieldID,
    hasError,
    hasHelp,
}: GetFormFieldAriaPropsOptions) => {
    const helpID = getFormFieldHelpElementID(fieldID);
    const errorID = getFormFieldErrorElementID(fieldID);

    const describedBy = [];
    if (hasHelp) describedBy.push(helpID);
    if (hasError) describedBy.push(errorID);

    return {
        'aria-invalid': hasError,
        'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
    };
};
