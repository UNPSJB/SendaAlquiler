import clsx from 'clsx';
import { LabelHTMLAttributes } from 'react';

export type LabelProps = Omit<
    LabelHTMLAttributes<HTMLLabelElement>,
    'htmlFor' | 'className'
> & {
    htmlFor: string;
    label: string;
    showRequired?: boolean;
    readOnly?: boolean;
};

/**
 * Label - A styled label component for form fields.
 * @param props - Contains the "for" attribute value and the label text.
 */
const Label: React.FC<LabelProps> = ({
    label,
    children,
    showRequired,
    readOnly = false,
    ...rest
}) => (
    <label
        className={clsx('block text-black', readOnly && 'pointer-events-none')}
        {...rest}
    >
        <span className="mb-2 block text-sm">
            {label}
            {showRequired && (
                <span className="text-red-500" role="presentation">
                    *
                </span>
            )}
        </span>
        {children}
    </label>
);

export default Label;
