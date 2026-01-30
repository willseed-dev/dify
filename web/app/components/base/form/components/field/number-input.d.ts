import type { InputNumberProps } from '../../../input-number';
import type { LabelProps } from '../label';
type TextFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
} & Omit<InputNumberProps, 'id' | 'value' | 'onChange' | 'onBlur'>;
declare const NumberInputField: ({ label, labelOptions, className, ...inputProps }: TextFieldProps) => any;
export default NumberInputField;
