import type { currentVarType } from './panel';
type Props = {
    currentNodeVar?: currentVarType;
    handleVarSelect: (state: any) => void;
};
declare const Left: ({ currentNodeVar, handleVarSelect, }: Props) => any;
export default Left;
