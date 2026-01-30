import type { WebhookTriggerNodeType } from './types';
declare const useConfig: (id: string, payload: WebhookTriggerNodeType) => {
    readOnly: any;
    inputs: any;
    setInputs: any;
    handleMethodChange: any;
    handleContentTypeChange: any;
    handleHeadersChange: any;
    handleParamsChange: any;
    handleBodyChange: any;
    handleAsyncModeChange: any;
    handleStatusCodeChange: any;
    handleStatusCodeBlur: any;
    handleResponseBodyChange: any;
    generateWebhookUrl: any;
};
export default useConfig;
