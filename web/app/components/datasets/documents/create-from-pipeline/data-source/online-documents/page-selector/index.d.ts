import type { DataSourceNotionPage, DataSourceNotionPageMap } from '@/models/common';
type PageSelectorProps = {
    checkedIds: Set<string>;
    disabledValue: Set<string>;
    searchValue: string;
    pagesMap: DataSourceNotionPageMap;
    list: DataSourceNotionPage[];
    onSelect: (selectedPagesId: Set<string>) => void;
    canPreview?: boolean;
    onPreview?: (selectedPageId: string) => void;
    isMultipleChoice?: boolean;
    currentCredentialId: string;
};
export type NotionPageTreeItem = {
    children: Set<string>;
    descendants: Set<string>;
    depth: number;
    ancestors: string[];
} & DataSourceNotionPage;
export type NotionPageTreeMap = Record<string, NotionPageTreeItem>;
declare const PageSelector: ({ checkedIds, disabledValue, searchValue, pagesMap, list, onSelect, canPreview, onPreview, isMultipleChoice, currentCredentialId, }: PageSelectorProps) => any;
export default PageSelector;
