import type { FileEntity } from './types';
type Shape = {
    files: FileEntity[];
    setFiles: (files: FileEntity[]) => void;
};
export declare const createFileStore: (value?: FileEntity[], onChange?: (files: FileEntity[]) => void) => any;
export declare const FileContext: any;
export declare function useFileStoreWithSelector<T>(selector: (state: Shape) => T): T;
export declare const useFileStore: () => any;
type FileProviderProps = {
    children: React.ReactNode;
    value?: FileEntity[];
    onChange?: (files: FileEntity[]) => void;
};
export declare const FileContextProvider: ({ children, value, onChange, }: FileProviderProps) => any;
export {};
