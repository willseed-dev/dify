export declare const fetchTagList: (type: string) => Promise<any>;
export declare const createTag: (name: string, type: string) => Promise<any>;
export declare const updateTag: (tagID: string, name: string) => Promise<any>;
export declare const deleteTag: (tagID: string) => Promise<any>;
export declare const bindTag: (tagIDList: string[], targetID: string, type: string) => Promise<any>;
export declare const unBindTag: (tagID: string, targetID: string, type: string) => Promise<any>;
