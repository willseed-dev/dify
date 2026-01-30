import type { ModelConfig, VisionSetting } from '@/app/components/workflow/types';
type Payload = {
    enabled: boolean;
    configs?: VisionSetting;
};
type Params = {
    payload: Payload;
    onChange: (payload: Payload) => void;
};
declare const useConfigVision: (model: ModelConfig, { payload, onChange, }: Params) => {
    isVisionModel: any;
    handleVisionResolutionEnabledChange: any;
    handleVisionResolutionChange: any;
    handleModelChanged: any;
};
export default useConfigVision;
