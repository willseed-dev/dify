import type { PromptConfig } from '@/models/debug';
import type { SiteInfo } from '@/models/share';
import type { VisionFile, VisionSettings } from '@/types/app';
import * as React from 'react';
export type IRunOnceProps = {
    siteInfo: SiteInfo;
    promptConfig: PromptConfig;
    inputs: Record<string, any>;
    inputsRef: React.RefObject<Record<string, any>>;
    onInputsChange: (inputs: Record<string, any>) => void;
    onSend: () => void;
    visionConfig: VisionSettings;
    onVisionFilesChange: (files: VisionFile[]) => void;
    runControl?: {
        onStop: () => Promise<void> | void;
        isStopping: boolean;
    } | null;
};
declare const _default: any;
export default _default;
