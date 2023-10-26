import clsx from 'clsx';

import { DashboardIconProps } from '../DashboardLayout';

const IconHome: React.FC<DashboardIconProps> = (props) => {
    return (
        <span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={clsx('h-6 w-6', props.isActive && 'fill-purple-500')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7m-7-7v14"
                />
            </svg>
        </span>
    );
};

export default IconHome;
