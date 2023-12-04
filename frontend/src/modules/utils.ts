export const getCleanErrorMessage = (err: Error) => {
    let message = err.message;

    const firstErrorSplitted = err.message.split('Error: ');
    if (firstErrorSplitted.length > 1) {
        message = firstErrorSplitted.slice(1).join('');
    }

    return message;
};
