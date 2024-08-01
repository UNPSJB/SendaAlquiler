'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { format, getDate } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';

import { ContractByIdQuery } from '@/api/graphql';

import { ContractStatusBadge } from '@/components/badges';
import { BaseTable } from '@/components/base-table';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatNumberAsPrice } from '@/lib/utils';

type Item = NonNullable<ContractByIdQuery['contractById']>['contractItems'][0];

const productColumnsHelper = createColumnHelper<Item>();

const productColumns: ColumnDef<Item, any>[] = [
    productColumnsHelper.accessor('product.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
        size: 225,
    }),
    productColumnsHelper.accessor('quantity', {
        header: 'Cantidad',
    }),
    productColumnsHelper.accessor('productPrice', {
        header: 'Precio u. x día',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('productSubtotal', {
        header: 'Subtotal',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.productSubtotal, 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('productDiscount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return `$${formatNumberAsPrice(value)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + row.original.productDiscount, 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    productColumnsHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.row.original;
            return `$${formatNumberAsPrice(value.productSubtotal - value.productDiscount)}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce(
                    (acc, row) =>
                        acc +
                        (row.original.productSubtotal - row.original.productDiscount),
                    0,
                );
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
];

type ServiceRowType = Item['serviceItems'][0] & {
    product: Item['product'];
};
const serviceColumnsHelper = createColumnHelper<ServiceRowType>();

const serviceColumns: ColumnDef<ServiceRowType, any>[] = [
    serviceColumnsHelper.accessor('service.name', {
        header: 'Descripción',
        cell: (cell) => {
            const value = cell.getValue();
            return (
                <div>
                    <p className="font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">
                        {cell.row.original.product.name} -{' '}
                        {cell.row.original.product.brand?.name || 'Sin marca'}
                    </p>
                </div>
            );
        },
    }),
    serviceColumnsHelper.accessor('price', {
        header: 'Precio',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
    }),
    serviceColumnsHelper.accessor('billingType', {
        header: 'Tipo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value;
        },
    }),
    serviceColumnsHelper.accessor('billingPeriod', {
        header: 'Periodo de facturación',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `${value} días` : '-';
        },
    }),
    serviceColumnsHelper.accessor('subtotal', {
        header: 'Subtotal',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + (row.original.subtotal || 0), 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    serviceColumnsHelper.accessor('discount', {
        header: 'Descuento',
        cell: (cell) => {
            const value = cell.getValue();
            return value ? `$${formatNumberAsPrice(value)}` : '-';
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce((acc, row) => acc + (row.original.discount || 0), 0);
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
    serviceColumnsHelper.accessor('total', {
        header: 'Total',
        cell: (cell) => {
            const value = cell.row.original;
            return `$${formatNumberAsPrice((value.subtotal || 0) - (value.discount || 0))}`;
        },
        footer: (props) => {
            const value = props.table
                .getFilteredRowModel()
                .rows.reduce(
                    (acc, row) =>
                        acc +
                        ((row.original.subtotal || 0) - (row.original.discount || 0)),
                    0,
                );
            return `$${formatNumberAsPrice(value)}`;
        },
    }),
];

type Props = {
    contract: NonNullable<ContractByIdQuery['contractById']>;
};

enum AccordionValue {
    LocationDetails = 'location-details',
    BillingInfo = 'billing-info',
    Resumen = 'resumen',
}

export const ContractDetails = ({ contract }: Props) => {
    // Fixed calculation for product total
    const productTotal = contract.contractItems.reduce(
        (acc, item) => acc + item.productSubtotal - item.productDiscount,
        0,
    );

    // Fixed calculation for service total
    const serviceTotal = contract.contractItems.reduce(
        (acc, item) =>
            acc +
            item.serviceItems.reduce(
                (serviceAcc, service) => serviceAcc + service.subtotal - service.discount,
                0,
            ),
        0,
    );

    // Calculate the grand total
    const grandTotal = productTotal + serviceTotal;

    return (
        <>
            <div className="space-y-4 bg-white p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Contrato #{contract.id}</h2>

                        <p className="text-sm text-muted-foreground">
                            Creado el {format(new Date(contract.createdOn), 'dd/MM/yyyy')}
                        </p>
                    </div>

                    <ContractStatusBadge status={contract.latestHistoryEntry!.status!} />
                </div>

                <div className="space-y-1">
                    <p>
                        <b>Sucursal:</b> {contract.office.name}
                    </p>
                    <p>
                        <b>Fechas de contrato:</b>{' '}
                        <ul className="list-inside list-disc">
                            <li>
                                <b>Inicio:</b>{' '}
                                {format(
                                    new Date(contract.contractStartDatetime),
                                    'EEEE',
                                    {
                                        locale: es,
                                    },
                                )}{' '}
                                {getDate(new Date(contract.contractStartDatetime))} de{' '}
                                {format(
                                    new Date(contract.contractStartDatetime),
                                    'MMMM',
                                    {
                                        locale: es,
                                    },
                                )}{' '}
                                a las{' '}
                                {format(
                                    new Date(contract.contractStartDatetime),
                                    'HH:mm',
                                )}{' '}
                                hs.
                            </li>
                            <li>
                                <b>Fin:</b>{' '}
                                {format(new Date(contract.contractEndDatetime), 'EEEE', {
                                    locale: es,
                                })}{' '}
                                {getDate(new Date(contract.contractEndDatetime))} de{' '}
                                {format(new Date(contract.contractEndDatetime), 'MMMM', {
                                    locale: es,
                                })}{' '}
                                a las{' '}
                                {format(new Date(contract.contractEndDatetime), 'HH:mm')}{' '}
                                hs.
                            </li>
                            <li>
                                <b>Días de alquiler:</b> {contract.numberOfRentalDays}
                            </li>
                            <li>
                                <b>Fecha de vencimiento:</b>{' '}
                                {format(new Date(contract.expirationDate), 'EEEE', {
                                    locale: es,
                                })}{' '}
                                {getDate(new Date(contract.expirationDate))} de{' '}
                                {format(new Date(contract.expirationDate), 'MMMM', {
                                    locale: es,
                                })}{' '}
                                a las {format(new Date(contract.expirationDate), 'HH:mm')}{' '}
                                hs. (
                                {dayjs(contract.expirationDate).diff(
                                    contract.createdOn,
                                    'days',
                                )}{' '}
                                días de prórroga desde el presupuesto)
                            </li>
                        </ul>
                    </p>
                    <p>
                        <b>Dirección de entrega:</b> {contract.office.street}{' '}
                        {contract.office.houseNumber}, {contract.client.locality.name},{' '}
                        {contract.client.locality.state} (
                        {contract.client.locality.postalCode})
                    </p>
                    <p>
                        <b>Cliente:</b> {contract.client.firstName}{' '}
                        {contract.client.lastName} (DNI: {contract.client.dni})
                    </p>
                    <p>
                        <b>Total:</b> ${formatNumberAsPrice(contract.total)}
                    </p>
                </div>

                <Accordion type="multiple">
                    <AccordionItem value={AccordionValue.LocationDetails}>
                        <AccordionTrigger>
                            <h3 className="text-sm text-muted-foreground">
                                Ver detalles de la ubicación
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <Label>Dirección de entrega</Label>
                                        <Input
                                            value={`${contract.office.street} ${contract.office.houseNumber}`}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Provincia</Label>
                                        <Input
                                            value={contract.client.locality.state}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ciudad</Label>
                                        <Input
                                            value={contract.client.locality.name}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Codigo Postal</Label>
                                        <Input
                                            value={contract.client.locality.postalCode}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Calle</Label>
                                        <Input
                                            value={contract.client.streetName}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>N° de Casa</Label>
                                        <Input
                                            value={contract.client.houseNumber}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Apartamento, habitación, unidad, etc
                                        </Label>
                                        <Input
                                            value={contract.client.houseUnit || ''}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Fecha de inicio</Label>
                                        <Input
                                            value={format(
                                                new Date(contract.contractStartDatetime),
                                                'dd/MM/yyyy',
                                            )}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Fecha de fin</Label>
                                        <Input
                                            value={format(
                                                new Date(contract.contractEndDatetime),
                                                'dd/MM/yyyy',
                                            )}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Fecha de vencimiento</Label>
                                        <Input
                                            value={format(
                                                new Date(contract.expirationDate),
                                                'dd/MM/yyyy',
                                            )}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>N° de días de alquiler</Label>
                                        <Input
                                            value={contract.numberOfRentalDays}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={AccordionValue.BillingInfo}>
                        <AccordionTrigger>
                            <h3 className="text-sm text-muted-foreground">
                                Ver información de facturación
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <Label>Nombre</Label>
                                        <Input
                                            value={contract.client.firstName}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Apellido</Label>
                                        <Input
                                            value={contract.client.lastName}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Correo</Label>
                                        <Input
                                            value={contract.client.email}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Telefono</Label>
                                        <Input
                                            value={`${contract.client.phoneCode}${contract.client.phoneNumber}`}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>DNI</Label>
                                        <Input
                                            value={contract.client.dni}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Provincia</Label>
                                        <Input
                                            value={contract.client.locality.state}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ciudad</Label>
                                        <Input
                                            value={contract.client.locality.name}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Codigo Postal</Label>
                                        <Input
                                            value={contract.client.locality.postalCode}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Calle</Label>
                                        <Input
                                            value={contract.client.streetName}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>N° de Casa</Label>
                                        <Input
                                            value={contract.client.houseNumber}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Apartamento, habitación, unidad, etc
                                        </Label>
                                        <Input
                                            value={contract.client.houseUnit || ''}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value={AccordionValue.Resumen}>
                        <AccordionTrigger>
                            <h3 className="text-sm text-muted-foreground">
                                Ver resumen financiero
                            </h3>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="rounded-md border border-border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Concepto</TableHead>
                                            <TableHead>Subtotal</TableHead>
                                            <TableHead>Descuento</TableHead>
                                            <TableHead>Total</TableHead>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Productos</TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc + item.productSubtotal,
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc + item.productDiscount,
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                ${formatNumberAsPrice(productTotal)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Servicios</TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc +
                                                            item.serviceItems.reduce(
                                                                (serviceAcc, service) =>
                                                                    serviceAcc +
                                                                    service.subtotal,
                                                                0,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc +
                                                            item.serviceItems.reduce(
                                                                (serviceAcc, service) =>
                                                                    serviceAcc +
                                                                    service.discount,
                                                                0,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                ${formatNumberAsPrice(serviceTotal)}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow className="font-bold">
                                            <TableCell>Total contrato</TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc +
                                                            item.productSubtotal +
                                                            item.serviceItems.reduce(
                                                                (serviceAcc, service) =>
                                                                    serviceAcc +
                                                                    service.subtotal,
                                                                0,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {formatNumberAsPrice(
                                                    contract.contractItems.reduce(
                                                        (acc, item) =>
                                                            acc +
                                                            item.productDiscount +
                                                            item.serviceItems.reduce(
                                                                (serviceAcc, service) =>
                                                                    serviceAcc +
                                                                    service.discount,
                                                                0,
                                                            ),
                                                        0,
                                                    ),
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                ${formatNumberAsPrice(grandTotal)}
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                </Table>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="space-y-4 bg-white p-4">
                <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Productos</h3>

                    <BaseTable columns={productColumns} data={contract.contractItems} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm text-muted-foreground">Servicios</h3>

                    <BaseTable
                        columns={serviceColumns}
                        data={contract.contractItems.flatMap((item) => {
                            return item.serviceItems.map((serviceItem) => ({
                                ...serviceItem,
                                product: item.product,
                            }));
                        })}
                    />
                </div>
            </div>
        </>
    );
};
