import type { NotionPageTreeItem, NotionPageTreeMap } from './index';
import type { DataSourceNotionPageMap } from '@/models/common';
export declare const recursivePushInParentDescendants: (pagesMap: DataSourceNotionPageMap, listTreeMap: NotionPageTreeMap, current: NotionPageTreeItem, leafItem: NotionPageTreeItem) => void;
