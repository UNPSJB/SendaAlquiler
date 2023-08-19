import React from 'react';
import { InputHTMLAttributes } from 'react';
import { getFormFieldAriaProps } from './utils';

type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'ref' | 'aria-invalid' | 'aria-describedby' | 'name' | 'id'
> & {
    hasError?: boolean;
    hasHelp?: boolean;
    name: string;
    id: string;
};

/**
 * Input - A styled input component that handles ARIA attributes for better accessibility.
 * @param props - Contains the usual input properties and additional flags for error and help indicators.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ hasError = false, hasHelp = false, ...props }, ref) => {
        const ariaProps = getFormFieldAriaProps({
            fieldID: props.id,
            hasError,
            hasHelp,
        });

        return (
            <input
                ref={ref}
                className="border border-gray-200 rounded p-4 block w-full"
                {...ariaProps}
                {...props}
            />
        );
    },
);

Input.displayName = 'Input';

export default Input;
