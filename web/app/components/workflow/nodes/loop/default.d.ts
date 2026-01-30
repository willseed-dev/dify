import type { NodeDefault } from '../../types';
import type { LoopNodeType } from './types';
declare const nodeDefault: NodeDefault<LoopNodeType>;
export declare const FILE_TYPE_OPTIONS: readonly [{
    readonly value: "image";
    readonly i18nKey: "image";
}, {
    readonly value: "document";
    readonly i18nKey: "doc";
}, {
    readonly value: "audio";
    readonly i18nKey: "audio";
}, {
    readonly value: "video";
    readonly i18nKey: "video";
}];
export declare const TRANSFER_METHOD: readonly [{
    readonly value: any;
    readonly i18nKey: "localUpload";
}, {
    readonly value: any;
    readonly i18nKey: "url";
}];
export declare const SUB_VARIABLES: string[];
export declare const OUTPUT_FILE_SUB_VARIABLES: string[];
export default nodeDefault;
