import type { FC } from 'react';
export type ListeningProps = {
    onStop: () => void;
    message?: string;
};
declare const Listening: FC<ListeningProps>;
export default Listening;
