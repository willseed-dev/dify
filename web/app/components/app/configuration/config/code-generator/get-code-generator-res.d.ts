import type { FC } from 'react';
import type { CodeLanguage } from '@/app/components/workflow/nodes/code/types';
import type { GenRes } from '@/service/debug';
import type { AppModeEnum } from '@/types/app';
export type IGetCodeGeneratorResProps = {
    flowId: string;
    nodeId: string;
    currentCode?: string;
    mode: AppModeEnum;
    isShow: boolean;
    codeLanguages: CodeLanguage;
    onClose: () => void;
    onFinished: (res: GenRes) => void;
};
export declare const GetCodeGeneratorResModal: FC<IGetCodeGeneratorResProps>;
declare const _default: any;
export default _default;
