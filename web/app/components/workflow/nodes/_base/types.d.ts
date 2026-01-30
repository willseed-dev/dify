import type { ValueSelector } from '@/app/components/workflow/types';
export declare enum VarKindType {
    variable = "variable",
    constant = "constant",
    mixed = "mixed"
}
export type ResourceVarInputs = Record<string, {
    type: VarKindType;
    value?: string | ValueSelector | any;
}>;
export type BaseResource = {
    name: string;
    [key: string]: any;
};
export type BaseResourceProvider = {
    plugin_id?: string;
    name: string;
    [key: string]: any;
};
