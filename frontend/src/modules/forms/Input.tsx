import clsx from 'clsx';
import React from 'react';
import { InputHTMLAttributes } from 'react';

import { getFormFieldAriaProps } from './utils';

export enum InputSize {
    SMALL = 'small',
    BASE = 'base',
}

type InputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'ref' | 'aria-invalid' | 'aria-describedby' | 'name' | 'id' | 'size'
> & {
    hasError?: boolean;
    hasHelp?: boolean;
    size?: InputSize;
    name: string;
    id: string;
};

/**
 * Input - A styled input component that handles ARIA attributes for better accessibility.
 * @param props - Contains the usual input properties and additional flags for error and help indicators.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { hasError, hasHelp, size, ...rest } = props;
    const ariaProps = getFormFieldAriaProps({
        fieldID: rest.id,
        hasError: !!hasError,
        hasHelp: !!hasHelp,
    });

    return (
        <input
            ref={ref}
            className={clsx(
                'block w-full rounded border border-gray-200 p-4',
                size === InputSize.SMALL && 'text-sm',
            )}
            {...ariaProps}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

export default Input;
