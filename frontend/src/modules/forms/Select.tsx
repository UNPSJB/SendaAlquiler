import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

type Props<TFieldValues extends FieldValues> = {
    id: Path<TFieldValues>;
    rules: RegisterOptions;
    control: Control<TFieldValues>;
} & Omit<ReactSelectProps, 'onChange' | 'id'>;

export const CustomSelect = (props: any) => (
    <ReactSelect classNamePrefix="react-select" {...props} />
);

const RHFSelect = <TFieldValues extends FieldValues>({
    id,
    control,
    rules,
    ...rest
}: Props<TFieldValues>) => (
    <Controller<TFieldValues>
        control={control}
        name={id}
        rules={rules}
        render={({ field: { onChange, value } }) => (
            <CustomSelect id={id} value={value} onChange={onChange} {...rest} />
        )}
    />
);

export default RHFSelect;
