import clsx from 'clsx';

import styles from './Spinner.module.scss';

export type SpinnerProps = {
    className?: string;
};

const classes = clsx(
    'block h-5 w-5 rounded-full border-2 border-gray-200 ease-linear',
    styles.spinner,
);

export const Spinner: React.FC<SpinnerProps> = ({ className }: SpinnerProps) => {
    return <span className={clsx(classes, className)} />;
};

export default Spinner;
