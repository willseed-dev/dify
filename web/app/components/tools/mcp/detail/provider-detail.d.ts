import type { FC } from 'react';
import type { ToolWithProvider } from '../../../workflow/types';
type Props = {
    detail?: ToolWithProvider;
    onUpdate: () => void;
    onHide: () => void;
    isTriggerAuthorize: boolean;
    onFirstCreate: () => void;
};
declare const MCPDetailPanel: FC<Props>;
export default MCPDetailPanel;
