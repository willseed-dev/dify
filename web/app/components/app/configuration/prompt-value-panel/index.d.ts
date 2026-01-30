import type { Inputs } from '@/models/debug';
import type { VisionFile, VisionSettings } from '@/types/app';
import { AppModeEnum } from '@/types/app';
export type IPromptValuePanelProps = {
    appType: AppModeEnum;
    onSend?: () => void;
    inputs: Inputs;
    visionConfig: VisionSettings;
    onVisionFilesChange: (files: VisionFile[]) => void;
};
declare const _default: any;
export default _default;
