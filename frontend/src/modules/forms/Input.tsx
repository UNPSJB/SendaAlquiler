import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { InputHTMLAttributes } from 'react';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

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
    | 'value'
    | 'onChange'
> & {
    hasError?: boolean;
    hasHelp?: boolean;
    size?: InputSize;
    name: string;
    id: string;
    type?: InputHTMLAttributes<HTMLInputElement>['type'] | 'price';
    value?: string;
    onChange?: (value: string) => void;
};

/**
 * Parses a string to an integer and ensures it is within the specified min and max range.
 * @param value The string value to parse.
 * @param min The minimum allowed value.
 * @param max The maximum allowed value.
 * @returns The parsed integer or the min/max value if outside the range.
 */
const parseAsInt = (
    value: string,
    min?: number | string,
    max?: number | string,
): number => {
    const valueInt = parseInt(value.replace(/\D/g, ''), 10);

    const minInt = typeof min === 'string' ? parseInt(min, 10) : min;
    const maxInt = typeof max === 'string' ? parseInt(max, 10) : max;

    if (typeof minInt !== 'undefined' && !isNaN(minInt) && valueInt < minInt) {
        return minInt;
    }

    if (typeof maxInt !== 'undefined' && !isNaN(maxInt) && valueInt > maxInt) {
        return maxInt;
    }

    return isNaN(valueInt) ? 0 : valueInt;
};

/**
 * Formats a numeric string as a price with thousands separators.
 * @param value The string value to format.
 * @returns The formatted price string.
 */
const formatPrice = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const useInputChange = (
    props: Pick<InputProps, 'onChange' | 'type' | 'value' | 'min' | 'max'>,
) => {
    const { onChange, type, value, min, max } = props;
    const [inputValue, setInputValue] = useState<string | number>(value || '');

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (type === 'number') {
            const processedValue = parseAsInt(newValue, min, max).toString();
            setInputValue(processedValue);
            onChange?.(processedValue);
            return;
        } else if (type === 'price') {
            const processedValue = formatPrice(newValue);
            setInputValue(processedValue);
            onChange?.(processedValue);
            return;
        }

        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return {
        inputValue,
        handleInputChange,
    };
};

const determineInputType = (type: string) => {
    if (type === 'number' || type === 'price') {
        return 'text';
    }

    return type;
};

/**
 * Input - A styled input component that handles ARIA attributes for better accessibility.
 * @param props - Contains the usual input properties and additional flags for error and help indicators.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        hasError,
        hasHelp,
        value,
        size,
        type = 'text',
        min,
        max,
        onChange,
        ...rest
    } = props;

    const ariaProps = getFormFieldAriaProps({
        fieldID: rest.id,
        hasError: !!hasError,
        hasHelp: !!hasHelp,
    });

    const { inputValue, handleInputChange } = useInputChange({
        onChange,
        type,
        value,
        min,
        max,
    });
    const inputType = determineInputType(type);

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
            type={inputType}
            min={min}
            max={max}
            {...ariaProps}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

type RHFProps<TFieldValues extends FieldValues, TName extends Path<TFieldValues>> = {
    control: Control<TFieldValues>;
    name: TName;
    rules?: RegisterOptions<TFieldValues, TName>;
} & Omit<InputProps, 'name'>;

const RHFInput = <TFieldValues extends FieldValues, TName extends Path<TFieldValues>>(
    props: RHFProps<TFieldValues, TName>,
) => {
    const { control, name, rules, ...rest } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <Input name={name} onChange={onChange} value={value} {...rest} />
            )}
        />
    );
};

export default RHFInput;
