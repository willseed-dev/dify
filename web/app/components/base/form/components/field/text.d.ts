import type { InputProps } from '../../../input';
import type { LabelProps } from '../label';
type TextFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
} & Omit<InputProps, 'className' | 'onChange' | 'onBlur' | 'value' | 'id'>;
declare const TextField: ({ label, labelOptions, className, ...inputProps }: TextFieldProps) => any;
export default TextField;
