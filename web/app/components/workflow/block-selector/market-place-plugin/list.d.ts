import type { Plugin, PluginCategoryEnum } from '@/app/components/plugins/types';
export type ListProps = {
    wrapElemRef: React.RefObject<HTMLElement | null>;
    list: Plugin[];
    searchText: string;
    tags: string[];
    category?: PluginCategoryEnum;
    toolContentClassName?: string;
    disableMaxWidth?: boolean;
    hideFindMoreFooter?: boolean;
    ref?: React.Ref<ListRef>;
};
export type ListRef = {
    handleScroll: () => void;
};
declare const List: {
    ({ wrapElemRef, searchText, tags, list, category, toolContentClassName, disableMaxWidth, hideFindMoreFooter, ref, }: ListProps): any;
    displayName: string;
};
export default List;
