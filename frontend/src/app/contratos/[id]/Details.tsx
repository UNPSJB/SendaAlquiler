import { PropsWithChildren } from 'react';

import { formatDateTimeHr } from '@/modules/dayjs/utils';
import { formatDateTime } from '@/modules/dayjs/utils';

import { ContractByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const ContractsByIdDetailsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <>
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
            <div className="mb-8">
                <UL>
                    <h1 className="mb-3 text-xl font-bold">Detalles del Contrato</h1>
                    <LI>
                        <b>Estado: </b>
                        {contract.latestHistoryEntry?.status}
                    </LI>
                    <LI>
                        <b>Vencimiento: </b> {formatDateTime(contract.expirationDate)}
                    </LI>
                    <LI>
                        <b>Fecha Inicio del Evento: </b>{' '}
                        {formatDateTimeHr(contract.contractStartDatetime)}
                    </LI>
                    <LI>
                        <b>Fecha Fin del Evento: </b>{' '}
                        {formatDateTimeHr(contract.contractEndDatetime)}
                    </LI>
                    <LI>
                        <b>N° de Locacion: </b> {contract.houseNumber}
                    </LI>
                    <LI>
                        <b>N° de Unidad: </b> {contract.houseUnit}
                    </LI>
                    <LI>
                        <b>Sucursal: </b> {contract.office.name} -{' '}
                        {contract.office.street} {contract.office.houseNumber}
                    </LI>
                </UL>
            </div>
        </>
    );
};

export default ContractsByIdDetailsTab;
