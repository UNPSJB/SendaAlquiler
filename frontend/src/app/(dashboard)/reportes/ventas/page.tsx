'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { ProductTypeChoices, ReportSalesQuery } from '@/api/graphql';
import { useInfiniteProducts } from '@/api/hooks';
import { useReportSales } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import {
    CalendarRangeField,
    CalendarRangePredefinedRange,
    CalendarRangePredefinedRangeKey,
    useCalendarRangeField,
} from './calendar-range-field';
import { ReportSalesChartLine } from './report-sales-chart-line';
import { ReportSalesChartPie } from './report-sales-chart-pie';
import { ReportSalesTableAmount } from './report-sales-table-amount';
import { ReportSalesTableUnity } from './report-sales-table-unity';

import { ComboboxMultiInfinite } from '@/components/combobox';
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
    metric: 'soldUnits' | 'soldAmount';
    products: {
        value: string;
        label: string;
    }[];
};

type ChartsProps = {
    report: NonNullable<ReportSalesQuery['salesReport']>;
    range: CalendarRangePredefinedRange;
    frequency: FormValues['frequency'];
    metric: FormValues['metric'];
};

const Charts = ({ report, range, frequency, metric }: ChartsProps) => {
    const metricKey: 'totalSoldUnits' | 'totalSoldAmount' =
        metric === 'soldUnits' ? 'totalSoldUnits' : 'totalSoldAmount';

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 rounded bg-white p-4">
                    <ReportSalesChartLine
                        report={report}
                        range={range}
                        frequency={frequency}
                        metricKey={metricKey}
                    />
                </div>

                <div className="col-span-4 flex flex-col space-y-4">
                    <div className="bg-white p-4">
                        <ReportSalesChartPie report={report} metricKey={metricKey} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Detalles</h2>

                    <p>
                        {metric === 'soldUnits'
                            ? `En esta tabla se muestran los top 10 productos más vendidos por unidades en el rango de fechas seleccionado.`
                            : `En esta tabla se muestran los top 10 productos más vendidos por monto en el rango de fechas seleccionado.`}
                    </p>
                </div>

                {metric === 'soldAmount' ? (
                    <ReportSalesTableAmount report={report} />
                ) : (
                    <ReportSalesTableUnity report={report} />
                )}
            </div>
        </div>
    );
};

const ReportSales = () => {
    const { predefinedRanges, getPredefinedRangeByKey } = useCalendarRangeField();

    const [previousValidRange, setPreviousValidRange] =
        useState<CalendarRangePredefinedRange>(
            getPredefinedRangeByKey(CalendarRangePredefinedRangeKey.last7days),
        );

    const formMethods = useForm<FormValues>({
        defaultValues: {
            calendarRange: previousValidRange,
            frequency: 'daily',
            metric: 'soldUnits',
            products: [],
        },
    });

    const { watch: formWatch } = formMethods;

    const watchedFrequency = formMethods.watch('frequency');

    const reportQuery = useReportSales({
        startDate: previousValidRange.range.from,
        endDate: previousValidRange.range.to,
        frequency: watchedFrequency,
        officeIds: null,
        productIds: formWatch('products').map((product) => product.value),
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
        (!reportQuery.data?.salesReport?.officeData && !reportQuery.isFetching)
    ) {
        return <p>Error</p>;
    }

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Reporte de ventas</DashboardLayoutBigTitle>
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
                                                <SelectItem value="soldUnits">
                                                    Unidades vendidas
                                                </SelectItem>
                                                <SelectItem value="soldAmount">
                                                    Monto vendido
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
                        report={reportQuery.data.salesReport}
                        frequency={watchedFrequency}
                        range={previousValidRange}
                        metric={formMethods.watch('metric')}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default ReportSales;
