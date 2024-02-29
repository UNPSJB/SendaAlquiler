import { useFormContext } from 'react-hook-form';

import { useAllClients } from '@/api/hooks';

import { ContractFormEditorValues } from './contract-form-editor';

import { ComboboxSimple } from '@/components/combobox';
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

export const ContractFormEditorBilling = () => {
    const formMethods = useFormContext<ContractFormEditorValues>();
    const clientsQuery = useAllClients();

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
                        <FormItem className="flex flex-col space-y-2">
                            <FormLabel required>Cliente</FormLabel>

                            <FormControl>
                                <ComboboxSimple
                                    placeholder="Selecciona un cliente"
                                    options={
                                        clientsQuery.data?.allClients.map((client) => ({
                                            value: client.id,
                                            label: `${client.firstName} ${client.lastName}`,
                                            data: client,
                                        })) || []
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

                <div className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                        <Label>Nombre</Label>
                        <Input
                            name="client.data.firstName"
                            value={client?.data?.firstName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <Label>Apellido</Label>
                        <Input
                            name="client.data.lastName"
                            value={client?.data?.lastName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        name="client.data.email"
                        value={client?.data?.email || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                        <Label>Código de área</Label>
                        <Input
                            name="client.data.phoneCode"
                            value={client?.data?.phoneCode || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <Label>Teléfono</Label>
                        <Input
                            name="client.data.phoneNumber"
                            value={client?.data?.phoneNumber || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>DNI</Label>
                    <Input
                        name="client.data.cuit"
                        value={client?.data?.dni || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Localidad</Label>
                    <Input
                        name="client.data.locality.name"
                        value={client?.data?.locality.name || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Input
                        name="client.data.locality.province.name"
                        value={client?.data?.locality.state || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Código Postal</Label>
                    <Input
                        name="client.data.locality.province.country.name"
                        value={client?.data?.locality.postalCode || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1 space-y-2">
                        <Label>Calle</Label>
                        <Input
                            name="client.data.streetName"
                            value={client?.data?.streetName || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>

                    <div className="flex-1 space-y-2">
                        <Label>Número</Label>
                        <Input
                            name="client.data.houseNumber"
                            value={client?.data?.houseNumber || ''}
                            disabled
                            className="bg-muted text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Unidad</Label>
                    <Input
                        name="client.data.houseUnit"
                        value={client?.data?.houseUnit || ''}
                        disabled
                        className="bg-muted text-muted-foreground"
                    />
                </div>

                <div className="space-y-2">
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
