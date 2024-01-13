'use client';

import { PropsWithChildren, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const defaultClasses = 'portal-container';

type PortalProps = PropsWithChildren<{
    className?: string;
    parent?: HTMLElement;
    onClick?: (e: any) => void;
}>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Portal: React.FC<PortalProps> = ({
    children,
    parent,
    className,
    onClick,
}) => {
    const el = useMemo(() => {
        if (typeof document !== 'undefined') {
            return document.createElement('div');
        }

        return null;
    }, []);

    useEffect(() => {
        const target = parent ? parent : document.body;
        const classList: string[] = [];

        // Add default classes
        defaultClasses.split(' ').forEach((item) => classList.push(item));

        if (className) {
            className.split(' ').forEach((item) => {
                if (item) {
                    classList.push(item);
                }
            });
        }

        if (!el) return;

        classList.forEach((item) => el.classList.add(item));

        if (onClick) {
            el.onclick = (e) => {
                if (el === e.target) {
                    onClick(e);
                }
            };
        }

        target.appendChild(el);

        return () => {
            target.removeChild(el);
        };
    }, [el, parent, className, onClick]);

    if (!el) return null;

    return createPortal(children as any, el);
};

export default Portal;
