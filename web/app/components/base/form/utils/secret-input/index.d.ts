import type { AnyFormApi } from '@tanstack/react-form';
import type { FormSchema } from '@/app/components/base/form/types';
export declare const transformFormSchemasSecretInput: (isPristineSecretInputNames: string[], values: Record<string, any>) => Record<string, any>;
export declare const getTransformedValuesWhenSecretInputPristine: (formSchemas: FormSchema[], form: AnyFormApi) => Record<string, any>;
