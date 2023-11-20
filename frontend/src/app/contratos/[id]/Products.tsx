import { PropsWithChildren } from 'react';

import { ContractByIdTabComponentProps } from './page';

// const UL: React.FC<PropsWithChildren> = ({ children }) => {
//     return <ul className="mt-8 ">{children}</ul>;
// };

// const LI: React.FC<PropsWithChildren> = ({ children }) => {
//     return <li className="my-2">{children}</li>;
// };

const ContractsByIdProductsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <>
            <div>
                {contract.rentalContractItems.map((item, index) => (
                    <div key={index} className="mb-4 mr-8 rounded-md border bg-white p-4">
                        <div className="flex justify-between border-b-2">
                            <h2 className="text-gray-500">
                                {item.product.name} {item.product.brand?.name}
                            </h2>
                            <p className=" text-gray-500">
                                {item.quantity}{' '}
                                {item.quantity > 1 ? 'unidad/es' : 'unidad'} x $
                                {item.product.price}
                            </p>
                            <div>
                                {item.product.services.map((service, serviceIndex) => (
                                    <div key={serviceIndex}>
                                        <h2 className="text-gray-500">{service.name}</h2>
                                        <p className="text-gray-500">
                                            1 unidad x ${service.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p className="font-bold">Subtotal </p>
                            <p className="font-bold">$ {item.total}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ContractsByIdProductsTab;
