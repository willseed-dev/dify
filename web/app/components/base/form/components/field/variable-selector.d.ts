import type { LabelProps } from '../label';
type VariableOrConstantInputFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
};
declare const VariableOrConstantInputField: ({ className, label, labelOptions, }: VariableOrConstantInputFieldProps) => any;
export default VariableOrConstantInputField;
