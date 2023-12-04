import clsx from 'clsx';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
    className?: string;
};

const classes = clsx(
    'block h-6 w-6 rounded-full border-2 border-y-gray-200 border-l-gray-200 ease-linear',
    styles.spinner,
);

export const Spinner: React.FC<SpinnerProps> = ({ className }: SpinnerProps) => {
    return <span className={clsx(classes, className)} />;
};

export default Spinner;
