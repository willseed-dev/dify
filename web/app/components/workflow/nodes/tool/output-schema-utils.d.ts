import type { SchemaTypeDefinition } from '@/service/use-common';
import { VarType } from '@/app/components/workflow/types';
/**
 * Normalizes a JSON Schema type to a simple string type.
 * Handles complex schemas with oneOf, anyOf, allOf.
 */
export declare const normalizeJsonSchemaType: (schema: any) => string | undefined;
/**
 * Extracts the items schema from an array schema.
 */
export declare const pickItemSchema: (schema: any) => any;
/**
 * Resolves a JSON Schema to a VarType enum value.
 * Properly handles array types by inspecting item types.
 */
export declare const resolveVarType: (schema: any, schemaTypeDefinitions?: SchemaTypeDefinition[]) => {
    type: VarType;
    schemaType?: string;
};
