import type { FC } from 'react';
import type { SchemaRoot } from '../../types';
type JsonSchemaConfigProps = {
    defaultSchema?: SchemaRoot;
    onSave: (schema: SchemaRoot) => void;
    onClose: () => void;
};
declare const JsonSchemaConfigWrapper: FC<JsonSchemaConfigProps>;
export default JsonSchemaConfigWrapper;
