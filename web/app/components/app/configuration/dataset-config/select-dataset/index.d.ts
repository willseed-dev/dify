import type { DataSet } from '@/models/datasets';
export type ISelectDataSetProps = {
    isShow: boolean;
    onClose: () => void;
    selectedIds: string[];
    onSelect: (dataSet: DataSet[]) => void;
};
declare const _default: any;
export default _default;
