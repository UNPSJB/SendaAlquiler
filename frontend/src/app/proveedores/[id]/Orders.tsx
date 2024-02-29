import { PropsWithChildren } from 'react';

import { useSupplierOrdersBySupplierId } from '@/api/hooks';

import { formatDateTime } from '@/modules/dayjs/utils';

import { SupplierOrderBySupplierIdTabComponentProps } from './page';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-4">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="mb-1">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
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
                        <div
                            className="mb-4 mr-8 mt-8 rounded-md border bg-white"
                            key={order?.id}
                        >
                            <h1 className="mb-2 border-b px-4 py-2 text-xl font-bold">
                                Pedido #{order.id}
                            </h1>
                            <div className="">
                                <div className="mb-4 px-4">
                                    <LI>
                                        <SN>Fecha:</SN> {formatDateTime(order.createdOn)}
                                    </LI>
                                    <LI>
                                        <SN>Estado: </SN>
                                        {order.latestHistoryEntry?.status}
                                    </LI>
                                    <UL>
                                        <h2 className="text-xl font-bold">
                                            Sucursal Destino:
                                        </h2>
                                        <LI>
                                            <SN>Nombre: </SN>
                                            {order.targetOffice.name}{' '}
                                        </LI>
                                        <LI>
                                            <SN>Direccion : </SN>
                                            {order.targetOffice.street}{' '}
                                            {order.targetOffice.houseNumber}
                                        </LI>
                                    </UL>
                                </div>
                                <div className="border-t">
                                    <div className="p-4">
                                        {order.orderItems.map((orderItem) => (
                                            <div
                                                key={orderItem.id}
                                                className="flex justify-between"
                                            >
                                                <div className="text-muted-foreground">
                                                    <b>-</b> {orderItem.product.name}{' '}
                                                    {orderItem.product.brand?.name}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {orderItem.quantityOrdered} .u x ${' '}
                                                    {orderItem.product.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </UL>
            )}
        </FetchedDataRenderer>
    );
};

export default SupplierByIdOrdersTab;
