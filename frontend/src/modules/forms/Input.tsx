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
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { hasError, hasHelp, ...rest } = props;
    const ariaProps = getFormFieldAriaProps({
        fieldID: rest.id,
        hasError: !!hasError,
        hasHelp: !!hasHelp,
    });

    return (
        <input
            ref={ref}
            className="border border-gray-200 rounded p-4 block w-full"
            {...ariaProps}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

export default Input;
