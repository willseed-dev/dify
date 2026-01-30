import type { FC } from 'react';
import type { ToolWithProvider } from '../../../workflow/types';
type Props = {
    detail: ToolWithProvider;
    onUpdate: (isDelete?: boolean) => void;
    onHide: () => void;
    isTriggerAuthorize: boolean;
    onFirstCreate: () => void;
};
declare const MCPDetailContent: FC<Props>;
export default MCPDetailContent;
