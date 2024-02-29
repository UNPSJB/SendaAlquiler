'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book, Trash } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateInternalOrderMutationVariables } from '@/api/graphql';
import {
    useCreateInternalOrder,
    useOffices,
    useProductsStocksByOfficeId,
} from '@/api/hooks';

import { useOfficeContext } from '@/app/OfficeProvider';

import ButtonWithSpinner from '@/components/ButtonWithSpinner';
import { ComboboxSimple } from '@/components/combobox';
import { Button } from '@/components/ui/button';
import { Form, FormDescription } from '@/components/ui/form';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { inputToNumber } from '@/lib/utils';

type Props = {
    cancelHref?: string;
    idToUpdate?: string;
    defaultValues?: OrderInternalFormEditorValues;
};

type OrderInternalFormEditorValues = Partial<{
    targetOffice: {
        value: string;
        label: string;
    };
    sourceOffice: {
        value: string;
        label: string;
    };
    orders: {
        product: {
            value: string;
            label: string;
            data: {
                product: {
                    id: string;
                    name: string;
                };
                quantity: number;
            };
        } | null;
        quantity: number;
    }[];
}>;

export const OrderInternalFormEditor = ({
    cancelHref,
    defaultValues,
    idToUpdate,
}: Props) => {
    const router = useRouter();
    const officeContext = useOfficeContext();

    const formMethods = useForm<OrderInternalFormEditorValues>({
        defaultValues: {
            targetOffice: {
                value: officeContext.office!.id,
                label: officeContext.office!.name,
            },
            ...defaultValues,
        },
    });

    const createOrderMutation = useCreateInternalOrder();

    const onSubmit: SubmitHandler<OrderInternalFormEditorValues> = (data) => {
        if (
            !data.orders ||
            data.orders.length === 0 ||
            !data.sourceOffice ||
            !data.targetOffice ||
            isCreatingOrUpdating
        ) {
            return;
        }

        createOrderMutation.mutate(
            {
                data: {
                    products: data.orders.map((order) => {
                        const next: CreateInternalOrderMutationVariables['data']['products'][0] =
                            {
                                id: order.product!.value,
                                quantity: order.quantity,
                            };
                        return next;
                    }),
                    sourceOfficeId: data.sourceOffice.value,
                    targetOfficeId: data.targetOffice.value,
                },
            },
            {
                onSuccess: (data) => {
                    if (!data.createInternalOrder) {
                        toast.error('Ocurrio un error al crear el pedido');
                        return;
                    }

                    const error = data.createInternalOrder.error;
                    const internalOrder = data.createInternalOrder.internalOrder;
                    if (error) {
                        toast.error(error);
                    }

                    if (internalOrder) {
                        toast.success('Pedido creado exitosamente');
                        router.push('/pedidos-internos');
                    }
                },
                onError: () => {
                    toast.error('Ocurrio un error al crear el pedido');
                },
            },
        );
    };

    const isCreatingOrUpdating = createOrderMutation.isLoading;
    return (
        <main className="px-8 pb-12">
            <div className="flex items-center justify-between py-6">
                <h1 className="text-3xl font-bold">
                    {idToUpdate ? 'Editar Pedido Interno' : 'Crear Pedido Interno'}
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
                    <OrderInternalFormEditorDetails />
                    <OrderInternalFormEditorOffices />

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
                            {idToUpdate ? 'Guardar Pedido' : 'Crear Pedido'}
                        </ButtonWithSpinner>
                    </div>
                </form>
            </Form>
        </main>
    );
};

const OrderInternalFormEditorDetails = () => {
    const formMethods = useFormContext<OrderInternalFormEditorValues>();
    const officeContext = useOfficeContext();
    const officesQuery = useOffices();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Detalles del envío</h2>

            <p className="text-muted-foreground">
                Estás creando un pedido hacia la sucursal &ldquo;
                {officeContext.office?.name}&rdquo;.
            </p>

            <FormField
                name="sourceOffice"
                rules={{ required: 'Este campo es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel required>Sucursal de origen</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                placeholder="Selecciona una sucursal"
                                options={(officesQuery.data
                                    ? officesQuery.data.offices
                                    : []
                                )
                                    .filter(
                                        (office) =>
                                            office.id !== officeContext.office!.id,
                                    )
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

            <FormField
                name="targetOffice"
                rules={{ required: 'Este campo es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel required>Sucursal de destino</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                options={[
                                    {
                                        label: officeContext.office!.name,
                                        value: officeContext.office!.id,
                                    },
                                ]}
                                onChange={field.onChange}
                                placeholder="Selecciona una sucursal"
                                value={{
                                    value: officeContext.office!.id,
                                    label: officeContext.office!.name,
                                }}
                            />
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

const OrderInternalFormEditorOffices = () => {
    const formMethods = useFormContext<OrderInternalFormEditorValues>();

    const watchedSourceOffice = formMethods.watch('sourceOffice');
    const productsQuery = useProductsStocksByOfficeId(watchedSourceOffice?.value);

    const ordersFieldArray = useFieldArray({
        name: 'orders',
        control: formMethods.control,
    });

    if (!watchedSourceOffice) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Productos</h2>

                <p className="text-muted-foreground">
                    Selecciona una sucursal de origen para ver los productos disponibles.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Productos</h2>

            {ordersFieldArray.fields.map((field, index) => {
                const watchedField = formMethods.watch(`orders.${index}`);

                return (
                    <div className="flex space-x-4" key={field.id}>
                        <div className="flex flex-1 space-x-4">
                            <FormField
                                name={`orders.${index}.product`}
                                control={formMethods.control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel required>Producto</FormLabel>

                                        <FormControl>
                                            <ComboboxSimple
                                                placeholder="Selecciona un producto"
                                                options={(productsQuery.data
                                                    ? productsQuery.data
                                                          .productsStocksByOfficeId
                                                    : []
                                                ).map((stockItem) => {
                                                    return {
                                                        label: `${stockItem.product.name} (${stockItem.quantity})`,
                                                        value: stockItem.product.id,
                                                        data: stockItem,
                                                    };
                                                })}
                                                onChange={(option) => {
                                                    field.onChange(option);
                                                    formMethods.setValue(
                                                        `orders.${index}.quantity`,
                                                        0,
                                                    );
                                                }}
                                                value={field.value || null}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name={`orders.${index}.quantity`}
                                control={formMethods.control}
                                rules={{
                                    validate: (value) => {
                                        if (value <= 0) {
                                            return 'La cantidad debe ser mayor a 0';
                                        }

                                        if (
                                            watchedField.product &&
                                            watchedField.product.data.quantity < value
                                        ) {
                                            return 'La cantidad no puede ser mayor a la cantidad disponible';
                                        }
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel required>Cantidad</FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        inputToNumber(e.target.value, {
                                                            min: 0,
                                                            max:
                                                                watchedField.product?.data
                                                                    .quantity || 0,
                                                        }),
                                                    );
                                                }}
                                                value={field.value || ''}
                                            />
                                        </FormControl>

                                        <FormDescription>
                                            {watchedField.product &&
                                                `Cantidad disponible: ${watchedField.product.data.quantity}`}
                                        </FormDescription>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex pt-7">
                            <button
                                className="h-4 w-4"
                                type="button"
                                onClick={() => {
                                    ordersFieldArray.remove(index);
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
                    ordersFieldArray.append({
                        product: null,
                        quantity: 0,
                    });
                }}
            >
                Agregar producto
            </Button>
        </div>
    );
};
