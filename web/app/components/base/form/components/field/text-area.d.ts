import type { TextareaProps } from '../../../textarea';
import type { LabelProps } from '../label';
type TextAreaFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
} & Omit<TextareaProps, 'className' | 'onChange' | 'onBlur' | 'value' | 'id'>;
declare const TextAreaField: ({ label, labelOptions, className, ...inputProps }: TextAreaFieldProps) => any;
export default TextAreaField;
