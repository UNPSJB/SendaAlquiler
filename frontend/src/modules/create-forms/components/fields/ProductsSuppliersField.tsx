import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { SuppliersQuery } from '@/api/graphql';
import { usePaginatedSuppliers } from '@/api/hooks';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import Input from '../../../forms/DeprecatedInput';
import { RHFFormField } from '../../../forms/FormField';
import RHFSelect from '../../../forms/Select';

export type ProductsSuppliersFieldFormValues = {
    suppliers: {
        supplier: {
            value: string;
            label: string;
            data: SuppliersQuery['suppliers']['results'][0];
        };
        price: number;
    }[];
};

const ProductsSuppliersField: React.FC = () => {
    const { control, getValues, watch } =
        useFormContext<ProductsSuppliersFieldFormValues>();
    const { queryResult: suppliersResult } = usePaginatedSuppliers();
    const { data, isLoading } = suppliersResult;

    const [suppliersToCreate, setOrdersToCreate] = useState(1);

    const handleAddOrder = () => {
        const suppliers = data?.suppliers.results;
        if (!suppliers) return;

        const createdStocks = getValues('suppliers') || [];
        if (suppliers.length > createdStocks.length) {
            setOrdersToCreate((orders) => orders + 1);
        }
    };

    const stocks = watch('suppliers') || [];
    const selectedProductIds = stocks
        .filter((x) => x.supplier)
        .map((x) => x.supplier?.value);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {Array.from({ length: suppliersToCreate }).map((_, index) => (
                    <div
                        className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                        key={index}
                    >
                        <RHFFormField
                            fieldID={`stock-${index}-supplier`}
                            label="Producto"
                            className="flex-1"
                            showRequired
                        >
                            <RHFSelect
                                options={(data?.suppliers.results || [])
                                    .filter((x) => {
                                        const isSelected = selectedProductIds.includes(
                                            x.id,
                                        );
                                        const isSelectedInCurrentIndex =
                                            selectedProductIds[index] === x.id;

                                        return isSelectedInCurrentIndex || !isSelected;
                                    })
                                    .map((stock) => ({
                                        label: stock.name,
                                        value: stock.id,
                                        data: stock,
                                    }))}
                                control={control}
                                name={`suppliers.${index}.supplier`}
                                rules={{
                                    required: true,
                                }}
                                isLoading={isLoading}
                                placeholder="Selecciona un proveedor"
                            />
                        </RHFFormField>

                        <RHFFormField
                            fieldID={`stock-${index}-price`}
                            label="Precio"
                            showRequired
                        >
                            <Input
                                id={`stock-${index}-price`}
                                name={`suppliers.${index}.price`}
                                type="price"
                                placeholder="1"
                                control={control}
                                rules={{ required: true }}
                            />
                        </RHFFormField>
                    </div>
                ))}
            </div>

            <FetchedDataRenderer
                {...suppliersResult}
                Loading={<Skeleton height={30} />}
                Error={null}
            >
                {({ suppliers }) => {
                    if (suppliersToCreate < suppliers.results.length) {
                        return (
                            <Button
                                fullWidth
                                variant={ButtonVariant.OUTLINE_WHITE}
                                onClick={handleAddOrder}
                            >
                                + Añadir proveedor
                            </Button>
                        );
                    }

                    return null;
                }}
            </FetchedDataRenderer>
        </div>
    );
};

export default ProductsSuppliersField;
