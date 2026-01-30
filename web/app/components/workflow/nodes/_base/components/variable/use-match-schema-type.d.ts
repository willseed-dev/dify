import type { AnyObj } from './match-schema-type';
import type { SchemaTypeDefinition } from '@/service/use-common';
export declare const getMatchedSchemaType: (obj: AnyObj, schemaTypeDefinitions?: SchemaTypeDefinition[]) => string;
declare const useMatchSchemaType: () => {
    isLoading: any;
    schemaTypeDefinitions: any;
};
export default useMatchSchemaType;
