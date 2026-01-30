import type { FC } from 'react';
import type { ModelParameterRule } from '../declarations';
export type ParameterValue = number | string | string[] | boolean | undefined;
type ParameterItemProps = {
    parameterRule: ModelParameterRule;
    value?: ParameterValue;
    onChange?: (value: ParameterValue) => void;
    onSwitch?: (checked: boolean, assignValue: ParameterValue) => void;
    isInWorkflow?: boolean;
};
declare const ParameterItem: FC<ParameterItemProps>;
export default ParameterItem;
