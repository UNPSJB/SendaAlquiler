'use client';

import Link from 'next/link';

import { ClipboardListIcon, DollarSignIcon, ShoppingBagIcon } from 'lucide-react';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { Card } from '@/components/ui/card';

const Page = () => {
    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Reportes</DashboardLayoutBigTitle>
                </div>
            }
        >
            <div className="container flex-1 space-y-8 bg-muted py-8">
                <div className="space-y-2">
                    <h2 className="font-bold">Reportes de ventas</h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <Link href={'/reportes/ventas'}>
                            <Card className="!border-none">
                                <div className="flex flex-row items-center justify-center space-x-4 rounded-md py-6 transition duration-200 hover:bg-black hover:text-white">
                                    <ShoppingBagIcon />

                                    <span>Ventas</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="font-bold">Pedidos a proveedores</h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <Link href={'/reportes/pedidos-a-proveedores'}>
                            <Card className="!border-none">
                                <div className="flex flex-row items-center justify-center space-x-4 rounded-md py-6 transition duration-200 hover:bg-black hover:text-white">
                                    <ClipboardListIcon />

                                    <span>Pedidos a proveedores</span>
                                </div>
                            </Card>
                        </Link>

                        <Link href={'/reportes/costo-proveedores'}>
                            <Card className="!border-none">
                                <div className="flex flex-row items-center justify-center space-x-4 rounded-md py-6 transition duration-200 hover:bg-black hover:text-white">
                                    <DollarSignIcon />

                                    <span>Costos proveedores</span>
                                </div>
                            </Card>
                        </Link>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="font-bold">Pedidos internos</h2>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <Link href={'/reportes/pedidos-internos'}>
                            <Card className="!border-none">
                                <div className="flex flex-row items-center justify-center space-x-4 rounded-md py-6 transition duration-200 hover:bg-black hover:text-white">
                                    <DollarSignIcon />

                                    <span>Pedidos internos</span>
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
