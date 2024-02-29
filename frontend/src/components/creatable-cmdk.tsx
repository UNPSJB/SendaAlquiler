import { Command as CommandPrimitive } from 'cmdk';
import React, { useEffect, useState } from 'react';

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from './ui/command';

import { removeAccentsAndLowercase } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface CreatableCMDKProps {
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange: (option: Option | null) => void;
    onCreateOption: (inputValue: string) => void;
    options: Option[];
    value: Option | null;
    createOptionLabel?: (inputValue: string) => React.ReactNode;
}

const filterOptions = (options: Option[], inputValue: string) => {
    return options.filter((option) => {
        return removeAccentsAndLowercase(option.label).includes(
            removeAccentsAndLowercase(inputValue),
        );
    });
};

export const CreatableCMDK: React.FC<CreatableCMDKProps> = ({
    isDisabled = false,
    isLoading = false,
    onChange,
    onCreateOption,
    options,
    value,
    createOptionLabel = (inputValue) => `Create "${inputValue}"`, // Default label format
}) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [items, setItems] = useState<Option[]>(options);

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue);
    };

    const handleCreateOptionSelect = () => {
        onCreateOption(inputValue);
        setInputValue('');
    };

    const filteredOptions =
        inputValue === '' ? options : filterOptions(options, inputValue);
    const displayCreateOption = filteredOptions.length === 0 && inputValue !== '';

    useEffect(() => {
        setItems(options);
    }, [options]);

    return (
        <Command value={value?.value}>
            <CommandInput
                value={inputValue}
                onValueChange={handleInputChange}
                disabled={isDisabled || isLoading}
            />

            <CommandList>
                {isLoading ? (
                    <CommandPrimitive.Loading>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                            Fetching data…
                        </div>
                    </CommandPrimitive.Loading>
                ) : (
                    <>
                        {items.map((item, index) => (
                            <CommandItem key={index} onSelect={() => onChange(item)}>
                                {item.label}
                            </CommandItem>
                        ))}

                        {displayCreateOption && (
                            <CommandItem onSelect={handleCreateOptionSelect}>
                                {createOptionLabel(inputValue)}
                            </CommandItem>
                        )}

                        <CommandEmpty>No results found.</CommandEmpty>
                    </>
                )}
            </CommandList>
        </Command>
    );
};
