import { PropsWithChildren } from 'react';

import { usePurchasesByClientId } from '@/api/hooks';

import { PurchasesByClientIdTabComponentProps } from './page';

import Button from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const Compra = {
    id: '',
    createdOn: '',
    total: 0,
    purchaseItems: [
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
};

const comprasFicticias = [
    {
        ...Compra,
        id: '1',
        createdOn: '2023-01-01',
        total: 150,
        purchaseItems: [
            {
                product: {
                    name: 'Producto 1',
                    brand: { name: 'Marca 1' },
                    price: 50,
                },
                quantity: 2,
            },
            {
                product: {
                    name: 'Producto 2',
                    brand: { name: 'Marca 2' },
                    price: 25,
                },
                quantity: 4,
            },
        ],
    },
    {
        ...Compra,
        id: '2',
        createdOn: '2023-02-01',
        total: 100,
        purchaseItems: [
            {
                product: {
                    name: 'Producto 3',
                    brand: { name: 'Marca 3' },
                    price: 100,
                },
                quantity: 1,
            },
        ],
    },
    // Agrega más instancias según tus necesidades
];

const redirigirACompra = (id: string) => {
    window.location.href = `/ventas/${id}`;
};

const ClientByIdPurchasesTab: React.FC<PurchasesByClientIdTabComponentProps> = ({
    id,
}) => {
    const usePurchasesByClientIdResult = usePurchasesByClientId(id as string);

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="pt-4 text-xl font-bold">
                    Contratos{' '}
                    <span className="text-base font-extralight">
                        ({comprasFicticias.length})
                    </span>
                </h1>
                <Button href="/ventas/add" className="mr-4 mt-8">
                    + Añadir Compra
                </Button>
            </div>
            <UL>
                <div className="mb-4 mr-4 mt-8 rounded-md border bg-white ">
                    <div className="flex border-b-2 p-4 font-bold">
                        <h2>{comprasFicticias[0].createdOn}</h2>
                    </div>
                    <div>
                        <div className="mt-2 flex justify-between px-4">
                            <h2 className="text-gray-400">
                                {comprasFicticias[0].purchaseItems[0].product.name}{' '}
                                {comprasFicticias[0].purchaseItems[0].product.brand?.name}
                            </h2>
                            <p className=" text-gray-400">
                                {comprasFicticias[0].purchaseItems[0].quantity} u. x $
                                {comprasFicticias[0].purchaseItems[0].product.price}
                            </p>
                        </div>
                    </div>
                    <div className=" flex justify-between border-b-2 p-2">
                        <p className="ml-2 font-bold">Total</p>
                        <b className="text-xl font-normal">
                            ${comprasFicticias[0].total}
                        </b>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={''}
                            className="border-x-2 px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                        >
                            Comprar de nuevo
                        </button>
                        <button
                            onClick={() => redirigirACompra(comprasFicticias[0].id)}
                            className="border-x-2 px-8 py-4  font-bold text-gray-500 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                        >
                            Ver mas detalles
                        </button>
                    </div>
                </div>
            </UL>
        </>
    );
};

export default ClientByIdPurchasesTab;
