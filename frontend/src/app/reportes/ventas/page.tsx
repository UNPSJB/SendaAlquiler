'use client';

import { formatDate, getDate, getMonth, getYear } from 'date-fns';
import { es, fr } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DateRange, DayPickerRangeProps } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

import { useReportSales } from '@/api/hooks/reports';

import DashboardLayout, {
    DashboardLayoutBigTitle,
} from '@/modules/dashboard/DashboardLayout';

import { PageLoading } from '@/components/page-loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { dateToInputValue } from '@/lib/utils';

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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

const ReportSales = () => {
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

    const [frequency, setFrequency] = useState<'daily' | 'monthly'>('monthly');

    const result = useReportSales({
        startDate: dateToInputValue(watchedDate?.from as Date),
        endDate: dateToInputValue(watchedDate?.to as Date),
        frequency: frequency,
        officeIds: null,
        productIds: null,
    });

    if (result.isFetching) {
        return <PageLoading />;
    }
    if (result.error || !result.data?.report?.officeData) {
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

    const fromDate = watchedDate?.from;
    const toDate = watchedDate?.to;

    const chartDataByFrequency = [];
    if (fromDate && toDate) {
        if (frequency === 'daily') {
            const days = dayjs(toDate).diff(fromDate, 'days') + 1;

            for (let i = 0; i < days; i++) {
                const date = dayjs(fromDate).add(i, 'days').toDate();
                const dataByOffice = result.data.report.officeData.map((item) => {
                    const frequencyData = item.frequencyData;
                    const itemSameDate = frequencyData.find((data) => {
                        return dayjs(data.date).isSame(date, 'day');
                    });

                    const data = {
                        officeId: item.officeId,
                        officeName: item.officeName,
                        totalSoldUnits: itemSameDate?.totalSoldUnits || 0,
                        totalSoldAmount: itemSameDate?.totalSoldAmount || 0,
                    };

                    return data;
                });

                chartDataByFrequency.push({
                    frequency: formatDate(date, 'd MMM', {
                        locale: es,
                    }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [
                            item.officeName,
                            item.totalSoldUnits,
                        ]),
                    ),
                });
            }
        } else if (frequency === 'monthly') {
            const months = dayjs(toDate).diff(fromDate, 'months') + 1;

            for (let i = 0; i < months; i++) {
                const date = dayjs(fromDate).add(i, 'months').toDate();
                const dataByOffice = result.data.report.officeData.map((item) => {
                    const frequencyData = item.frequencyData;
                    const itemSameDate = frequencyData.find((data) => {
                        return data.month === getMonth(date);
                    });

                    const data = {
                        officeId: item.officeId,
                        officeName: item.officeName,
                        totalSoldUnits: itemSameDate?.totalSoldUnits || 0,
                        totalSoldAmount: itemSameDate?.totalSoldAmount || 0,
                    };

                    return data;
                });

                chartDataByFrequency.push({
                    frequency: formatDate(date, 'LLL', {
                        locale: es,
                    }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [
                            item.officeName,
                            item.totalSoldUnits,
                        ]),
                    ),
                });
            }
        }
    }

    return (
        <DashboardLayout
            header={
                <div className="flex items-center justify-between">
                    <DashboardLayoutBigTitle>Reporte de ventas</DashboardLayoutBigTitle>
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

                <div className="mb-4">
                    <div className="rounded bg-white">
                        <LineChart width={500} height={500} data={chartDataByFrequency}>
                            <XAxis dataKey="frequency" />
                            <YAxis />

                            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

                            {result.data.report.officeData.map((item, index) => {
                                return (
                                    <Line
                                        key={item.officeId}
                                        type="monotone"
                                        dataKey={item.officeName}
                                        stroke={COLORS[index % COLORS.length]}
                                    />
                                );
                            })}

                            <Legend />
                        </LineChart>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="rounded-md bg-white"></div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportSales;
