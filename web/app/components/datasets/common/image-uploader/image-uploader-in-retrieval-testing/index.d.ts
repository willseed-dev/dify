import type { FileEntity } from '../types';
type ImageUploaderInRetrievalTestingProps = {
    textArea: React.ReactNode;
    actionButton: React.ReactNode;
    showUploader?: boolean;
    className?: string;
    actionAreaClassName?: string;
};
export type ImageUploaderInRetrievalTestingWrapperProps = {
    value?: FileEntity[];
    onChange: (files: FileEntity[]) => void;
} & ImageUploaderInRetrievalTestingProps;
declare const ImageUploaderInRetrievalTestingWrapper: ({ value, onChange, ...props }: ImageUploaderInRetrievalTestingWrapperProps) => any;
export default ImageUploaderInRetrievalTestingWrapper;
