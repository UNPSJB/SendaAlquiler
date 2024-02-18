import clsx from 'clsx';
import { ComponentProps } from 'react';

import Spinner from './Spinner/Spinner';
import { Button } from './ui/button';

type Props = ComponentProps<typeof Button> & {
    showSpinner: boolean;
};

const ButtonWithSpinner: React.FC<Props> = ({
    showSpinner: isLoading,
    children,
    ...props
}) => (
    <Button className="relative" {...props}>
        <span className={clsx(isLoading && 'invisible')}>{children}</span>
        <span
            className={clsx(
                isLoading && 'absolute inset-0 flex items-center justify-center',
            )}
        >
            {isLoading && <Spinner />}
        </span>
    </Button>
);

export default ButtonWithSpinner;
