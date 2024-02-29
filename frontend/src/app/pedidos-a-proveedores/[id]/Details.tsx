import { PropsWithChildren } from 'react';

import { SupplierOrderByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
};

const SupplierOrderByIddDetailsTab: React.FC<SupplierOrderByIdTabComponentProps> = ({
    supplierOrder,
}) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Pedido #{supplierOrder.id}</h1>

                <LI>
                    <SN>Sucursal: </SN>
                    {supplierOrder.targetOffice.name}
                </LI>
                <LI>
                    <SN>Dirección: </SN>
                    {supplierOrder.targetOffice.street}{' '}
                    {supplierOrder.targetOffice.houseNumber}
                </LI>
                <LI>
                    <SN>Ciudad: </SN>
                    {supplierOrder.targetOffice.locality.name}
                </LI>
                <LI>
                    <SN>Empleado: </SN>
                    {supplierOrder.latestHistoryEntry?.user?.firstName}{' '}
                    {supplierOrder.latestHistoryEntry?.user?.lastName}
                </LI>
                <LI>
                    <SN>Estado: </SN>
                    {supplierOrder.latestHistoryEntry?.status}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Proveedor</h1>
                <LI>
                    <SN>Telefono: </SN>
                    {supplierOrder.supplier.phoneCode}
                    {supplierOrder.supplier.phoneNumber}
                </LI>
                <LI>
                    <SN>Cuit: </SN>
                    {supplierOrder.supplier.cuit}
                </LI>

                <LI>
                    <SN>Provincia: </SN>
                    {supplierOrder.supplier.locality.state}
                </LI>
                <LI>
                    <SN>Ciudad: </SN> {supplierOrder.supplier.locality.name}
                </LI>
                <LI>
                    <SN>Codigo Postal: </SN> {supplierOrder.supplier.locality.postalCode}
                </LI>
                <LI>
                    <SN>Dirección: </SN> {supplierOrder.supplier.streetName}{' '}
                    {supplierOrder.supplier.houseNumber}
                </LI>
            </UL>
        </>
    );
};

export default SupplierOrderByIddDetailsTab;
