import type { ReactNode } from 'react';
import type { Node } from 'reactflow';
import type { CredentialFormSchema, FormValue } from '../declarations';
import type { NodeOutPutVar } from '@/app/components/workflow/types';
import { FormTypeEnum } from '../declarations';
type FormProps<CustomFormSchema extends Omit<CredentialFormSchema, 'type'> & {
    type: string;
} = never> = {
    className?: string;
    itemClassName?: string;
    fieldLabelClassName?: string;
    value: FormValue;
    onChange: (val: FormValue) => void;
    formSchemas: Array<CredentialFormSchema | CustomFormSchema>;
    validating: boolean;
    validatedSuccess?: boolean;
    showOnVariableMap: Record<string, string[]>;
    isEditMode: boolean;
    isAgentStrategy?: boolean;
    readonly?: boolean;
    inputClassName?: string;
    isShowDefaultValue?: boolean;
    fieldMoreInfo?: (payload: CredentialFormSchema | CustomFormSchema) => ReactNode;
    customRenderField?: (formSchema: CustomFormSchema, props: Omit<FormProps<CustomFormSchema>, 'override' | 'customRenderField'>) => ReactNode;
    override?: [Array<FormTypeEnum>, (formSchema: CredentialFormSchema, props: Omit<FormProps<CustomFormSchema>, 'override' | 'customRenderField'>) => ReactNode];
    nodeId?: string;
    nodeOutputVars?: NodeOutPutVar[];
    availableNodes?: Node[];
    canChooseMCPTool?: boolean;
};
declare function Form<CustomFormSchema extends Omit<CredentialFormSchema, 'type'> & {
    type: string;
} = never>({ className, itemClassName, fieldLabelClassName, value, onChange, formSchemas, validating, validatedSuccess, showOnVariableMap, isEditMode, isAgentStrategy, readonly, inputClassName, isShowDefaultValue, fieldMoreInfo, customRenderField, override, nodeId, nodeOutputVars, availableNodes, canChooseMCPTool, }: FormProps<CustomFormSchema>): any;
export default Form;
