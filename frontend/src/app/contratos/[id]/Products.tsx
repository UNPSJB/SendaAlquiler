import { ContractByIdTabComponentProps } from './page';

const ContractsByIdProductsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <>
            <div className="mt-8">
                {contract.rentalContractItems.map((item, index) => (
                    <div key={index} className="mb-4 mr-8 rounded-md border bg-white p-4">
                        <div>
                            <div className="border-b-2">
                                <div className="flex justify-between pb-1">
                                    <h2 className="text-gray-500">
                                        {item.product.name} {item.product.brand?.name}
                                    </h2>
                                    <p className=" text-gray-500">
                                        {item.quantity}{' '}
                                        {item.quantity > 1 ? 'unidad/es' : 'unidad'} x $
                                        {item.product.price}
                                    </p>
                                </div>
                                <div className="pb-2">
                                    {item.product.services.map(
                                        (service, serviceIndex) => (
                                            <div key={serviceIndex}>
                                                <div className="flex justify-between ">
                                                    <h2 className="text-gray-500">
                                                        - {service.name}
                                                    </h2>
                                                    <p className=" text-gray-500">
                                                        1 unidad x ${service.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                            <p className="font-bold">Subtotal </p>
                            <p className="font-bold">$ {item.total}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mr-8 mt-8 flex justify-between border-t-2 pr-2 pt-2">
                <p className="ml-4 font-bold">Total</p>
                <b className="text-xl">${contract.total}</b>
            </div>
        </>
    );
};

export default ContractsByIdProductsTab;
