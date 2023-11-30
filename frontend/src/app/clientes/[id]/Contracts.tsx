import { PropsWithChildren } from 'react';

import { useRentalContractsByClientId } from '@/api/hooks';

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

const ContratoAlquiler = {
    id: '',
    createdOn: '',
    currentHistory: {
        status: '',
    },
    expirationDate: '',
    contractStartDatetime: '',
    contractEndDatetime: '',
    locality: {
        name: '',
        state: '',
    },
    houseNumber: '',
    streetName: '',
    houseUnit: '',
    rentalContractItems: [
        {
            product: {
                name: '',
                brand: {
                    name: '',
                },
                price: 0,
            },
            quantity: '',
        },
    ],
    total: 0,
};

const contratosFicticios = [
    {
        ...ContratoAlquiler,
        id: '1',
        createdOn: '2023-01-01',
        currentHistory: { status: 'Presupuestado' },
        expirationDate: '2023-12-31',
        contractStartDatetime: '2023-01-15',
        contractEndDatetime: '2024-01-15',
        locality: { name: 'Ciudad A', state: 'Estado A' },
        houseNumber: '123',
        streetName: 'Calle Principal',
        houseUnit: 'A',
        rentalContractItems: [
            {
                product: {
                    name: 'Producto 1',
                    brand: { name: 'Marca 1' },
                    price: 50,
                },
                quantity: 30,
            },
            {
                product: {
                    name: 'Producto 2',
                    brand: { name: 'Marca 2' },
                    price: 75,
                },
                quantity: 20,
            },
        ],
        total: 125,
    },
    {
        ...ContratoAlquiler,
        id: '2',
        createdOn: '2023-02-01',
        currentHistory: { status: 'Finalizado' },
        expirationDate: '2024-02-28',
        contractStartDatetime: '2023-02-15',
        contractEndDatetime: '2024-02-15',
        locality: { name: 'Ciudad B', state: 'Estado B' },
        houseNumber: '456',
        streetName: 'Avenida Principal',
        houseUnit: 'B',
        rentalContractItems: [
            {
                product: {
                    name: 'Producto 3',
                    brand: { name: 'Marca 3' },
                    price: 100,
                },
                quantity: 10,
            },
        ],
        total: 100,
    },
    // Agrega más instancias según tus necesidades
];

const redirigirAContrato = (id: string) => {
    window.location.href = `/contratos/${id}`;
};

const ClientByIdContractsTab: React.FC<RentalContractsByClientIdTabComponentProps> = ({
    id,
}) => {
    const useRentalContractsByClientIdResult = useRentalContractsByClientId(id as string);

    return (
        <>
            {/* <FetchedDataRenderer
            {...useRentalContractsByClientIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener las compras"
                    line1="Hubo un error al obtener las compras del cliente."
                />
            } */}

            <>
                <div className="flex items-center justify-between">
                    <h1 className="pt-4 text-xl font-bold">
                        Contratos{' '}
                        <span className="text-base font-extralight">
                            ({contratosFicticios.length})
                        </span>
                    </h1>
                    <Button href="/contratos/add" className="mr-4 mt-8">
                        + Añadir Contrato
                    </Button>
                </div>
                {/* {({ rentalContractsByClientId }) => ( */}
                <UL>
                    {/* {rentalContractsByClientId.map((contract) => ( */}
                    <div className="mb-4 mr-4 mt-8 rounded-md border bg-white ">
                        <div className="flex justify-between border-b-2 px-4 pt-3">
                            <h2 className="mt-2">
                                {contratosFicticios[0].contractStartDatetime} -{' '}
                                {contratosFicticios[0].contractEndDatetime}
                            </h2>

                            <div className="mb-3 flex rounded-full border border-black px-4 py-1 ">
                                <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-orange-500 "></div>
                                <b>Presupuestado</b>
                            </div>
                        </div>
                        <div className="h-full border-b-2 px-4 py-2 text-gray-400">
                            <LI>
                                <SN>Contrato creado el:</SN>{' '}
                                {contratosFicticios[0].createdOn}
                            </LI>
                            <LI>
                                <SN>Fecha Vencimiento:</SN>{' '}
                                {contratosFicticios[0].expirationDate}{' '}
                            </LI>
                            <LI>
                                <SN>Locación:</SN> {contratosFicticios[0].streetName}{' '}
                                {contratosFicticios[0].houseNumber}{' '}
                                {contratosFicticios[0].locality.name}{' '}
                                {contratosFicticios[0].locality.state}{' '}
                            </LI>
                        </div>
                        <div>
                            <div className="mt-2 flex justify-between px-4">
                                <h2 className="text-gray-400">
                                    {
                                        contratosFicticios[0].rentalContractItems[0]
                                            .product.name
                                    }{' '}
                                    {
                                        contratosFicticios[0].rentalContractItems[0]
                                            .product.brand?.name
                                    }
                                </h2>
                                <p className=" text-gray-400">
                                    {
                                        contratosFicticios[0].rentalContractItems[0]
                                            .quantity
                                    }{' '}
                                    u. x $
                                    {
                                        contratosFicticios[0].rentalContractItems[0]
                                            .product.price
                                    }
                                </p>
                            </div>
                        </div>
                        <div className=" flex justify-between border-b-2 p-2">
                            <p className="ml-2 font-bold">Total</p>
                            <b className="text-xl font-normal">
                                ${contratosFicticios[0].total}
                            </b>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                    redirigirAContrato(contratosFicticios[0].id)
                                }
                                className="border-x-2 px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                            >
                                Ver mas detalles
                            </button>
                            <button
                                onClick={''}
                                className="border-x-2 px-8 py-4  font-bold text-gray-500 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                            >
                                Señar contrato
                            </button>
                        </div>
                    </div>
                    {/* ) */}
                </UL>
            </>
        </>
        // )}
        // </FetchedDataRenderer>
    );
};

export default ClientByIdContractsTab;
