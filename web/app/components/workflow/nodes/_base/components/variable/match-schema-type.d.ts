export type AnyObj = Record<string, any> | null;
declare function matchTheSchemaType(scheme: AnyObj, target: AnyObj): boolean;
export default matchTheSchemaType;
