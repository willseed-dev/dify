import type { ToolWithProvider } from '../../workflow/types';
type Props = {
    currentProvider?: ToolWithProvider;
    data: ToolWithProvider;
    handleSelect: (providerID: string) => void;
    onUpdate: (providerID: string) => void;
    onDeleted: () => void;
};
declare const MCPCard: ({ currentProvider, data, onUpdate, handleSelect, onDeleted, }: Props) => any;
export default MCPCard;
