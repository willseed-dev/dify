import type { Option, PureSelectProps } from '../../../select/pure';
import type { LabelProps } from '../label';
type SelectFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    options: Option[];
    onChange?: (value: string) => void;
    className?: string;
} & Omit<PureSelectProps, 'options' | 'value' | 'onChange' | 'multiple'> & {
    multiple?: false;
};
declare const SelectField: ({ label, labelOptions, options, onChange, className, ...selectProps }: SelectFieldProps) => any;
export default SelectField;
