import type { BasicPlan, PlanInfo } from '@/app/components/billing/type';
export declare const NUM_INFINITE = -1;
export declare const contractSales = "contractSales";
export declare const unAvailable = "unAvailable";
export declare const contactSalesUrl = "https://vikgc6bnu1s.typeform.com/dify-business";
export declare const getStartedWithCommunityUrl = "https://github.com/langgenius/dify";
export declare const getWithPremiumUrl = "https://aws.amazon.com/marketplace/pp/prodview-t22mebxzwjhu6";
export declare const ALL_PLANS: Record<BasicPlan, PlanInfo>;
export declare const defaultPlan: {
    type: BasicPlan;
    usage: {
        documents: number;
        vectorSpace: number;
        buildApps: number;
        teamMembers: number;
        annotatedResponse: number;
        documentsUploadQuota: number;
        apiRateLimit: number;
        triggerEvents: number;
    };
    total: {
        documents: number;
        vectorSpace: number;
        buildApps: number;
        teamMembers: number;
        annotatedResponse: number;
        documentsUploadQuota: number;
        apiRateLimit: any;
        triggerEvents: any;
    };
    reset: {
        apiRateLimit: null;
        triggerEvents: null;
    };
};
