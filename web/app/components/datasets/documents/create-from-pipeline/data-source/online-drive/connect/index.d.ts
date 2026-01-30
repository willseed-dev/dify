import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
type ConnectProps = {
    nodeData: DataSourceNodeType;
    onSetting: () => void;
};
declare const Connect: ({ nodeData, onSetting, }: ConnectProps) => any;
export default Connect;
