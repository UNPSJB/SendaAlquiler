import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';

import { useAllLocalities } from '@/api/hooks';

import { ContractFormEditorValues } from './contract-form-editor';

import { ComboboxSimple } from '@/components/combobox';
import { DateTimePicker } from '@/components/date-time-picker/date-time-picker';
import { Button } from '@/components/ui/button';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const ContractFormEditorDetails = () => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const localitiesQuery = useAllLocalities();

    const watchedClient = formMethods.watch('client')?.data;
    const watchedStartDatetime = formMethods.watch('startDatetime');

    return (
        <section className="flex border-t border-gray-200 py-8">
            <div className="w-3/12 space-y-4">
                <h2 className="text-lg font-bold">Detalles</h2>

                <Button
                    variant="outline"
                    disabled={!watchedClient}
                    onClick={() => {
                        if (!watchedClient) return;

                        formMethods.setValue('locality', {
                            value: watchedClient.locality.id,
                            label: watchedClient.locality.name,
                        });
                        formMethods.setValue('streetName', watchedClient.streetName);
                        formMethods.setValue('houseNumber', watchedClient.houseNumber);
                        formMethods.setValue('houseUnit', watchedClient.houseUnit);
                    }}
                >
                    Copiar dirección de cliente
                </Button>
            </div>

            <div className="w-9/12 space-y-4">
                <FormField
                    name="locality"
                    control={formMethods.control}
                    rules={{ required: 'La localidad es requerida' }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel required>Localidad</FormLabel>

                            <FormControl>
                                <ComboboxSimple
                                    placeholder="Selecciona una localidad"
                                    options={
                                        localitiesQuery.data?.allLocalities.map(
                                            (locality) => ({
                                                value: locality.id,
                                                label: locality.name,
                                            }),
                                        ) || []
                                    }
                                    onChange={(option) => {
                                        field.onChange(option);
                                    }}
                                    value={field.value || null}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="streetName"
                    control={formMethods.control}
                    rules={{ required: 'La calle es requerida' }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel required>Calle</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="houseNumber"
                    control={formMethods.control}
                    rules={{ required: 'El número es requerido' }}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel required>Número</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="houseUnit"
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Unidad</FormLabel>

                            <FormControl>
                                <Input {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="note"
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel>Nota</FormLabel>

                            <FormControl>
                                <Textarea {...field} value={field.value || ''} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        name="startDatetime"
                        rules={{ required: 'El cliente es requerido' }}
                        control={formMethods.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel required>Fecha de inicio</FormLabel>

                                <FormControl>
                                    <DateTimePicker
                                        onChange={field.onChange}
                                        value={field.value || null}
                                        fromDate={dayjs().toDate()}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="endDatetime"
                        rules={{ required: 'El cliente es requerido' }}
                        control={formMethods.control}
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-2">
                                <FormLabel required>Fecha de fin</FormLabel>

                                <FormControl>
                                    <DateTimePicker
                                        onChange={field.onChange}
                                        value={field.value || null}
                                        fromDate={
                                            watchedStartDatetime
                                                ? dayjs(watchedStartDatetime)
                                                      .add(1, 'day')
                                                      .toDate()
                                                : dayjs().add(1, 'day').toDate()
                                        }
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </section>
    );
};
