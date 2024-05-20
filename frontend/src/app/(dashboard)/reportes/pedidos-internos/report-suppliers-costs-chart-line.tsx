import { formatDate } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs, { Dayjs } from 'dayjs';
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

import { InternalOrderReportQuery } from '@/api/graphql';

import { REPORT_SALES_COLORS } from './report-sales-constants';

import { CalendarRangePredefinedRange } from '@/components/calendar-range-field';
import { formatNumberWithThousandsSeparator } from '@/lib/utils';

type Props = {
    report: NonNullable<InternalOrderReportQuery['internalOrderReport']>;
    range: CalendarRangePredefinedRange;
    frequency: 'daily' | 'monthly' | 'yearly';
};

const getFrequencyDiff = (frequency: string, fromDate: Dayjs, toDate: Dayjs) => {
    switch (frequency) {
        case 'daily':
            return toDate.diff(fromDate, 'days') + 1;
        case 'monthly':
            return toDate.diff(fromDate, 'months') + 1;
        case 'yearly':
            return toDate.diff(fromDate, 'years') + 1;
        default:
            return 0;
    }
};

const getFrequencyFormat = (frequency: string) => {
    switch (frequency) {
        case 'daily':
            return 'dd/MM/yyyy';
        case 'monthly':
            return 'LLL yyyy';
        case 'yearly':
            return 'yyyy';
        default:
            return '';
    }
};

const getDataByOffice = (report: Props['report'], date: Date, frequency: string) => {
    return report.orderCountTrendByOffice.map((item) => {
        const frequencyData = item.orderCountTrend;
        const itemSameDate = frequencyData.find((data) => {
            switch (frequency) {
                case 'daily':
                    return dayjs(data.date).isSame(date, 'day');
                case 'monthly':
                    return (
                        data.month === date.getMonth() && data.year === date.getFullYear()
                    );
                case 'yearly':
                    return data.year === date.getFullYear();
                default:
                    return false;
            }
        });

        return {
            officeId: item.officeId,
            officeName: item.officeName,
            value: itemSameDate?.count,
        };
    });
};

export const ReportSuppliersCostsChartLine = ({ range, frequency, report }: Props) => {
    const fromDate = range.range.from ? dayjs(range.range.from) : null;
    const toDate = range.range.to ? dayjs(range.range.to) : null;

    const chartDataByFrequency = [];
    if (fromDate && toDate) {
        const diff = getFrequencyDiff(frequency, fromDate, toDate);
        const frequencyFormat = getFrequencyFormat(frequency);

        for (let i = 0; i < diff; i++) {
            const date = fromDate
                .add(
                    i,
                    frequency === 'daily'
                        ? 'days'
                        : frequency === 'monthly'
                          ? 'months'
                          : 'years',
                )
                .toDate();
            const dataByOffice = getDataByOffice(report, date, frequency);

            if (
                dataByOffice.filter((item) => (item.value as number) > 0).length > 0 ||
                i === 0 ||
                i === diff - 1
            ) {
                chartDataByFrequency.push({
                    frequency: formatDate(date, frequencyFormat, { locale: es }),
                    ...Object.fromEntries(
                        dataByOffice.map((item) => [item.officeName, item.value]),
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
                    tickFormatter={(value) => {
                        return formatNumberWithThousandsSeparator(value);
                    }}
                />

                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />

                {report.orderCountTrendByOffice.map((item, index) => {
                    return (
                        <Line
                            key={item.officeId}
                            type="monotone"
                            dataKey={item.officeName}
                            stroke={
                                REPORT_SALES_COLORS[index % REPORT_SALES_COLORS.length]
                            }
                            connectNulls
                        />
                    );
                })}

                <Tooltip
                    formatter={(value: number) => {
                        return formatNumberWithThousandsSeparator(value);
                    }}
                />

                <Legend />
            </LineChart>
        </ResponsiveContainer>
    );
};
