'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { differenceInCalendarDays } from 'date-fns';
import { useEffect } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { ContractItemInput, ProductsQuery, StateChoices } from '@/api/graphql';
import { useCreateContract, useClients } from '@/api/hooks';

import { ContractFormEditorDiscountType } from '@/app/(dashboard)/contratos/add/page';

import { ContractFormEditorBilling } from './contract-form-editor-billing';
import { ContractFormEditorDetails } from './contract-form-editor-details';
import { ContractFormEditorOrders } from './contract-form-editor-orders';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { formatNumberAsPrice } from '@/lib/utils';

type CreateContractFormProps = {
    cancelHref: string;
    defaultValues?: ContractFormEditorValues;
};

type ProductDetails = ProductsQuery['products']['results'][0];

export type ContractFormEditorValues = {
    client?: {
        label: string;
        value: string;
        data: {
            firstName: string;
            lastName: string;
            email: string;
            phoneCode: string;
            phoneNumber: string;
            dni: string;
            streetName: string;
            houseNumber: string;
            houseUnit: string | null;
            locality: {
                id: string;
                name: string;
                state: StateChoices;
                postalCode: string;
            };
        };
    };
    orders:
        | {
              product:
                  | {
                        value: string;
                        label: string;
                        data: ProductDetails;
                    }
                  | null
                  | undefined;

              quantity: number | null | undefined;
              services:
                  | ({
                        service: {
                            value: string;
                            label: string;
                            data: ProductDetails['services'][0];
                        } | null;
                        serviceDiscountType:
                            | {
                                  value: ContractFormEditorDiscountType;
                                  label: string;
                              }
                            | null
                            | undefined;
                        serviceDiscountPercentage: number | null;
                        serviceDiscountAmount: number | null;
                    } | null)[]
                  | undefined;

              productDiscountType:
                  | {
                        value: ContractFormEditorDiscountType;
                        label: string;
                    }
                  | null
                  | undefined;
              productDiscountPercentage: number | null;
              productDiscountAmount: number | null;
          }[]
        | undefined;
    startDatetime: Date | null | undefined;
    endDatetime: Date | null | undefined;
    expirationDatetime: Date | null | undefined;
    streetName: string | null;
    houseUnit: string | null;
    houseNumber: string | null;
    dni: string | null;
    note: string | null;
    locality: {
        value: string;
        label: string;
    } | null;
};

export const ContractFormEditor: React.FC<CreateContractFormProps> = ({
    cancelHref,
    defaultValues,
}) => {
    const clientsResult = useClients();
    const formMethods = useForm<ContractFormEditorValues>({ defaultValues });
    const { watch, setValue } = formMethods;
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    const { mutate, isPending: isMutating } = useCreateContract();

    const orders = watch('orders');

    const startDatetime = formMethods.watch('startDatetime');
    const endDatetime = formMethods.watch('endDatetime');

    let contractDurationInDays = 0;
    if (startDatetime && endDatetime) {
        contractDurationInDays = differenceInCalendarDays(endDatetime, startDatetime);
    }

    const subtotal = (orders || []).reduce((acc, order) => {
        const product = order.product?.data;
        const quantity = order.quantity || 0;
        const productPrice = product?.price || 0;
        const productSubtotal = productPrice * quantity * contractDurationInDays;

        return (
            acc +
            productSubtotal +
            (order.services || []).reduce((acc, service) => {
                const servicePrice = service?.service?.data.price || 0;
                return acc + servicePrice;
            }, 0)
        );
    }, 0);
    const discount = (orders || []).reduce((acc, order) => {
        let productDiscountAmount = order.productDiscountAmount || 0;
        if (order.productDiscountType?.value === ContractFormEditorDiscountType.NONE) {
            productDiscountAmount = 0;
        }

        return (
            acc +
            productDiscountAmount +
            (order.services || []).reduce((acc, service) => {
                if (
                    service?.serviceDiscountType?.value ===
                    ContractFormEditorDiscountType.NONE
                ) {
                    return acc;
                }

                return acc + (service?.serviceDiscountAmount || 0);
            }, 0)
        );
    }, 0);
    const total = subtotal - discount;

    const onSubmit: SubmitHandler<ContractFormEditorValues> = (data) => {
        const client = data.client?.value;
        const orders = data.orders
            ? data.orders.map((order) => {
                  const next: ContractItemInput = {
                      productDiscount: order.productDiscountAmount,
                      productId: order.product!.data.id,
                      serviceItems: order.services!.map((service) => {
                          const next: NonNullable<ContractItemInput['serviceItems']>[0] =
                              {
                                  discount: service!.serviceDiscountAmount,
                                  serviceId: service!.service!.data.id,
                              };

                          return next;
                      }),
                      quantity: order.quantity!,
                  };

                  return next;
              })
            : null;

        if (
            !client ||
            !orders ||
            orders.length === 0 ||
            !data.startDatetime ||
            !data.endDatetime ||
            !data.locality ||
            !data.houseNumber ||
            !data.streetName
        ) {
            return;
        }

        mutate(
            {
                contractData: {
                    clientId: client,
                    contractStart: data.startDatetime,
                    contractEnd: data.endDatetime,
                    expirationDate: data.expirationDatetime,
                    houseNumber: data.houseNumber,
                    houseUnit: data.houseUnit,
                    localityId: data.locality.value,
                    streetName: data.streetName,
                },
                itemsData: orders,
            },
            {
                onSuccess: (data) => {
                    const error = data.createContract?.error;
                    if (error || !data.createContract) {
                        toast.error(error || 'No se pudo crear el contrato');
                    }

                    const contract = data.createContract?.contractId;
                    if (contract) {
                        toast.success(
                            'Contrato creado exitosamente. Presupuesto enviado por email.',
                        );
                        router.push('/contratos');
                    }
                },
                onError: () => {
                    toast.error(
                        'No se pudo crear el contrato. Por favor, revisa los datos ingresados.',
                    );
                },
            },
        );
    };

    const onError: SubmitErrorHandler<ContractFormEditorValues> = () => {
        toast.error(
            'No se pudo crear el contrato. Por favor, revisa los datos ingresados.',
        );
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
            <header className="border-b border-black bg-white">
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
                        <h1 className="py-8 pl-8 text-3xl font-black">
                            Prespuestar contrato
                        </h1>
                    </div>
                </div>
            </header>

            <Form {...formMethods}>
                <main className="container pb-32 pt-16">
                    <ContractFormEditorBilling />
                    <ContractFormEditorDetails />
                    <ContractFormEditorOrders />

                    <div className="fixed inset-x-0 bottom-0 border-t border-gray-400 bg-white py-4">
                        <div className="container flex items-center justify-between">
                            <table className="w-[300px] font-headings">
                                <thead>
                                    <tr></tr>
                                    <tr></tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-sm">SUBTOTAL ARS</td>
                                        <td className="text-right text-sm">
                                            ${formatNumberAsPrice(subtotal)}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="text-sm">DESCUENTOS ARS</td>
                                        <td className="text-right text-sm">
                                            ${formatNumberAsPrice(discount)}
                                        </td>
                                    </tr>

                                    <tr className="align-bottom">
                                        <td className="pt-2 text-base font-bold">
                                            TOTAL ARS
                                        </td>
                                        <td className="pt-2 text-right text-base font-bold">
                                            ${formatNumberAsPrice(total)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

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
                </main>
            </Form>
        </>
    );
};
