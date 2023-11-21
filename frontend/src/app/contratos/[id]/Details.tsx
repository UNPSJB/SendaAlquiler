import { PropsWithChildren } from 'react';

import { ContractByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const ScrollableContainer: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div
            className="h-full overflow-y-auto" // Estilo para permitir desplazamiento vertical y altura máxima
            style={{
                maxHeight: 'calc(70vh - 10px)',
                scrollbarWidth: 'thin', // Para navegadores que admiten el modelo de scrollbar antiguo
                scrollbarColor: 'dark',
            }}
        >
            {children}
        </div>
    );
};

const ContractsByIdDetailsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <ScrollableContainer>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <b>Correo: </b>
                    {contract.client.email}
                </LI>
                <LI>
                    <b>Telefono: </b>
                    {contract.client.phoneCode}
                    {contract.client.phoneNumber}
                </LI>
                <LI>
                    <b>Dni: </b>
                    {contract.client.dni}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Ubicación</h1>
                <LI>
                    <b>Provincia: </b>
                    {contract.client.locality.state}
                </LI>
                <LI>
                    <b>Ciudad: </b> {contract.client.locality.name}
                </LI>
                <LI>
                    <b>Codigo Postal: </b> {contract.client.locality.postalCode}
                </LI>
                <LI>
                    <b>Calle: </b> {contract.client.streetName}
                </LI>
                <LI>
                    <b>N° de Casa: </b> {contract.client.houseNumber}
                </LI>
                <LI>
                    <b>Apartamento, habitación, unidad, etc: </b>{' '}
                    {contract.client.houseUnit}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Detalles del Contrato</h1>
                <LI>
                    <b>Estado: </b>
                    {contract.currentHistory?.status}
                </LI>
                <LI>
                    <b>Vencimiento: </b>{' '}
                    {new Date(contract.expirationDate).toLocaleDateString('es-ES')}
                </LI>
                <LI>
                    <b>Señado: </b> {contract.hasPayedDeposit ? 'Sí' : 'No'}
                </LI>
                <LI>
                    <b>Cancelado: </b> {contract.hasPayedRemainingAmount ? 'Sí' : 'No'}
                </LI>
                <LI>
                    <b>Fecha Inicio del Evento: </b>{' '}
                    {new Date(contract.contractStartDatetime).toLocaleDateString('es-ES')}
                </LI>
                <LI>
                    <b>Fecha Fin del Evento: </b>{' '}
                    {new Date(contract.contractEndDatetime).toLocaleDateString('es-ES')}
                </LI>
                <LI>
                    <b>N° de Locacion: </b> {contract.houseNumber}
                </LI>
                <LI>
                    <b>N° de Unidad: </b> {contract.houseUnit}
                </LI>
                <LI>
                    <b>Sucursal: </b> {contract.office.name} - {contract.office.street}{' '}
                    {contract.office.houseNumber}
                </LI>
            </UL>
        </ScrollableContainer>
    );
};

export default ContractsByIdDetailsTab;
