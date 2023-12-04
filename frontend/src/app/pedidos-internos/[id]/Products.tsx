import { InternalOrderHistoryStatusChoices } from '@/api/graphql';

import { InternalOrderByIdTabComponentProps } from './page';

const InternalOrderByIdProductsTab: React.FC<InternalOrderByIdTabComponentProps> = ({
    internalOrder,
}) => {
    return (
        <div className="mb-4 mr-8 mt-8 rounded-md border border-gray-300 bg-white">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="border-b border-gray-200 p-4 text-left">
                            Producto
                        </th>
                        <th className="border-b border-gray-200 p-4 text-left">Marca</th>
                        <th className="border-b border-gray-200 p-4 text-left">Tipo</th>
                        <th className="border-b border-gray-200 p-4 text-left">Pedido</th>
                        <th className="border-b border-gray-200 p-4 text-left">
                            Recibido
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {internalOrder.orders.map((item, index) => (
                        <tr className="group" key={index}>
                            <td className="p-4 group-last:first:rounded-bl-md group-even:bg-gray-100">
                                {item.product.name}
                            </td>
                            <td className="p-4 group-even:bg-gray-100">
                                {item.product.brand?.name}
                            </td>
                            <td className="p-4 group-even:bg-gray-100">
                                {item.product.type}
                            </td>
                            <td className="p-4 group-even:bg-gray-100">
                                {item.quantity}
                            </td>
                            <td className="p-4 group-last:last:rounded-br-md group-even:bg-gray-100">
                                {internalOrder.currentHistory?.status ===
                                InternalOrderHistoryStatusChoices.Completed
                                    ? item.quantityReceived
                                    : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InternalOrderByIdProductsTab;
