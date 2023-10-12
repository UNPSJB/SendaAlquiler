import { PropsWithChildren } from 'react';

const Avatar: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <span className="mt-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#36E270] px-7 py-6 text-3xl font-bold text-white">
            {children}
        </span>
    );
};

export default Avatar;
