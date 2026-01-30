import type { FileEntity } from '../types';
type ImageUploaderInChunkProps = {
    disabled?: boolean;
    className?: string;
};
export type ImageUploaderInChunkWrapperProps = {
    value?: FileEntity[];
    onChange: (files: FileEntity[]) => void;
} & ImageUploaderInChunkProps;
declare const ImageUploaderInChunkWrapper: ({ value, onChange, ...props }: ImageUploaderInChunkWrapperProps) => any;
export default ImageUploaderInChunkWrapper;
