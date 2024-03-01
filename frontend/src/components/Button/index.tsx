import Link from 'next/link';

import clsx from 'clsx';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef, ReactNode } from 'react';

import { buttonVariants } from '../ui/button';

export enum ButtonVariant {
    BLACK = 'default',
    GRAY = 'secondary',
    OUTLINE_WHITE = 'outline',
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
    const className = clsx(
        buttonVariants({
            variant: variant,
        }),
        fullWidth && 'w-full',
        extraClassName,
    );

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
