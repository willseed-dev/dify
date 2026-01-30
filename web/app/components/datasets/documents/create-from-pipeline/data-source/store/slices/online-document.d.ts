import type { StateCreator } from 'zustand';
import type { DataSourceNotionWorkspace, NotionPage } from '@/models/common';
export type OnlineDocumentSliceShape = {
    documentsData: DataSourceNotionWorkspace[];
    setDocumentsData: (documentData: DataSourceNotionWorkspace[]) => void;
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    onlineDocuments: NotionPage[];
    setOnlineDocuments: (documents: NotionPage[]) => void;
    currentDocument: NotionPage | undefined;
    setCurrentDocument: (document: NotionPage | undefined) => void;
    selectedPagesId: Set<string>;
    setSelectedPagesId: (selectedPagesId: Set<string>) => void;
    previewOnlineDocumentRef: React.RefObject<NotionPage | undefined>;
};
export declare const createOnlineDocumentSlice: StateCreator<OnlineDocumentSliceShape>;
