import type { DataSourceCredential } from '../../header/account-setting/data-source-page-new/types';
import type { NotionPage } from '@/models/common';
type NotionPageSelectorProps = {
    value?: string[];
    onSelect: (selectedPages: NotionPage[]) => void;
    canPreview?: boolean;
    previewPageId?: string;
    onPreview?: (selectedPage: NotionPage) => void;
    datasetId?: string;
    credentialList: DataSourceCredential[];
    onSelectCredential?: (credentialId: string) => void;
};
declare const NotionPageSelector: ({ value, onSelect, canPreview, previewPageId, onPreview, datasetId, credentialList, onSelectCredential, }: NotionPageSelectorProps) => any;
export default NotionPageSelector;
