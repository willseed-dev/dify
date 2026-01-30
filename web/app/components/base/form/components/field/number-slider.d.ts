import type { LabelProps } from '../label';
import type { InputNumberWithSliderProps } from '@/app/components/workflow/nodes/_base/components/input-number-with-slider';
type NumberSliderFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    description?: string;
    className?: string;
} & Omit<InputNumberWithSliderProps, 'value' | 'onChange'>;
declare const NumberSliderField: ({ label, labelOptions, description, className, ...InputNumberWithSliderProps }: NumberSliderFieldProps) => any;
export default NumberSliderField;
