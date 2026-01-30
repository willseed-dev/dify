import type { EnvironmentVariable } from '@/app/components/workflow/types';
import * as React from 'react';
type Props = {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    env?: EnvironmentVariable;
    onClose: () => void;
    onSave: (env: EnvironmentVariable) => void;
};
declare const VariableTrigger: ({ open, setOpen, env, onClose, onSave, }: Props) => any;
export default VariableTrigger;
