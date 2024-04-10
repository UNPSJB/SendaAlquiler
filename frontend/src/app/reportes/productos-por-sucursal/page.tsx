'use client';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { formatDate, getDate, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DateRange, DayPickerRangeProps } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import { AdminReportMostSoldProductsQuery } from '@/api/graphql';
import { useReportMostSoldProducts } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { BaseTable } from '@/components/base-table';
import { PageLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    dateToInputValue,
    formatNumberAsPrice,
    formatNumberWithThousandsSeparator,
} from '@/lib/utils';

type Item = NonNullable<
    AdminReportMostSoldProductsQuery['reportMostSoldProducts']['general']
>['items'][0];
type ItemByOffice = NonNullable<
    AdminReportMostSoldProductsQuery['reportMostSoldProducts']['byOffice'][0]
>['items'][0];

const productColumnsHelper = createColumnHelper<Item>();
const productByOfficeColumnHelper = createColumnHelper<ItemByOffice>();

type OfficeTableProps = {
    data: AdminReportMostSoldProductsQuery['reportMostSoldProducts']['byOffice'][0];
};

const OfficeTable = ({ data }: OfficeTableProps) => {
    const productByOfficeColumn: ColumnDef<ItemByOffice, any>[] = [
        productByOfficeColumnHelper.accessor('product.name', {
            header: 'Descripción',
            cell: (cell) => {
                const value = cell.getValue();
                return (
                    <div>
                        <div>
                            <p className="mb-1">{value}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            SKU: {cell.row.original.product.sku}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                        </p>
                    </div>
                );
            },
            size: 300,
        }),
        productColumnsHelper.accessor('quantity', {
            header: () => {
                return (
                    <div className="flex">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Cantidad de ventas</p>
                            <p className="font-bold text-black">{data.totalQuantity}</p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            size: 200,
        }),
        productColumnsHelper.accessor('totalAmount', {
            header: () => {
                return (
                    <div className="flex py-2">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Total de ventas</p>
                            <p className="font-bold text-black">
                                ${formatNumberAsPrice(data.totalAmount)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            cell: (cell) => {
                const value = cell.getValue();
                return <span>${formatNumberAsPrice(value)}</span>;
            },
            size: 200,
        }),
    ];

    return <BaseTable columns={productByOfficeColumn} data={data.items} />;
};

type MainTableProps = {
    data: AdminReportMostSoldProductsQuery['reportMostSoldProducts']['general'];
};

const MainTable = ({ data }: MainTableProps) => {
    const productColumns: ColumnDef<Item, any>[] = [
        productColumnsHelper.accessor('product.name', {
            header: 'Descripción',
            cell: (cell) => {
                const value = cell.getValue();
                return (
                    <div>
                        <div>
                            <p className="mb-1">{value}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            SKU: {cell.row.original.product.sku}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Marca: {cell.row.original.product.brand?.name || 'Sin marca'}
                        </p>
                    </div>
                );
            },
            minSize: 400,
        }),
        productColumnsHelper.accessor('quantity', {
            header: () => {
                return (
                    <div className="flex py-2">
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Cantidad de ventas</p>
                            <p className="font-bold text-black">
                                {formatNumberWithThousandsSeparator(data.totalQuantity)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            size: 200,
        }),
        productColumnsHelper.accessor('totalAmount', {
            header: () => {
                return (
                    <div className="flex">
                        {' '}
                        <div className="flex flex-col items-end">
                            <p className="mb-2">Total de ventas</p>
                            <p className="font-bold text-black">
                                ${formatNumberAsPrice(data.totalAmount)}
                            </p>
                            <p className="font-bold">100% del total</p>
                        </div>
                    </div>
                );
            },
            cell: (cell) => {
                const value = cell.getValue();
                return <span>${formatNumberAsPrice(value)}</span>;
            },
            size: 200,
        }),
    ];

    return <BaseTable columns={productColumns} data={data.items} />;
};

type CalendarProps = Omit<DayPickerRangeProps, 'selected' | 'mode'> & {
    selected?: DateRange | null;
    onChange: (date: DateRange | undefined) => void;
    predefinedRanges: {
        label: string;
        range: DateRange;
    }[];
};

const CalendarRangeField = ({
    selected,
    onChange,
    predefinedRanges,
    ...rest
}: CalendarProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <button className="flex items-center space-x-4 text-sm">
                        {selected && selected.from && selected.to ? (
                            <span>
                                {getDate(selected.from)}{' '}
                                {formatDate(selected.from, 'LLL', {
                                    locale: es,
                                })}{' '}
                                del {getYear(selected.from)} - {getDate(selected.to)}{' '}
                                {formatDate(selected.to, 'LLL', {
                                    locale: es,
                                })}{' '}
                                {getYear(selected.to)}
                            </span>
                        ) : (
                            <span>Selecciona una fecha</span>
                        )}

                        <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1 1.5L6 6.5L11 1.5"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                    <div className="border-r">
                        <p className="px-4 py-2">
                            <span className="text-sm font-bold">Rangos predefinidos</span>
                        </p>

                        <div className="flex flex-col">
                            {predefinedRanges.map((range, index) => (
                                <Button
                                    key={index}
                                    className="justify-start rounded-none"
                                    variant={
                                        selected?.from === range.range.from &&
                                        selected?.to === range.range.to
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    onClick={() => {
                                        onChange(range.range);
                                    }}
                                >
                                    {range.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Calendar
                        mode="range"
                        {...rest}
                        onSelect={(range) => {
                            onChange(range);
                        }}
                        selected={selected ?? undefined}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};

type FormValues = {
    date?: DateRange;
};

const Products = () => {
    const [predefinedRanges] = useState(() => [
        {
            label: 'Los ultimos 7 dias',
            range: {
                from: dayjs().subtract(7, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 28 dias',
            range: {
                from: dayjs().subtract(28, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 90 dias',
            range: {
                from: dayjs().subtract(90, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 180 dias',
            range: {
                from: dayjs().subtract(180, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Todos los tiempos',
            range: {
                from: dayjs().set('year', 2020).set('month', 0).set('date', 1).toDate(),
                to: dayjs().toDate(),
            },
        },
    ]);

    const formMethods = useForm<FormValues>({
        defaultValues: {
            date: predefinedRanges[1].range,
        },
    });
    const watchedDate = formMethods.watch('date');
    const result = useReportMostSoldProducts(
        watchedDate && watchedDate.from && watchedDate.to
            ? {
                  startDate: dateToInputValue(watchedDate.from),
                  endDate: dateToInputValue(watchedDate.to),
              }
            : {
                  startDate: dateToInputValue(predefinedRanges[1].range.from),
                  endDate: dateToInputValue(predefinedRanges[1].range.to),
              },
    );

    if (result.isFetching) {
        return <PageLoading />;
    }
    if (result.error || !result.data) {
        return <p>Error</p>;
    }

    const selectedPredefinedRange = predefinedRanges.find(
        (range) =>
            dayjs(range.range.from).isSame(
                dayjs(formMethods.watch('date')?.from),
                'day',
            ) &&
            dayjs(range.range.to).isSame(dayjs(formMethods.watch('date')?.to), 'day'),
    );

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
            <div className="pr-container bg-muted py-8 pl-8">
                <div className="mb-8 flex space-x-8 rounded-lg bg-card p-4 text-card-foreground shadow-sm">
                    <span className="rounded-xl bg-gray-100 px-2 py-1 text-xs">
                        {selectedPredefinedRange?.label || 'Personalizado'}
                    </span>

                    <Form {...formMethods}>
                        <FormField
                            name="date"
                            rules={{ required: 'Este campo es requerido' }}
                            render={({ field }) => (
                                <CalendarRangeField
                                    selected={field.value}
                                    onChange={(date) => {
                                        formMethods.setValue('date', date);
                                    }}
                                    predefinedRanges={predefinedRanges}
                                />
                            )}
                        />
                    </Form>
                </div>

                <div className="mb-4 flex justify-between">
                    <span className="text-xl font-bold">Vista general</span>
                </div>

                <div className="space-y-2">
                    <div className="rounded-md bg-white">
                        <MainTable data={result.data.reportMostSoldProducts.general} />
                    </div>
                </div>

                <div className="my-4 text-xl font-bold">Por sucursal</div>

                <div className="mb-4 grid grid-cols-2 gap-8">
                    {result.data.reportMostSoldProducts.byOffice.map((report) => (
                        <div className="space-y-2" key={report.office.id}>
                            <div className="flex justify-between">
                                <p className="text-sm font-bold">{report.office.name}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="rounded-md bg-white">
                                    <OfficeTable data={report} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Products;
