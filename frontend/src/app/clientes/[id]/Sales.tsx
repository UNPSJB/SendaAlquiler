import { useSalesByClientId } from '@/api/hooks';

import { SalesByClientIdTabComponentProps } from './page';

import DeprecatedButton from '@/components/Button';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';

const ClientByIdSalesTab: React.FC<SalesByClientIdTabComponentProps> = ({ id }) => {
    const useSalesByClientIdResult = useSalesByClientId(id);

    return (
        <FetchedDataRenderer
            {...useSalesByClientIdResult}
            Loading={<DashboardLayoutContentLoading />}
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

                    <ul className="space-y-8"></ul>
                </div>
            )}
        </FetchedDataRenderer>
    );
};

export default ClientByIdSalesTab;
