import { TaskStatus } from '../../types';
type Params = {
    taskId: string;
    pluginUniqueIdentifier: string;
};
declare function checkTaskStatus(): {
    check: ({ taskId, pluginUniqueIdentifier, }: Params) => Promise<{
        status: TaskStatus;
        error?: undefined;
    } | {
        status: TaskStatus;
        error: any;
    }>;
    stop: () => void;
};
export default checkTaskStatus;
