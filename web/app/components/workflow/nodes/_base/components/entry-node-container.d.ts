import type { FC, ReactNode } from 'react';
export declare enum StartNodeTypeEnum {
    Start = "start",
    Trigger = "trigger"
}
type EntryNodeContainerProps = {
    children: ReactNode;
    customLabel?: string;
    nodeType?: StartNodeTypeEnum;
};
declare const EntryNodeContainer: FC<EntryNodeContainerProps>;
export default EntryNodeContainer;
