import { SupplierOrderByIdTabComponentProps } from './page';

const SupplierOrderByIdProductsTab: React.FC<SupplierOrderByIdTabComponentProps> = ({
    supplierOrder,
}) => {
    return (
        <>
            <div className="mb-4 mr-8 mt-8 rounded-md border bg-white p-4">
                <div className="flex justify-between border-b-2 font-bold">
                    <h2>Producto</h2>
                    <h2 className="pr-2">Pedido | Recibido</h2>
                </div>

                <div className="mt-2">
                    {supplierOrder.currentHistory?.supplierOrder.orders.map(
                        (item, index) => (
                            <div key={index}>
                                <div className="flex justify-between pb-1">
                                    <h2 className="text-gray-500">
                                        {item.product.name} {item.product.brand?.name}
                                    </h2>
                                    <p className=" text-gray-500">
                                        {item.quantity}{' '}
                                        {item.quantity > 1 ? 'unidad/es' : 'unidad'}{' '}
                                        <span className="font-bold">|</span>{' '}
                                        {item.quantityReceived}
                                        {item.quantityReceived > 1
                                            ? 'unidad/es'
                                            : 'unidad'}
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </>
    );
};

export default SupplierOrderByIdProductsTab;
