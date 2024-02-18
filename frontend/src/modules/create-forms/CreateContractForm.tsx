'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import dayjs from 'dayjs';
import { useEffect } from 'react';
import {
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
    useFormState,
} from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateRentalContractInput } from '@/api/graphql';
import { useAllClients, useCreateRentalContract } from '@/api/hooks';

import { ComboboxClients, ComboboxClientsProps } from './ComboboxClients';
import {
    ContractProductsField,
    ContractProductsFieldFormValues,
} from './components/fields/ContractProductsField';
import CreatableSelectLocalityField, {
    LocalityFieldValue,
} from './components/fields/CreatableSelectLocalityField';

import DeprecatedButton, { ButtonVariant } from '@/components/Button';
import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';
import { DateTimePickerDemo } from '@/components/ui/date-time-picker-demo';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import Label from '../forms/Label';

type CreateContractFormProps = {
    cancelHref: string;
};

type FormValues = {
    client: ComboboxClientsProps['value'];
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
    };
    contractStartDatetime: Date;
    contractEndDatetime: Date;
} & ContractProductsFieldFormValues;

const getMinimumDatetimeValues = (startDatetime: Date | null) => {
    const tommorow = dayjs()
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .add(1, 'day')
        .toDate();

    const minDateForContractStartDatetime = tommorow;

    const minDateForContractEndDatetime = dayjs(startDatetime || tommorow)
        .add(1, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .toDate();

    return {
        minDateForContractStartDatetime,
        minDateForContractEndDatetime,
    };
};

/**
 * Calculates the number of days between two dates based only on the dates, not the time.
 *
 * @param startDatetime The start date.
 * @param endDatetime The end date.
 * @returns The number of days between the two dates.
 */
const calculateNumberOfRentalDays = (
    startDatetime: Date | null,
    endDatetime: Date | null,
) => {
    if (!startDatetime || !endDatetime) {
        return 0;
    }

    const startDatetimeDayjs = dayjs(startDatetime).set('minutes', 0).set('hours', 0);
    const endDatetimeDayjs = dayjs(endDatetime).set('minutes', 0).set('hours', 0);

    const numberOfDays = endDatetimeDayjs.diff(startDatetimeDayjs, 'day');

    return numberOfDays;
};

const CreateContractForm: React.FC<CreateContractFormProps> = ({ cancelHref }) => {
    const searchParams = useSearchParams();
    const clientId = searchParams.get('client');

    const queryResult = useAllClients();
    const formMethods = useForm<FormValues>();
    const { isValid: formIsValid } = useFormState({
        control: formMethods.control,
    });
    const { watch, setValue } = formMethods;
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
        onError: () => {
            toast.error('No se pudo crear el contrato');
        },
    });

    const client = watch('client');
    const startDatetimeWatch = watch('contractStartDatetime');
    const endDatetimeWatch = watch('contractEndDatetime');

    const startDatetimeValue =
        startDatetimeWatch && startDatetimeWatch ? startDatetimeWatch : null;
    const endDatetimeValue =
        endDatetimeWatch && endDatetimeWatch ? endDatetimeWatch : null;

    const { minDateForContractStartDatetime, minDateForContractEndDatetime } =
        getMinimumDatetimeValues(startDatetimeValue);

    const productsOrders = watch('productsOrders');

    const numberOfRentalDays = calculateNumberOfRentalDays(
        startDatetimeValue,
        endDatetimeValue,
    );

    const subtotal = !numberOfRentalDays
        ? 0
        : productsOrders?.reduce((acc, current) => {
              return acc + (current.subtotal || 0);
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

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const clientId = data.client?.id;
        const contractStartDatetime = data.contractStartDatetime;
        const contractEndDatetime = data.contractEndDatetime;
        const houseNumber = data.details.houseNumber;
        const houseUnit = data.details.houseUnit;
        const localityId = data.details.locality?.data.id;

        const products: CreateRentalContractInput['products'] = [];
        for (const productAndQuantity of data.productsOrders || []) {
            const productId = productAndQuantity.product?.data.id;
            const officesOrders = [];

            if (!productId) continue;

            if (productAndQuantity.quantityByOffice) {
                const officesIds = Object.keys(productAndQuantity.quantityByOffice);

                for (const officeId of officesIds) {
                    const quantity = productAndQuantity.quantityByOffice[officeId];
                    if (!quantity) continue;

                    officesOrders.push({
                        officeId: officeId,
                        quantity: quantity,
                    });
                }
            }

            const service = productAndQuantity.service?.value || null;

            products.push({
                id: productId,
                officesOrders: officesOrders,
                service: service,
                discount: productAndQuantity.discount || 0,
            });
        }
        const streetName = data.details.streetName;

        if (
            !clientId ||
            !contractStartDatetime ||
            !products ||
            products.length === 0 ||
            !localityId ||
            !streetName
        ) {
            toast.error('Faltan campos obligatorios');
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
                products: products,
            },
        });
    };

    const onError: SubmitErrorHandler<FormValues> = () => {
        toast.error('Hay un error en el formulario');
    };

    useEffect(() => {
        const data = queryResult.data;
        if (!data) return;

        const matchingClient = data.allClients.find((client) => client.id === clientId);
        if (matchingClient) {
            setValue('client', matchingClient);
        }
    }, [clientId, setValue, queryResult.data]);

    console.log('formIsValid', formIsValid);
    console.log('formIsValid', formMethods.formState.errors);

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
                            <DeprecatedButton
                                variant={ButtonVariant.OUTLINE_WHITE}
                                href={cancelHref}
                            >
                                Cancelar
                            </DeprecatedButton>

                            <ButtonWithSpinner
                                onClick={formMethods.handleSubmit(onSubmit, onError)}
                                variant={ButtonVariant.BLACK}
                                // disabled={!formIsValid}
                                showSpinner={isMutating}
                            >
                                Guardar
                            </ButtonWithSpinner>
                        </div>
                    </div>
                </div>
            </header>

            <FetchedDataRenderer
                {...queryResult}
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
                {() => (
                    <Form {...formMethods}>
                        <main className="container pb-16 pt-36">
                            <section className="flex pb-8">
                                <div className="w-3/12">
                                    <h2 className="text-xl font-bold">
                                        Detalles de facturación
                                    </h2>
                                </div>

                                <div className="w-9/12 space-y-6">
                                    <FormField
                                        control={formMethods.control}
                                        name="client"
                                        rules={{
                                            required: 'El cliente es requerido',
                                        }}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel required>Cliente</FormLabel>

                                                <FormControl>
                                                    <ComboboxClients {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <Label
                                                label="Nombre"
                                                htmlFor="client.firstName"
                                                readOnly
                                            >
                                                <Input
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                            className="bg-muted text-muted-foreground"
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
                                            className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                                    className="bg-muted text-muted-foreground"
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
                                            className="bg-muted text-muted-foreground"
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
                                            className="bg-muted text-muted-foreground"
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

                                    <DeprecatedButton
                                        variant={ButtonVariant.OUTLINE_WHITE}
                                        onClick={copyClientDetailsOnDetails}
                                        disabled={!client}
                                    >
                                        Copiar detalles de cliente
                                    </DeprecatedButton>
                                </div>

                                <div className="w-9/12 space-y-6">
                                    <FormField
                                        rules={{
                                            required: 'La localidad es requerida',
                                        }}
                                        control={formMethods.control}
                                        name="details.locality"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel required>Localidad</FormLabel>

                                                <FormControl>
                                                    <CreatableSelectLocalityField
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex space-x-8">
                                        <div className="w-1/2">
                                            <FormField
                                                name="details.streetName"
                                                rules={{
                                                    required: 'La calle es requerida',
                                                }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel required>
                                                            Calle
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Calle"
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <FormField
                                                name="details.houseNumber"
                                                rules={{
                                                    required:
                                                        'El número de casa es requerido',
                                                }}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel required>
                                                            N° de casa
                                                        </FormLabel>

                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="N° de casa"
                                                            />
                                                        </FormControl>

                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <FormField
                                        name="details.houseUnit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Apartamento, habitación, unidad, etc
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Apartamento, habitación, unidad, etc"
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="details.note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nota/Aclaración</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="Nota/aclaración"
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex space-x-8">
                                        <FormField
                                            name="contractStartDatetime"
                                            rules={{
                                                required:
                                                    'La fecha de inicio es requerida',
                                            }}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel required>
                                                        Fecha y hora de inicio
                                                    </FormLabel>

                                                    <FormControl>
                                                        <DateTimePickerDemo
                                                            onChange={(date) => {
                                                                field.onChange(date);
                                                            }}
                                                            value={field.value}
                                                            fromDate={
                                                                minDateForContractStartDatetime
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="contractEndDatetime"
                                            rules={{
                                                required:
                                                    'La fecha de finalización es requerida',
                                            }}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel required>
                                                        Fecha y hora de finalización
                                                    </FormLabel>

                                                    <FormControl>
                                                        <DateTimePickerDemo
                                                            onChange={(date) => {
                                                                field.onChange(date);
                                                            }}
                                                            value={field.value}
                                                            fromDate={
                                                                minDateForContractEndDatetime
                                                            }
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="flex border-t border-gray-200 py-8">
                                <h2 className="w-3/12 text-xl font-bold">
                                    Productos alquilados
                                </h2>

                                <div className="w-9/12 space-y-6">
                                    {startDatetimeValue && endDatetimeValue ? (
                                        <ContractProductsField
                                            numberOfRentalDays={numberOfRentalDays}
                                            startDate={dayjs(startDatetimeValue).format(
                                                'YYYY-MM-DD',
                                            )}
                                            endDate={dayjs(endDatetimeValue).format(
                                                'YYYY-MM-DD',
                                            )}
                                            formMethods={{
                                                control: formMethods.control,
                                                setValue: formMethods.setValue,
                                                watch: formMethods.watch,
                                                getValues: formMethods.getValues,
                                            }}
                                        />
                                    ) : (
                                        <p>
                                            Selecciona una fecha de inicio y fin para ver
                                            los productos disponibles
                                        </p>
                                    )}
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
                    </Form>
                )}
            </FetchedDataRenderer>
        </>
    );
};

export default CreateContractForm;
