'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { InternalOrderReportQuery, ProductTypeChoices } from '@/api/graphql';
import { useInfiniteProducts } from '@/api/hooks';
import { useInternalOrderReport } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { ReportSuppliersCostsChartLine } from './report-suppliers-costs-chart-line';
import { ReportSuppliersOrdersChartPie } from './report-suppliers-orders-chart-pie';
import { ReportSuppliersOrdersTable } from './report-suppliers-orders-table';

import {
    CalendarRangeField,
    CalendarRangePredefinedRange,
    CalendarRangePredefinedRangeKey,
    useCalendarRangeField,
} from '@/components/calendar-range-field';
import { ComboboxMultiInfinite } from '@/components/combobox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type FormValues = {
    calendarRange: CalendarRangePredefinedRange | undefined;
    frequency: 'daily' | 'monthly' | 'yearly';
    metric: 'numOrders' | 'numUnits';
    products: {
        value: string;
        label: string;
    }[];
};

type ChartsProps = {
    report: NonNullable<InternalOrderReportQuery['internalOrderReport']>;
    range: CalendarRangePredefinedRange;
    frequency: FormValues['frequency'];
};

type DashboardCardProps = {
    title: string;
    value: string;
    percentage: string;
};

const DashboardCard = ({ title, value, percentage }: DashboardCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{percentage}</p>
            </CardContent>
        </Card>
    );
};

const Charts = ({ report, range, frequency }: ChartsProps) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-4 rounded bg-white p-4">
                    <h2 className="text-lg font-medium">Unidades ordenadas</h2>

                    <ReportSuppliersCostsChartLine
                        report={report}
                        range={range}
                        frequency={frequency}
                    />
                </div>

                <div className="col-span-4 flex flex-col space-y-2">
                    <div className="space-y-4 bg-white p-4">
                        <h2 className="text-lg font-medium">Unidades ordenadas</h2>

                        <ReportSuppliersOrdersChartPie report={report} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Detalles</h2>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <DashboardCard
                        title="Duración promedio de procesamiento"
                        value={report.averageOrderProcessingTime.toString()}
                        percentage="días"
                    />

                    <DashboardCard
                        title="Tasa de cumplimiento de pedidos"
                        value={
                            report.orderFulfillmentRate?.fulfillmentRate
                                ? `${report.orderFulfillmentRate?.fulfillmentRate.toFixed(2)}%`
                                : 'N/A'
                        }
                        percentage="100% del total"
                    />
                </div>

                <ReportSuppliersOrdersTable report={report} />
            </div>
        </div>
    );
};

const ReportSuppliersOrders = () => {
    const { predefinedRanges, getPredefinedRangeByKey } = useCalendarRangeField();

    const [previousValidRange, setPreviousValidRange] =
        useState<CalendarRangePredefinedRange>(
            getPredefinedRangeByKey(CalendarRangePredefinedRangeKey.last7days),
        );

    const formMethods = useForm<FormValues>({
        defaultValues: {
            calendarRange: previousValidRange,
            frequency: 'daily',
            metric: 'numUnits',
            products: [],
        },
    });

    const { watch: formWatch } = formMethods;

    const watchedFrequency = formMethods.watch('frequency');

    const reportQuery = useInternalOrderReport({
        startDate: previousValidRange.range.from,
        endDate: previousValidRange.range.to,
        frequency: watchedFrequency,
        productIds:
            formMethods.watch('products').length > 0
                ? formMethods.watch('products').map((product) => product.value)
                : null,
        officeIds: null,
    });

    const [productNameQuery, setProductNameQuery] = useState<string>('');
    const productsQuery = useInfiniteProducts({
        officeId: null,
        page: 1,
        query: productNameQuery,
        type: ProductTypeChoices.Comerciable,
    });

    useEffect(() => {
        const subscription = formWatch((values, props) => {
            const { calendarRange } = values;
            if (
                props.name?.startsWith('calendarRange') &&
                calendarRange &&
                calendarRange.range?.from &&
                calendarRange.range.to
            ) {
                setPreviousValidRange(calendarRange as CalendarRangePredefinedRange);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [formWatch, setPreviousValidRange]);

    if (
        reportQuery.error ||
        (!reportQuery.data?.internalOrderReport && !reportQuery.isFetching)
    ) {
        return <p>Error</p>;
    }

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Pedidos internos</DashboardLayoutBigTitle>
                </div>
            }
        >
            <div className="pr-container flex-1 bg-muted py-8 pl-8">
                <div className="mb-8 flex items-center space-x-8 rounded-lg bg-card p-4 text-card-foreground shadow-sm">
                    <Form {...formMethods}>
                        <div className="space-y-2">
                            <Label className="font-headings font-medium">
                                Rango de fechas
                            </Label>

                            <div className="flex items-center space-x-2">
                                <span className="rounded-xl bg-gray-100 px-2 py-1 text-xs">
                                    {previousValidRange?.label || 'Personalizado'}
                                </span>

                                <FormField
                                    name="calendarRange"
                                    control={formMethods.control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <CalendarRangeField
                                                selected={field.value}
                                                onChange={field.onChange}
                                                predefinedRanges={predefinedRanges}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="font-headings font-medium">
                                Frecuencia
                            </Label>

                            <FormField
                                name="frequency"
                                control={formMethods.control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="w-[200px]">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Frecuencia" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="daily">
                                                    Diario
                                                </SelectItem>
                                                <SelectItem value="monthly">
                                                    Mensual
                                                </SelectItem>
                                                <SelectItem value="yearly">
                                                    Anual
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-headings font-medium">Métrica</Label>

                            <FormField
                                name="metric"
                                control={formMethods.control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="w-[200px]">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Métrica" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="numOrders">
                                                    Número de pedidos
                                                </SelectItem>
                                                <SelectItem value="numUnits">
                                                    Unidades ordenadas
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-headings font-medium">Productos</Label>

                            <FormField
                                name="products"
                                control={formMethods.control}
                                rules={{ required: 'Este campo es requerido' }}
                                render={({ field }) => (
                                    <FormItem className="w-[200px]">
                                        <ComboboxMultiInfinite
                                            placeholder="Productos"
                                            options={
                                                productsQuery.data
                                                    ? productsQuery.data.pages.flatMap(
                                                          (page) =>
                                                              page.products.results.map(
                                                                  (product) => ({
                                                                      value: product.id,
                                                                      label: product.name,
                                                                  }),
                                                              ),
                                                      )
                                                    : []
                                            }
                                            value={field.value}
                                            onChange={field.onChange}
                                            fetchNextPage={productsQuery.fetchNextPage}
                                            hasNextPage={productsQuery.hasNextPage}
                                            isFetchingNextPage={
                                                productsQuery.isFetchingNextPage
                                            }
                                            queryValue={productNameQuery}
                                            setQueryValue={setProductNameQuery}
                                            isLoading={productsQuery.isFetching}
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                </div>

                {reportQuery.isFetching || !reportQuery.data ? (
                    <Skeleton className="h-96 w-full" />
                ) : (
                    <Charts
                        report={reportQuery.data.internalOrderReport}
                        frequency={watchedFrequency}
                        range={previousValidRange}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default ReportSuppliersOrders;
