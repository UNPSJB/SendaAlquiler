import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

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
import { cn, removeAccentsAndLowercase } from '@/lib/utils';

type Props<TData extends string | number | Record<string, any>> = {
    options: Array<{ key: string; value: TData; label: string }>;
    placeholder?: string;
    noOptionsMessage?: string;
    onChange: (value: string) => void;
    value: string | null | undefined;
    disabled?: boolean;
};

export function Combobox<TData extends string | number | Record<string, any>>(
    props: Props<TData>,
) {
    const {
        value,
        onChange,
        options,
        placeholder = 'Selecciona una opción',
        noOptionsMessage = 'No se encontraron resultados',
        disabled,
    } = props;
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-[200px] justify-between text-left"
                    disabled={disabled}
                >
                    <span className="inline-block w-[90%] overflow-hidden text-ellipsis text-left">
                        {value
                            ? options.find((option) => option.key === value)?.label
                            : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
                <Command
                    filter={(value, search) => {
                        const item = options.find((option) => option.key === value);
                        if (item === undefined) return 0;

                        const matches = removeAccentsAndLowercase(item.label).includes(
                            removeAccentsAndLowercase(search || ''),
                        );

                        if (matches) {
                            return 1;
                        }

                        return 0;
                    }}
                >
                    <CommandInput placeholder={placeholder} />

                    <CommandList>
                        <CommandEmpty>{noOptionsMessage}</CommandEmpty>

                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.key}
                                    value={option.key}
                                    onSelect={() => {
                                        onChange(option.key === value ? '' : option.key);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.key
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />

                                    <span className="min-w-0 flex-1">{option.label}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface ComboboxOption {
    label: string;
    value: string;
}

interface ComboboxCreatableProps {
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange: (option: ComboboxOption | null) => void;
    onCreateOption: (inputValue: string) => void;
    options: ComboboxOption[];
    value: ComboboxOption | null;
    createOptionLabel?: (inputValue: string) => React.ReactNode;
    messageCreating?: string;
    placeholder?: string;
}

const filterOptions = <TData extends ComboboxOption>(
    options: TData[],
    inputValue: string,
) => {
    return options.filter((option) => {
        return removeAccentsAndLowercase(option.label).includes(
            removeAccentsAndLowercase(inputValue),
        );
    });
};

export const ComboboxCreatable: React.FC<ComboboxCreatableProps> = ({
    isDisabled = false,
    isLoading = false,
    onChange,
    onCreateOption,
    options,
    value,
    placeholder = 'Selecciona una opción',
    messageCreating = 'Creando opción...',
    createOptionLabel = (inputValue) => `Create "${inputValue}"`, // Default label format
}) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
    };

    const handleCreateOptionSelect = () => {
        setOpen(false);
        onCreateOption(inputValue);
        setInputValue('');
    };

    const filteredOptions =
        inputValue === '' ? options : filterOptions(options, inputValue);
    const displayCreateOption = filteredOptions.length === 0 && inputValue !== '';

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-[200px] justify-between text-left"
                    disabled={isDisabled || isLoading}
                >
                    <span className="inline-block w-[90%] overflow-hidden text-ellipsis text-left">
                        {value?.label || placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
                <Command value={value?.value || ''} shouldFilter={false}>
                    <CommandInput
                        value={inputValue}
                        onValueChange={handleInputChange}
                        disabled={isDisabled || isLoading}
                    />

                    <CommandList>
                        {isLoading ? (
                            <CommandPrimitive.Loading>
                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                    {messageCreating}
                                </div>
                            </CommandPrimitive.Loading>
                        ) : (
                            <>
                                {filteredOptions.map((item) => (
                                    <CommandItem
                                        key={item.label}
                                        onSelect={() => {
                                            onChange(item);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value?.value === item.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />

                                        <span className="min-w-0 flex-1">
                                            {item.label}
                                        </span>
                                    </CommandItem>
                                ))}

                                {displayCreateOption && (
                                    <CommandItem onSelect={handleCreateOptionSelect}>
                                        {createOptionLabel(inputValue)}
                                    </CommandItem>
                                )}

                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

interface ComboboxSimpleProps<TData extends ComboboxOption> {
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange: (option: TData | null) => void;
    options: TData[];
    value: TData | null;
    placeholder?: string;
}

export const ComboboxSimple = <TData extends ComboboxOption>({
    isDisabled = false,
    isLoading = false,
    onChange,
    options,
    value,
    placeholder = 'Selecciona una opción',
}: ComboboxSimpleProps<TData>) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
    };

    const filteredOptions = filterOptions(options, inputValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-[200px] justify-between text-left"
                    disabled={isDisabled || isLoading}
                >
                    <span className="inline-block w-[90%] overflow-hidden text-ellipsis text-left">
                        {value?.label || placeholder}
                    </span>

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-0">
                <Command value={value?.value || ''} shouldFilter={false}>
                    <CommandInput
                        value={inputValue}
                        onValueChange={handleInputChange}
                        disabled={isDisabled || isLoading}
                    />

                    <CommandList>
                        {isLoading ? (
                            <CommandPrimitive.Loading>
                                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                    Cargando...
                                </div>
                            </CommandPrimitive.Loading>
                        ) : (
                            <>
                                {filteredOptions.map((item) => (
                                    <CommandItem
                                        key={item.label}
                                        onSelect={() => {
                                            onChange(item);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value?.value === item.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />

                                        <span className="min-w-0 flex-1">
                                            {item.label}
                                        </span>
                                    </CommandItem>
                                ))}

                                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
