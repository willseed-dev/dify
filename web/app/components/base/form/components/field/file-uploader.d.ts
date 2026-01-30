import type { FileUploaderInAttachmentWrapperProps } from '../../../file-uploader/file-uploader-in-attachment';
import type { LabelProps } from '../label';
type FileUploaderFieldProps = {
    label: string;
    labelOptions?: Omit<LabelProps, 'htmlFor' | 'label'>;
    className?: string;
} & Omit<FileUploaderInAttachmentWrapperProps, 'value' | 'onChange'>;
declare const FileUploaderField: ({ label, labelOptions, className, ...inputProps }: FileUploaderFieldProps) => any;
export default FileUploaderField;
