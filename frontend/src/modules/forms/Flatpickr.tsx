import 'flatpickr/dist/flatpickr.min.css';

import { Spanish } from 'flatpickr/dist/l10n/es';
import Flatpickr, { DateTimePickerProps } from 'react-flatpickr';
import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';

type FlatpickrProps = Omit<DateTimePickerProps, 'className' | 'options'>;

export const CustomFlatpickr: React.FC<FlatpickrProps> = (props) => {
    const enableTime = 'data-enable-time' in props;
    return (
        <Flatpickr
            {...props}
            className="block w-full rounded border border-gray-200 p-4"
            onChange={(date) => console.log(date)}
            options={{
                dateFormat: enableTime ? 'd/m/Y H:i' : 'd/m/Y',
                locale: Spanish,
            }}
        />
    );
};

type Props<TFieldValues extends FieldValues> = {
    id: Path<TFieldValues>;
    rules: RegisterOptions;
    control: Control<TFieldValues>;
} & Omit<FlatpickrProps, 'onChange' | 'id'>;

export const RHFCustomFlatpickr = <TFieldValues extends FieldValues>({
    id,
    control,
    rules,
    ...rest
}: Props<TFieldValues>) => {
    return (
        <Controller<TFieldValues>
            control={control}
            name={id}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <CustomFlatpickr value={value} onChange={onChange} {...rest} />
            )}
        />
    );
};
