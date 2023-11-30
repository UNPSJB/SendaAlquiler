import Link from 'next/link';

import clsx from 'clsx';
import dayjs from 'dayjs';
import { PropsWithChildren } from 'react';

import { RentalContractStatusChoices } from '@/api/graphql';
import { useRentalContractsByClientId } from '@/api/hooks';

import { getDayNameFromDayjs, getMonthNameFromDayjs } from '@/modules/dayjs/utils';

import { RentalContractsByClientIdTabComponentProps } from './page';

import Button from '@/components/Button';
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
    return <span className="font-medium text-black">{children}</span>;
};

const dataByStatus: Record<
    RentalContractStatusChoices,
    {
        bg: string;
        text: string;
    }
> = {
    [RentalContractStatusChoices.Presupuestado]: {
        bg: 'bg-orange-500',
        text: 'Presupuestado',
    },
    [RentalContractStatusChoices.ConDeposito]: {
        bg: 'bg-yellow-500',
        text: 'Señado',
    },
    [RentalContractStatusChoices.Activo]: {
        bg: 'bg-blue-500',
        text: 'Enviado',
    },
    [RentalContractStatusChoices.Pagado]: {
        bg: 'bg-green-500',
        text: 'Aceptado',
    },
    [RentalContractStatusChoices.Cancelado]: {
        bg: 'bg-red-500',
        text: 'Rechazado',
    },
    [RentalContractStatusChoices.DevolucionExitosa]: {
        bg: '',
        text: '',
    },
    [RentalContractStatusChoices.DevolucionFallida]: {
        bg: '',
        text: '',
    },
    [RentalContractStatusChoices.Finalizado]: {
        bg: '',
        text: '',
    },
    [RentalContractStatusChoices.Vencido]: {
        bg: '',
        text: '',
    },
};

type StatusIndicatorProps = { status: RentalContractStatusChoices };

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
    return (
        <>
            <div
                className={clsx(
                    'mr-2 mt-1 h-4 w-4 rounded-full',
                    dataByStatus[status].bg,
                )}
            ></div>
            <b>{dataByStatus[status].text}</b>
        </>
    );
};

const formatDateTime = (datetime: string) => {
    const dateTimeDayjs = dayjs(datetime);

    return `${getDayNameFromDayjs(dateTimeDayjs)} ${dateTimeDayjs.get(
        'date',
    )} de ${getMonthNameFromDayjs(dateTimeDayjs)} del ${dateTimeDayjs.get(
        'year',
    )} a las ${dateTimeDayjs.format('HH:mm')}`;
};

const ClientByIdContractsTab: React.FC<RentalContractsByClientIdTabComponentProps> = ({
    id,
}) => {
    const useRentalContractsByClientIdResult = useRentalContractsByClientId(id as string);

    return (
        <FetchedDataRenderer
            {...useRentalContractsByClientIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener las compras"
                    line1="Hubo un error al obtener las compras del cliente."
                />
            }
        >
            {({ rentalContractsByClientId }) => (
                <>
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Contratos{' '}
                            <span className="text-base font-extralight">
                                ({rentalContractsByClientId.length})
                            </span>
                        </h1>
                        <Button href="/contratos/add" className="mr-4 mt-8">
                            + Añadir Contrato
                        </Button>
                    </div>

                    <UL>
                        {rentalContractsByClientId.map((contract) => (
                            <div
                                className="mb-4 mr-4 mt-8 rounded-md border bg-white "
                                key={contract.id}
                            >
                                <div className="flex justify-between border-b-2 px-4 pt-3">
                                    <h2 className="mt-2">
                                        {formatDateTime(contract.contractStartDatetime)} -{' '}
                                        {formatDateTime(contract.contractEndDatetime)}
                                    </h2>

                                    <div className="mb-3 flex rounded-full border border-black px-4 py-1 ">
                                        <StatusIndicator
                                            status={contract.currentHistory!.status}
                                        />
                                    </div>
                                </div>
                                <div className="h-full border-b-2 px-4 py-2 text-gray-400">
                                    <LI>
                                        <SN>Contrato creado el:</SN> {contract.createdOn}
                                    </LI>
                                    <LI>
                                        <SN>Fecha Vencimiento:</SN>{' '}
                                        {contract.expirationDate}{' '}
                                    </LI>
                                    <LI>
                                        <SN>Locación:</SN> {contract.streetName}{' '}
                                        {contract.houseNumber} {contract.locality.name}{' '}
                                        {contract.locality.state}{' '}
                                    </LI>
                                </div>
                                <div>
                                    <div className="mt-2 flex justify-between px-4">
                                        {contract.rentalContractItems.map((item) => {
                                            return (
                                                <li key={item.id}>
                                                    <h2 className="text-gray-400">
                                                        {
                                                            contract
                                                                .rentalContractItems[0]
                                                                .product.name
                                                        }{' '}
                                                        {
                                                            contract
                                                                .rentalContractItems[0]
                                                                .product.brand?.name
                                                        }
                                                    </h2>
                                                    <p className=" text-gray-400">
                                                        {
                                                            contract
                                                                .rentalContractItems[0]
                                                                .quantity
                                                        }{' '}
                                                        u. x $
                                                        {
                                                            contract
                                                                .rentalContractItems[0]
                                                                .product.price
                                                        }
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className=" flex justify-between border-b-2 p-2">
                                    <p className="ml-2 font-bold">Total</p>
                                    <b className="text-xl font-normal">
                                        ${contract.total}
                                    </b>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href={`/contratos/${contract.id}`}
                                        className="border-x-2 px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Ver mas detalles
                                    </Link>
                                    <button
                                        onClick={() => {}}
                                        className="border-x-2 px-8 py-4  font-bold text-gray-500 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Señar contrato
                                    </button>
                                </div>
                            </div>
                        ))}
                    </UL>
                </>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdContractsTab;
