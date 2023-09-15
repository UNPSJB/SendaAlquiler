import { LabelHTMLAttributes } from 'react';

export type LabelProps = Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    'htmlFor' | 'className'
> & {
    htmlFor: string;
    label: string;
};

/**
 * Label - A styled label component for form fields.
 * @param props - Contains the "for" attribute value and the label text.
 */
const Label: React.FC<LabelProps> = ({ label, children, ...rest }) => (
    <label className="block" {...rest}>
        <span className="mb-2 block text-sm">{label}</span>
        {children}
    </label>
);

export default Label;
