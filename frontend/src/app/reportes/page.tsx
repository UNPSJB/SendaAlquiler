'use client';

import Link from 'next/link';

import { ShoppingBagIcon } from 'lucide-react';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
    //const {queryResult, variables, setVariables } = useClients();

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
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-evenly space-y-0 pb-6">
                                    <CardTitle className="text-base font-bold">
                                        Producto mas vendido por sucursal
                                    </CardTitle>
                                    <ShoppingBagIcon />
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
