import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { OfficesQuery } from '@/api/graphql';
import { useOffices } from '@/api/hooks';

import Button, { ButtonVariant } from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';

import { RHFFormField } from '../../forms/FormField';
import Input from '../../forms/Input';
import RHFSelect from '../../forms/Select';

export type ProductsStockFieldFormValues = {
    stock: {
        office: {
            value: string;
            label: string;
            data: OfficesQuery['offices'][0];
        };
        stock: number;
    }[];
};

const ProductsStockField: React.FC = () => {
    const { control, getValues, watch } = useFormContext<ProductsStockFieldFormValues>();
    const officesResult = useOffices();
    const { data, isLoading } = officesResult;

    const [officesToCreate, setOrdersToCreate] = useState(1);

    const handleAddOrder = () => {
        const offices = data?.offices;
        if (!offices) return;

        const createdStocks = getValues('stock') || [];
        if (offices.length > createdStocks.length) {
            setOrdersToCreate((orders) => orders + 1);
        }
    };

    const stocks = watch('stock') || [];
    const selectedProductIds = stocks.filter((x) => x.office).map((x) => x.office?.value);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {Array.from({ length: officesToCreate }).map((_, index) => (
                    <div
                        className="flex space-x-4 rounded border border-gray-200 bg-gray-100 p-4"
                        key={index}
                    >
                        <RHFFormField
                            fieldID={`stock-${index}-office`}
                            label="Sucursal"
                            className="flex-1"
                            showRequired
                        >
                            <RHFSelect
                                options={(data?.offices || [])
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
                                name={`stock.${index}.office`}
                                rules={{
                                    required: true,
                                }}
                                isLoading={isLoading}
                                placeholder="Selecciona un proveedor"
                            />
                        </RHFFormField>

                        <RHFFormField
                            fieldID={`stock-${index}-stock`}
                            label="Stock"
                            showRequired
                        >
                            <Input
                                id={`stock-${index}-stock`}
                                name={`stock.${index}.stock`}
                                type="number"
                                placeholder="1"
                                control={control}
                                rules={{ required: true }}
                            />
                        </RHFFormField>
                    </div>
                ))}
            </div>

            <FetchedDataRenderer
                {...officesResult}
                Loading={<Skeleton height={30} />}
                Error={null}
            >
                {({ offices }) => {
                    if (officesToCreate < offices.length) {
                        return (
                            <Button
                                fullWidth
                                variant={ButtonVariant.OUTLINE_WHITE}
                                onClick={handleAddOrder}
                            >
                                + Añadir stock
                            </Button>
                        );
                    }

                    return null;
                }}
            </FetchedDataRenderer>
        </div>
    );
};

export default ProductsStockField;
