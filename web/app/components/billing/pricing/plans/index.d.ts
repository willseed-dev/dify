import type { UsagePlanInfo } from '../../type';
import type { PlanRange } from '../plan-switcher/plan-range-switcher';
import { Plan } from '../../type';
type PlansProps = {
    plan: {
        type: Plan;
        usage: UsagePlanInfo;
        total: UsagePlanInfo;
    };
    currentPlan: string;
    planRange: PlanRange;
    canPay: boolean;
};
declare const Plans: ({ plan, currentPlan, planRange, canPay, }: PlansProps) => any;
export default Plans;
