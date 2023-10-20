import { useEffect } from 'react';

const useModalCancel = (onCancel: () => void, show: boolean) => {
    useEffect(() => {
        if (!show) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.keyCode === 27) {
                e.preventDefault();
                onCancel();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onCancel, show]);
};

export default useModalCancel;
