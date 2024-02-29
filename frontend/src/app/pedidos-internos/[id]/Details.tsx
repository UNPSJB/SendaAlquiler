import { PropsWithChildren } from 'react';

import { formatDateTime } from '@/modules/dayjs/utils';

import { InternalOrderByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
};

const InternalOrderByIddDetailsTab: React.FC<InternalOrderByIdTabComponentProps> = ({
    internalOrder,
}) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold ">Pedido #{internalOrder.id}</h1>

                <LI>
                    <SN>Estado: </SN>
                    {internalOrder.latestHistoryEntry?.status}
                </LI>
                <LI>
                    <SN>Fecha pedido: </SN>
                    {formatDateTime(internalOrder.createdOn)}
                </LI>
            </UL>
            <UL>
                <h2 className="mb-3 text-xl font-bold">Sucursal Remitente: </h2>
                <LI>
                    <SN>Nombre: </SN>
                    {internalOrder.sourceOffice.name}
                </LI>
                <LI>
                    <SN>Dirección: </SN>
                    {internalOrder.sourceOffice.street}{' '}
                    {internalOrder.sourceOffice.houseNumber}
                </LI>
                <LI>
                    <SN>Ciudad: </SN>
                    {internalOrder.sourceOffice.locality.name} |{' '}
                    {internalOrder.sourceOffice.locality.postalCode}
                </LI>
            </UL>
            <UL>
                <h2 className="mb-3 text-xl font-bold">Sucursal Destino: </h2>
                <LI>
                    <SN>Nombre: </SN>
                    {internalOrder.targetOffice.name}
                </LI>
                <LI>
                    <SN>Dirección: </SN>
                    {internalOrder.targetOffice.street}{' '}
                    {internalOrder.targetOffice.houseNumber}
                </LI>
                <LI>
                    <SN>Ciudad: </SN>
                    {internalOrder.targetOffice.locality.name} |{' '}
                    {internalOrder.targetOffice.locality.postalCode}
                </LI>
            </UL>
        </>
    );
};

export default InternalOrderByIddDetailsTab;
