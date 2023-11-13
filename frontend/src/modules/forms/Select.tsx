import { Control, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import ReactSelect, {
    ActionMeta,
    GroupBase,
    OnChangeValue,
    OptionsOrGroups,
    PropsValue,
    Props as ReactSelectProps,
} from 'react-select';

type Props<
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
> = Omit<ReactSelectProps<Option, IsMulti, Group>, 'options' | 'value' | 'onChange'> & {
    options?: OptionsOrGroups<Option, Group>;
    value?: PropsValue<Option>;
    onChange?: (
        newValue: OnChangeValue<Option, IsMulti>,
        actionMeta: ActionMeta<Option>,
    ) => void;
};

export const CustomSelect = <
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({
    options,
    ...props
}: Props<Option, IsMulti, Group>) => (
    <ReactSelect<Option, IsMulti, Group>
        options={options}
        classNamePrefix="react-select"
        {...props}
    />
);

type RHFSelectProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
> = {
    rules: RegisterOptions;
    control: Control<TFieldValues>;
    name: TName;
} & Omit<ReactSelectProps<Option, IsMulti, Group>, 'onChange' | 'id'>;

const RHFSelect = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
    Option = unknown,
    IsMulti extends boolean = boolean,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: RHFSelectProps<TFieldValues, TName, Option, IsMulti, Group>,
) => {
    const { name, rules, control, ...rest } = props;

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value } }) => (
                <CustomSelect id={name} value={value} onChange={onChange} {...rest} />
            )}
        />
    );
};

export default RHFSelect;
