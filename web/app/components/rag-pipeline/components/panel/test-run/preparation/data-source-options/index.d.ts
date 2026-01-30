import type { Datasource } from '../../types';
type DataSourceOptionsProps = {
    dataSourceNodeId: string;
    onSelect: (option: Datasource) => void;
};
declare const DataSourceOptions: ({ dataSourceNodeId, onSelect, }: DataSourceOptionsProps) => any;
export default DataSourceOptions;
