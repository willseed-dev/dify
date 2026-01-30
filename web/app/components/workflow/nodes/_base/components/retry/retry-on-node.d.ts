import type { Node } from '@/app/components/workflow/types';
type RetryOnNodeProps = Pick<Node, 'id' | 'data'>;
declare const RetryOnNode: ({ data, }: RetryOnNodeProps) => any;
export default RetryOnNode;
