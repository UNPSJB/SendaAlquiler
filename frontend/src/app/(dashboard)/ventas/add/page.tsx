import fetchServer from '@/api/fetch-server';
import { SaleByIdDocument } from '@/api/graphql';

import { SaleFormEditor } from '@/modules/editors/sale/sale-form-editor';

import { calculateDiscountPercentageFromAmount } from '@/lib/utils';
import { PageProps } from '@/types/next';

type Props = PageProps<
    unknown,
    {
        duplicateId?: string;
    }
>;

export enum SaleFormEditorDiscountType {
    PERCENTAGE = 'percentage',
    AMOUNT = 'amount',
    NONE = 'none',
}

const getData = async (duplicateId: string) => {
    try {
        const response = await fetchServer(SaleByIdDocument, { id: duplicateId });
        return response.saleById;
    } catch (error) {
        console.error('Error fetching data', error);
        return null;
    }
};

const Page = async ({ searchParams: { duplicateId } }: Props) => {
    const data = duplicateId ? await getData(duplicateId) : null;

    return (
        <SaleFormEditor
            cancelHref="/ventas"
            defaultValues={
                data
                    ? {
                          client: {
                              label: `${data.client.firstName} ${data.client.lastName}`,
                              value: data.client.id,
                              data: data.client,
                          },
                          orders: [
                              ...data.saleItems.map((item) => ({
                                  product: {
                                      label: item.product.name,
                                      value: item.product.id,
                                      data: {
                                          ...item.product,
                                          currentOfficeQuantity: 0,
                                      },
                                  },
                                  quantity: 0,
                                  discountPercentage:
                                      calculateDiscountPercentageFromAmount({
                                          amount: item.discount,
                                          subtotal: item.subtotal,
                                      }),
                                  discountAmount: item.discount,
                                  discountType: item.discount
                                      ? SaleFormEditorDiscountType.AMOUNT
                                      : SaleFormEditorDiscountType.NONE,
                              })),
                          ],
                      }
                    : undefined
            }
        />
    );
};

export default Page;
