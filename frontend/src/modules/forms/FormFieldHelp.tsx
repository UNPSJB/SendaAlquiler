import { PropsWithChildren } from 'react';

import { getFormFieldHelpElementID } from './utils';

type Props = PropsWithChildren<{
    fieldID: string;
}>;

/**
 * FormFieldHelp - Displays the help text for a given form field.
 * @param props - Contains the field ID and the children (help text).
 */
const FormFieldHelp: React.FC<Props> = ({ fieldID, children }) => (
    <span
        id={getFormFieldHelpElementID(fieldID)}
        className="block font-headings text-sm text-muted-foreground"
    >
        {children}
    </span>
);

export default FormFieldHelp;
