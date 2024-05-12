'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useState } from 'react';

import { ProductByIdQuery } from '@/api/graphql';
import { useProductById } from '@/api/hooks';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import Tabs from '@/modules/details-page/Tabs';
import ChevronRight from '@/modules/icons/ChevronRight';

import { ProductByIdDetailsTab } from './product-by-id-details';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import FetchStatusMessageWithButton from '@/components/FetchStatusMessageWithButton';
import FetchStatusMessageWithDescription from '@/components/FetchStatusMessageWithDescription';
import { DashboardLayoutContentLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';

const getDasboardTitle = (
    product: ProductByIdQuery['productById'] | undefined,
    id: string,
) => {
    if (!product) {
        return <DashboardLayoutBigTitle>Productos</DashboardLayoutBigTitle>;
    }

    return (
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <DashboardLayoutBigTitle>
                    <Link href="/productos">Productos</Link>
                </DashboardLayoutBigTitle>
                <ChevronRight />
                <span className="font-headings text-sm">{product.name}</span>
            </div>

            <Button asChild>
                <Link href={`/productos/${id}/edit`}>Editar</Link>
            </Button>
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
        <DashboardLayout header={getDasboardTitle(product, id as string)}>
            <FetchedDataRenderer
                {...useProductByIdResult}
                Loading={<DashboardLayoutContentLoading />}
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
                            <header className="border-b pl-8">
                                <div className="mb-10">
                                    <h1 className="my-2 mt-8 text-xl font-bold">
                                        {product.name}
                                    </h1>
                                    <p>{product.brand?.name || '-'}</p>
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

                            <div className="flex flex-1 bg-gray-100">
                                <section className="pr-container flex w-full flex-1 flex-col pl-8">
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
