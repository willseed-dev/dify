import type { LabelProps } from '../label';
type OptionsFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
};
declare const OptionsField: ({ label, className, labelOptions, }: OptionsFieldProps) => any;
export default OptionsField;
