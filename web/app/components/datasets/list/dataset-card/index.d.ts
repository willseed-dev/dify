import type { DataSet } from '@/models/datasets';
type DatasetCardProps = {
    dataset: DataSet;
    onSuccess?: () => void;
};
declare const DatasetCard: ({ dataset, onSuccess, }: DatasetCardProps) => any;
export default DatasetCard;
