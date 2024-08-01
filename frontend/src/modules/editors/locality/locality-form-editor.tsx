'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { StateChoices } from '@/api/graphql';
import { useCreateLocality, useUpdateLocality } from '@/api/hooks';

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

export type LocalityFormEditorValues = {
    name: string;
    state: {
        label: string;
        value: StateChoices;
    };
    postalCode: string;
};

type Props = {
    defaultValues?: LocalityFormEditorValues;
    cancelHref?: string;
    idToUpdate?: string;
};

export const LocalityFormEditor = ({ defaultValues, cancelHref, idToUpdate }: Props) => {
    const router = useRouter();

    const formMethods = useForm<LocalityFormEditorValues>({
        defaultValues,
    });

    const createLocalityMutation = useCreateLocality({
        onSuccess: (data) => {
            const error = data.createLocality?.error;
            const locality = data.createLocality?.locality;
            if (error) {
                toast.error(error);
            }

            if (locality) {
                toast.success('Localidad creada exitosamente');
                router.push('/localidades');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al crear la localidad');
        },
    });

    const updateLocalityMutation = useUpdateLocality({
        onSuccess: (data) => {
            const error = data.updateLocality?.error;
            const locality = data.updateLocality?.locality;
            if (error) {
                toast.error(error);
            }

            if (locality) {
                toast.success('Localidad actualizada exitosamente');
                router.push('/localidades');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al actualizar la localidad');
        },
    });

    const onSubmit: SubmitHandler<LocalityFormEditorValues> = (data) => {
        if (!data.name || !data.state || !data.postalCode || isCreatingOrUpdating) return;

        if (!idToUpdate) {
            createLocalityMutation.mutate({
                name: data.name,
                state: data.state.value,
                postalCode: data.postalCode,
            });
        } else {
            updateLocalityMutation.mutate({
                id: idToUpdate,
                name: data.name,
                state: data.state.value,
                postalCode: data.postalCode,
            });
        }
    };

    const isCreatingOrUpdating =
        createLocalityMutation.isPending || updateLocalityMutation.isPending;

    return (
        <main className="px-8 pb-12">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Localidad' : 'Crear Localidad'}
                </h1>

                <a
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-500"
                    href="#"
                >
                    <span>Tutorial</span>
                    <Book className="size-5" />
                </a>
            </div>

            <Form {...formMethods}>
                <form
                    className="space-y-12 pb-24"
                    onSubmit={formMethods.handleSubmit(onSubmit)}
                >
                    <LocalityFormEditorDetails />

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
                            {idToUpdate ? 'Guardar Localidad' : 'Crear Localidad'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

const LocalityFormEditorDetails = () => {
    const formMethods = useFormContext<LocalityFormEditorValues>();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Datos de la Localidad</h2>

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
                name="postalCode"
                rules={{ required: 'El código postal es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel required>Código Postal</FormLabel>

                        <FormControl>
                            <Input {...field} value={field.value || ''} />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                name="state"
                rules={{ required: 'La provincia es requerida' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required>Provincia</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                placeholder="Selecciona una provincia"
                                options={[
                                    {
                                        label: 'Buenos Aires',
                                        value: StateChoices.BuenosAires,
                                    },
                                    { label: 'Catamarca', value: StateChoices.Catamarca },
                                    { label: 'Chaco', value: StateChoices.Chaco },
                                    { label: 'Chubut', value: StateChoices.Chubut },
                                    { label: 'Cordoba', value: StateChoices.Cordoba },
                                    {
                                        label: 'Corrientes',
                                        value: StateChoices.Corrientes,
                                    },
                                    {
                                        label: 'Entre Rios',
                                        value: StateChoices.EntreRios,
                                    },
                                    { label: 'Formosa', value: StateChoices.Formosa },
                                    { label: 'Jujuy', value: StateChoices.Jujuy },
                                    { label: 'La Pampa', value: StateChoices.LaPampa },
                                    { label: 'La Rioja', value: StateChoices.LaRioja },
                                    { label: 'Mendoza', value: StateChoices.Mendoza },
                                    { label: 'Misiones', value: StateChoices.Misiones },
                                    { label: 'Neuquen', value: StateChoices.Neuquen },
                                ]}
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
        </div>
    );
};
