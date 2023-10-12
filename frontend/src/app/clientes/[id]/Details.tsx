import { PropsWithChildren } from 'react';

import { ClientByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
};

const ClientByIdDetailsTab: React.FC<ClientByIdTabComponentProps> = ({ client }) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <SN>Correo: </SN>
                    {client.email}
                </LI>
                <LI>
                    <SN>Telefono: </SN>
                    {client.phoneCode}
                    {client.phoneNumber}
                </LI>
                <LI>
                    <SN>Dni: </SN>
                    {client.dni}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Ubicación</h1>
                <LI>
                    <SN>Provincia: </SN>
                    {client.locality.state}
                </LI>
                <LI>
                    <SN>Ciudad: </SN> {client.locality.name}
                </LI>
                <LI>
                    <SN>Codigo Postal: </SN> {client.locality.postalCode}
                </LI>
                <LI>
                    <SN>Calle: </SN> {client.streetName}
                </LI>
                <LI>
                    <SN>N° de Casa: </SN> {client.houseNumber}
                </LI>
                <LI>
                    <SN>Apartamento, habitación, unidad, etc: </SN> {client.houseUnit}
                </LI>
            </UL>
        </>
    );
};

export default ClientByIdDetailsTab;
