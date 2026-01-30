import type { RunAndHistoryProps } from './run-and-history';
export type HeaderInNormalProps = {
    components?: {
        left?: React.ReactNode;
        middle?: React.ReactNode;
        chatVariableTrigger?: React.ReactNode;
    };
    runAndHistoryProps?: RunAndHistoryProps;
};
declare const HeaderInNormal: ({ components, runAndHistoryProps, }: HeaderInNormalProps) => any;
export default HeaderInNormal;
