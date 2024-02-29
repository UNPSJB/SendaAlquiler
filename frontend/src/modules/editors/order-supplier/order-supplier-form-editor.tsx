'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Book, Trash } from 'lucide-react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';

import { CreateSupplierOrderMutationVariables } from '@/api/graphql';
import {
    useAllSuppliers,
    useCreateSupplierOrder,
    useProductsSuppliedBySupplierId,
} from '@/api/hooks';

import { useOfficeContext } from '@/app/OfficeProvider';

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
import { inputToNumber } from '@/lib/utils';

type Props = {
    cancelHref?: string;
    idToUpdate?: string;
    defaultValues?: OrderSupplierFormEditorValues;
};

type OrderSupplierFormEditorValues = Partial<{
    orders: {
        product: {
            value: string;
            label: string;
        };
        quantity: number;
    }[];
    supplier: {
        value: string;
        label: string;
    };
}>;

export const OrderSupplierFormEditor = ({
    cancelHref,
    defaultValues,
    idToUpdate,
}: Props) => {
    const router = useRouter();

    const formMethods = useForm<OrderSupplierFormEditorValues>({
        defaultValues,
    });

    const officeContext = useOfficeContext();

    const createOrderMutation = useCreateSupplierOrder();

    const onSubmit: SubmitHandler<OrderSupplierFormEditorValues> = (data) => {
        if (
            !data.orders ||
            data.orders.length === 0 ||
            !data.supplier ||
            isCreatingOrUpdating
        ) {
            return;
        }

        createOrderMutation.mutate(
            {
                data: {
                    officeDestinationId: officeContext.office!.id,
                    products: data.orders.map((order) => {
                        const next: CreateSupplierOrderMutationVariables['data']['products'][0] =
                            {
                                id: order.product.value,
                                quantity: order.quantity,
                            };
                        return next;
                    }),
                    supplierId: data.supplier.value,
                },
            },
            {
                onSuccess: (data) => {
                    if (!data.createSupplierOrder) {
                        toast.error('Ocurrio un error al crear el pedido');
                        return;
                    }

                    const error = data.createSupplierOrder.error;
                    const supplierOrder = data.createSupplierOrder.supplierOrder;
                    if (error) {
                        toast.error(error);
                    }

                    if (supplierOrder) {
                        toast.success('Pedido creado exitosamente');
                        router.push('/pedidos-a-proveedores');
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
                    {idToUpdate
                        ? 'Editar Pedido a Proveedor'
                        : 'Crear Pedido a Proveedor'}
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
                    <OrderSupplierFormEditorDetails />
                    <OrderSupplierFormEditorOffices />

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

const OrderSupplierFormEditorDetails = () => {
    const formMethods = useFormContext<OrderSupplierFormEditorValues>();
    const officeContext = useOfficeContext();
    const suppliersQuery = useAllSuppliers();

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Detalles del envío</h2>

            <p className="text-muted-foreground">
                Estás creando un pedido para la sucursal &ldquo;
                {officeContext.office?.name}&rdquo;.
            </p>

            <FormField
                name="supplier"
                rules={{ required: 'El proveedor es requerido' }}
                control={formMethods.control}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel required>Proveedor</FormLabel>

                        <FormControl>
                            <ComboboxSimple
                                placeholder="Selecciona un proveedor"
                                options={(suppliersQuery.data
                                    ? suppliersQuery.data.allSuppliers
                                    : []
                                ).map((supplier) => {
                                    return {
                                        label: supplier.name,
                                        value: supplier.id,
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
        </div>
    );
};

const OrderSupplierFormEditorOffices = () => {
    const formMethods = useFormContext<OrderSupplierFormEditorValues>();

    const watchedSupplier = formMethods.watch('supplier');
    const productsQuery = useProductsSuppliedBySupplierId(watchedSupplier?.value);

    const ordersFieldArray = useFieldArray({
        name: 'orders',
        control: formMethods.control,
    });

    if (!watchedSupplier) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold">Productos</h2>

                <p className="text-muted-foreground">
                    Selecciona un proveedor para ver sus productos.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold">Productos</h2>

            {ordersFieldArray.fields.map((field, index) => {
                return (
                    <div className="flex space-x-4" key={field.id}>
                        <div className="flex flex-1 space-x-4">
                            <FormField
                                name={`orders.${index}.product`}
                                control={formMethods.control}
                                rules={{ required: 'El producto es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel required>Producto</FormLabel>

                                        <FormControl>
                                            <ComboboxSimple
                                                placeholder="Selecciona un producto"
                                                options={(productsQuery.data
                                                    ? productsQuery.data
                                                          .productsSuppliedBySupplierId
                                                    : []
                                                ).map((product) => {
                                                    return {
                                                        label: product.name,
                                                        value: product.id,
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
                                rules={{ required: 'La cantidad es requerida' }}
                                render={({ field }) => (
                                    <FormItem className="flex flex-1 flex-col">
                                        <FormLabel required>Cantidad</FormLabel>

                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        inputToNumber(e.target.value),
                                                    );
                                                }}
                                                value={field.value || ''}
                                            />
                                        </FormControl>

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
                        product: {
                            value: '',
                            label: '',
                        },
                        quantity: 0,
                    });
                }}
            >
                Agregar producto
            </Button>
        </div>
    );
};
