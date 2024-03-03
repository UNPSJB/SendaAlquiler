'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ClientsQuery, ProductsQuery, SaleOrderItemInput } from '@/api/graphql';
import { useCreateSale, useClients } from '@/api/hooks';

import { SaleFormEditorBilling } from './sale-form-editor-billing';
import { SaleFormEditorOrders } from './sale-form-editor-orders';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { formatNumberAsPrice } from '@/lib/utils';

type CreateSaleFormProps = {
    cancelHref: string;
};

type ProductDetails = ProductsQuery['products']['results'][0];

export enum SaleFormEditorDiscountType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount',
    NONE = 'none',
}

export type SaleFormEditorValues = {
    client?: {
        label: string;
        value: string;
        data: ClientsQuery['clients']['results'][0];
    };
    orders:
        | {
              product: {
                  value: string;
                  label: string;
                  data: ProductDetails;
              } | null;
              quantity: number | null;
              discountPercentage: number | null;
              discountAmount: number | null;
              discountType: SaleFormEditorDiscountType | null;
          }[]
        | undefined;
};

export const SaleFormEditor: React.FC<CreateSaleFormProps> = ({ cancelHref }) => {
    const clientsResult = useClients();
    const formMethods = useForm<SaleFormEditorValues>();
    const { watch, setValue } = formMethods;
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    const { mutate, isPending: isMutating } = useCreateSale();

    const orders = watch('orders');
    const subtotal = (orders || []).reduce((acc, order) => {
        const product = order.product?.data;
        const quantity = order.quantity || 0;

        const productPrice = product?.price || 0;
        const productSubtotal = productPrice * quantity;

        return acc + productSubtotal;
    }, 0);
    const discount = (orders || []).reduce((acc, order) => {
        const discountAmount = order.discountAmount || 0;
        return acc + discountAmount;
    }, 0);
    const total = subtotal - discount;

    const onSubmit: SubmitHandler<SaleFormEditorValues> = (data) => {
        const client = data.client?.data.id;
        const orders = data.orders
            ? data.orders.map((order) => {
                  const next: SaleOrderItemInput = {
                      product: order.product?.data.id as string,
                      quantity: order.quantity as number,
                      discount: order.discountAmount || 0,
                  };

                  return next;
              })
            : null;

        if (!client || !orders || orders.length === 0) {
            return;
        }

        mutate(
            {
                saleData: {
                    client: client,
                    orders: orders,
                },
            },
            {
                onSuccess: (data) => {
                    const error = data.createSale?.error;
                    if (error || !data.createSale) {
                        toast.error(error || 'No se pudo crear la venta');
                    }

                    const sale = data.createSale?.sale;
                    if (sale) {
                        toast.success('Venta creada exitosamente');
                        router.push('/ventas');
                    }
                },
                onError: () => {
                    toast.error('No se pudo crear la venta');
                },
            },
        );
    };

    const onError: SubmitErrorHandler<SaleFormEditorValues> = () => {
        toast.error('No se pudo crear la venta. Por favor, revisa los datos ingresados.');
    };

    useEffect(() => {
        if (clientId) {
            const client = clientsResult.queryResult.data?.clients.results.find(
                (client) => client.id === clientId,
            );

            if (client) {
                setValue('client', {
                    label: `${client.firstName} ${client.lastName}`,
                    value: client.id,
                    data: client,
                });
            }
        }
    }, [clientId, clientsResult.queryResult.data, setValue]);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 border-b border-black bg-white">
                <div className="container flex justify-between">
                    <div className="relative">
                        <div className="absolute inset-0 left-[-999rem] bg-black"></div>

                        <Link
                            className="relative block bg-black py-8 pl-4 pr-12 font-headings text-3xl font-black text-white"
                            href="/"
                        >
                            SENDA
                        </Link>
                    </div>

                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="py-8 pl-8 text-3xl font-black">Venta</h1>

                        <div className="space-x-4">
                            {cancelHref && (
                                <Button variant="secondary" asChild>
                                    <Link href={cancelHref}>Cancelar</Link>
                                </Button>
                            )}

                            <ButtonWithSpinner
                                onClick={formMethods.handleSubmit(onSubmit, onError)}
                                showSpinner={isMutating}
                            >
                                Guardar
                            </ButtonWithSpinner>
                        </div>
                    </div>
                </div>
            </header>

            <Form {...formMethods}>
                <main className="container pb-16 pt-36">
                    <SaleFormEditorBilling />
                    <SaleFormEditorOrders />

                    <div className="flex justify-end">
                        <div className="w-1/2 rounded border border-gray-200 p-6">
                            <table className="w-full font-headings">
                                <thead>
                                    <tr></tr>
                                    <tr></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>SUBTOTAL ARS</td>
                                        <td className="text-right">
                                            ${formatNumberAsPrice(subtotal)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>DESCUENTO ARS</td>
                                        <td className="text-right">
                                            ${formatNumberAsPrice(discount)}
                                        </td>
                                    </tr>

                                    <tr className="align-bottom">
                                        <td className="pt-4 font-bold">TOTAL ARS</td>
                                        <td className="pt-4 text-right text-2xl font-bold">
                                            ${formatNumberAsPrice(total)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </Form>
        </>
    );
};
