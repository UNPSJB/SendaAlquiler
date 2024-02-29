import { PropsWithChildren } from 'react';

export const TD: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <td className="px-8 py-4 first:pl-4 last:pr-4 group-even:bg-gray-50">
            {children}
        </td>
    );
};

export const TR: React.FC<PropsWithChildren> = ({ children }) => {
    return <tr className="group">{children}</tr>;
};

export const TH: React.FC<PropsWithChildren> = ({ children }) => {
    return <th className="px-8 py-2.5 text-left first:pl-4 last:pr-4">{children}</th>;
};

export const Table: React.FC<PropsWithChildren> = ({ children }) => {
    return <table className="w-full text-sm">{children}</table>;
};
