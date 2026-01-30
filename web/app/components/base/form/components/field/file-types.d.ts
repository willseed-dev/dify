import type { LabelProps } from '../label';
type FileTypesFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
};
declare const FileTypesField: ({ label, labelOptions, className, }: FileTypesFieldProps) => any;
export default FileTypesField;
