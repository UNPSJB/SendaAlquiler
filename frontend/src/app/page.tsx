'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton';

import fetchClient from '@/api/fetch-client';
import { DashboardDocument, DashboardQuery } from '@/api/graphql';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';
import { getMonthNameFromDayjs } from '@/modules/dayjs/utils';

import FetchedDataRenderer from '@/components/FetchedDataRenderer';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            grid: {
                drawTicks: true,
                display: true,
            },
        },
    },
};

const Home = () => {
    const result = useQuery([], () => {
        return fetchClient(DashboardDocument, {});
    });

    return (
        <DashboardLayout
            header={<DashboardLayoutBigTitle>Dashboard</DashboardLayoutBigTitle>}
        >
            <div className="container py-8">
                <FetchedDataRenderer
                    {...result}
                    Loading={
                        <div className="relative pb-[50%]">
                            <div className="absolute inset-0 h-full w-full">
                                <Skeleton
                                    height="100%"
                                    className="absolute inset-0 h-full"
                                />
                            </div>
                        </div>
                    }
                    Error={<div>Error</div>}
                >
                    {({ allSales, allClients, allProducts }) => {
                        const salesByMonth = allSales.reduce(
                            (acc, sale) => {
                                const dateDayjs = dayjs(sale.createdOn);
                                const monthNameInSpanish =
                                    getMonthNameFromDayjs(dateDayjs);

                                if (acc[monthNameInSpanish]) {
                                    acc[monthNameInSpanish].push(sale);
                                } else {
                                    acc[monthNameInSpanish] = [sale];
                                }
                                return acc;
                            },
                            {} as Record<string, Array<DashboardQuery['allSales'][0]>>,
                        );

                        const salesMonths = Object.keys(salesByMonth).sort(
                            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
                        );

                        const salesTotals = allSales
                            .reduce((acc, sale) => {
                                return acc + sale.total;
                            }, 0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                        return (
                            <>
                                <div className="mb-4 grid grid-cols-3 gap-4">
                                    <div className="rounded border border-gray-300 p-5">
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Clientes
                                            </p>
                                            <p className="text-4xl font-bold">
                                                {allClients.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded border border-gray-300 p-5">
                                        <div>
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Ventas
                                            </p>
                                            <p className="text-4xl font-bold">
                                                {allSales.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <div className="w-9/12 rounded border border-gray-300">
                                        <h2 className="border-b border-gray-200 p-5 text-xl font-bold">
                                            Ventas
                                        </h2>

                                        <div className="p-5">
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                Total generado
                                            </p>
                                            <p className="mb-8 text-2xl font-bold">
                                                ${salesTotals} ARS
                                            </p>

                                            <Line
                                                options={options}
                                                data={{
                                                    labels: salesMonths,
                                                    datasets: [
                                                        {
                                                            label: 'Ventas',
                                                            data: salesMonths.map(
                                                                (date) => {
                                                                    return salesByMonth[
                                                                        date
                                                                    ].reduce(
                                                                        (acc, sale) => {
                                                                            return (
                                                                                acc +
                                                                                sale.total
                                                                            );
                                                                        },
                                                                        0,
                                                                    );
                                                                },
                                                            ),
                                                            borderColor:
                                                                'rgb(255, 99, 132)',
                                                            backgroundColor:
                                                                'rgba(255, 99, 132, 0.5)',
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="border border-gray-300">
                                            <h2 className="border-b border-gray-200 p-5 text-xl font-bold">
                                                Productos más vendidos
                                            </h2>

                                            {allProducts
                                                .sort((a, b) => {
                                                    return (
                                                        b.saleItems.reduce(
                                                            (acc, item) => {
                                                                return (
                                                                    acc + item.quantity
                                                                );
                                                            },
                                                            0,
                                                        ) -
                                                        a.saleItems.reduce(
                                                            (acc, item) => {
                                                                return (
                                                                    acc + item.quantity
                                                                );
                                                            },
                                                            0,
                                                        )
                                                    );
                                                })
                                                .slice(0, 5)
                                                .map((product) => {
                                                    return (
                                                        <div
                                                            key={product.id}
                                                            className="rounded border-b border-gray-200 p-5"
                                                        >
                                                            <div>
                                                                <p className="mb-2 text-sm text-muted-foreground">
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-4xl font-bold">
                                                                    {product.saleItems.reduce(
                                                                        (acc, item) => {
                                                                            return (
                                                                                acc +
                                                                                item.quantity
                                                                            );
                                                                        },
                                                                        0,
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    }}
                </FetchedDataRenderer>
            </div>
        </DashboardLayout>
    );
};

export default Home;
