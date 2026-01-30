import type { FC } from 'react';
import type { AppIconType } from '@/types/app';
export type AnswerIconProps = {
    iconType?: AppIconType | null;
    icon?: string | null;
    background?: string | null;
    imageUrl?: string | null;
};
declare const AnswerIcon: FC<AnswerIconProps>;
export default AnswerIcon;
