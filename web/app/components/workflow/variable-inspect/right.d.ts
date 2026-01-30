import type { currentVarType } from './panel';
type Props = {
    nodeId: string;
    currentNodeVar?: currentVarType;
    handleOpenMenu: () => void;
    isValueFetching?: boolean;
};
declare const Right: ({ nodeId, currentNodeVar, handleOpenMenu, isValueFetching, }: Props) => any;
export default Right;
