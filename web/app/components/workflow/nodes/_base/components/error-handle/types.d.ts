import type { VarType } from '@/app/components/workflow/types';
export declare enum ErrorHandleTypeEnum {
    none = "none",
    failBranch = "fail-branch",
    defaultValue = "default-value"
}
export type DefaultValueForm = {
    key: string;
    type: VarType;
    value?: any;
};
