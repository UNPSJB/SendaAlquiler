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
                    {({ allPurchases, allClients, allProducts }) => {
                        const purchasesByMonth = allPurchases.reduce(
                            (acc, purchase) => {
                                const dateDayjs = dayjs(purchase.createdOn);
                                const monthNameInSpanish =
                                    getMonthNameFromDayjs(dateDayjs);

                                if (acc[monthNameInSpanish]) {
                                    acc[monthNameInSpanish].push(purchase);
                                } else {
                                    acc[monthNameInSpanish] = [purchase];
                                }
                                return acc;
                            },
                            {} as Record<
                                string,
                                Array<DashboardQuery['allPurchases'][0]>
                            >,
                        );

                        const purchasesMonths = Object.keys(purchasesByMonth).sort(
                            (a, b) => new Date(a).getTime() - new Date(b).getTime(),
                        );

                        const purchasesTotals = allPurchases
                            .reduce((acc, purchase) => {
                                return acc + parseFloat(purchase.total);
                            }, 0)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                        return (
                            <>
                                <div className="mb-4 grid grid-cols-3 gap-4">
                                    <div className="rounded border border-gray-300 p-5">
                                        <div>
                                            <p className="mb-2 text-sm text-gray-500">
                                                Clientes
                                            </p>
                                            <p className="text-4xl font-bold">
                                                {allClients.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded border border-gray-300 p-5">
                                        <div>
                                            <p className="mb-2 text-sm text-gray-500">
                                                Ventas
                                            </p>
                                            <p className="text-4xl font-bold">
                                                {allPurchases.length}
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
                                            <p className="mb-2 text-sm text-gray-500">
                                                Total generado
                                            </p>
                                            <p className="mb-8 text-2xl font-bold">
                                                ${purchasesTotals} ARS
                                            </p>

                                            <Line
                                                options={options}
                                                data={{
                                                    labels: purchasesMonths,
                                                    datasets: [
                                                        {
                                                            label: 'Ventas',
                                                            data: purchasesMonths.map(
                                                                (date) => {
                                                                    return purchasesByMonth[
                                                                        date
                                                                    ].reduce(
                                                                        (
                                                                            acc,
                                                                            purchase,
                                                                        ) => {
                                                                            return (
                                                                                acc +
                                                                                parseFloat(
                                                                                    purchase.total,
                                                                                )
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
                                                        b.purchaseItems.reduce(
                                                            (acc, item) => {
                                                                return (
                                                                    acc + item.quantity
                                                                );
                                                            },
                                                            0,
                                                        ) -
                                                        a.purchaseItems.reduce(
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
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    {product.name}
                                                                </p>
                                                                <p className="text-4xl font-bold">
                                                                    {product.purchaseItems.reduce(
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
