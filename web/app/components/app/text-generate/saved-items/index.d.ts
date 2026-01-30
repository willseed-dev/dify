import type { SavedMessage } from '@/models/debug';
export type ISavedItemsProps = {
    className?: string;
    isShowTextToSpeech?: boolean;
    list: SavedMessage[];
    onRemove: (id: string) => void;
    onStartCreateContent: () => void;
};
declare const _default: any;
export default _default;
