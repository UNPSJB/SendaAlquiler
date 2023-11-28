import { InternalOrderByIdTabComponentProps } from './page';

const InternalOrderByIdProductsTab: React.FC<InternalOrderByIdTabComponentProps> = ({
    internalOrder,
}) => {
    return (
        <>
            <div className="mb-4 mr-8 mt-8 rounded-md border bg-white p-8">
                <div className="flex justify-between border-b-2 text-xl font-bold">
                    <h2>Producto</h2>
                    <h2 className="pr-2">Pedido | Recibido</h2>
                </div>

                <div className="mt-2">
                    {internalOrder.orders.map((item, index) => (
                        <div key={index}>
                            <div className="flex justify-between pb-2">
                                <h2 className="text-gray-500">
                                    <b className="font-medium">-</b> {item.product.name}{' '}
                                    {item.product.brand?.name} ({item.product.type})
                                </h2>
                                <p className=" text-gray-500">
                                    {item.quantity} u.{' '}
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

export default InternalOrderByIdProductsTab;
