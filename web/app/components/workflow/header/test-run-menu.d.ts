export declare enum TriggerType {
    UserInput = "user_input",
    Schedule = "schedule",
    Webhook = "webhook",
    Plugin = "plugin",
    All = "all"
}
export type TriggerOption = {
    id: string;
    type: TriggerType;
    name: string;
    icon: React.ReactNode;
    nodeId?: string;
    relatedNodeIds?: string[];
    enabled: boolean;
};
export type TestRunOptions = {
    userInput?: TriggerOption;
    triggers: TriggerOption[];
    runAll?: TriggerOption;
};
export type TestRunMenuRef = {
    toggle: () => void;
};
declare const TestRunMenu: any;
export default TestRunMenu;
