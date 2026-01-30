import type { BlockEnum } from '@/app/components/workflow/types';
import { BlockClassificationEnum } from '@/app/components/workflow/block-selector/types';
export type GenNodeMetaDataParams = {
    classification?: BlockClassificationEnum;
    sort: number;
    type: BlockEnum;
    title?: string;
    author?: string;
    helpLinkUri?: string;
    isRequired?: boolean;
    isUndeletable?: boolean;
    isStart?: boolean;
    isSingleton?: boolean;
    isTypeFixed?: boolean;
};
export declare const genNodeMetaData: ({ classification, sort, type, title, author, helpLinkUri, isRequired, isUndeletable, isStart, isSingleton, isTypeFixed, }: GenNodeMetaDataParams) => {
    classification: any;
    sort: number;
    type: BlockEnum;
    title: string;
    author: string;
    helpLinkUri: any;
    isRequired: boolean;
    isUndeletable: boolean;
    isStart: boolean;
    isSingleton: boolean;
    isTypeFixed: boolean;
};
