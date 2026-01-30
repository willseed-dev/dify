import type { FC } from 'react';
import { VarType } from '@/app/components/workflow/nodes/tool/types';
type Props = {
    value: VarType;
    onChange: (value: VarType) => void;
};
declare const FormInputTypeSwitch: FC<Props>;
export default FormInputTypeSwitch;
