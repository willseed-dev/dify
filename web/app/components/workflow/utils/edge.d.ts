import { NodeRunningStatus } from '../types';
export declare const getEdgeColor: (nodeRunningStatus?: NodeRunningStatus, isFailBranch?: boolean) => "var(--color-workflow-link-line-normal)" | "var(--color-workflow-link-line-handle)" | "var(--color-workflow-link-line-failure-handle)" | "var(--color-workflow-link-line-success-handle)" | "var(--color-workflow-link-line-error-handle)";
