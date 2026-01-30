import type { ZodSchema } from 'zod';
type SubmitValidator<T> = ({ value }: {
    value: T;
}) => {
    fields: Record<string, string>;
} | undefined;
export declare const zodSubmitValidator: <T>(schema: ZodSchema<T>) => SubmitValidator<T>;
export {};
