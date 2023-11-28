import { PropsWithChildren } from 'react';

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
                {' '}
                <h1 className="mb-3 text-xl font-bold ">Pedido #{internalOrder.id}</h1>
                <LI>
                    <SN>Estado: </SN>
                    {internalOrder.currentHistory?.status}
                </LI>
                <LI>
                    <SN>Fecha: </SN>
                    {new Date(internalOrder.createdOn).toLocaleDateString('es-ES')}
                </LI>
            </UL>
            <UL>
                <h2 className="mb-3 text-xl font-bold">Sucursal Remitente: </h2>
                <LI>
                    <SN>Nombre: </SN>
                    {internalOrder.officeBranch.name}
                </LI>
                <LI>
                    <SN>Dirección: </SN>
                    {internalOrder.officeBranch.street}{' '}
                    {internalOrder.officeBranch.houseNumber}
                </LI>
                <LI>
                    <SN>Ciudad: </SN>
                    {internalOrder.officeBranch.locality.name} |{' '}
                    {internalOrder.officeBranch.locality.postalCode}
                </LI>
            </UL>
            <UL>
                <h2 className="mb-3 text-xl font-bold">Sucursal Destino: </h2>
                <LI>
                    <SN>Nombre: </SN>
                    {internalOrder.officeDestination.name}
                </LI>
                <LI>
                    <SN>Dirección: </SN>
                    {internalOrder.officeDestination.street}{' '}
                    {internalOrder.officeDestination.houseNumber}
                </LI>
                <LI>
                    <SN>Ciudad: </SN>
                    {internalOrder.officeDestination.locality.name} |{' '}
                    {internalOrder.officeDestination.locality.postalCode}
                </LI>
            </UL>
        </>
    );
};

export default InternalOrderByIddDetailsTab;
