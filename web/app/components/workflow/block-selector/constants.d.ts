import { BlockEnum } from '../types';
import { BlockClassificationEnum } from './types';
export declare const BLOCK_CLASSIFICATIONS: readonly [BlockClassificationEnum.Default, BlockClassificationEnum.QuestionUnderstand, BlockClassificationEnum.Logic, BlockClassificationEnum.Transform, BlockClassificationEnum.Utilities];
export declare const DEFAULT_FILE_EXTENSIONS_IN_LOCAL_FILE_DATA_SOURCE: string[];
export declare const START_BLOCKS: readonly [{
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.Start;
    readonly title: "User Input";
    readonly description: "Traditional start node for user input";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.TriggerSchedule;
    readonly title: "Schedule Trigger";
    readonly description: "Time-based workflow trigger";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.TriggerWebhook;
    readonly title: "Webhook Trigger";
    readonly description: "HTTP callback trigger";
}];
export declare const ENTRY_NODE_TYPES: readonly [BlockEnum.Start, BlockEnum.TriggerSchedule, BlockEnum.TriggerWebhook, BlockEnum.TriggerPlugin];
export declare const BLOCKS: readonly [{
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.LLM;
    readonly title: "LLM";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.KnowledgeRetrieval;
    readonly title: "Knowledge Retrieval";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.End;
    readonly title: "End";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.Answer;
    readonly title: "Direct Answer";
}, {
    readonly classification: BlockClassificationEnum.QuestionUnderstand;
    readonly type: BlockEnum.QuestionClassifier;
    readonly title: "Question Classifier";
}, {
    readonly classification: BlockClassificationEnum.Logic;
    readonly type: BlockEnum.IfElse;
    readonly title: "IF/ELSE";
}, {
    readonly classification: BlockClassificationEnum.Logic;
    readonly type: BlockEnum.LoopEnd;
    readonly title: "Exit Loop";
    readonly description: "";
}, {
    readonly classification: BlockClassificationEnum.Logic;
    readonly type: BlockEnum.Iteration;
    readonly title: "Iteration";
}, {
    readonly classification: BlockClassificationEnum.Logic;
    readonly type: BlockEnum.Loop;
    readonly title: "Loop";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.Code;
    readonly title: "Code";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.TemplateTransform;
    readonly title: "Templating Transform";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.VariableAggregator;
    readonly title: "Variable Aggregator";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.DocExtractor;
    readonly title: "Doc Extractor";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.Assigner;
    readonly title: "Variable Assigner";
}, {
    readonly classification: BlockClassificationEnum.Transform;
    readonly type: BlockEnum.ParameterExtractor;
    readonly title: "Parameter Extractor";
}, {
    readonly classification: BlockClassificationEnum.Utilities;
    readonly type: BlockEnum.HttpRequest;
    readonly title: "HTTP Request";
}, {
    readonly classification: BlockClassificationEnum.Utilities;
    readonly type: BlockEnum.ListFilter;
    readonly title: "List Filter";
}, {
    readonly classification: BlockClassificationEnum.Default;
    readonly type: BlockEnum.Agent;
    readonly title: "Agent";
}];
