import Link from 'next/link';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { ContractStatusChoices } from '@/api/graphql';
import {
    usePayContractDepositMutation,
    usePayTotalContractMutation,
    useContractsByClientId,
} from '@/api/hooks';

import { formatDateTimeHr } from '@/modules/dayjs/utils';
import { formatDateTime } from '@/modules/dayjs/utils';

import { ContractsByClientIdTabComponentProps } from './page';

import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-medium text-black">{children}</span>;
};

const dataByStatus: Record<
    ContractStatusChoices,
    {
        bg: string;
        text: string;
    }
> = {
    [ContractStatusChoices.Presupuestado]: {
        bg: 'bg-orange-500',
        text: 'Presupuestado',
    },
    [ContractStatusChoices.ConDeposito]: {
        bg: 'bg-yellow-500',
        text: 'Señado',
    },
    [ContractStatusChoices.Activo]: {
        bg: 'bg-blue-500',
        text: 'Enviado',
    },
    [ContractStatusChoices.Pagado]: {
        bg: 'bg-green-500',
        text: 'Aceptado',
    },
    [ContractStatusChoices.Cancelado]: {
        bg: 'bg-red-500',
        text: 'Rechazado',
    },
    [ContractStatusChoices.DevolucionExitosa]: {
        bg: '',
        text: '',
    },
    [ContractStatusChoices.DevolucionFallida]: {
        bg: '',
        text: '',
    },
    [ContractStatusChoices.Finalizado]: {
        bg: '',
        text: '',
    },
    [ContractStatusChoices.Vencido]: {
        bg: '',
        text: '',
    },
};

type StatusIndicatorProps = { status: ContractStatusChoices };

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

type StatusButtonProps = { status: ContractStatusChoices; id: string };

const StatusButton: React.FC<StatusButtonProps> = ({ status, id }) => {
    const { mutate: payContractDeposit } = usePayContractDepositMutation();
    const { mutate: payContractTotal } = usePayTotalContractMutation();

    if (status === ContractStatusChoices.Presupuestado) {
        return (
            <button
                onClick={() => {
                    payContractDeposit(id);
                }}
                className=" px-8 py-4  font-bold text-muted-foreground duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
            >
                Señar contrato
            </button>
        );
    }

    if (status === ContractStatusChoices.ConDeposito) {
        return (
            <button
                onClick={() => {
                    payContractTotal(id);
                }}
                className=" px-8 py-4  font-bold text-muted-foreground duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
            >
                Pagar totalidad del contrato
            </button>
        );
    }

    return null;
};

const ClientByIdContractsTab: React.FC<ContractsByClientIdTabComponentProps> = ({
    id,
}) => {
    const useContractsByClientIdResult = useContractsByClientId(id);

    return (
        <FetchedDataRenderer
            {...useContractsByClientIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener los contratos"
                    line1="Hubo un error al obtener los contratos del cliente."
                />
            }
        >
            {({ contractsByClientId }) => (
                <>
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Contratos{' '}
                            <span className="text-base font-extralight">
                                ({contractsByClientId.length})
                            </span>
                        </h1>
                        <DeprecatedButton
                            href={`/contratos/add?client=${id}`}
                            className="mr-4 mt-8"
                        >
                            + Añadir Contrato
                        </DeprecatedButton>
                    </div>

                    <ul className="mt-8 space-y-8">
                        {contractsByClientId.map((contract) => (
                            <div
                                className="mb-4 mr-4 mt-8 rounded-md border bg-white "
                                key={contract.id}
                            >
                                <div className="flex justify-between border-b px-4 pt-3">
                                    <h2 className="mt-2">
                                        {formatDateTimeHr(contract.contractStartDatetime)}{' '}
                                        - {formatDateTimeHr(contract.contractEndDatetime)}
                                    </h2>

                                    <div className="mb-3 flex rounded-full border border-black px-4 py-1 ">
                                        <StatusIndicator
                                            status={contract.latestHistoryEntry!.status}
                                        />
                                    </div>
                                </div>
                                <div className="h-full border-b px-4 py-2 text-gray-400">
                                    <LI>
                                        <SN>Contrato creado el:</SN>{' '}
                                        {formatDateTime(contract.createdOn)}
                                    </LI>
                                    <LI>
                                        <SN>Fecha Vencimiento:</SN>{' '}
                                        {formatDateTime(contract.expirationDate)}{' '}
                                    </LI>
                                    <LI>
                                        <SN>Locación:</SN> {contract.streetName}{' '}
                                        {contract.houseNumber}, {contract.locality.name},{' '}
                                        {contract.locality.state}
                                    </LI>
                                </div>
                                <div>
                                    <div className="mt-2 px-4">
                                        {contract.contractItems.map((item) => {
                                            return (
                                                <li
                                                    key={item.id}
                                                    className="flex justify-between py-1"
                                                >
                                                    <h2 className="text-gray-400">
                                                        {item.product.name}{' '}
                                                        {item.product.brand?.name}
                                                    </h2>
                                                    <p className=" text-gray-400">
                                                        {item.quantity} u. x $
                                                        {item.product.price}
                                                    </p>
                                                </li>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="mr-2 flex justify-between border-b p-2">
                                    <p className="ml-2 font-bold">Total</p>
                                    <b className="text-xl font-normal">
                                        ${contract.total}
                                    </b>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href={`/contratos/${contract.id}`}
                                        className="border-x px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Ver mas detalles
                                    </Link>

                                    <StatusButton
                                        id={contract.id}
                                        status={contract.latestHistoryEntry!.status}
                                    />
                                </div>
                            </div>
                        ))}
                    </ul>
                </>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdContractsTab;
