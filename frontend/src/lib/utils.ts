import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const removeAccentsAndLowercase = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

/**
 * Formats a number as a price
 * last two digits will be the cents
 * and adds a "." as thousands separator
 *
 * Example:
 * 1234567 -> 12.345,67
 *
 * @param number
 * @returns formatted price
 */
export const formatNumberAsPrice = (number: number): string => {
    if (isNaN(number) || !number || typeof number !== 'number') {
        return '0';
    }

    return (number / 100)
        .toFixed(2)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formats number to thousands separator
 *
 * Example:
 * 1234567 -> 1.234.567
 *
 * @param number
 * @returns formatted number
 */

export const formatNumberWithThousandsSeparator = (number: number): string => {
    if (isNaN(number) || number === 0 || typeof number !== 'number') {
        return '0';
    }

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type InputToNumberOptions = {
    min?: number;
    max?: number;
};

export const inputToNumber = (
    input: string,
    options: InputToNumberOptions = {},
): number | null => {
    const { min = 0, max = 1000000000 } = options;

    const onlyDigits = input.replace(/[^0-9]/g, '');
    if (onlyDigits === '') {
        return null;
    }

    const asInt = parseInt(onlyDigits, 10);
    if (isNaN(asInt)) {
        return null;
    }

    return Math.min(Math.max(asInt, min), max);
};

type CalculateDiscountFromPercentageOptions = {
    subtotal: number;
    percentage: number;
};

export const calculateDiscountAmountFromPercentage = ({
    subtotal,
    percentage,
}: CalculateDiscountFromPercentageOptions) => {
    return subtotal * (percentage / 100);
};

type CalculateDiscountFromAmountOptions = {
    subtotal: number;
    amount: number;
};

export const calculateDiscountPercentageFromAmount = ({
    subtotal,
    amount,
}: CalculateDiscountFromAmountOptions) => {
    const percentage = (amount / subtotal) * 100;
    return Math.round(percentage * 100) / 100;
};

export const padNumber = (value: number, digits = 2): string => {
    let val = value.toString();

    while (val.length < digits) {
        val = `0${val}`;
    }

    return val;
};

export const dateToInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = padNumber(date.getMonth() + 1);
    const day = padNumber(date.getDate());

    return `${year}-${month}-${day}`;
};

export const datetimeToInputValue = (date: Date) => {
    return date.toISOString();
};
