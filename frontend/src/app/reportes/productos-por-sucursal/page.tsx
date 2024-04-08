'use client';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const Products = () => {
    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>
                        Productos mas vendidos
                    </DashboardLayoutBigTitle>
                </div>
            }
        >
            <div className="container flex-1 bg-muted py-8">
                <div className="flex rounded-lg bg-card p-4 text-card-foreground shadow-sm">
                    <div className="rounded-xl bg-gray-100 px-2 py-1 text-xs">
                        {' '}
                        los ultimos 28 dias
                    </div>
                    <p className="mx-4">23 feb</p>
                </div>
                <div className="my-4 text-xl font-bold">Vista Global</div>
                <div className="space-y-4 bg-white p-4">
                    <div className="space-y-2">
                        <div className="rounded-md border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descripcion</TableHead>
                                        <TableHead>Cantidad de ventas</TableHead>
                                        <TableHead>Total en ventas</TableHead>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Producto 1</TableCell>
                                        <TableCell>${}</TableCell>
                                    </TableRow>
                                </TableHeader>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="my-4 text-xl font-bold">Por sucursal</div>
                {/* esto no deberia tener el nombre del lugar manual */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                        <h3 className="text-sm font-bold">Trelew</h3>
                        <a href="/" className="text-sm text-blue-700">
                            {' '}
                            Ver mas detalles
                        </a>
                    </div>
                    <div className="flex justify-between">
                        <h3 className="text-sm font-bold">Trelew</h3>
                        <a href="/" className="text-sm text-blue-700">
                            {' '}
                            Ver mas detalles
                        </a>
                    </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="space-y-4 bg-white p-4">
                        <div className="space-y-2">
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Descripcion</TableHead>
                                            <TableHead>Cantidad de ventas</TableHead>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Producto 1</TableCell>
                                            <TableCell>${}</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </div>
                        </div>
                    </div>
                    {/* esto a continuacion tecnicamente no va pero lo puse para que se vea */}

                    <div className="space-y-4 bg-white p-4">
                        <div className="space-y-2">
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Descripcion</TableHead>
                                            <TableHead>Cantidad de ventas</TableHead>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Producto 1</TableCell>
                                            <TableCell>${}</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
