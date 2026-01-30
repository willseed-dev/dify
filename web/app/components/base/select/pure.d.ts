import type { PortalToFollowElemOptions } from '@/app/components/base/portal-to-follow-elem';
export type Option = {
    label: string;
    value: string;
};
type SharedPureSelectProps = {
    options: Option[];
    containerProps?: PortalToFollowElemOptions & {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    };
    triggerProps?: {
        className?: string;
    };
    popupProps?: {
        wrapperClassName?: string;
        className?: string;
        itemClassName?: string;
        title?: string;
        titleClassName?: string;
    };
    placeholder?: string;
    disabled?: boolean;
    triggerPopupSameWidth?: boolean;
};
type SingleSelectProps = {
    multiple?: false;
    value?: string;
    onChange?: (value: string) => void;
};
type MultiSelectProps = {
    multiple: true;
    value?: string[];
    onChange?: (value: string[]) => void;
};
export type PureSelectProps = SharedPureSelectProps & (SingleSelectProps | MultiSelectProps);
declare const PureSelect: (props: PureSelectProps) => any;
export default PureSelect;
