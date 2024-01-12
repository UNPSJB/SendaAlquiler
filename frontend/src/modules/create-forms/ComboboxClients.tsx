import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { AllClientsQuery } from '@/api/graphql';
import { useAllClients } from '@/api/hooks';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Client = NonNullable<AllClientsQuery['allClients']>[0];

const getClientLabel = (client: Client) => `${client.firstName} ${client.lastName}`;

export type ComboboxClientsProps = {
    value: Client | null;
    onChange: (client: Client | null) => void;
};

type ClientItemProps = {
    client: Client;
    selected: boolean;
    onSelect: () => void;
};

const ClientItem = ({ client, selected, onSelect }: ClientItemProps) => {
    return (
        <CommandItem value={client.id} onSelect={onSelect} className="flex flex-col">
            <div className="flex w-full">
                <div>
                    <div className="flex w-full flex-col">
                        <span>{getClientLabel(client)}</span>

                        <span className="text-sm text-muted-foreground">
                            {client.email}
                        </span>
                    </div>
                </div>

                {selected && <Check className="ml-auto h-4 w-4" />}
            </div>
        </CommandItem>
    );
};

export const ComboboxClients = ({ onChange, value }: ComboboxClientsProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    const allClients = useAllClients({
        query: query,
    });

    const clients = allClients.data?.allClients || [];

    console.log(clients);
    console.log(value);
    console.log(query);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value ? getClientLabel(value) : 'Selecciona un cliente'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
                <Command className="rounded-lg border shadow-md" shouldFilter={false}>
                    <CommandInput
                        placeholder="Escribe al menos 3 caracteres"
                        value={query}
                        onValueChange={setQuery}
                    />

                    <CommandList>
                        <CommandEmpty>No se encontraron clientes</CommandEmpty>

                        <CommandGroup>
                            {value && (
                                <ClientItem
                                    key={value.id}
                                    client={value}
                                    onSelect={() => {
                                        onChange(value.id === value?.id ? null : value);
                                        setOpen(false);
                                    }}
                                    selected
                                />
                            )}

                            {clients
                                .filter((client) => client.id !== value?.id)
                                .map((client) => (
                                    <ClientItem
                                        key={client.id}
                                        client={client}
                                        onSelect={() => {
                                            onChange(
                                                client.id === value?.id ? null : client,
                                            );
                                            setOpen(false);
                                        }}
                                        selected={false}
                                    />
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
