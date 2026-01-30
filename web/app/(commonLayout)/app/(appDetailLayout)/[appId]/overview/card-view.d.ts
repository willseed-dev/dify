import type { FC } from 'react';
export type ICardViewProps = {
    appId: string;
    isInPanel?: boolean;
    className?: string;
};
declare const CardView: FC<ICardViewProps>;
export default CardView;
