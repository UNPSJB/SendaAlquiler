import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import throttle from 'lodash/throttle';
import { useCallback, useMemo } from 'react';

const valueToArrayOrUndefined = (value: string) => {
    if (value) {
        return value.split(',').filter((x) => x.length > 0);
    }

    return undefined;
};

const valueToBooleanOrUndefined = (value: string) => {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    return undefined;
};

const valueToStringOrUndefined = (value: string) => {
    if (value) {
        return value;
    }

    return undefined;
};

type FilterParamType = 'multiple-string' | 'multiple-int' | 'string' | 'boolean' | 'int';

export type URLFiltersConfig<K extends string = string> = Record<
    K,
    { type: FilterParamType }
>;

type ParsedFilters<Config extends URLFiltersConfig> = {
    [Key in keyof Config]: Config[Key]['type'] extends 'multiple-string'
        ? string[] | undefined
        : Config[Key]['type'] extends 'multiple-int'
          ? number[] | undefined
          : Config[Key]['type'] extends 'boolean'
            ? boolean | undefined
            : Config[Key]['type'] extends 'string'
              ? string | undefined
              : Config[Key]['type'] extends 'int'
                ? number | undefined
                : never;
};

type StringKeys<Config extends URLFiltersConfig> = {
    [Key in keyof Config]: Config[Key]['type'] extends 'string' ? Key : never;
}[keyof Config];

export const useUrlFilters = <Config extends URLFiltersConfig>(config: Config) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const filters = useMemo(() => {
        const parsedFilters: Partial<ParsedFilters<Config>> = {};

        for (const key in config) {
            const type = config[key].type;
            const value = searchParams.get(key);

            if (!value) {
                continue;
            }

            switch (type) {
                case 'multiple-string':
                    parsedFilters[key] = valueToArrayOrUndefined(
                        value,
                    ) as ParsedFilters<Config>[typeof key];
                    break;
                case 'multiple-int':
                    parsedFilters[key] = valueToArrayOrUndefined(value)
                        ?.map((x) => parseInt(x, 10))
                        .filter((x) => !isNaN(x)) as ParsedFilters<Config>[typeof key];
                    break;
                case 'string':
                    parsedFilters[key] = valueToStringOrUndefined(
                        value,
                    ) as ParsedFilters<Config>[typeof key];
                    break;
                case 'boolean':
                    parsedFilters[key] = valueToBooleanOrUndefined(
                        value,
                    ) as ParsedFilters<Config>[typeof key];
                    break;
                case 'int':
                    parsedFilters[key] = parseInt(
                        value,
                        10,
                    ) as ParsedFilters<Config>[typeof key];
                    break;
                default:
                    break;
            }
        }

        return parsedFilters;
    }, [searchParams, config]);

    const setFilter = useCallback(
        <Key extends keyof Config>(key: Key, value: ParsedFilters<Config>[Key]) => {
            const type = config[key].type;

            let newValue: string | null = null;
            if (!!value) {
                if (
                    type === 'multiple-string' &&
                    Array.isArray(value) &&
                    value.length > 0
                ) {
                    newValue = value.join(',');
                }

                if (type === 'multiple-int' && Array.isArray(value) && value.length > 0) {
                    newValue = value.map((x) => x.toString()).join(',');
                }

                if (type === 'boolean' && typeof value === 'boolean') {
                    newValue = value.toString();
                }

                if (type === 'string') {
                    newValue = value as string;
                }

                if (type === 'int' && typeof value === 'number') {
                    newValue = value.toString();
                }

                if (newValue === '') {
                    newValue = null;
                }
            }

            const params = new URLSearchParams(searchParams);
            if (newValue !== null) {
                params.set(key as string, newValue);
            } else {
                params.delete(key as string);
            }

            replace(`${pathname}?${params.toString()}`);
        },
        [searchParams, replace, pathname, config],
    );

    // Throttled search for string inputs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setSearchThrottled = useCallback(
        throttle((key: StringKeys<Config>, query: string) => {
            if (typeof key !== 'string') {
                return;
            }

            setFilter(key as string, query as any);
        }, 500),
        [setFilter],
    );

    return { filters, setFilter, setSearchThrottled };
};
