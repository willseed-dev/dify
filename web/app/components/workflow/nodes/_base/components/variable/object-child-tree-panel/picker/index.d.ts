import type { FC } from 'react';
import type { StructuredOutput } from '../../../../../llm/types';
import type { ValueSelector } from '@/app/components/workflow/types';
type Props = {
    className?: string;
    root: {
        nodeId?: string;
        nodeName?: string;
        attrName: string;
        attrAlias?: string;
    };
    payload: StructuredOutput;
    readonly?: boolean;
    onSelect?: (valueSelector: ValueSelector) => void;
    onHovering?: (value: boolean) => void;
};
export declare const PickerPanelMain: FC<Props>;
declare const _default: any;
export default _default;
