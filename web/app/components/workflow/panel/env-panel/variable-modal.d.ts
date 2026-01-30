import type { EnvironmentVariable } from '@/app/components/workflow/types';
export type ModalPropsType = {
    env?: EnvironmentVariable;
    onClose: () => void;
    onSave: (env: EnvironmentVariable) => void;
};
declare const VariableModal: ({ env, onClose, onSave, }: ModalPropsType) => any;
export default VariableModal;
