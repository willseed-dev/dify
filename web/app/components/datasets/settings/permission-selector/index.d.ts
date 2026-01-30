import type { Member } from '@/models/common';
import { DatasetPermission } from '@/models/datasets';
export type RoleSelectorProps = {
    disabled?: boolean;
    permission?: DatasetPermission;
    value: string[];
    memberList: Member[];
    onChange: (permission?: DatasetPermission) => void;
    onMemberSelect: (v: string[]) => void;
};
declare const PermissionSelector: ({ disabled, permission, value, memberList, onChange, onMemberSelect, }: RoleSelectorProps) => any;
export default PermissionSelector;
