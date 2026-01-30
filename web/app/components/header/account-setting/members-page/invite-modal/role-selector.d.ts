declare const roleI18nKeyMap: {
    readonly normal: "members.normal";
    readonly editor: "members.editor";
    readonly admin: "members.admin";
    readonly dataset_operator: "members.datasetOperator";
};
export type RoleKey = keyof typeof roleI18nKeyMap;
export type RoleSelectorProps = {
    value: RoleKey;
    onChange: (role: RoleKey) => void;
};
declare const RoleSelector: ({ value, onChange }: RoleSelectorProps) => any;
export default RoleSelector;
