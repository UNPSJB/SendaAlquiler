export const getCleanErrorMessage = (err: Error) => {
    let message = err.message;

    const firstErrorSplitted = err.message.split('Error: ');
    if (firstErrorSplitted.length > 1) {
        message = firstErrorSplitted.slice(1).join('');
    }

    return message;
};

type OnNumericInputChangeOptions = {
    value: string;
    max?: number;
    min?: number;
};

export const getNumericInputValue = ({
    value,
    max,
    min,
}: OnNumericInputChangeOptions): number | null => {
    const asNumber = value.length ? parseInt(value.replace(/[^0-9]/g, '')) : null;

    if (asNumber === null || isNaN(asNumber)) {
        return null;
    }

    if (typeof max !== 'undefined' && asNumber > max) {
        return max;
    }

    if (typeof min !== 'undefined' && asNumber < min) {
        return min;
    }

    return asNumber;
};
