import type { TriggerWithProvider } from '@/app/components/workflow/block-selector/types';
export type AuthFlowStep = 'auth' | 'params' | 'complete';
export type AuthFlowState = {
    step: AuthFlowStep;
    builderId: string;
    isLoading: boolean;
    error: string | null;
};
export type AuthFlowActions = {
    startAuth: () => Promise<void>;
    verifyAuth: (credentials: Record<string, unknown>) => Promise<void>;
    completeConfig: (parameters: Record<string, unknown>, properties?: Record<string, unknown>, name?: string) => Promise<void>;
    reset: () => void;
};
export declare const useTriggerAuthFlow: (provider: TriggerWithProvider) => AuthFlowState & AuthFlowActions;
