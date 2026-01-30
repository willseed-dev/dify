import type { FC } from 'react';
import { Plan } from '../../billing/type';
type PlanBadgeProps = {
    plan: Plan;
    allowHover?: boolean;
    sandboxAsUpgrade?: boolean;
    onClick?: () => void;
};
declare const PlanBadge: FC<PlanBadgeProps>;
export default PlanBadge;
