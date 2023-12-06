import { PropsWithChildren } from 'react';

import { InternalOrderHistoryStatusChoices } from '@/api/graphql';

import { InternalOrderByIdTabComponentProps } from './page';

type Props = {
    headers: string[];
    data: React.ReactNode;
};

export const TableSecondaryTData: React.FC<PropsWithChildren> = ({ children }) => (
    <td className="p-4 group-last:first:rounded-bl-md group-last:last:rounded-br-md group-even:bg-gray-100">
        {children}
    </td>
);

export const TableSecondaryTRow: React.FC<PropsWithChildren> = ({ children }) => (
    <tr className="group">{children}</tr>
);

export const TableSecondary: React.FC<Props> = ({ headers, data }) => {
    return (
        <table className="w-full">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className="border-b border-gray-200 p-4 text-left"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>{data}</tbody>
        </table>
    );
};

const InternalOrderByIdProductsTab: React.FC<InternalOrderByIdTabComponentProps> = ({
    internalOrder,
}) => {
    return (
        <div className="mb-4 mr-8 mt-8 rounded-md border border-gray-300 bg-white">
            <TableSecondary
                headers={['Producto', 'Marca', 'Tipo', 'Pedido', 'Recibido']}
                data={internalOrder.orders.map((item, index) => (
                    <TableSecondaryTRow key={index}>
                        <TableSecondaryTData>{item.product.name}</TableSecondaryTData>
                        <TableSecondaryTData>
                            {item.product.brand?.name}
                        </TableSecondaryTData>
                        <TableSecondaryTData>{item.product.type}</TableSecondaryTData>
                        <TableSecondaryTData>{item.quantity}</TableSecondaryTData>
                        <TableSecondaryTData>
                            {internalOrder.currentHistory?.status ===
                            InternalOrderHistoryStatusChoices.Completed
                                ? item.quantityReceived
                                : '-'}
                        </TableSecondaryTData>
                    </TableSecondaryTRow>
                ))}
            />
        </div>
    );
};

export default InternalOrderByIdProductsTab;
