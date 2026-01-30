import type { Collection, Tool } from '../types';
type Props = {
    disabled?: boolean;
    collection: Collection;
    tool: Tool;
    isBuiltIn: boolean;
    isModel: boolean;
};
declare const ToolItem: ({ disabled, collection, tool, isBuiltIn, isModel, }: Props) => any;
export default ToolItem;
