'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book, Trash } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateEmployeeMutationVariables } from '@/api/graphql';
import { useCreateEmployee, useOffices, useUpdateEmployee } from '@/api/hooks';

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
    defaultValues?: EmployeeFormEditorValues;
};

type EmployeeFormEditorValues = Omit<
    CreateEmployeeMutationVariables['employeeData'],
    'offices'
> & {
    offices:
        | {
              value: string;
              label: string;
          }[]
        | null
        | undefined;
    officesIdsToDelete?: string[];
};

export const EmployeeFormEditor = ({ cancelHref, defaultValues, idToUpdate }: Props) => {
    const router = useRouter();

    const formMethods = useForm<EmployeeFormEditorValues>({
        defaultValues,
    });

    const createEmployeeMutation = useCreateEmployee({
        onSuccess: (data) => {
            const error = data.createEmployee?.error;
            const employee = data.createEmployee?.employee;
            if (error) {
                toast.error(error);
            }

            if (employee) {
                toast.success('Empleado creado exitosamente');
                router.push('/empleados');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al crear el empleado');
        },
    });

    const updateEmployeeMutation = useUpdateEmployee({
        onSuccess: (data) => {
            const error = data.updateEmployee?.error;
            const employee = data.updateEmployee?.employee;
            if (error) {
                toast.error(error);
            }

            if (employee) {
                toast.success('Empleado actualizado exitosamente');
                router.push('/empleados');
            }
        },
        onError: () => {
            toast.error('Ocurrio un error al actualizar el empleado');
        },
    });

    const onSubmit: SubmitHandler<EmployeeFormEditorValues> = (data) => {
        if (
            !data.firstName ||
            !data.lastName ||
            !data.email ||
            !data.offices ||
            isCreatingOrUpdating
        )
            return;

        if (!idToUpdate) {
            createEmployeeMutation.mutate({
                employeeData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    offices: data.offices.map((office) => office.value),
                },
            });
        } else {
            updateEmployeeMutation.mutate({
                id: idToUpdate,
                employeeData: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    offices: data.offices.map((office) => office.value),
                },
            });
        }
    };

    const isCreatingOrUpdating =
        createEmployeeMutation.isPending || updateEmployeeMutation.isPending;

    return (
        <main className="px-8 pb-12">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Empleado' : 'Crear Empleado'}
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
                    <EmployeeFormEditorDetails />
                    <EmployeeFormEditorOffices />

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
                            {idToUpdate ? 'Guardar Empleado' : 'Crear Empleado'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

const EmployeeFormEditorDetails = () => {
    const formMethods = useFormContext<EmployeeFormEditorValues>();

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
        </div>
    );
};

const EmployeeFormEditorOffices = () => {
    const formMethods = useFormContext<EmployeeFormEditorValues>();
    const officesQuery = useOffices();

    const officesFieldArray = useFieldArray({
        name: 'offices',
        control: formMethods.control,
    });

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Sucursales</h2>

            {officesFieldArray.fields.map((field, index) => {
                return (
                    <div className="flex space-x-4" key={field.id}>
                        <FormField
                            name={`offices.${index}`}
                            control={formMethods.control}
                            rules={{ required: 'La oficina es requerida' }}
                            render={({ field }) => (
                                <FormItem className="flex flex-1 flex-col">
                                    <FormLabel required>Oficina</FormLabel>

                                    <FormControl>
                                        <ComboboxSimple
                                            placeholder="Selecciona una oficina"
                                            options={(officesQuery.data
                                                ? officesQuery.data.offices
                                                : []
                                            )
                                                .filter((office) => {
                                                    return !formMethods
                                                        .getValues()
                                                        .offices?.some(
                                                            (officeSelected) =>
                                                                officeSelected.value ===
                                                                office.id,
                                                        );
                                                })
                                                .map((office) => {
                                                    return {
                                                        label: office.name,
                                                        value: office.id,
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

                        <div className="flex pt-7">
                            <button
                                className="h-4 w-4"
                                type="button"
                                onClick={() => {
                                    if (field.value) {
                                        formMethods.setValue('officesIdsToDelete', [
                                            ...(formMethods.getValues()
                                                .officesIdsToDelete || []),
                                            field.value,
                                        ]);
                                    }

                                    officesFieldArray.remove(index);
                                }}
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                );
            })}

            <Button
                type="button"
                onClick={() => {
                    officesFieldArray.append({
                        value: '',
                        label: '',
                    });
                }}
            >
                Agregar oficina
            </Button>
        </div>
    );
};
