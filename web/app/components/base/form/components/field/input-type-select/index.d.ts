import type { CustomSelectProps } from '../../../../select/custom';
import type { LabelProps } from '../../label';
import type { FileTypeSelectOption } from './types';
type InputTypeSelectFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    supportFile: boolean;
    className?: string;
} & Omit<CustomSelectProps<FileTypeSelectOption>, 'options' | 'value' | 'onChange' | 'CustomTrigger' | 'CustomOption'>;
declare const InputTypeSelectField: ({ label, labelOptions, supportFile, className, ...customSelectProps }: InputTypeSelectFieldProps) => any;
export default InputTypeSelectField;
