import { useFieldArray, useFormContext } from 'react-hook-form';

import { ContractFormEditorDiscountType } from '@/app/contratos/add/page';

import { ContractFormEditorValues } from './contract-form-editor';
import { ContractFormEditorOrderItem } from './contract-form-editor-order-item';

import { Button } from '@/components/ui/button';

export const ContractFormEditorOrders = () => {
    const formMethods = useFormContext<ContractFormEditorValues>();

    const ordersFieldArray = useFieldArray({
        control: formMethods.control,
        name: 'orders',
    });
    const startDatetime = formMethods.watch('startDatetime');
    const endDatetime = formMethods.watch('endDatetime');
    const existentOrders = formMethods.watch('orders') || [];

    const lastOrderHasProduct =
        existentOrders.length == 0 ||
        (existentOrders.length > 0 &&
            existentOrders[existentOrders.length - 1].product?.value);

    return (
        <section className="space-y-4 border-t border-gray-200 py-8">
            <h2 className="text-xl font-bold">Productos y servicios</h2>

            {startDatetime && endDatetime ? (
                <div className="space-y-6">
                    {ordersFieldArray.fields.map((field, index) => {
                        return (
                            <ContractFormEditorOrderItem
                                key={field.id}
                                orderIndex={index}
                                ordersFieldArray={ordersFieldArray}
                            />
                        );
                    })}

                    {lastOrderHasProduct && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                ordersFieldArray.append({
                                    product: null,
                                    productDiscountAmount: null,
                                    productDiscountPercentage: null,
                                    productDiscountType: {
                                        value: ContractFormEditorDiscountType.NONE,
                                        label: 'Sin descuento',
                                    },

                                    services: [],
                                    allocations: [],
                                });
                            }}
                        >
                            + Añadir producto
                        </Button>
                    )}
                </div>
            ) : (
                <p className="text-sm">
                    Debes seleccionar una fecha de inicio y fin para poder añadir
                    productos
                </p>
            )}
        </section>
    );
};
