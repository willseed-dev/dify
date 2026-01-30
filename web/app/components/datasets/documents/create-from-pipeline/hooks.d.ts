import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
import type { Node } from '@/app/components/workflow/types';
import { AddDocumentsStep } from './types';
export declare const useAddDocumentsSteps: () => {
    steps: {
        label: any;
        value: AddDocumentsStep;
    }[];
    currentStep: any;
    handleNextStep: any;
    handleBackStep: any;
};
export declare const useDatasourceOptions: (pipelineNodes: Node<DataSourceNodeType>[]) => any;
export declare const useLocalFile: () => {
    localFileList: any;
    allFileLoaded: any;
    currentLocalFile: any;
    hidePreviewLocalFile: any;
};
export declare const useOnlineDocument: () => {
    currentWorkspace: any;
    onlineDocuments: any;
    currentDocument: any;
    PagesMapAndSelectedPagesId: DataSourceNotionPageMap;
    hidePreviewOnlineDocument: any;
    clearOnlineDocumentData: any;
};
export declare const useWebsiteCrawl: () => {
    websitePages: any;
    currentWebsite: any;
    hideWebsitePreview: any;
    clearWebsiteCrawlData: any;
};
export declare const useOnlineDrive: () => {
    onlineDriveFileList: any;
    selectedFileIds: any;
    selectedOnlineDriveFileList: any;
    clearOnlineDriveData: any;
};
