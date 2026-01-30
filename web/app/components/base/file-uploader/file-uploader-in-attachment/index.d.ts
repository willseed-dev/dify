import type { FileEntity } from '../types';
import type { FileUpload } from '@/app/components/base/features/types';
export type FileUploaderInAttachmentWrapperProps = {
    value?: FileEntity[];
    onChange: (files: FileEntity[]) => void;
    fileConfig: FileUpload;
    isDisabled?: boolean;
};
declare const FileUploaderInAttachmentWrapper: ({ value, onChange, fileConfig, isDisabled, }: FileUploaderInAttachmentWrapperProps) => any;
export default FileUploaderInAttachmentWrapper;
