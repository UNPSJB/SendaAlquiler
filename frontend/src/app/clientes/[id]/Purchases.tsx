import Link from 'next/link';

import { PropsWithChildren } from 'react';

import { usePurchasesByClientId } from '@/api/hooks';

import { formatDateTime } from '@/modules/dayjs/utils';

import { PurchasesByClientIdTabComponentProps } from './page';

import Button from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const ClientByIdPurchasesTab: React.FC<PurchasesByClientIdTabComponentProps> = ({
    id,
}) => {
    const usePurchasesByClientIdResult = usePurchasesByClientId(id as string);

    return (
        <FetchedDataRenderer
            {...usePurchasesByClientIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener las compras"
                    line1="Hubo un error al obtener las compras del cliente."
                />
            }
        >
            {({ purchasesByClientId }) => (
                <>
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Compras{' '}
                            <span className="text-base font-extralight">
                                ({purchasesByClientId.length})
                            </span>
                        </h1>
                        <Button href="/ventas/add" className="mr-4 mt-8">
                            + Añadir Compra
                        </Button>
                    </div>

                    <UL>
                        {purchasesByClientId.map((purchase) => (
                            <div
                                key={purchase.id}
                                className="mb-4 mr-4 mt-8 rounded-md border bg-white "
                            >
                                <div className="flex border-b p-4 font-bold">
                                    <h2>{formatDateTime(purchase.createdOn)}</h2>
                                </div>
                                <div className="my-2">
                                    {purchase.purchaseItems.map((item) => {
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex justify-between px-4 py-1"
                                            >
                                                <h2 className="text-gray-400">
                                                    {item.product.name}{' '}
                                                    {item.product.brand?.name}
                                                </h2>
                                                <p className=" text-gray-400">
                                                    {item.quantity} u. x $
                                                    {item.product.price}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between border-b px-2 pb-2">
                                    <p className="ml-2 font-bold">Total</p>
                                    <b className="text-xl font-normal">
                                        ${purchase.total}
                                    </b>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        href={``}
                                        passHref
                                        className="border-x px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Comprar de nuevo
                                    </Link>
                                    <Link
                                        href={`/ventas/${purchase.id}`}
                                        passHref
                                        className=" px-8 py-4  font-bold text-gray-500 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                    >
                                        Ver mas detalles
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </UL>
                </>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdPurchasesTab;
