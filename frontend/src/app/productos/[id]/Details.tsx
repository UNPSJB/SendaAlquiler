import { PropsWithChildren } from 'react';

import { ProductByIdTabComponentProps } from './page';

const UL: React.FC<PropsWithChildren> = ({ children }) => {
    return <ul className="mt-8 ">{children}</ul>;
};

const LI: React.FC<PropsWithChildren> = ({ children }) => {
    return <li className="my-2">{children}</li>;
};

const ProductByIdDetailsTab: React.FC<ProductByIdTabComponentProps> = ({ product }) => {
    return (
        <>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Información Básica</h1>
                <LI>
                    <b>SKU: </b>
                    {product.sku}
                </LI>
                <LI>
                    <b>Descripción: </b>
                    {product.description}
                </LI>
                <LI>
                    <b>Tipo: </b>
                    {product.type}
                </LI>
                <LI>
                    <b>Precio: </b>$ {product.price}
                </LI>
                <LI>
                    <b>Servicio/s: </b>
                    {product.services.map((service, index) => (
                        <span key={index}>
                            {service.name}
                            {index !== product.services.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </LI>
            </UL>
            <UL>
                <h1 className="mb-3 text-xl font-bold">Stock</h1>
                {product.stock.map((stockItem, index) => (
                    <LI key={index}>
                        <b>{stockItem.office.locality.name}: </b>
                        {stockItem.stock}
                    </LI>
                ))}
            </UL>
        </>
    );
};

export default ProductByIdDetailsTab;
