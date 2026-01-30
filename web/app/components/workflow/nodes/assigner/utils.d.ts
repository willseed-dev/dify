import type { AssignerNodeType } from './types';
import type { I18nKeysByPrefix } from '@/types/i18n';
import { WriteMode } from './types';
export declare const checkNodeValid: (_payload: AssignerNodeType) => boolean;
export declare const formatOperationName: (type: string) => string;
export type OperationName = I18nKeysByPrefix<'workflow', 'nodes.assigner.operations.'>;
export type Item = {
    value: 'divider';
    name: 'divider';
} | {
    value: string | number;
    name: OperationName;
};
export declare function isOperationItem(item: Item): item is {
    value: string | number;
    name: OperationName;
};
export declare const getOperationItems: (assignedVarType?: string, writeModeTypes?: WriteMode[], writeModeTypesArr?: WriteMode[], writeModeTypesNum?: WriteMode[]) => Item[];
export declare const convertV1ToV2: (payload: any) => AssignerNodeType;
