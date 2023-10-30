import { PropsWithChildren } from 'react';

import { ClientByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const ClientByIdDetailsTab: React.FC<ClientByIdTabComponentProps> = ({ client }) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <b>Correo: </b>
                    {client.email}
                </LI>
                <LI>
                    <b>Telefono: </b>
                    {client.phoneCode}
                    {client.phoneNumber}
                </LI>
                <LI>
                    <b>Dni: </b>
                    {client.dni}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Ubicación</h1>
                <LI>
                    <b>Provincia: </b>
                    {client.locality.state}
                </LI>
                <LI>
                    <b>Ciudad: </b> {client.locality.name}
                </LI>
                <LI>
                    <b>Codigo Postal: </b> {client.locality.postalCode}
                </LI>
                <LI>
                    <b>Calle: </b> {client.streetName}
                </LI>
                <LI>
                    <b>N° de Casa: </b> {client.houseNumber}
                </LI>
                <LI>
                    <b>Apartamento, habitación, unidad, etc: </b> {client.houseUnit}
                </LI>
            </UL>
        </>
    );
};

export default ClientByIdDetailsTab;
