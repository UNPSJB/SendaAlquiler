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
                            className="mb-4 mr-8 mt-8 rounded-md border bg-white p-4"
                            key={order?.id}
                        >
                            <h1 className="mb-3 border-b-2 text-xl font-bold">
                                Pedido #{order.id}
                            </h1>

                            <LI>
                                <SN>Fecha:</SN>{' '}
                                {new Date(order.createdOn).toLocaleDateString()}
                            </LI>
                            <LI>
                                <SN>Estado: </SN>
                                {order.currentHistory?.status}
                            </LI>
                            <UL>
                                <h2 className="mb-3 text-xl font-bold">
                                    Sucursal Destino:
                                </h2>
                                <LI>
                                    <SN>Nombre: </SN>
                                    {order.officeDestination.name}{' '}
                                </LI>
                                <LI>
                                    <SN>Direccion : </SN>
                                    {order.officeDestination.street}{' '}
                                    {order.officeDestination.houseNumber}
                                </LI>
                            </UL>

                            <LI>
                                <UL>
                                    <h2 className="mb-3 text-xl font-bold ">
                                        Productos:
                                    </h2>
                                    {order.orders.map((orderItem) => (
                                        <LI key={orderItem.id}>
                                            <div className="text-gray-500">
                                                <b>-</b> {orderItem.product.name}{' '}
                                                {orderItem.product.brand?.name} (x
                                                {orderItem.quantity}{' '}
                                                {orderItem.quantity > 1
                                                    ? 'unidades'
                                                    : 'unidad'}
                                                )
                                            </div>
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
