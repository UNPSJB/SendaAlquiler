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
    | 'className'
    | 'ref'
    | 'aria-invalid'
    | 'aria-describedby'
    | 'name'
    | 'id'
    | 'size'
    | 'type'
> & {
    hasError?: boolean;
    hasHelp?: boolean;
    size?: InputSize;
    name: string;
    id: string;
    type?: InputHTMLAttributes<HTMLInputElement>['type'] | 'price';
};

/**
 * Input - A styled input component that handles ARIA attributes for better accessibility.
 * @param props - Contains the usual input properties and additional flags for error and help indicators.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { hasError, hasHelp, size, type = 'text', min, max, onChange, ...rest } = props;
    const ariaProps = getFormFieldAriaProps({
        fieldID: rest.id,
        hasError: !!hasError,
        hasHelp: !!hasHelp,
    });

    const [inputValue, setInputValue] = useState<string | number>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (type === 'number' && value !== '') {
            const valueWithRemovedNonDigits = value.replace(/\D/g, '');
            const valueInt = parseInt(valueWithRemovedNonDigits, 10);

            let minInt: number | undefined = undefined;
            if (typeof min === 'number') {
                minInt = min;
            } else if (typeof min === 'string') {
                minInt = parseInt(min, 10);
            }

            if (minInt !== undefined && valueInt < minInt) {
                setInputValue(minInt.toString());
                return;
            }

            let maxInt: number | undefined = undefined;
            if (typeof max === 'number') {
                maxInt = max;
            } else if (typeof max === 'string') {
                maxInt = parseInt(max, 10);
            }

            if (maxInt !== undefined && valueInt > maxInt) {
                setInputValue(maxInt.toString());
                return;
            }

            setInputValue(valueWithRemovedNonDigits);
            return;
        }

        if (type === 'price' && value !== '') {
            const valueWithRemovedNonDigits = value.replace(/\D/g, '');
            const valueAsPriceFormatWithThousands = valueWithRemovedNonDigits.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                '.',
            );

            setInputValue(valueAsPriceFormatWithThousands);
            return;
        }

        setInputValue(value);

        if (onChange) {
            onChange(e);
        }
    };

    let inputType = props.type;
    if (inputType === 'number' || inputType === 'price') {
        inputType = 'text';
    }

    return (
        <input
            ref={ref}
            className={clsx(
                'block w-full rounded border border-gray-200 p-4',
                size === InputSize.SMALL && 'text-sm',
                rest.readOnly ? 'pointer-events-none bg-gray-100' : 'bg-white',
            )}
            onChange={handleInputChange}
            value={inputValue}
            min={min}
            max={max}
            {...ariaProps}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

export default Input;
