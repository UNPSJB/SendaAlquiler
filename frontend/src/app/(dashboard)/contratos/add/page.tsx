import fetchServer from '@/api/fetch-server';
import {
    ContractByIdDocument,
    ContractByIdQuery,
    ProductTypeChoices,
} from '@/api/graphql';

import {
    ContractFormEditor,
    ContractFormEditorValues,
} from '@/modules/editors/contract/contract-form-editor';

import { calculateDiscountPercentageFromAmount } from '@/lib/utils';
import { PageProps } from '@/types/next';

type Props = PageProps<
    unknown,
    {
        duplicateId?: string;
    }
>;

export enum ContractFormEditorDiscountType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount',
    NONE = 'none',
}

export enum SaleFormEditorDiscountType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount',
    NONE = 'none',
}

const getData = async (duplicateId: string) => {
    try {
        const response = await fetchServer(ContractByIdDocument, { id: duplicateId });
        return response.contractById;
    } catch (error) {
        console.error('Error fetching data', error);
        return null;
    }
};

const getDefaultValue = (data: ContractByIdQuery['contractById']) => {
    if (!data) {
        return undefined;
    }

    const next: ContractFormEditorValues = {
        startDatetime: null,
        endDatetime: null,
        expirationDatetime: null,
        streetName: data.streetName,
        houseNumber: data.houseNumber,
        houseUnit: data.houseUnit,
        dni: data.client.dni,
        note: null,
        locality: {
            value: data.locality.id,
            label: data.locality.name,
        },
        client: {
            label: `${data.client.firstName} ${data.client.lastName}`,
            value: data.client.id,
            data: data.client,
        },
        orders: data.contractItems.map((item) => {
            return {
                product: {
                    value: item.product.id,
                    label: item.product.name,
                    data: {
                        ...item.product,
                        price: 0,
                        discount: 0,
                        currentOfficeQuantity: 0,
                        services: [],
                        type: ProductTypeChoices.Alquilable,
                    },
                },
                quantity: item.quantity,
                services: item.serviceItems.map((service) => {
                    return {
                        service: {
                            value: service.service.id,
                            label: service.service.name,
                            data: service.service,
                        },
                        serviceDiscountType: {
                            value: ContractFormEditorDiscountType.AMOUNT,
                            label: 'Monto Fijo ($)',
                        },
                        serviceDiscountPercentage: calculateDiscountPercentageFromAmount({
                            subtotal: service.subtotal,
                            amount: service.discount,
                        }),
                        serviceDiscountAmount: service.discount,
                    };
                }),
                productDiscountType: {
                    value: ContractFormEditorDiscountType.AMOUNT,
                    label: 'Monto Fijo ($)',
                },
                productDiscountPercentage: calculateDiscountPercentageFromAmount({
                    subtotal: item.productSubtotal,
                    amount: item.productDiscount,
                }),
                productDiscountAmount: item.productDiscount,
            };
        }),
    };

    return next;
};

const Page = async ({ searchParams: { duplicateId } }: Props) => {
    const data = duplicateId ? await getData(duplicateId) : null;

    const defaultValues = getDefaultValue(data);

    return <ContractFormEditor cancelHref="/contratos" defaultValues={defaultValues} />;
};

export default Page;
