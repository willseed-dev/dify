import type { FC } from 'react';
import type { SchemaRoot } from '../../types';
type JsonSchemaConfigModalProps = {
    isShow: boolean;
    defaultSchema?: SchemaRoot;
    onSave: (schema: SchemaRoot) => void;
    onClose: () => void;
};
declare const JsonSchemaConfigModal: FC<JsonSchemaConfigModalProps>;
export default JsonSchemaConfigModal;
