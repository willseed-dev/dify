import type { InputVar, MoreInfo } from '@/app/components/workflow/types';
export type IConfigModalProps = {
    isCreate?: boolean;
    payload?: InputVar;
    isShow: boolean;
    varKeys?: string[];
    onClose: () => void;
    onConfirm: (newValue: InputVar, moreInfo?: MoreInfo) => void;
    supportFile?: boolean;
};
declare const _default: any;
export default _default;
