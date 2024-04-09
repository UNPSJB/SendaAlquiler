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
                                <div className="flex flex-row items-center justify-center space-x-4 rounded-md py-6 transition duration-200 hover:bg-black hover:text-white">
                                    <ShoppingBagIcon />

                                    <span>Producto más vendido por sucursal</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Page;
