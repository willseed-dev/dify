import type { TriggerEventParameter } from '../../plugins/types';
import type { ToolCredential, ToolParameter } from '../types';
import { FormTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations';
export declare const toType: (type: string) => string;
export declare const triggerEventParametersToFormSchemas: (parameters: TriggerEventParameter[]) => {
    type: string;
    _type: string;
    tooltip: any;
    name: string;
    label: FormTypeEnum;
    auto_generate: any;
    template: any;
    scope: any;
    required: boolean;
    multiple: boolean;
    default: any;
    min: any;
    max: any;
    precision: any;
    options?: Array<{
        value: string;
        label: FormTypeEnum;
        icon?: string;
    }>;
    description?: FormTypeEnum;
}[];
export declare const toolParametersToFormSchemas: (parameters: ToolParameter[]) => {
    variable: string;
    type: string;
    _type: string;
    show_on: never[];
    options: {
        show_on: never[];
        label: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
        value: string;
    }[] | undefined;
    tooltip: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
    name: string;
    label: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
    human_description: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
    form: string;
    llm_description: string;
    required: boolean;
    multiple: boolean;
    default: string;
    min?: number;
    max?: number;
}[];
export declare const toolCredentialToFormSchemas: (parameters: ToolCredential[]) => {
    variable: string;
    type: string;
    label: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
    tooltip: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N | null;
    show_on: never[];
    options: {
        show_on: never[];
        label: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
        value: string;
    }[] | undefined;
    name: string;
    help: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N | null;
    placeholder: import("../../header/account-setting/model-provider-page/declarations").TypeWithI18N;
    required: boolean;
    default: string;
}[];
export declare const addDefaultValue: (value: Record<string, any>, formSchemas: {
    variable: string;
    type: string;
    default?: any;
}[]) => {
    [x: string]: any;
};
export declare const generateFormValue: (value: Record<string, any>, formSchemas: {
    variable: string;
    default?: any;
    type: string;
}[], isReasoning?: boolean) => any;
export declare const getPlainValue: (value: Record<string, any>) => {
    [x: string]: any;
};
export declare const getStructureValue: (value: Record<string, any>) => any;
export declare const getConfiguredValue: (value: Record<string, any>, formSchemas: {
    variable: string;
    type: string;
    default?: any;
}[]) => {
    [x: string]: any;
};
export declare const generateAgentToolValue: (value: Record<string, any>, formSchemas: {
    variable: string;
    default?: any;
    type: string;
}[], isReasoning?: boolean) => any;
