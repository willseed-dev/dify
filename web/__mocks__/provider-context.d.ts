import type { Plan, UsagePlanInfo } from '@/app/components/billing/type';
import type { ProviderContextState } from '@/context/provider-context';
export declare const baseProviderContextValue: ProviderContextState;
export declare const createMockProviderContextValue: (overrides?: Partial<ProviderContextState>) => ProviderContextState;
export declare const createMockPlan: (plan: Plan) => ProviderContextState;
export declare const createMockPlanUsage: (usage: UsagePlanInfo, ctx: Partial<ProviderContextState>) => ProviderContextState;
export declare const createMockPlanTotal: (total: UsagePlanInfo, ctx: Partial<ProviderContextState>) => ProviderContextState;
export declare const createMockPlanReset: (reset: Partial<ProviderContextState["plan"]["reset"]>, ctx: Partial<ProviderContextState>) => ProviderContextState;
