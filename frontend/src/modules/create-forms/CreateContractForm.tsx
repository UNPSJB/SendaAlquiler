'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    FormProvider,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { ClientsQuery } from '@/api/graphql';
import { useClients, useCreateRentalContract } from '@/api/hooks';

import LocalityField, { LocalityFieldValue } from './fields/LocalityField';
import RHFOfficesField, { OfficesFieldValue } from './fields/OfficesField';
import RHFProductOrderField, { ProductQuantityPair } from './fields/ProductOrderField';

import Button, { ButtonVariant } from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

import { RHFCustomFlatpickr } from '../forms/Flatpickr';
import { RHFFormField } from '../forms/FormField';
import RHFInput, { Input } from '../forms/Input';
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
    billing: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        dni: string;
        state: string;
        locality: string;
        postalCode: string;
        streetName: string;
        houseNumber: string;
        houseUnit: string | null;
        note: string;
    };
    details: {
        locality?: LocalityFieldValue;
        streetName: string;
        houseNumber: string;
        houseUnit: string | null;
        note?: string;
        office?: OfficesFieldValue;
    };
    productsAndQuantity: ProductQuantityPair[];
    contractStartDatetime: Date[];
    contractEndDatetime: Date[];
};

const CreateContractForm: React.FC<CreateContractFormProps> = ({ cancelHref }) => {
    const clientsResult = useClients();
    const formMethods = useForm<FormValues>();
    const { watch, control, setValue } = formMethods;
    const router = useRouter();

    const { mutate, isLoading: isMutating } = useCreateRentalContract({
        onSuccess: (data) => {
            const error = data.createRentalContract?.error;
            if (error || !data.createRentalContract) {
                toast.error(error || 'No se pudo crear el contrato');
            }

            const contract = data.createRentalContract?.rentalContract;
            if (contract) {
                toast.success('Contrato creado exitosamente');
                router.push('/contratos');
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

    const copyClientDetailsOnDetails = () => {
        if (client) {
            formMethods.setValue('details', {
                streetName: client.streetName,
                houseNumber: client.houseNumber,
                houseUnit: client.houseUnit,
            });

            formMethods.setValue('details.locality', {
                value: client.locality.id,
                label: client.locality.name,
                data: client.locality,
            });
        }
    };

    const formIsValid = formMethods.formState.isValid;

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const clientId = data.client?.data.id;
        const contractStartDatetime = data.contractStartDatetime[0];
        const contractEndDatetime = data.contractEndDatetime[0];
        const houseNumber = data.details.houseNumber;
        const houseUnit = data.details.houseUnit;
        const localityId = data.details.locality?.data.id;
        const officeId = data.details.office?.data.id;
        const products = data.productsAndQuantity
            ? data.productsAndQuantity.map((productAndQuantity) => ({
                  id: productAndQuantity.product?.data.id as string,
                  quantity: productAndQuantity.quantity as number,
                  service: productAndQuantity.service?.value.toString() || null,
              }))
            : null;
        const streetName = data.details.streetName;

        if (
            !clientId ||
            !contractStartDatetime ||
            !products ||
            products.length === 0 ||
            !localityId ||
            !officeId ||
            !streetName
        ) {
            return;
        }

        mutate({
            data: {
                clientId: clientId,
                contractStartDatetime: contractStartDatetime,
                contractEndDatetime: contractEndDatetime,
                houseNumber: houseNumber,
                houseUnit: houseUnit,
                streetName: streetName,
                localityId: localityId,
                officeId: officeId,
                products: products,
            },
        });
    };

    const onError: SubmitErrorHandler<FormValues> = (errors) => {
        console.log('errors', errors);
    };

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
                                <div className="w-3/12">
                                    <h2 className="mb-4 text-xl font-bold">
                                        Detalles de contrato
                                    </h2>

                                    <Button
                                        variant={ButtonVariant.OUTLINE_WHITE}
                                        onClick={copyClientDetailsOnDetails}
                                        disabled={!client}
                                    >
                                        Copiar detalles de cliente
                                    </Button>
                                </div>

                                <div className="w-9/12 space-y-6">
                                    <RHFFormField
                                        label="Sucursal"
                                        fieldID="details.office"
                                    >
                                        <RHFOfficesField<FormValues, 'details.office'>
                                            name="details.office"
                                            control={control}
                                            placeholder="Selecciona una oficina"
                                            officeToExclude={undefined}
                                        />
                                    </RHFFormField>

                                    <RHFFormField
                                        label="Fecha y hora de inicio"
                                        fieldID="contractStartDatetime"
                                    >
                                        <RHFCustomFlatpickr
                                            data-enable-time
                                            name="contractStartDatetime"
                                            control={control}
                                            rules={{ required: true }}
                                            placeholder="Fecha y hora de inicio"
                                        />
                                    </RHFFormField>

                                    <RHFFormField
                                        label="Fecha y hora de finalización"
                                        fieldID="contractEndDatetime"
                                    >
                                        <RHFCustomFlatpickr
                                            data-enable-time
                                            name="contractEndDatetime"
                                            control={control}
                                            rules={{ required: true }}
                                            placeholder="Fecha y hora de finalización"
                                        />
                                    </RHFFormField>

                                    <RHFFormField
                                        label="Localidad"
                                        fieldID="details.locality"
                                    >
                                        <LocalityField
                                            name="details.locality"
                                            control={control}
                                            setValue={setValue}
                                        />
                                    </RHFFormField>

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <RHFFormField
                                                label="Calle"
                                                fieldID="details.streetName"
                                            >
                                                <RHFInput
                                                    id="details.streetName"
                                                    name="details.streetName"
                                                    type="text"
                                                    placeholder="Calle"
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                    }}
                                                />
                                            </RHFFormField>
                                        </div>

                                        <div className="w-1/2">
                                            <RHFFormField
                                                label="N° de casa"
                                                fieldID="details.houseNumber"
                                            >
                                                <RHFInput
                                                    id="details.houseNumber"
                                                    name="details.houseNumber"
                                                    type="text"
                                                    placeholder="N° de casa"
                                                    control={control}
                                                    rules={{
                                                        required: true,
                                                    }}
                                                />
                                            </RHFFormField>
                                        </div>
                                    </div>

                                    <RHFFormField
                                        label="Apartamento, habitación, unidad, etc"
                                        fieldID="details.houseUnit"
                                    >
                                        <RHFInput
                                            id="details.houseUnit"
                                            name="details.houseUnit"
                                            type="text"
                                            placeholder="Apartamento, habitación, unidad, etc"
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                        />
                                    </RHFFormField>

                                    <RHFFormField
                                        label="Nota/Aclaración"
                                        fieldID="details.note"
                                    >
                                        <RHFInput
                                            id="details.note"
                                            name="details.note"
                                            type="text"
                                            placeholder="Nota/aclaración"
                                            control={control}
                                            rules={{
                                                required: true,
                                            }}
                                        />
                                    </RHFFormField>
                                </div>
                            </section>

                            <section className="flex border-t border-gray-200 py-8">
                                <h2 className="w-3/12 text-xl font-bold">
                                    Productos alquilados
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    <RHFProductOrderField<
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

export default CreateContractForm;
