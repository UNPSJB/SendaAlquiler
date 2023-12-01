'use client';

import { useParams } from 'next/navigation';

import { PurchaseByIdQuery } from '@/api/graphql';
import { usePurchaseById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import { formatDateTime } from '@/modules/dayjs/utils';
import ChevronRight from '@/modules/icons/ChevronRight';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (firstName: string, lastName: string) => {
    return (firstName[0] + lastName[0]).toUpperCase();
};

const getDasboardTitle = (purchase: PurchaseByIdQuery['purchaseById'] | undefined) => {
    if (!purchase) {
        return <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Ventas</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">
                {purchase.client.firstName} {purchase.client.lastName} / #{purchase.id}
            </span>
        </div>
    );
};

const Page = () => {
    const { id } = useParams();
    const usePurchaseByIdResult = usePurchaseById(id as string);

    const purchase = usePurchaseByIdResult.data?.purchaseById;

    return (
        <DashboardLayout header={getDasboardTitle(purchase)}>
            <FetchedDataRenderer
                {...usePurchaseByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar la venta."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ purchaseById: purchase }) => {
                    if (!purchase) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que la venta que buscas no existe."
                                    btnHref="/ventas"
                                    btnText='Volver a "Ventas"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-10">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(
                                            purchase.client.firstName,
                                            purchase.client.lastName,
                                        )}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {purchase.client.firstName}{' '}
                                            {purchase.client.lastName}
                                        </h1>
                                        <p>
                                            {purchase.client.email} |{' '}
                                            {purchase.client.phoneCode}
                                            {purchase.client.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            </header>

                            <div className="flex-1 bg-gray-100 px-0">
                                <section className="mt-8 items-center pl-10">
                                    <div className="mb-4 flex">
                                        <div className="pl-4">
                                            <h1 className="text-xl font-bold">
                                                Venta #{purchase.id}
                                            </h1>
                                            <p className=" text-base">
                                                {formatDateTime(purchase.createdOn)}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {purchase.purchaseItems.map((item, index) => (
                                            <div
                                                key={index}
                                                className="mb-2 mr-8 rounded-md border bg-white"
                                            >
                                                <div className="flex justify-between border-b px-4 pb-2 pt-4">
                                                    <h2 className="text-gray-500">
                                                        {item.product.name}{' '}
                                                        {item.product.brand?.name}
                                                    </h2>
                                                    <p className=" text-gray-500">
                                                        {item.quantity} u. x $
                                                        {item.product.price}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between px-4 py-2">
                                                    <p className="font-bold">Subtotal </p>
                                                    <p className="font-bold">
                                                        $ {item.total}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mr-8 mt-8 flex justify-between border-t pr-2 pt-2">
                                        <p className="ml-4 text-lg font-bold">Total</p>
                                        <b className="text-xl">${purchase.total}</b>
                                    </div>
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;
