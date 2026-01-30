type Option = {
    name: string;
    value: string;
    type: string;
};
export type Props = {
    triggerClassName?: string;
    className?: string;
    value: string | undefined;
    options: Option[];
    onChange: (value: string) => void;
    notSelectedVarTip?: string | null;
};
declare const _default: any;
export default _default;
