import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useInfiniteClients } from '@/api/hooks';

import { SaleFormEditorValues } from './sale-form-editor';

import { ComboboxInfinite } from '@/components/combobox';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const SaleFormEditorBilling = () => {
    const formMethods = useFormContext<SaleFormEditorValues>();

    const [query, setQuery] = useState<string>('');
    const clientsQuery = useInfiniteClients({
        page: 1,
        localities: null,
        query: query,
    });

    const client = formMethods.watch('client');

    return (
        <section className="flex w-full pb-8">
            <h2 className="w-3/12 text-lg font-bold">Datos de Facturación</h2>

            <div className="w-9/12 space-y-4">
                <FormField
                    name="client"
                    rules={{ required: 'El cliente es requerido' }}
                    control={formMethods.control}
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel required>Cliente</FormLabel>

                            <FormControl>
                                <ComboboxInfinite
                                    placeholder="Selecciona un cliente"
                                    isLoading={clientsQuery.isPending}
                                    options={(clientsQuery.data
                                        ? clientsQuery.data.pages
                                              .map((page) => page.clients.results)
                                              .flat()
                                        : []
                                    ).map((client) => ({
                                        value: client.id,
                                        label: `${client.firstName} ${client.lastName}`,
                                        data: client,
                                    }))}
                                    queryValue={query}
                                    setQueryValue={setQuery}
                                    onChange={field.onChange}
                                    value={field.value || null}
                                    fetchNextPage={clientsQuery.fetchNextPage}
                                    hasNextPage={clientsQuery.hasNextPage}
                                    isFetchingNextPage={clientsQuery.isFetchingNextPage}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label>Nombre</Label>
                        <Input
                            name="client.data.firstName"
                            value={client?.data?.firstName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1">
                        <Label>Apellido</Label>
                        <Input
                            name="client.data.lastName"
                            value={client?.data?.lastName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div>
                    <Label>Email</Label>
                    <Input
                        name="client.data.email"
                        value={client?.data?.email || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label>Código de área</Label>
                        <Input
                            name="client.data.phoneCode"
                            value={client?.data?.phoneCode || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1">
                        <Label>Teléfono</Label>
                        <Input
                            name="client.data.phoneNumber"
                            value={client?.data?.phoneNumber || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div>
                    <Label>DNI</Label>
                    <Input
                        name="client.data.cuit"
                        value={client?.data?.dni || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div>
                    <Label>Localidad</Label>
                    <Input
                        name="client.data.locality.name"
                        value={client?.data?.locality.name || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div>
                    <Label>Provincia</Label>
                    <Input
                        name="client.data.locality.province.name"
                        value={client?.data?.locality.state || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div>
                    <Label>Código Postal</Label>
                    <Input
                        name="client.data.locality.province.country.name"
                        value={client?.data?.locality.postalCode || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label>Calle</Label>
                        <Input
                            name="client.data.streetName"
                            value={client?.data?.streetName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1">
                        <Label>Número</Label>
                        <Input
                            name="client.data.houseNumber"
                            value={client?.data?.houseNumber || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div>
                    <Label>Unidad</Label>
                    <Input
                        name="client.data.houseUnit"
                        value={client?.data?.houseUnit || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div>
                    <Label>Notas adicionales</Label>

                    <Textarea
                        name="client.data.note"
                        value={client?.data?.note || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>
            </div>
        </section>
    );
};
