'use client';

import Link from 'next/link';

import { FormProvider, useForm } from 'react-hook-form';

import { ClientsQuery } from '@/api/graphql';
import { useClients } from '@/api/hooks';

import LocalityField from './fields/LocalityField';
import ProductsAndQuantityField, {
    ProductQuantityPair,
} from './fields/ProductOrderField';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

import { RHFCustomFlatpickr } from '../forms/Flatpickr';
import { RHFFormField } from '../forms/FormField';
import Input from '../forms/Input';
import Label from '../forms/Label';
import RHFSelect from '../forms/Select';

type CreateContractFormProps = {
    cancelHref: string;
};

type FormValues = {
    client?: {
        label: string;
        value: string;
        data: ClientsQuery['clients'][0];
    };
    test: string;
    productsAndQuantity: ProductQuantityPair[];
    contractStartDatetime: Date[];
    contractEndDatetime: Date[];
};

const CreateContractForm: React.FC<CreateContractFormProps> = ({ cancelHref }) => {
    const clientsResult = useClients();
    const formMethods = useForm<FormValues>();
    const { watch, control } = formMethods;

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
                        <h1 className="py-8 pl-10 text-3xl font-black">
                            Presupuestar contrato
                        </h1>

                        <div className="space-x-4">
                            <Button
                                variant={ButtonVariant.OUTLINE_WHITE}
                                href={cancelHref}
                            >
                                Cancelar
                            </Button>

                            <Button variant={ButtonVariant.BLACK} href={cancelHref}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <FetchedDataRenderer
                {...clientsResult}
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
                {({ clients }) => (
                    <FormProvider {...formMethods}>
                        <main className="container pb-16 pt-36">
                            <section className="flex pb-8">
                                <h2 className="w-3/12 text-xl font-bold">
                                    Detalles de facturación
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    <RHFFormField label="Cliente" fieldID="client">
                                        <RHFSelect
                                            placeholder="Selecciona un cliente"
                                            id="client"
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
                                                htmlFor="billingFirstName"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingFirstName"
                                                    name="billingFirstName"
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
                                                htmlFor="billingLastName"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingLastName"
                                                    name="billingLastName"
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
                                                htmlFor="billingPhone"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingPhone"
                                                    name="billingPhone"
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
                                                htmlFor="billingEmail"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingEmail"
                                                    name="billingEmail"
                                                    type="text"
                                                    placeholder="Correo"
                                                    value={client?.email || ''}
                                                    readOnly
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <Label label="DNI" htmlFor="billingDni" readOnly>
                                        <Input
                                            id="billingDni"
                                            name="billingDni"
                                            type="text"
                                            placeholder="DNI"
                                            value={client?.dni || ''}
                                            readOnly
                                        />
                                    </Label>

                                    <Label
                                        label="Provincia"
                                        htmlFor="billingState"
                                        readOnly
                                    >
                                        <Input
                                            id="billingState"
                                            name="billingState"
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
                                                htmlFor="billingLocality"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingLocality"
                                                    name="billingLocality"
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
                                                htmlFor="billingPostalCode"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingPostalCode"
                                                    name="billingPostalCode"
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
                                                htmlFor="billingStreetName"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingStreetName"
                                                    name="billingStreetName"
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
                                                htmlFor="billingHouseNumber"
                                                readOnly
                                            >
                                                <Input
                                                    id="billingHouseNumber"
                                                    name="billingHouseNumber"
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
                                        htmlFor="billingHouseUnit"
                                        readOnly
                                    >
                                        <Input
                                            id="billingHouseUnit"
                                            name="billingHouseUnit"
                                            type="text"
                                            placeholder="Apartamento, habitación, unidad, etc"
                                            value={client?.houseUnit || ''}
                                            readOnly
                                        />
                                    </Label>

                                    <Label
                                        label="Nota/Aclaración"
                                        htmlFor="billingNote"
                                        readOnly
                                    >
                                        <Input
                                            id="billingNote"
                                            name="billingNote"
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
                                    Detalles de contrato
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    <Label
                                        label="Fecha y hora de inicio"
                                        htmlFor="contractStartDatetime"
                                    >
                                        <RHFCustomFlatpickr
                                            data-enable-time
                                            name="contractStartDatetime"
                                            control={control}
                                            rules={{ required: true }}
                                            placeholder="Fecha y hora de inicio"
                                        />
                                    </Label>

                                    <Label
                                        label="Fecha y hora de finalización"
                                        htmlFor="contractEndDatetime"
                                    >
                                        <RHFCustomFlatpickr
                                            data-enable-time
                                            name="contractEndDatetime"
                                            control={control}
                                            rules={{ required: true }}
                                            placeholder="Fecha y hora de finalización"
                                        />
                                    </Label>

                                    <RHFFormField
                                        label="Localidad"
                                        fieldID="contractLocality"
                                    >
                                        <LocalityField name="contractLocality" />
                                    </RHFFormField>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Calle"
                                                htmlFor="contractStreetName"
                                            >
                                                <Input
                                                    id="contractStreetName"
                                                    name="contractStreetName"
                                                    type="text"
                                                    placeholder="Calle"
                                                />
                                            </Label>
                                        </div>

                                        <div className="w-1/2">
                                            <Label
                                                label="N° de casa"
                                                htmlFor="contractHouseNumber"
                                            >
                                                <Input
                                                    id="contractHouseNumber"
                                                    name="contractHouseNumber"
                                                    type="text"
                                                    placeholder="N° de casa"
                                                />
                                            </Label>
                                        </div>
                                    </div>

                                    <Label
                                        label="Apartamento, habitación, unidad, etc"
                                        htmlFor="contractHouseUnit"
                                        readOnly
                                    >
                                        <Input
                                            id="contractHouseUnit"
                                            name="contractHouseUnit"
                                            type="text"
                                            placeholder="Apartamento, habitación, unidad, etc"
                                        />
                                    </Label>

                                    <Label
                                        label="Nota/Aclaración"
                                        htmlFor="contractNote"
                                        readOnly
                                    >
                                        <Input
                                            id="contractNote"
                                            name="contractNote"
                                            type="text"
                                            placeholder="Nota/aclaración"
                                        />
                                    </Label>
                                </div>
                            </section>

                            <section className="flex border-t border-gray-200 py-8">
                                <h2 className="w-3/12 text-xl font-bold">
                                    Productos alquilados
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    <ProductsAndQuantityField
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

export default CreateContractForm;
