import { formatDate, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import { ReportSalesQuery } from '@/api/graphql';

import { CalendarRangePredefinedRange } from './calendar-range-field';
import { REPORT_SALES_COLORS } from './report-sales-constants';

import { formatNumberWithThousandsSeparator, formatNumberAsPrice } from '@/lib/utils';

type Props = {
    report: NonNullable<ReportSalesQuery['report']>;
    range: CalendarRangePredefinedRange;
    frequency: 'daily' | 'monthly' | 'yearly';
    metricKey: 'totalSoldUnits' | 'totalSoldAmount';
};

export const ReportSalesChartLine = ({ range, frequency, report, metricKey }: Props) => {
    const fromDate = range.range.from;
    const toDate = range.range.to;

    const chartDataByFrequency = [];
    if (fromDate && toDate) {
        if (frequency === 'daily') {
            const days = dayjs(toDate).diff(fromDate, 'days') + 1;

            for (let i = 0; i < days; i++) {
                const date = dayjs(fromDate).add(i, 'days').toDate();
                const dataByOffice = report.officeData.map((item) => {
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
                    frequency: formatDate(date, 'dd/MM/yyyy', {
                        locale: es,
                    }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [item.officeName, item[metricKey]]),
                    ),
                });
            }
        } else if (frequency === 'monthly') {
            const months = dayjs(toDate).diff(fromDate, 'months') + 1;

            for (let i = 0; i < months; i++) {
                const date = dayjs(fromDate).add(i, 'months').toDate();
                const dataByOffice = report.officeData.map((item) => {
                    const frequencyData = item.frequencyData;
                    const itemSameDate = frequencyData.find((data) => {
                        return (
                            data.month === getMonth(date) && data.year === getYear(date)
                        );
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
                    frequency: formatDate(date, 'LLL yyyy', {
                        locale: es,
                    }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [item.officeName, item[metricKey]]),
                    ),
                });
            }
        } else if (frequency === 'yearly') {
            const years = dayjs(toDate).diff(fromDate, 'years') + 1;

            for (let i = 0; i < years; i++) {
                const date = dayjs(fromDate).add(i, 'years').toDate();
                const dataByOffice = report.officeData.map((item) => {
                    const frequencyData = item.frequencyData;
                    const itemSameDate = frequencyData.find((data) => {
                        return data.year === getYear(date);
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
                    frequency: formatDate(date, 'yyyy', {
                        locale: es,
                    }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [item.officeName, item[metricKey]]),
                    ),
                });
            }
        }
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartDataByFrequency}>
                <XAxis dataKey="frequency" />
                <YAxis
                    width={108}
                    tickFormatter={(value) => {
                        return metricKey === 'totalSoldUnits'
                            ? formatNumberWithThousandsSeparator(value)
                            : `$${formatNumberAsPrice(value)}`;
                    }}
                />

                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

                {report.officeData.map((item, index) => {
                    return (
                        <Line
                            key={item.officeId}
                            type="monotone"
                            dataKey={item.officeName}
                            stroke={
                                REPORT_SALES_COLORS[index % REPORT_SALES_COLORS.length]
                            }
                        />
                    );
                })}

                <Tooltip
                    formatter={(value: number) => {
                        return metricKey === 'totalSoldUnits'
                            ? formatNumberWithThousandsSeparator(value)
                            : `$${formatNumberAsPrice(value)}`;
                    }}
                />

                <Legend />
            </LineChart>
        </ResponsiveContainer>
    );
};
