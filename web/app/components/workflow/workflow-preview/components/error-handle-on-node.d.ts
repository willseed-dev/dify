import type { Node } from '@/app/components/workflow/types';
type ErrorHandleOnNodeProps = Pick<Node, 'id' | 'data'>;
declare const ErrorHandleOnNode: ({ id, data, }: ErrorHandleOnNodeProps) => any;
export default ErrorHandleOnNode;
