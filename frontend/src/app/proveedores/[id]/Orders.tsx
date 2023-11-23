import { useParams } from 'next/navigation';

import { PropsWithChildren } from 'react';

import { useSupplierOrdersBySupplierId } from '@/api/hooks';

import { SupplierOrderBySupplierIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SupplierByIdOrdersTab: React.FC<SupplierOrderBySupplierIdTabComponentProps> = (
    supplierOrder,
) => {
    // const { id } = useParams();
    // const useSupplierOrdersBySupplierIdResult = useSupplierOrdersBySupplierId(
    //     id as string,
    // );

    // const supplierOrderBySupplier =
    //     useSupplierOrdersBySupplierIdResult.data?.supplierOrderBySupplierId;

    const useSupplierOrdersBySupplierIdResult = useSupplierOrdersBySupplierId(
        supplierOrder.supplierOrder?.id,
    );
    const supplierOrderBySupplier =
        useSupplierOrdersBySupplierIdResult.data?.supplierOrderBySupplierId;

    return (
        <>
            {/* <UL>
                {supplierOrder?.map((order) => (
                    <div key={order?.id}>
                        <h1 className="mb-3 text-xl font-bold">
                            Pedido <div id={supplierOrderBySupplier.}></div>
                        </h1>
    
                        <LI>Date Created: {order.dateCreated}</LI>
                        <LI>Office Destination: {order.officeDestination.name}</LI>

        
                            <>
                                <LI>
                                    Current History Status: {order.currentHistory.status}
                                </LI>
                                <LI>User Email: {order.currentHistory.user.email}</LI>
                                <LI>History Date: {order.currentHistory.date}</LI>
                            </>
                        )}

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
            </UL> */}
        </>
    );
};

export default SupplierByIdOrdersTab;
