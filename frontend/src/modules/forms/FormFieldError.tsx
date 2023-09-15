import { PropsWithChildren } from 'react';

import { getFormFieldErrorElementID } from './utils';

type Props = PropsWithChildren<{
    fieldID: string;
}>;

/**
 * FormFieldError - Displays the error message for a given form field.
 * @param props - Contains the field ID and the children (error message).
 */
const FormFieldError: React.FC<Props> = ({ fieldID, children }) => (
    <span
        id={getFormFieldErrorElementID(fieldID)}
        className="block font-headings text-xs text-red-500"
        role="alert"
    >
        {children}
    </span>
);

export default FormFieldError;
