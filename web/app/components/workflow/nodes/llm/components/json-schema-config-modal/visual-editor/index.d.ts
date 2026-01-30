import type { FC } from 'react';
import type { SchemaRoot } from '../../../types';
export type VisualEditorProps = {
    className?: string;
    schema: SchemaRoot;
    rootName?: string;
    readOnly?: boolean;
    onChange?: (schema: SchemaRoot) => void;
};
declare const VisualEditor: FC<VisualEditorProps>;
export default VisualEditor;
