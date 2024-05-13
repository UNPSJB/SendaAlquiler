import { formatDate, getMonth, getYear } from 'date-fns';
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

import { ReportSalesQuery } from '@/api/graphql';

import { REPORT_SALES_COLORS } from './report-sales-constants';

import { CalendarRangePredefinedRange } from '@/components/calendar-range-field';
import { formatNumberWithThousandsSeparator, formatNumberAsPrice } from '@/lib/utils';

type Props = {
    report: NonNullable<ReportSalesQuery['salesReport']>;
    range: CalendarRangePredefinedRange;
    frequency: 'daily' | 'monthly' | 'yearly';
    metricKey: 'totalSoldUnits' | 'totalSoldAmount';
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

const getDataByOffice = (
    report: NonNullable<ReportSalesQuery['salesReport']>,
    date: Date,
    frequency: string,
    metricKey: 'totalSoldUnits' | 'totalSoldAmount',
) => {
    return report.officeData.map((item) => {
        const frequencyData = item.frequencyData;
        const itemSameDate = frequencyData.find((data) => {
            switch (frequency) {
                case 'daily':
                    return dayjs(data.date).isSame(date, 'day');
                case 'monthly':
                    return data.month === getMonth(date) && data.year === getYear(date);
                case 'yearly':
                    return data.year === getYear(date);
                default:
                    return false;
            }
        });

        return {
            officeId: item.officeId,
            officeName: item.officeName,
            totalSoldUnits: itemSameDate?.totalSoldUnits || 0,
            totalSoldAmount: itemSameDate?.totalSoldAmount || 0,
            [metricKey]: itemSameDate?.[metricKey] || 0,
        };
    });
};

export const ReportSalesChartLine = ({ range, frequency, report, metricKey }: Props) => {
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
                        ? 'day'
                        : frequency === 'monthly'
                          ? 'month'
                          : 'year',
                )
                .toDate();

            const dataByOffice = getDataByOffice(report, date, frequency, metricKey);

            if (
                dataByOffice.filter((item) => (item[metricKey] as number) > 0).length >
                    0 ||
                i === 0 ||
                i === diff - 1
            ) {
                chartDataByFrequency.push({
                    frequency: formatDate(date, frequencyFormat, { locale: es }),
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
