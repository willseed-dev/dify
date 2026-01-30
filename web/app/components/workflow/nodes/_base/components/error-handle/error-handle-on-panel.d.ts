import type { Node } from '@/app/components/workflow/types';
type ErrorHandleProps = Pick<Node, 'id' | 'data'>;
declare const ErrorHandle: ({ id, data, }: ErrorHandleProps) => any;
export default ErrorHandle;
