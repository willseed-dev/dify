import type { VarInInspect } from '@/types/workflow';
type OutputToVarInInspectParams = {
    nodeId: string;
    name: string;
    value: any;
};
export declare const outputToVarInInspect: ({ nodeId, name, value, }: OutputToVarInInspectParams) => VarInInspect;
export {};
