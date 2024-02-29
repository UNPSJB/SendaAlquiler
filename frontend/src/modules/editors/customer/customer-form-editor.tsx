'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAllLocalities, useCreateClient, useUpdateClient } from '@/api/hooks';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = {
    cancelHref?: string;
    idToUpdate?: string;
    defaultValues?: CustomerFormEditorValues;
};

type CustomerFormEditorValues = {
    dni: string | undefined | null;
    email: string | undefined | null;
    firstName: string | undefined | null;
    houseNumber: string | undefined | null;
    houseUnit: string | undefined | null;
    lastName: string | undefined | null;
    phoneCode: string | undefined | null;
    phoneNumber: string | undefined | null;
    streetName: string | undefined | null;
    locality:
        | {
              value: string;
              label: string;
          }
        | null
        | undefined;
};

export const CustomerFormEditor = ({ cancelHref, defaultValues, idToUpdate }: Props) => {
    const router = useRouter();

    const formMethods = useForm<CustomerFormEditorValues>({
        defaultValues,
    });

    const createCustomerMutation = useCreateClient({
        onSuccess: (data) => {
            const error = data.createClient?.error;
            const customer = data.createClient?.client;
            if (error) {
                toast.error(error);
            }

            if (customer) {
                toast.success('Cliente creado exitosamente');
                router.push('/clientes');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al crear el cliente');
        },
    });

    const updateCustomerMutation = useUpdateClient({
        onSuccess: (data) => {
            const error = data.updateClient?.error;
            const customer = data.updateClient?.client;
            if (error) {
                toast.error(error);
            }

            if (customer) {
                toast.success('Cliente actualizado exitosamente');
                router.push('/clientes');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al actualizar el cliente');
        },
    });

    const onSubmit: SubmitHandler<CustomerFormEditorValues> = (data) => {
        if (
            !data.firstName ||
            !data.lastName ||
            !data.email ||
            !data.dni ||
            !data.houseNumber ||
            !data.locality?.value ||
            !data.phoneCode ||
            !data.phoneNumber ||
            !data.streetName ||
            isCreatingOrUpdating
        )
            return;

        if (!idToUpdate) {
            createCustomerMutation.mutate({
                clientData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    dni: data.dni,
                    houseNumber: data.houseNumber,
                    houseUnit: data.houseUnit || null,
                    localityId: data.locality.value,
                    phoneCode: data.phoneCode,
                    phoneNumber: data.phoneNumber,
                    streetName: data.streetName,
                },
            });
        } else {
            updateCustomerMutation.mutate({
                id: idToUpdate,
                clientData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    dni: data.dni,
                    houseNumber: data.houseNumber,
                    houseUnit: data.houseUnit || null,
                    localityId: data.locality.value,
                    phoneCode: data.phoneCode,
                    phoneNumber: data.phoneNumber,
                    streetName: data.streetName,
                },
            });
        }
    };

    const isCreatingOrUpdating =
        createCustomerMutation.isLoading || updateCustomerMutation.isLoading;

    return (
        <main className="px-8 pb-12">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Cliente' : 'Crear Cliente'}
                </h1>

                <a
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-500"
                    href="#"
                >
                    <span>Tutorial</span>
                    <Book className="h-5 w-5" />
                </a>
            </div>

            <Form {...formMethods}>
                <form
                    className="space-y-12 pb-24"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <CustomerFormEditorDetails />

                    <div className="fixed bottom-0 right-0 flex justify-end space-x-4 border-t border-muted bg-background px-8 py-3 shadow-sm lg:left-[20%]">
                        {cancelHref && (
                            <Button variant="secondary" type="button" asChild>
                                <Link href={cancelHref}>Cancelar</Link>
                            </Button>
                        )}

                        <ButtonWithSpinner
                            showSpinner={isCreatingOrUpdating}
                            size="lg"
                            type="submit"
                        >
                            {idToUpdate ? 'Guardar Cliente' : 'Crear Cliente'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

const CustomerFormEditorDetails = () => {
    const formMethods = useFormContext<CustomerFormEditorValues>();
    const localitiesQuery = useAllLocalities();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Datos Personales</h2>

            <div className="flex space-x-4">
                <FormField
                    name="firstName"
                    rules={{ required: 'El nombre es requerido' }}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel required>Nombre</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="lastName"
                    rules={{ required: 'El apellido es requerido' }}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel required>Apellido</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                name="email"
                rules={{
                    required: 'El correo electrónico es requerido',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Correo electrónico inválido',
                    },
                }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Correo electrónico</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="dni"
                rules={{ required: 'El DNI es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>DNI</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="phoneCode"
                rules={{ required: 'El código de área es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Código de área</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="phoneNumber"
                rules={{ required: 'El número de teléfono es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Número de teléfono</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="locality"
                rules={{ required: 'La localidad es requerida' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col space-y-2">
                        <FormLabel required>Localidad</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                {...field}
                                options={
                                    localitiesQuery.data?.allLocalities.map(
                                        (locality) => ({
                                            value: locality.id,
                                            label: locality.name,
                                        }),
                                    ) || []
                                }
                                placeholder="Seleccione una localidad"
                                onChange={field.onChange}
                                value={field.value || null}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="streetName"
                rules={{ required: 'La calle es requerida' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Calle</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="houseNumber"
                rules={{ required: 'El número de casa es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Número de casa</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="houseUnit"
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unidad</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
