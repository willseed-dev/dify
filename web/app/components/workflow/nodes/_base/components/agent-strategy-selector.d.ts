import type { Strategy } from './agent-strategy';
export type AgentStrategySelectorProps = {
    value?: Strategy;
    onChange: (value?: Strategy) => void;
    canChooseMCPTool: boolean;
};
export declare const AgentStrategySelector: any;
