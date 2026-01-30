import type { DeepKeys } from '@tanstack/react-form';
import type { FormData } from './types';
import { PipelineInputVarType } from '@/models/pipeline';
export declare const useHiddenFieldNames: (type: PipelineInputVarType) => any;
export declare const useConfigurations: (props: {
    getFieldValue: (fieldName: DeepKeys<FormData>) => any;
    setFieldValue: (fieldName: DeepKeys<FormData>, value: any) => void;
    supportFile: boolean;
}) => any;
export declare const useHiddenConfigurations: (props: {
    options: string[] | undefined;
}) => any;
