import type { ConversationVariable } from '@/app/components/workflow/types';
import * as React from 'react';
type Props = {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    showTip: boolean;
    chatVar?: ConversationVariable;
    onClose: () => void;
    onSave: (env: ConversationVariable) => void;
};
declare const VariableModalTrigger: ({ open, setOpen, showTip, chatVar, onClose, onSave, }: Props) => any;
export default VariableModalTrigger;
