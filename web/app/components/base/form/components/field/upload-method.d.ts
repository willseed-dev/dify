import type { LabelProps } from '../label';
type UploadMethodFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
};
declare const UploadMethodField: ({ label, labelOptions, className, }: UploadMethodFieldProps) => any;
export default UploadMethodField;
