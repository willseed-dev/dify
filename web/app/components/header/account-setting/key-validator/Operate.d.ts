import type { Status } from './declarations';
type OperateProps = {
    isOpen: boolean;
    status: Status;
    disabled?: boolean;
    onCancel: () => void;
    onSave: () => void;
    onAdd: () => void;
    onEdit: () => void;
};
declare const Operate: ({ isOpen, status, disabled, onCancel, onSave, onAdd, onEdit, }: OperateProps) => any;
export default Operate;
