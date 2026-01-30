import { VarInInspectType } from '@/types/workflow';
export declare const useVarIcon: (variables: string[], variableCategory?: VarInInspectType | string) => any;
export declare const useVarColor: (variables: string[], isExceptionVariable?: boolean, variableCategory?: VarInInspectType | string) => any;
export declare const useVarName: (variables: string[], notShowFullPath?: boolean) => any;
export declare const useVarBgColorInEditor: (variables: string[], hasError?: boolean) => {
    hoverBorderColor: string;
    hoverBgColor: string;
    selectedBorderColor: string;
    selectedBgColor: string;
};
