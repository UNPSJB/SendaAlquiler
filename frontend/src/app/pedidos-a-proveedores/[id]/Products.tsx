import { SupplierOrderByIdTabComponentProps } from './page';

const SupplierOrderByIdProductsTab: React.FC<SupplierOrderByIdTabComponentProps> = ({
    supplierOrder,
}) => {
    return (
        <>
            <div className="mb-4 mr-8 mt-8 rounded-md border bg-white">
                <div className="flex justify-between border-b px-4 py-3 font-bold">
                    <h2>Producto</h2>
                    <h2 className="pr-2">Pedido | Recibido</h2>
                </div>

                <div className="px-4 py-2">
                    {supplierOrder.orderItems.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between pb-2">
                                <h2 className="text-muted-foreground">
                                    <b className="font-medium">-</b> {item.product.name}{' '}
                                    {item.product.brand?.name}
                                </h2>
                                <p className=" text-muted-foreground">
                                    {item.quantityOrdered} u.{' '}
                                    <span className="font-bold">|</span>{' '}
                                    {item.quantityReceived} u.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SupplierOrderByIdProductsTab;
