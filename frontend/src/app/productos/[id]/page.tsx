'use client';

import { useParams } from 'next/navigation';

import { useState } from 'react';

import { ProductByIdQuery } from '@/api/graphql';
import { useProductById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import ProductByIdDetailsTab from './Details';

import Avatar from '@/components/Avatar';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import Spinner from '@/components/Spinner/Spinner';

const getAvatarText = (name: string) => {
    return (name[0]).toUpperCase();
};

const getDasboardTitle = (product: ProductByIdQuery['productById'] | undefined) => {
    if (!product) {
        return <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center space-x-4">
            <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>
            <ChevronRight />
            <span className="font-headings text-sm">
                {product.name} 
            </span>
        </div>
    );
};

export type ProductByIdTabComponentProps = {
    product: NonNullable<ProductByIdQuery['productById']>;
};

const tabs = [
    {
        label: 'Detalles',
        key: 'details',
        Component: ProductByIdDetailsTab,
    },
];

const Page = () => {
    const { id } = useParams();
    const useProductByIdResult = useProductById(id as string);

    const [activeTab, setActiveTab] = useState(tabs[0].key);

    const product = useProductByIdResult.data?.productById;
    const Component = tabs.find((tab) => tab.key === activeTab)!.Component;

    return (
        <DashboardLayout header={getDasboardTitle(product)}>
            <FetchedDataRenderer
                {...useProductByIdResult}
                Loading={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <Spinner />
                    </div>
                }
                Error={
                    <div className="flex w-full flex-1 items-center justify-center">
                        <FetchStatusMessageWithDescription
                            title="Ha ocurrido un error"
                            line1="Hubo un error al cargar al producto."
                            line2="Prueba de nuevo más tarde."
                        />
                    </div>
                }
            >
                {({ productById: product }) => {
                    if (!product) {
                        return (
                            <div className="flex w-full flex-1 items-center justify-center">
                                <FetchStatusMessageWithButton
                                    message="Parece que el producto que buscas no existe."
                                    btnHref="/productos"
                                    btnText='Volver a "Productos"'
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex  flex-1 flex-col">
                            <header className="border-b pl-10">
                                <div className="mb-10 flex items-center">
                                    <Avatar>
                                        {getAvatarText(product.name)}
                                    </Avatar>
                                    <div className="pl-6">
                                        <h1 className="my-2 mt-10 text-xl font-bold">
                                            {product.name} 
                                        </h1>
                                        <p>{product.brand.name}</p>
                                    </div>
                                </div>

                                <Tabs
                                    tabs={tabs.map((tab) => {
                                        return {
                                            ...tab,
                                            isActive: tab.key === activeTab,
                                            onClick: setActiveTab,
                                        };
                                    })}
                                />
                            </header>

                            <div className="flex-1 bg-gray-100 px-0">
                                <section className="pl-10 ">
                                    <Component product={product} />
                                </section>
                            </div>
                        </div>
                    );
                }}
            </FetchedDataRenderer>
        </DashboardLayout>
    );
};

export default Page;