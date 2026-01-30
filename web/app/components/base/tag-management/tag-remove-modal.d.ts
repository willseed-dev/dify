import type { Tag } from '@/app/components/base/tag-management/constant';
type TagRemoveModalProps = {
    show: boolean;
    tag: Tag;
    onConfirm: () => void;
    onClose: () => void;
};
declare const TagRemoveModal: ({ show, tag, onConfirm, onClose }: TagRemoveModalProps) => any;
export default TagRemoveModal;
