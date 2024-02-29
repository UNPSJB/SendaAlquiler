'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useAllLocalities, useCreateSupplier, useUpdateSupplier } from '@/api/hooks';

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
import { Textarea } from '@/components/ui/textarea';

type Props = {
    cancelHref?: string;
    idToUpdate?: string;
    defaultValues?: SupplierFormEditorValues;
};

type SupplierFormEditorValues = {
    locality: {
        value: string;
        label: string;
    };
    cuit: string;
    email: string;
    name: string;
    phoneCode: string;
    phoneNumber: string;
    streetName: string;
    houseNumber: string;
    houseUnit?: string | null;
    note?: string | null;
};

export const SupplierFormEditor = ({ cancelHref, defaultValues, idToUpdate }: Props) => {
    const router = useRouter();

    const formMethods = useForm<SupplierFormEditorValues>({
        defaultValues,
    });

    const createSupplierMutation = useCreateSupplier({
        onSuccess: (data) => {
            const error = data.createSupplier?.error;
            const supplier = data.createSupplier?.supplier;
            if (error) {
                toast.error(error);
            }

            if (supplier) {
                toast.success('Proveedor creado exitosamente');
                router.push('/proveedores');
            }
        },
        onError: () => {
            toast.error('No se pudo crear el proveedor');
        },
    });

    const updateSupplierMutation = useUpdateSupplier({
        onSuccess: (data) => {
            const error = data.updateSupplier?.error;
            const supplier = data.updateSupplier?.supplier;
            if (error) {
                toast.error(error);
            }

            if (supplier) {
                toast.success('Proveedor actualizado exitosamente');
                router.push('/proveedores');
            }
        },
        onError: () => {
            toast.error('No se pudo actualizar el proveedor');
        },
    });

    const onSubmit: SubmitHandler<SupplierFormEditorValues> = (data) => {
        if (
            !data.name ||
            !data.email ||
            !data.cuit ||
            !data.phoneCode ||
            !data.phoneNumber ||
            !data.streetName ||
            !data.houseNumber
        )
            return;

        if (!idToUpdate) {
            createSupplierMutation.mutate({
                data: {
                    cuit: data.cuit,
                    email: data.email,
                    name: data.name,
                    houseNumber: data.houseNumber,
                    houseUnit: data.houseUnit || null,
                    phoneCode: data.phoneCode,
                    phoneNumber: data.phoneNumber,
                    streetName: data.streetName,
                    locality: data.locality.value,
                    note: data.note || '',
                },
            });
        } else {
            updateSupplierMutation.mutate({
                id: idToUpdate,
                input: {
                    cuit: data.cuit,
                    email: data.email,
                    name: data.name,
                    houseNumber: data.houseNumber,
                    houseUnit: data.houseUnit || null,
                    phoneCode: data.phoneCode,
                    phoneNumber: data.phoneNumber,
                    streetName: data.streetName,
                    locality: data.locality.value,
                    note: data.note || '',
                },
            });
        }
    };

    const isCreatingOrUpdating =
        createSupplierMutation.isLoading || updateSupplierMutation.isLoading;

    return (
        <main className="px-8 pb-12" onSubmit={formMethods.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Proveedor' : 'Crear Proveedor'}
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
                <form className="space-y-12 pb-24">
                    <SupplierFormEditorDetails />
                    <SupplierFormEditorLocation />
                    <SupplierFormEditorNote />

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
                            {idToUpdate ? 'Guardar Proveedor' : 'Crear Proveedor'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

const SupplierFormEditorDetails = () => {
    const formMethods = useFormContext<SupplierFormEditorValues>();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Información de Contacto</h2>

            <FormField
                name="name"
                rules={{ required: 'El nombre es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Nombre</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

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
                name="cuit"
                rules={{
                    required: 'El CUIT es requerido',
                    maxLength: {
                        value: 11,
                        message: 'CUIT inválido',
                    },
                }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>CUIT</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex space-x-4">
                <FormField
                    name="phoneCode"
                    rules={{ required: 'El código de área es requerido' }}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex-1">
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
                        <FormItem className="flex-1">
                            <FormLabel required>Número de teléfono</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

const SupplierFormEditorLocation = () => {
    const formMethods = useFormContext<SupplierFormEditorValues>();
    const localitiesQuery = useAllLocalities();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Información de Ubicación</h2>

            <FormField
                name="locality"
                rules={{ required: 'La localidad es requerida' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required>Localidad</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                placeholder="Selecciona una localidad"
                                options={(localitiesQuery.data
                                    ? localitiesQuery.data.allLocalities
                                    : []
                                ).map((locality) => {
                                    return {
                                        label: locality.name,
                                        value: locality.id,
                                    };
                                })}
                                onChange={(option) => {
                                    field.onChange(option);
                                }}
                                value={field.value || null}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex space-x-4">
                <FormField
                    name="streetName"
                    rules={{ required: 'La calle es requerida' }}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex-1">
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
                        <FormItem className="flex-1">
                            <FormLabel required>Número de casa</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                name="houseUnit"
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Apartamento, habitación, unidad, etc</FormLabel>

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

const SupplierFormEditorNote = () => {
    const formMethods = useFormContext<SupplierFormEditorValues>();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Notas</h2>

            <FormField
                name="note"
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notas</FormLabel>

                        <FormControl>
                            <Textarea {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
