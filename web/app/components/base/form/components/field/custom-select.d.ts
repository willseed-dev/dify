import type { CustomSelectProps, Option } from '../../../select/custom';
import type { LabelProps } from '../label';
type CustomSelectFieldProps<T extends Option> = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    options: T[];
    className?: string;
} & Omit<CustomSelectProps<T>, 'options' | 'value' | 'onChange'>;
declare const CustomSelectField: <T extends Option>({ label, labelOptions, options, className, ...selectProps }: CustomSelectFieldProps<T>) => any;
export default CustomSelectField;
