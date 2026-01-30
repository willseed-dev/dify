import type { FC } from 'react';
import type { SchemaRoot } from '../../../types';
type JsonSchemaGeneratorProps = {
    onApply: (schema: SchemaRoot) => void;
    crossAxisOffset?: number;
};
declare const JsonSchemaGenerator: FC<JsonSchemaGeneratorProps>;
export default JsonSchemaGenerator;
