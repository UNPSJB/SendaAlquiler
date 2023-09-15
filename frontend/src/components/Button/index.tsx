import Link from 'next/link';

import clsx from 'clsx';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

export enum ButtonVariant {
    BLACK = 'BLACK',
    OUTLINE_WHITE = 'OUTLINE_WHITE',
}

interface CommonProps {
    variant?: ButtonVariant;
    href?: string;
    external?: boolean;
    nativeAnchor?: boolean;
    children: ReactNode;
    fullWidth?: boolean;
}

type PropsBuilder<P> = CommonProps & Omit<P, 'className'>;
type ButtonProps = PropsBuilder<ButtonHTMLAttributes<HTMLButtonElement>>;
type AnchorProps = PropsBuilder<AnchorHTMLAttributes<HTMLAnchorElement>>;
type Props = ButtonProps & AnchorProps;

const commonClasses = 'rounded p-3 font-headings text-sm font-bold min-w-[10rem]';
const buttonClasses: Record<ButtonVariant, string> = {
    [ButtonVariant.BLACK]: clsx(commonClasses, 'bg-black text-white'),
    [ButtonVariant.OUTLINE_WHITE]: clsx(commonClasses, 'border border-gray-300 bg-white'),
};

const Button: React.FC<Props> = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
    (props, ref) => {
        const {
            variant = ButtonVariant.BLACK,
            fullWidth,
            href,
            external,
            nativeAnchor,
            children,
            ...rest
        } = props;
        const className = clsx(buttonClasses[variant], fullWidth && 'block w-full');

        if (href) {
            // External link
            if (external) {
                return (
                    <a
                        ref={ref as React.Ref<HTMLAnchorElement>}
                        href={href}
                        className={className}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...rest}
                    >
                        {children}
                    </a>
                );
            }

            // Simple native anchors
            if (nativeAnchor) {
                return (
                    <a
                        ref={ref as React.Ref<HTMLAnchorElement>}
                        href={href}
                        className={className}
                        {...rest}
                    >
                        {children}
                    </a>
                );
            }

            // Internal navigation using Next.js Link
            return (
                <Link href={href} passHref>
                    <a
                        ref={ref as React.Ref<HTMLAnchorElement>}
                        className={className}
                        {...rest}
                    >
                        {children}
                    </a>
                </Link>
            );
        }

        // Button element for actions
        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={className}
                {...rest}
            >
                {children}
            </button>
        );
    },
);

Button.displayName = 'Button';

export default Button;
