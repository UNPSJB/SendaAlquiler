import clsx from 'clsx';
import { ComponentProps } from 'react';

import Button from './Button';
import Spinner from './Spinner/Spinner';

type Props = ComponentProps<typeof Button> & {
    isLoading?: boolean;
};

const ButtonWithSpinner: React.FC<Props> = ({ isLoading, children, ...props }) => (
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
