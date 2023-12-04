import { ContractByIdTabComponentProps } from './page';

const ContractsByIdProductsTab: React.FC<ContractByIdTabComponentProps> = ({
    contract,
}) => {
    return (
        <>
            <div className="mt-8">
                {contract.rentalContractItems.map((item, index) => (
                    <div key={index} className="mb-2 mr-8 rounded-md border bg-white">
                        <div>
                            <div className="border-b px-4 pt-2">
                                <div className="flex justify-between">
                                    <h2 className="text-gray-500">
                                        {item.product.name} {item.product.brand?.name}
                                    </h2>
                                    <p className=" text-gray-500">
                                        {item.quantity} u. x ${item.product.price}
                                    </p>
                                </div>
                                <div className="pb-2    ">
                                    {item.service && (
                                        <div className="flex justify-between ">
                                            <h2 className="text-gray-500">
                                                - {item.service.name}
                                            </h2>
                                            <p className=" text-gray-500">
                                                {item.quantity} unidad x $
                                                {item.servicePrice}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className=" flex justify-between px-4 py-2">
                            <p className="font-bold">Subtotal </p>
                            <p className="font-bold">$ {item.total}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mr-8 mt-4 flex justify-between border-t pr-2 pt-2">
                <p className="mb-8 ml-4 font-bold">Total</p>
                <b className="text-xl">${contract.total}</b>
            </div>
        </>
    );
};

export default ContractsByIdProductsTab;
