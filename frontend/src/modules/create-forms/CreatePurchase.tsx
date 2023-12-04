'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';
import {
    FormProvider,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { ClientsQuery } from '@/api/graphql';
import { useCreatePurchase, useClients } from '@/api/hooks';

import ProductPurchaseOrderField, {
    ProductQuantityPair,
} from './components/fields/ProductPurchaseOrderField';

import Button, { ButtonVariant } from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

import { RHFFormField } from '../forms/FormField';
import { Input } from '../forms/Input';
import Label from '../forms/Label';
import RHFSelect from '../forms/Select';

type CreatePurchaseFormProps = {
    cancelHref: string;
};

type FormValues = {
    client?: {
        label: string;
        value: string;
        data: ClientsQuery['clients']['results'][0];
    };
    productsAndQuantity: ProductQuantityPair[];
};

const CreatePurchaseForm: React.FC<CreatePurchaseFormProps> = ({ cancelHref }) => {
    const clientsResult = useClients();
    const formMethods = useForm<FormValues>();
    const { watch, control, setValue } = formMethods;
    const router = useRouter();

    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    const { mutate, isLoading: isMutating } = useCreatePurchase({
        onSuccess: (data) => {
            const error = data.createPurchase?.error;
            if (error || !data.createPurchase) {
                toast.error(error || 'No se pudo crear la venta');
            }

            const purchase = data.createPurchase?.purchase;
            if (purchase) {
                toast.success('Venta creada exitosamente');
                router.push('/ventas');
            }
        },
    });

    const client = watch('client')?.data;
    const productsAndQuantity = watch('productsAndQuantity');
    const subtotal = productsAndQuantity?.reduce((acc, curr) => {
        const product = curr.product?.data;
        const quantity = curr.quantity;
        if (product && quantity) {
            return acc + product.price * quantity;
        }
        return acc;
    }, 0);

    const formIsValid = formMethods.formState.isValid;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const client = data.client?.data.id;
        const products = data.productsAndQuantity
            ? data.productsAndQuantity.map((productAndQuantity) => ({
                  product: productAndQuantity.product?.data.id as string,
                  quantity: productAndQuantity.quantity as number,
              }))
            : null;

        if (!client || !products || products.length === 0) {
            return;
        }

        mutate({
            purchaseData: {
                client: client,
                products: products,
            },
        });
    };

    const onError: SubmitErrorHandler<FormValues> = () => {
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
                        <h1 className="py-8 pl-10 text-3xl font-black">Venta</h1>

                        <div className="space-x-4">
                            <Button
                                variant={ButtonVariant.OUTLINE_WHITE}
                                href={cancelHref}
                            >
                                Cancelar
                            </Button>

                            <ButtonWithSpinner
                                onClick={formMethods.handleSubmit(onSubmit, onError)}
                                variant={ButtonVariant.BLACK}
                                href={cancelHref}
                                disabled={formIsValid}
                                isLoading={isMutating}
                            >
                                Guardar
                            </ButtonWithSpinner>
                        </div>
                    </div>
                </div>
            </header>

            <FetchedDataRenderer
                {...clientsResult.queryResult}
                Loading={
                    <main className="flex min-h-screen items-center justify-center pb-16 pt-36">
                        <Spinner />
                    </main>
                }
                Error={
                    <main className="flex min-h-screen items-center pb-16 pt-36">
                        <div className="container flex w-full justify-center">
                            <FetchStatusMessageWithDescription
                                title="No se pudo cargar la lista de clientes"
                                line1="Por favor, intenta recargar la página."
                            />
                        </div>
                    </main>
                }
            >
                {({ clients: { results: clients } }) => (
                    <FormProvider {...formMethods}>
                        <main className="container pb-16 pt-36">
                            <section className="flex pb-8">
                                <div className="w-3/12">
                                    <h2 className="text-xl font-bold">
                                        Detalles de facturación
                                    </h2>
                                </div>

                                <div className="w-9/12 space-y-6">
                                    <RHFFormField label="Cliente" fieldID="client">
                                        <RHFSelect
                                            placeholder="Selecciona un cliente"
                                            name="client"
                                            control={control}
                                            rules={{ required: true }}
                                            options={clients.map((client) => ({
                                                label: `${client.firstName} ${client.lastName}`,
                                                value: client.id,
                                                data: client,
                                            }))}
                                        />
                                    </RHFFormField>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Nombre"
                                                htmlFor="client.firstName"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.firstName"
                                                    name="client.firstName"
                                                    type="text"
                                                    placeholder="Nombre"
                                                    value={client?.firstName || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>

                                        <div className="w-1/2">
                                            <Label
                                                label="Apellido"
                                                htmlFor="client.lastName"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.lastName"
                                                    name="client.lastName"
                                                    type="text"
                                                    placeholder="Apellido"
                                                    value={client?.lastName || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Teléfono"
                                                htmlFor="client.phone"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.phone"
                                                    name="client.phone"
                                                    type="text"
                                                    placeholder="Teléfono"
                                                    value={
                                                        client
                                                            ? `+${client?.phoneCode}${client?.phoneNumber}`
                                                            : ''
                                                    }
                                                    readOnly
                                                />
                                            </Label>
                                        </div>

                                        <div className="w-1/2">
                                            <Label
                                                label="Correo"
                                                htmlFor="client.email"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.email"
                                                    name="client.email"
                                                    type="text"
                                                    placeholder="Correo"
                                                    value={client?.email || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <Label label="DNI" htmlFor="client.dni" readOnly>
                                        <Input
                                            id="client.dni"
                                            name="client.dni"
                                            type="text"
                                            placeholder="DNI"
                                            value={client?.dni || ''}
                                            readOnly
                                        />
                                    </Label>

                                    <Label
                                        label="Provincia"
                                        htmlFor="client.state"
                                        readOnly
                                    >
                                        <Input
                                            id="client.state"
                                            name="client.state"
                                            type="text"
                                            placeholder="Provincia"
                                            value={client?.locality.state || ''}
                                            readOnly
                                        />
                                    </Label>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Ciudad"
                                                htmlFor="client.locality"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.locality"
                                                    name="client.locality"
                                                    type="text"
                                                    placeholder="Ciudad"
                                                    value={client?.locality.name || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>

                                        <div className="w-1/2">
                                            <Label
                                                label="Código Postal"
                                                htmlFor="client.postalCode"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.postalCode"
                                                    name="client.postalCode"
                                                    type="text"
                                                    placeholder="Código Postal"
                                                    value={
                                                        client?.locality.postalCode || ''
                                                    }
                                                    readOnly
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Calle"
                                                htmlFor="client.streetName"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.streetName"
                                                    name="client.streetName"
                                                    type="text"
                                                    placeholder="Calle"
                                                    value={client?.streetName || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>

                                        <div className="w-1/2">
                                            <Label
                                                label="N° de casa"
                                                htmlFor="client.houseNumber"
                                                readOnly
                                            >
                                                <Input
                                                    id="client.houseNumber"
                                                    name="client.houseNumber"
                                                    type="text"
                                                    placeholder="N° de casa"
                                                    value={client?.houseNumber || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <Label
                                        label="Apartamento, habitación, unidad, etc"
                                        htmlFor="client.houseUnit"
                                        readOnly
                                    >
                                        <Input
                                            id="client.houseUnit"
                                            name="client.houseUnit"
                                            type="text"
                                            placeholder="Apartamento, habitación, unidad, etc"
                                            value={client?.houseUnit || ''}
                                            readOnly
                                        />
                                    </Label>

                                    <Label
                                        label="Nota/Aclaración"
                                        htmlFor="client.note"
                                        readOnly
                                    >
                                        <Input
                                            id="client.note"
                                            name="client.note"
                                            type="text"
                                            placeholder="Nota/aclaración"
                                            value={undefined}
                                            readOnly
                                        />
                                    </Label>
                                </div>
                            </section>

                            <section className="flex border-t border-gray-200 py-8">
                                <h2 className="w-3/12 text-xl font-bold">
                                    Productos comprados
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    <ProductPurchaseOrderField<
                                        FormValues,
                                        'productsAndQuantity'
                                    >
                                        control={control}
                                        name="productsAndQuantity"
                                    />
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <div className="w-1/2 rounded border border-gray-200 p-6">
                                    <table className="w-full font-headings">
                                        <thead>
                                            <tr></tr>
                                            <tr></tr>
                                        </thead>
                                        <tbody>
                                            <tr className="align-bottom">
                                                <td className="font-bold">TOTAL ARS</td>
                                                <td className="text-right text-4xl font-bold">
                                                    {subtotal}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </main>
                    </FormProvider>
                )}
            </FetchedDataRenderer>
        </>
    );
};

export default CreatePurchaseForm;
