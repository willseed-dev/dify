import type { CurrentPlanInfoBackend } from '../type';
export declare const parseCurrentPlan: (data: CurrentPlanInfoBackend) => {
    type: import("../type").BasicPlan;
    usage: {
        vectorSpace: number;
        buildApps: number;
        teamMembers: number;
        annotatedResponse: number;
        documentsUploadQuota: number;
        apiRateLimit: number;
        triggerEvents: number;
    };
    total: {
        vectorSpace: any;
        buildApps: any;
        teamMembers: any;
        annotatedResponse: any;
        documentsUploadQuota: any;
        apiRateLimit: any;
        triggerEvents: any;
    };
    reset: {
        apiRateLimit: any;
        triggerEvents: any;
    };
};
