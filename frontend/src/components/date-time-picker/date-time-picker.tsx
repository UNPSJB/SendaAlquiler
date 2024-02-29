import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { TimePicker } from './time-picker';

import { Button } from '@/components/ui/button';
import { Calendar, CalendarProps } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Props = {
    onChange: (date: Date | null) => void;
    value: Date | null;
} & Pick<CalendarProps, 'fromDate'>;

export function DateTimePicker({ onChange, value: date, ...props }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {date ? (
                        format(date, 'PPP HH:mm:ss', {
                            locale: es,
                        })
                    ) : (
                        <span>Selecciona una fecha</span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date || undefined}
                    onSelect={(date) => onChange(date || null)}
                    initialFocus
                    {...props}
                />
                <div className="border-t border-border p-3">
                    <TimePicker setDate={(date) => onChange(date || null)} date={date} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
