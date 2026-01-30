import type { FC } from 'react';
type ReasoningFormatConfigProps = {
    value?: 'tagged' | 'separated';
    onChange: (value: 'tagged' | 'separated') => void;
    readonly?: boolean;
};
declare const ReasoningFormatConfig: FC<ReasoningFormatConfigProps>;
export default ReasoningFormatConfig;
