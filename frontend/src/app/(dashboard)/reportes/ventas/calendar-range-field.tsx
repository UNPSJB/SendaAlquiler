import { formatDate, getDate, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import dayjs from 'dayjs';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange, DayPickerRangeProps } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = Omit<DayPickerRangeProps, 'selected' | 'mode'> & {
    selected?: CalendarRangePredefinedRange | null;
    onChange: (date: CalendarRangePredefinedRange | undefined) => void;
    predefinedRanges: CalendarRangePredefinedRange[];
};

export enum CalendarRangePredefinedRangeKey {
    'last7days',
    'last28days',
    'last90days',
    'last180days',
    'allTime',
    'personalizado',
}

export type CalendarRangePredefinedRange = {
    label: string;
    key: CalendarRangePredefinedRangeKey;
    range: DateRange;
};

export type CalendarRangePersonalizedRange = {
    label: string;
    key: CalendarRangePredefinedRangeKey.personalizado;
    range: DateRange;
};

export const useCalendarRangeField = () => {
    const [predefinedRanges] = useState<CalendarRangePredefinedRange[]>(() => [
        {
            label: 'Los ultimos 7 dias',
            key: CalendarRangePredefinedRangeKey.last7days,
            range: {
                from: dayjs().subtract(7, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 28 dias',
            key: CalendarRangePredefinedRangeKey.last28days,
            range: {
                from: dayjs().subtract(28, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 90 dias',
            key: CalendarRangePredefinedRangeKey.last90days,
            range: {
                from: dayjs().subtract(90, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Los ultimos 180 dias',
            key: CalendarRangePredefinedRangeKey.last180days,
            range: {
                from: dayjs().subtract(180, 'days').toDate(),
                to: dayjs().toDate(),
            },
        },
        {
            label: 'Todos los tiempos',
            key: CalendarRangePredefinedRangeKey.allTime,
            range: {
                from: dayjs().set('year', 2023).set('month', 3).set('date', 20).toDate(),
                to: dayjs().toDate(),
            },
        },
    ]);

    const getPredefinedRangeByKey = (
        key: Omit<CalendarRangePredefinedRangeKey, 'personalizado'>,
    ) => {
        return predefinedRanges.find(
            (range) => range.key === key,
        ) as CalendarRangePredefinedRange;
    };

    return { predefinedRanges, getPredefinedRangeByKey };
};

export const CalendarRangeField = ({
    selected,
    onChange,
    predefinedRanges,
    ...rest
}: Props) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant="outline" className="flex space-x-2">
                        {selected && selected.range.from && selected.range.to ? (
                            <span>
                                {getDate(selected.range.from)}{' '}
                                {formatDate(selected.range.from, 'LLL', {
                                    locale: es,
                                })}{' '}
                                del {getYear(selected.range.from)} -{' '}
                                {getDate(selected.range.to)}{' '}
                                {formatDate(selected.range.to, 'LLL', {
                                    locale: es,
                                })}{' '}
                                {getYear(selected.range.to)}
                            </span>
                        ) : (
                            <span>Selecciona una fecha</span>
                        )}

                        <ChevronDownIcon className="size-4 opacity-50" />
                    </Button>
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
                                        selected?.range.from === range.range.from &&
                                        selected?.range.to === range.range.to
                                            ? 'secondary'
                                            : 'ghost'
                                    }
                                    onClick={() => {
                                        onChange(range);
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
                            if (!range?.from || !range?.to) {
                                onChange({
                                    label: 'Personalizado',
                                    key: CalendarRangePredefinedRangeKey.personalizado,
                                    range: {
                                        from: range?.from,
                                        to: range?.to,
                                    },
                                });
                            } else {
                                const selectedRange = predefinedRanges.find(
                                    (r) =>
                                        r.range.from === range.from &&
                                        r.range.to === range.to,
                                );

                                if (selectedRange) {
                                    onChange(selectedRange);
                                } else {
                                    onChange({
                                        label: 'Personalizado',
                                        key: CalendarRangePredefinedRangeKey.personalizado,
                                        range: {
                                            from: range.from,
                                            to: range.to,
                                        },
                                    });
                                }
                            }
                        }}
                        selected={selected?.range ?? undefined}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};
