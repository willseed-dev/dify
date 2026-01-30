import * as React from 'react';
import { VersionHistoryContextMenuOptions } from '../../../types';
export type ContextMenuProps = {
    isShowDelete: boolean;
    isNamedVersion: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleClickMenuItem: (operation: VersionHistoryContextMenuOptions) => void;
};
declare const _default: any;
export default _default;
