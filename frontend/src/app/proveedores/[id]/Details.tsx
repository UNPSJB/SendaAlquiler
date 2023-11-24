import { PropsWithChildren } from 'react';

import { SupplierByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
};

const SupplierByIdDetailsTab: React.FC<SupplierByIdTabComponentProps> = ({
    supplier,
}) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <SN>Correo: </SN>
                    {supplier.email}
                </LI>
                <LI>
                    <SN>Telefono: </SN>
                    {supplier.phoneCode}
                    {supplier.phoneNumber}
                </LI>
                <LI>
                    <SN>Dni: </SN>
                    {supplier.cuit}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Ubicación</h1>
                <LI>
                    <SN>Provincia: </SN>
                    {supplier.locality.state}
                </LI>
                <LI>
                    <SN>Ciudad: </SN> {supplier.locality.name}
                </LI>
                <LI>
                    <SN>Codigo Postal: </SN> {supplier.locality.postalCode}
                </LI>
                <LI>
                    <SN>Calle: </SN> {supplier.streetName}
                </LI>
                <LI>
                    <SN>N° de Casa: </SN> {supplier.houseNumber}
                </LI>
                <LI>
                    <SN>Apartamento, habitación, unidad, etc: </SN> {supplier.houseUnit}
                </LI>
            </UL>
        </>
    );
};

export default SupplierByIdDetailsTab;
