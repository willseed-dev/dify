import type { Params as OneStepRunParams } from '@/app/components/workflow/nodes/_base/hooks/use-one-step-run';
type Params<T> = Omit<OneStepRunParams<T>, 'isRunAfterSingleRun'>;
declare const useLastRun: <T>({ ...oneStepRunParams }: Params<T>) => any;
export default useLastRun;
