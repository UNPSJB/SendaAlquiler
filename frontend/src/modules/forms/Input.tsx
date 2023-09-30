import clsx from 'clsx';
import React, { useState } from 'react';
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
    const { hasError, hasHelp, size, type = 'text', onChange, ...rest } = props;
    const ariaProps = getFormFieldAriaProps({
        fieldID: rest.id,
        hasError: !!hasError,
        hasHelp: !!hasHelp,
    });

    const [inputValue, setInputValue] = useState<string | number>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (type === 'number' && value !== '') {
            const valueWithRemovedNonDigits = value.replace(/\D/g, '');
            setInputValue(valueWithRemovedNonDigits);
            return;
        }

        setInputValue(value);

        if (onChange) {
            onChange(e);
        }
    };

    let inputType = props.type;
    if (inputType === 'number') {
        inputType = 'text';
    }

    return (
        <input
            ref={ref}
            className={clsx(
                'block w-full rounded border border-gray-200 p-4',
                size === InputSize.SMALL && 'text-sm',
            )}
            onChange={handleInputChange}
            value={inputValue}
            {...ariaProps}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

export default Input;
