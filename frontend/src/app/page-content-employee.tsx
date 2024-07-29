'use client';

import { useQuery } from '@tanstack/react-query';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import Skeleton from 'react-loading-skeleton';

import fetchClient from '@/api/fetch-client';
import {
    DashboardStatsDocument,
    DashboardStatsPeriod,
    DashboardStatsQuery,
} from '@/api/graphql';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { BaseTable } from '@/components/base-table';
import FetchedDataRenderer from '@/components/FetchedDataRenderer';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn, formatNumberAsPrice } from '@/lib/utils';

type GetStatComparisonOptions = {
    current: number;
    previous: number;
};

const getStatComparison = ({ current, previous }: GetStatComparisonOptions) => {
    const increase = current - previous;

    if (previous === 0) {
        return {
            increase,
            increasePercentage: 0,
        };
    }

    const increasePercentage = ((increase / previous) * 100).toFixed(1);
    return {
        increase,
        increasePercentage,
    };
};

type TopSellingRow = DashboardStatsQuery['dashboardStats']['topSellingProducts'][0];

const topSellingColumnHelper = createColumnHelper<TopSellingRow>();

const topSellingColumns: ColumnDef<TopSellingRow, any>[] = [
    topSellingColumnHelper.accessor('product.name', {
        header: 'Producto',
    }),
    topSellingColumnHelper.accessor('count', {
        id: 'sales-count',
        header: 'Unidades vendidas',
        cell: (props) => {
            const original = props.row.original;
            return original.count;
        },
    }),
    topSellingColumnHelper.accessor('sales', {
        id: 'sales-amount',
        header: 'Ventas ($)',
        cell: (props) => {
            const original = props.row.original;
            return `$${formatNumberAsPrice(original.sales)}`;
        },
    }),
];

