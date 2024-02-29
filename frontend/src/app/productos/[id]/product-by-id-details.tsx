import { ProductByIdTabComponentProps } from './page';

import { formatNumberAsPrice } from '@/lib/utils';

export const ProductByIdDetailsTab: React.FC<ProductByIdTabComponentProps> = ({
    product,
}) => {
    return (
        <div className="space-y-6 pb-12 pt-6">
            <div className="space-y-4">
                <div>
                    <h2 className="mb-2 font-bold">Detalles</h2>
                    <div className="space-y-2">
                        <p className="text-sm">SKU: {product.sku}</p>
                        <p className="text-sm">Marca: {product.brand?.name || '-'}</p>
                        <p className="text-sm">Tipo: {product.type}</p>
                        <p className="text-sm">
                            Precio:{' '}
                            {product.price
                                ? `$${formatNumberAsPrice(product.price)}`
                                : '-'}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Stocks</h2>
                    <div className="space-y-2">
                        {product.stockItems.map((stock) => (
                            <div
                                key={stock.office.id}
                                className="space-y-2 rounded border bg-white p-3"
                            >
                                <p className="text-sm">Oficina: {stock.office.name}</p>
                                <p className="text-sm">
                                    Localidad: {stock.office.locality.name}
                                </p>
                                <p className="text-sm">Stock: {stock.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Servicios</h2>
                    <div className="space-y-2">
                        {product.services.map((service) => (
                            <div
                                className="space-y-2 rounded border bg-white p-3"
                                key={service.id}
                            >
                                <p className="text-sm">Nombre: {service.name}</p>
                                <p className="text-sm">
                                    Precio:{' '}
                                    {service.price
                                        ? `$${formatNumberAsPrice(service.price)}`
                                        : '-'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="mb-2 font-bold">Proveedores</h2>
                    <div className="space-y-2">
                        {product.suppliers.map((supplier) => (
                            <div
                                key={supplier.supplier.id}
                                className="space-y-2 rounded border bg-white p-3"
                            >
                                <p className="text-sm">
                                    Nombre: {supplier.supplier.name}
                                </p>
                                <p className="text-sm">
                                    Precio:{' '}
                                    {supplier.price
                                        ? `$${formatNumberAsPrice(supplier.price)}`
                                        : '-'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
