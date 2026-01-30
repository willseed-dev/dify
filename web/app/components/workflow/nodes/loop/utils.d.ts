import type { Branch } from '@/app/components/workflow/types';
import { VarType } from '@/app/components/workflow/types';
import { ComparisonOperator } from './types';
export declare const isEmptyRelatedOperator: (operator: ComparisonOperator) => boolean;
declare const notTranslateKey: readonly [ComparisonOperator.equal, ComparisonOperator.notEqual, ComparisonOperator.largerThan, ComparisonOperator.largerThanOrEqual, ComparisonOperator.lessThan, ComparisonOperator.lessThanOrEqual];
type NotTranslateOperator = typeof notTranslateKey[number];
export type TranslatableComparisonOperator = Exclude<ComparisonOperator, NotTranslateOperator>;
export declare function isComparisonOperatorNeedTranslate(operator: ComparisonOperator): operator is TranslatableComparisonOperator;
export declare function isComparisonOperatorNeedTranslate(operator?: ComparisonOperator): operator is TranslatableComparisonOperator;
export declare const getOperators: (type?: VarType, file?: {
    key: string;
}) => ComparisonOperator[];
export declare const comparisonOperatorNotRequireValue: (operator?: ComparisonOperator) => boolean;
export declare const branchNameCorrect: (branches: Branch[]) => any[];
export {};
