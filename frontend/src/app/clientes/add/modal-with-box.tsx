import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import clsx from 'clsx';
import React, { PropsWithChildren, useEffect, useRef } from 'react';

import useModalCancel from './hooks';
import styles from './modal-with-box.module.scss';

import Portal from '@/components/Portal';

const classes = {
    portal: clsx(
        'fixed inset-0 z-[99] overflow-hidden bg-black bg-opacity-[0.95] py-16',
        styles.box,
    ),
    box: 'flex flex-col w-full bg-dark text-white rounded min-h-96 max-h-full overflow-y-scroll border border-white border-opacity-20',
    toolbar: {
        root: 'flex items-center justify-between p-6 bg-dark shadow',
        title: 'text-lg font-semibold',
        icon: 'cursor-pointer hover:opacity-50',
    },
};

const ModalBox = React.forwardRef<HTMLDivElement, PropsWithChildren<unknown>>(
    ({ children }, ref) => (
        <div
            ref={ref}
            className={classes.box}
            style={{
                boxShadow: '0 0 4px rgba(255, 255, 255, 0.2)',
            }}
        >
            {children}
        </div>
    ),
);

ModalBox.displayName = 'ModalBox';

type ModalWithBoxProps = PropsWithChildren<{
    onCancel: () => void;
    className?: string;
    closeOnOutsideClick?: boolean;
    show: boolean;
}>;

export const ModalWithBox: React.FC<ModalWithBoxProps> = ({
    children,
    onCancel,
    className,
    closeOnOutsideClick,
    show,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    useModalCancel(onCancel, show);

    useEffect(() => {
        const current = ref.current;
        if (!show || !current) {
            return;
        }

        disableBodyScroll(current);

        return () => {
            enableBodyScroll(current);
        };
    }, [show]);

    const onCancelClick = (e: any) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    if (!show) {
        return;
    }

    return (
        <Portal
            className={clsx(classes.portal, className)}
            onClick={closeOnOutsideClick ? onCancelClick : undefined}
        >
            <div
                className="container flex h-full min-h-full items-center justify-center"
                onClick={closeOnOutsideClick ? onCancelClick : undefined}
            >
                <ModalBox ref={ref}>{children}</ModalBox>
            </div>
        </Portal>
    );
};

export default ModalWithBox;
