import 'flatpickr/dist/flatpickr.min.css';

import { Spanish } from 'flatpickr/dist/l10n/es';
import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';
import {
    Control,
    Controller,
    FieldPath,
    FieldValues,
    RegisterOptions,
} from 'react-hook-form';

type FlatpickrProps = Omit<DateTimePickerProps, 'className'>;

export const CustomFlatpickr: React.FC<FlatpickrProps> = ({ options, ...props }) => {
    const enableTime = 'data-enable-time' in props;
    return (
        <Flatpickr
            {...props}
            className="block w-full rounded border border-gray-200 p-4"
            onChange={props.onChange}
            options={{
                dateFormat: enableTime ? 'd/m/Y H:i' : 'd/m/Y',
                locale: Spanish,
                ...options,
            }}
        />
    );
};

type Props<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
    name: TName;
    control: Control<TFieldValues>;
    rules: RegisterOptions<TFieldValues, TName>;
} & Omit<FlatpickrProps, 'onChange' | 'id' | 'name'> &
    (TFieldValues[Extract<keyof TFieldValues, TName>] extends Date[] ? object : never);

export const RHFCustomFlatpickr = <
    TFieldValues extends FieldValues,
    TName extends FieldPath<TFieldValues>,
>(
    props: Props<TFieldValues, TName>,
) => {
    const { name, control, rules, ...rest } = props;

    return (
        <Controller<TFieldValues, TName>
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <CustomFlatpickr value={value} onChange={onChange} {...rest} />
            )}
        />
    );
};
