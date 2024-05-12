import { Legend, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import { ReportSalesQuery } from '@/api/graphql';

import { REPORT_SALES_COLORS } from './report-sales-constants';

import { formatNumberWithThousandsSeparator, formatNumberAsPrice } from '@/lib/utils';

type Props = {
    report: NonNullable<ReportSalesQuery['salesReport']>;
    metricKey: 'totalSoldUnits' | 'totalSoldAmount';
};

export const ReportSalesChartPie = ({ report, metricKey }: Props) => {
    const dataForPieChart = report.officeData.map((item) => {
        return {
            name: item.officeName,
            value: item[metricKey],
        };
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart
                margin={{
                    left: 16,
                    top: 16,
                    right: 16,
                    bottom: 16,
                }}
            >
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={dataForPieChart}
                    cx="50%"
                    cy="40%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ cx, cy, midAngle, outerRadius, fill, value }) => {
                        const RADIAN = Math.PI / 180;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);
                        const sx = cx + (outerRadius + 10) * cos;
                        const sy = cy + (outerRadius + 10) * sin;
                        const mx = cx + (outerRadius + 30) * cos;
                        const my = cy + (outerRadius + 30) * sin;
                        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                        const ey = my;
                        const textAnchor = cos >= 0 ? 'start' : 'end';

                        return (
                            <g>
                                <path
                                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                                    stroke={fill}
                                    fill="none"
                                />
                                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                                <text
                                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                                    y={ey}
                                    textAnchor={textAnchor}
                                    fill={fill}
                                    fontSize={12}
                                >
                                    {metricKey === 'totalSoldUnits'
                                        ? formatNumberWithThousandsSeparator(value)
                                        : `$${formatNumberAsPrice(value)}`}
                                </text>
                            </g>
                        );
                    }}
                >
                    {dataForPieChart.map((entry, index) => {
                        return (
                            <Cell
                                key={`cell-${entry.name}`}
                                fill={
                                    REPORT_SALES_COLORS[
                                        index % REPORT_SALES_COLORS.length
                                    ]
                                }
                            />
                        );
                    })}
                </Pie>

                <Tooltip
                    formatter={(value: number) => {
                        return metricKey === 'totalSoldUnits'
                            ? formatNumberWithThousandsSeparator(value)
                            : `$${formatNumberAsPrice(value)}`;
                    }}
                />

                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
