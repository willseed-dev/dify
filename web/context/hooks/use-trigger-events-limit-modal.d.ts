import type { Dispatch, SetStateAction } from 'react';
import type { ModalState } from '../modal-context';
import { Plan } from '@/app/components/billing/type';
export type TriggerEventsLimitModalPayload = {
    usage: number;
    total: number;
    resetInDays?: number;
    storageKey?: string;
    persistDismiss?: boolean;
};
type TriggerPlanInfo = {
    type: Plan;
    usage: {
        triggerEvents: number;
    };
    total: {
        triggerEvents: number;
    };
    reset: {
        triggerEvents?: number | null;
    };
};
type UseTriggerEventsLimitModalOptions = {
    plan: TriggerPlanInfo;
    isFetchedPlan: boolean;
    currentWorkspaceId?: string;
};
type UseTriggerEventsLimitModalResult = {
    showTriggerEventsLimitModal: ModalState<TriggerEventsLimitModalPayload> | null;
    setShowTriggerEventsLimitModal: Dispatch<SetStateAction<ModalState<TriggerEventsLimitModalPayload> | null>>;
    persistTriggerEventsLimitModalDismiss: () => void;
};
export declare const useTriggerEventsLimitModal: ({ plan, isFetchedPlan, currentWorkspaceId, }: UseTriggerEventsLimitModalOptions) => UseTriggerEventsLimitModalResult;
export {};
