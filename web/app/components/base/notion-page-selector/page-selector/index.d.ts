import type { DataSourceNotionPage, DataSourceNotionPageMap } from '@/models/common';
type PageSelectorProps = {
    value: Set<string>;
    disabledValue: Set<string>;
    searchValue: string;
    pagesMap: DataSourceNotionPageMap;
    list: DataSourceNotionPage[];
    onSelect: (selectedPagesId: Set<string>) => void;
    canPreview?: boolean;
    previewPageId?: string;
    onPreview?: (selectedPageId: string) => void;
    isMultipleChoice?: boolean;
};
declare const PageSelector: ({ value, disabledValue, searchValue, pagesMap, list, onSelect, canPreview, previewPageId, onPreview, }: PageSelectorProps) => any;
export default PageSelector;