const HomeEmployee = () => {
    const result = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => {
            return fetchClient(DashboardStatsDocument, {
                period: DashboardStatsPeriod.Months_1,
            });
        },
    });

    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Dashboard</DashboardLayoutBigTitle>}
        >
            <div className="container flex-1 bg-muted py-8">
                <FetchedDataRenderer
                    {...result}
                    Loading={
                        <div className="relative pb-[50%]">
                            <div className="absolute inset-0 size-full">
                                <Skeleton
                                    height="100%"
                                    className="absolute inset-0 h-full"
                                />
                            </div>
                        </div>
                    }
                    Error={<div>Error</div>}
                >
                    {({
                        dashboardStats: {
                            noClientsCurrentPeriod,
                            noClientsPreviousPeriod,
                            noContractsCurrentPeriod,
                            noContractsPreviousPeriod,
                            noSalesCurrentPeriod,
                            noSalesPreviousPeriod,
                            recentSales,
                            topSellingProducts,
                            upcomingContracts,
                        },
                    }) => {
                        const noClientsComparison = getStatComparison({
                            current: noClientsCurrentPeriod,
                            previous: noClientsPreviousPeriod,
                        });
                        const noSalesComparison = getStatComparison({
                            current: noSalesCurrentPeriod,
                            previous: noSalesPreviousPeriod,
                        });
                        const noContractsComparison = getStatComparison({
                            current: noContractsCurrentPeriod,
                            previous: noContractsPreviousPeriod,
                        });

                        return (
                            <div>
                                <div className="mb-4 grid grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Clientes
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="size-4 text-muted-foreground"
                                            >
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                +{noClientsCurrentPeriod}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {noClientsComparison.increase > 0
                                                    ? `+${noClientsComparison.increasePercentage}% respecto al mes pasado`
                                                    : `-${noClientsComparison.increasePercentage}% respecto al mes pasado`}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Ventas
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="size-4 text-muted-foreground"
                                            >
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3" />
                                                <polyline points="21 10 21 3 14 3" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                +{noSalesCurrentPeriod}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {noSalesComparison.increase > 0
                                                    ? `+${noSalesComparison.increasePercentage}% respecto al mes pasado`
                                                    : `-${noSalesComparison.increasePercentage}% respecto al mes pasado`}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Contratos
                                            </CardTitle>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                className="size-4 text-muted-foreground"
                                            >
                                                <path d="M21 12.79A9 9 0 1 1 11.21 3" />
                                                <polyline points="21 10 21 3 14 3" />
                                            </svg>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                +{noContractsCurrentPeriod}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {noContractsComparison.increase > 0
                                                    ? `+${noContractsComparison.increasePercentage}% respecto al mes pasado`
                                                    : `-${noContractsComparison.increasePercentage}% respecto al mes pasado`}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 grid grid-cols-3 gap-4">
                                        <div className="rounded-md border border-border bg-white">
                                            <h2 className="border-b border-border p-4 text-xl font-bold">
                                                Próximos contratos
                                            </h2>

                                            <div className="flex justify-center bg-muted p-4">
                                                <DayPicker
                                                    showOutsideDays={true}
                                                    className={cn('rounded bg-white p-3')}
                                                    classNames={{
                                                        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                                                        month: 'space-y-4',
                                                        caption:
                                                            'flex justify-center pt-1 relative items-center',
                                                        caption_label:
                                                            'text-sm font-medium',
                                                        nav: 'space-x-1 flex items-center',
                                                        nav_button: cn(
                                                            buttonVariants({
                                                                variant: 'outline',
                                                            }),
                                                            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                                                        ),
                                                        nav_button_previous:
                                                            'absolute left-1',
                                                        nav_button_next:
                                                            'absolute right-1',
                                                        table: 'w-full border-collapse space-y-1',
                                                        head_row: 'flex',
                                                        head_cell:
                                                            'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                                                        row: 'flex w-full mt-2',
                                                        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                                                        day: cn(
                                                            buttonVariants({
                                                                variant: 'ghost',
                                                            }),
                                                            'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                                                        ),
                                                        day_range_end: 'day-range-end',
                                                        day_selected:
                                                            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                                                        day_today:
                                                            'bg-accent text-accent-foreground',
                                                        day_outside:
                                                            'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                                                        day_disabled:
                                                            'text-muted-foreground opacity-50',
                                                        day_range_middle:
                                                            'aria-selected:bg-accent aria-selected:text-accent-foreground',
                                                        day_hidden: 'invisible',
                                                    }}
                                                    components={{
                                                        IconLeft: () => (
                                                            <ChevronLeft className="size-4" />
                                                        ),
                                                        IconRight: () => (
                                                            <ChevronRight className="size-4" />
                                                        ),
                                                        DayContent: (props) => {
                                                            const contractInDay =
                                                                upcomingContracts.find(
                                                                    (contract) => {
                                                                        return (
                                                                            dayjs(
                                                                                contract.contractStartDatetime,
                                                                            ).get(
                                                                                'date',
                                                                            ) ===
                                                                            props.date.getDate()
                                                                        );
                                                                    },
                                                                );

                                                            if (contractInDay) {
                                                                return (
                                                                    <HoverCard>
                                                                        <HoverCardTrigger
                                                                            className={cn(
                                                                                buttonVariants(
                                                                                    {
                                                                                        variant:
                                                                                            'ghost',
                                                                                    },
                                                                                ),
                                                                                'h-9 w-9 p-0 font-normal hover:bg-primary hover:text-white aria-selected:opacity-100',
                                                                            )}
                                                                        >
                                                                            {dayjs(
                                                                                props.date,
                                                                            ).get('date')}
                                                                        </HoverCardTrigger>

                                                                        <HoverCardContent>
                                                                            Contrato con
                                                                            id{' '}
                                                                            {
                                                                                contractInDay.id
                                                                            }
                                                                        </HoverCardContent>
                                                                    </HoverCard>
                                                                );
                                                            }

                                                            return (
                                                                <span
                                                                    className={cn(
                                                                        buttonVariants({
                                                                            variant:
                                                                                'ghost',
                                                                        }),
                                                                        'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
                                                                    )}
                                                                >
                                                                    {dayjs(
                                                                        props.date,
                                                                    ).get('date')}
                                                                </span>
                                                            );
                                                        },
                                                    }}
                                                    fromDate={new Date()}
                                                    selected={upcomingContracts.map(
                                                        (contract) => {
                                                            return new Date(
                                                                contract.contractStartDatetime,
                                                            );
                                                        },
                                                    )}
                                                />
                                            </div>
                                            {/* Show next 5 contracts */}
                                            {upcomingContracts
                                                .slice(0, 5)
                                                .map((contract) => {
                                                    return (
                                                        <div
                                                            key={contract.id}
                                                            className="border-b border-border p-4"
                                                        >
                                                            <p className="text-sm font-bold">
                                                                {
                                                                    contract.client
                                                                        .firstName
                                                                }{' '}
                                                                {contract.client.lastName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {contract.client.email}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    contract.contractStartDatetime
                                                                }
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                        </div>

                                        <div className="rounded-md border border-border bg-white">
                                            <h2 className="border-b border-border p-4 text-xl font-bold">
                                                Últimas ventas
                                            </h2>

                                            <div className="p-4">
                                                {recentSales.map((sale) => {
                                                    return (
                                                        <div
                                                            key={sale.id}
                                                            className="mb-4 flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-bold">
                                                                    {
                                                                        sale.client
                                                                            .firstName
                                                                    }{' '}
                                                                    {sale.client.lastName}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {sale.client.email}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold">
                                                                    $
                                                                    {formatNumberAsPrice(
                                                                        sale.total,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="rounded-md border border-border bg-white">
                                            <h2 className="border-b border-border p-4 text-xl font-bold">
                                                Productos más vendidos
                                            </h2>

                                            <div className="p-4">
                                                <BaseTable
                                                    columns={topSellingColumns}
                                                    data={topSellingProducts}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </FetchedDataRenderer>
            </div>
        </DashboardLayout>
    );
};

export default HomeEmployee;
