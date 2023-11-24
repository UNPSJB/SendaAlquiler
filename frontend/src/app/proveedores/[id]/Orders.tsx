import { PropsWithChildren } from 'react';

import { useSupplierOrdersBySupplierId } from '@/api/hooks';

import { SupplierOrderBySupplierIdTabComponentProps } from './page';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SupplierByIdOrdersTab: React.FC<SupplierOrderBySupplierIdTabComponentProps> = ({
    id,
}) => {
    const useSupplierOrdersBySupplierIdResult = useSupplierOrdersBySupplierId(
        id as string,
    );

    return (
        <FetchedDataRenderer
            {...useSupplierOrdersBySupplierIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener los pedidos"
                    line1="Hubo un error al obtener los pedidos del proveedor."
                />
            }
        >
            {({ supplierOrdersBySupplierId }) => (
                <UL>
                    {supplierOrdersBySupplierId.map((order) => (
                        <div key={order?.id}>
                            <h1 className="mb-3 text-xl font-bold">
                                Pedido <div id={order.id}></div>
                            </h1>

                            <LI>
                                Date Created:{' '}
                                {new Date(order.createdOn).toLocaleDateString()}
                            </LI>
                            <LI>Office Destination: {order.officeDestination.name}</LI>

                            <>
                                <LI>
                                    Current History Status: {order.currentHistory?.status}
                                </LI>

                                <LI>User Email: {order.currentHistory?.user?.email}</LI>
                                <LI>
                                    History Date:{' '}
                                    {new Date(
                                        order.currentHistory?.createdOn,
                                    ).toLocaleDateString()}
                                </LI>
                            </>

                            <LI>
                                Orders:
                                <UL>
                                    {order.orders.map((orderItem) => (
                                        <LI key={orderItem.id}>
                                            Product: {orderItem.product.name}, Quantity:{' '}
                                            {orderItem.quantity}
                                        </LI>
                                    ))}
                                </UL>
                            </LI>
                        </div>
                    ))}
                </UL>
            )}
        </FetchedDataRenderer>
    );
};

export default SupplierByIdOrdersTab;
