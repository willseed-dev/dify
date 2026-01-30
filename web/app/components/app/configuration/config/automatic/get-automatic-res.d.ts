import type { GenRes } from '@/service/debug';
import type { AppModeEnum } from '@/types/app';
export type IGetAutomaticResProps = {
    mode: AppModeEnum;
    isShow: boolean;
    onClose: () => void;
    onFinished: (res: GenRes) => void;
    flowId?: string;
    nodeId?: string;
    editorId?: string;
    currentPrompt?: string;
    isBasicMode?: boolean;
};
declare const _default: any;
export default _default;
