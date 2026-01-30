import type { FC } from 'react';
import type { ModerationContentConfig } from '@/models/debug';
type ModerationContentProps = {
    title: string;
    info?: string;
    showPreset?: boolean;
    config: ModerationContentConfig;
    onConfigChange: (config: ModerationContentConfig) => void;
};
declare const ModerationContent: FC<ModerationContentProps>;
export default ModerationContent;
