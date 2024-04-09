'use client';

import Link from 'next/link';

import { ShoppingBagIcon } from 'lucide-react';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Reportes</DashboardLayoutBigTitle>
                </div>
            }
        >
            <div className="container flex-1 bg-muted py-8">
                <div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <Link href={'/reportes/productos-por-sucursal'}>
                            <Card className="!border-none">
                                <CardHeader className="flex flex-row items-center space-y-0 pb-6 hover:bg-muted">
                                    <ShoppingBagIcon className="mr-8" />
                                    <CardTitle className="mx-6 px-8 text-base font-bold">
                                        Producto más vendido por sucursal
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
