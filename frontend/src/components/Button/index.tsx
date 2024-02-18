import Link from 'next/link';

import clsx from 'clsx';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

export enum ButtonVariant {
    BLACK = 'BLACK',
    GRAY = 'GRAY',
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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type Props = CommonProps & ButtonProps & AnchorProps;

const commonClasses =
    'rounded p-3 border font-headings text-sm font-bold min-w-[10rem] transition duration-100';
const buttonClasses: Record<ButtonVariant, string> = {
    [ButtonVariant.BLACK]: clsx(
        commonClasses,
        'border-black bg-black text-white',
        'hover:border-gray-900 hover:bg-gray-800',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2',
        'active:border-gray-900 active:bg-gray-700 active:shadow-sm',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
    [ButtonVariant.OUTLINE_WHITE]: clsx(
        commonClasses,
        'border-gray-300 bg-white text-black',
        'hover:border-gray-400 hover:bg-gray-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
        'active:border-gray-900 active:bg-gray-200 active:shadow-sm',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
    [ButtonVariant.GRAY]: clsx(
        commonClasses,
        'border-gray-300 bg-gray-200 text-gray-700',
        'hover:border-gray-400 hover:bg-gray-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
        'active:border-gray-600 active:bg-gray-300 active:shadow',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
};

const DeprecatedButton: React.FC<Props> = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    Props
>((props, ref) => {
    const {
        variant = ButtonVariant.BLACK,
        fullWidth,
        href,
        external,
        nativeAnchor,
        children,
        type = 'button',
        disabled,
        className: extraClassName,
        ...rest
    } = props;
    const className = clsx(buttonClasses[variant], fullWidth && 'w-full', extraClassName);

    if (href) {
        // External link
        if (external) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={clsx(className, 'text-center')}
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
                    className={clsx(className, 'text-center')}
                    {...rest}
                >
                    {children}
                </a>
            );
        }

        // Internal navigation using Next.js Link
        return (
            <Link
                href={href}
                ref={ref as React.Ref<HTMLAnchorElement>}
                className={clsx(className, 'text-center')}
                {...rest}
            >
                {children}
            </Link>
        );
    }

    // Button element for actions
    return (
        <button
            disabled={disabled}
            ref={ref as React.Ref<HTMLButtonElement>}
            className={className}
            type={type}
            {...rest}
        >
            {children}
        </button>
    );
});

DeprecatedButton.displayName = 'Button';

export default DeprecatedButton;
