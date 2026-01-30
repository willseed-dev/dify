import type { FC } from 'react';
type SchemaEditorProps = {
    schema: string;
    onUpdate: (schema: string) => void;
    hideTopMenu?: boolean;
    className?: string;
    readonly?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    isTruncated?: boolean;
};
declare const SchemaEditor: FC<SchemaEditorProps>;
export default SchemaEditor;
