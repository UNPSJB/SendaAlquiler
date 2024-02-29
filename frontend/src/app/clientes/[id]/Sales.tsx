import Link from 'next/link';

import { useSalesByClientId } from '@/api/hooks';

import { formatDateTime } from '@/modules/dayjs/utils';

import {
    TableSecondary,
    TableSecondaryTData,
    TableSecondaryTRow,
} from '@/app/pedidos-internos/[id]/Products';

import { SalesByClientIdTabComponentProps } from './page';

import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const ClientByIdSalesTab: React.FC<SalesByClientIdTabComponentProps> = ({ id }) => {
    const useSalesByClientIdResult = useSalesByClientId(id);

    return (
        <FetchedDataRenderer
            {...useSalesByClientIdResult}
            Loading={<Spinner />}
            Error={
                <FetchStatusMessageWithDescription
                    title="Error al obtener las compras"
                    line1="Hubo un error al obtener las compras del cliente."
                />
            }
        >
            {({ salesByClientId }) => (
                <div className="pr-container pb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="pt-4 text-xl font-bold">
                            Compras{' '}
                            <span className="text-base font-extralight">
                                ({salesByClientId.length})
                            </span>
                        </h1>
                        <DeprecatedButton
                            href={`/ventas/add?client=${id}`}
                            className="mr-4 mt-8"
                        >
                            + Añadir Compra
                        </DeprecatedButton>
                    </div>

                    <ul className="space-y-8">
                        {salesByClientId.map((sale) => (
                            <div key={sale.id}>
                                <div className="flex">
                                    <h2 className="relative mb-[-1px] rounded-t-xl border-x border-t border-gray-300 bg-white px-4 pb-1 pt-4 font-bold">
                                        {formatDateTime(sale.createdOn)}
                                    </h2>
                                </div>

                                <div className="border border-gray-300 bg-white">
                                    <TableSecondary
                                        headers={[
                                            'Producto',
                                            'Marca',
                                            'Cantidad',
                                            'Precio',
                                        ]}
                                        data={
                                            <>
                                                {sale.saleItems.map((item, index) => (
                                                    <TableSecondaryTRow key={index}>
                                                        <TableSecondaryTData>
                                                            {item.product.name}
                                                        </TableSecondaryTData>
                                                        <TableSecondaryTData>
                                                            {item.product.brand?.name}
                                                        </TableSecondaryTData>
                                                        <TableSecondaryTData>
                                                            {item.quantity}
                                                        </TableSecondaryTData>
                                                        <TableSecondaryTData>
                                                            ${item.product.price}
                                                        </TableSecondaryTData>
                                                    </TableSecondaryTRow>
                                                ))}

                                                <TableSecondaryTRow>
                                                    <TableSecondaryTData>
                                                        <span className="text-xl font-bold">
                                                            Total
                                                        </span>
                                                    </TableSecondaryTData>
                                                    <TableSecondaryTData></TableSecondaryTData>
                                                    <TableSecondaryTData></TableSecondaryTData>
                                                    <TableSecondaryTData>
                                                        <div className="text-xl font-bold">
                                                            ${sale.total}
                                                        </div>
                                                    </TableSecondaryTData>
                                                </TableSecondaryTRow>
                                            </>
                                        }
                                    />

                                    <div className="flex justify-end">
                                        <Link
                                            href={`/ventas/add?client=${id}`}
                                            passHref
                                            className="border-x px-8 py-4  text-gray-400 duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                        >
                                            Comprar de nuevo
                                        </Link>
                                        <Link
                                            href={`/ventas/${sale.id}`}
                                            passHref
                                            className=" px-8 py-4  font-bold text-muted-foreground duration-300 ease-in-out hover:bg-gray-200 hover:text-gray-700"
                                        >
                                            Ver mas detalles
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdSalesTab;
