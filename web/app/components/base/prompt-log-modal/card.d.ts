import type { FC } from 'react';
type CardProps = {
    log: {
        role: string;
        text: string;
    }[];
};
declare const Card: FC<CardProps>;
export default Card;
