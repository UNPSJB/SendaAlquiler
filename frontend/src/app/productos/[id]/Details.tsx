import { PropsWithChildren } from 'react';

import { ProductByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const SN: React.FC<PropsWithChildren> = ({ children }) => {
    return <span className="font-bold">{children}</span>;
};


const ProductByIdDetailsTab: React.FC<ProductByIdTabComponentProps> = ({ product }) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <SN>SKU: </SN>
                    {product.sku}
                </LI>
                <LI>
                    <SN>Descripción: </SN>
                    {product.description}
                </LI>
                <LI>
                    <SN>Tipo: </SN>
                    {product.type}
                </LI>
                <LI>
                    <SN>Precio: </SN>
                    $ {product.price}
                </LI>
                <LI>
                    <SN>Servicio/s: </SN>
                    {product.services.map((service, index) => (
                        <span key={index}>{service.name}{index !== product.services.length - 1 ? ', ' : ''}</span>
                    ))}
                </LI>

            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Stock</h1>
                {product.stock.map((stockItem, index) => (
                    <LI key={index}>
                        <SN>{stockItem.office.locality.name}: </SN>
                        {stockItem.stock}
                    </LI>
                ))}
            </UL>
        </>
    );
};

export default ProductByIdDetailsTab;