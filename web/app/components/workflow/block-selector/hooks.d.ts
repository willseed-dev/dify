import { TabsEnum, ToolTypeEnum } from './types';
export declare const useBlocks: () => ({
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.LLM;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.KnowledgeRetrieval;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.End;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.Answer;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.QuestionUnderstand;
    type: import("../types").BlockEnum.QuestionClassifier;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Logic;
    type: import("../types").BlockEnum.IfElse;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Logic;
    type: import("../types").BlockEnum.LoopEnd;
    description: "";
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Logic;
    type: import("../types").BlockEnum.Iteration;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Logic;
    type: import("../types").BlockEnum.Loop;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.Code;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.TemplateTransform;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.VariableAggregator;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.DocExtractor;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.Assigner;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Transform;
    type: import("../types").BlockEnum.ParameterExtractor;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Utilities;
    type: import("../types").BlockEnum.HttpRequest;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Utilities;
    type: import("../types").BlockEnum.ListFilter;
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.Agent;
})[];
export declare const useStartBlocks: () => ({
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.Start;
    description: "Traditional start node for user input";
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.TriggerSchedule;
    description: "Time-based workflow trigger";
} | {
    title: any;
    classification: import("./types").BlockClassificationEnum.Default;
    type: import("../types").BlockEnum.TriggerWebhook;
    description: "HTTP callback trigger";
})[];
export declare const useTabs: ({ noBlocks, noSources, noTools, noStart, defaultActiveTab, hasUserInputNode, forceEnableStartTab, }: {
    noBlocks?: boolean;
    noSources?: boolean;
    noTools?: boolean;
    noStart?: boolean;
    defaultActiveTab?: TabsEnum;
    hasUserInputNode?: boolean;
    forceEnableStartTab?: boolean;
}) => {
    tabs: any;
    activeTab: any;
    setActiveTab: any;
};
export declare const useToolTabs: (isHideMCPTools?: boolean) => {
    key: ToolTypeEnum;
    name: any;
}[];
