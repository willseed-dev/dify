import type { CommonShape } from './slices/common';
import type { LocalFileSliceShape } from './slices/local-file';
import type { OnlineDocumentSliceShape } from './slices/online-document';
import type { OnlineDriveSliceShape } from './slices/online-drive';
import type { WebsiteCrawlSliceShape } from './slices/website-crawl';
export type DataSourceShape = CommonShape & LocalFileSliceShape & OnlineDocumentSliceShape & WebsiteCrawlSliceShape & OnlineDriveSliceShape;
export declare const createDataSourceStore: () => any;
export declare const useDataSourceStoreWithSelector: <T>(selector: (state: DataSourceShape) => T) => T;
export declare const useDataSourceStore: () => any;
