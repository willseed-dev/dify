import { FlowType } from '@/types/common';
export declare const flowPrefixMap: {
    [FlowType.appFlow]: string;
    [FlowType.ragPipeline]: string;
};
export declare const getFlowPrefix: (type?: FlowType) => string;
