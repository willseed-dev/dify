import type { MoreInfo } from '@/app/components/workflow/types';
import type { InputVar } from '@/models/pipeline';
export type InputFieldEditorProps = {
    onClose: () => void;
    onSubmit: (data: InputVar, moreInfo?: MoreInfo) => void;
    initialData?: InputVar;
};
declare const InputFieldEditorPanel: ({ onClose, onSubmit, initialData, }: InputFieldEditorProps) => any;
export default InputFieldEditorPanel;
