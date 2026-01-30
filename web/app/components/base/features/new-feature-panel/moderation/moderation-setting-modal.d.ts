import type { FC } from 'react';
import type { ModerationConfig } from '@/models/debug';
type ModerationSettingModalProps = {
    data: ModerationConfig;
    onCancel: () => void;
    onSave: (moderationConfig: ModerationConfig) => void;
};
declare const ModerationSettingModal: FC<ModerationSettingModalProps>;
export default ModerationSettingModal;
