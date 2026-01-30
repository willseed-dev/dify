import type { Dayjs } from 'dayjs';
import type { FC } from 'react';
import type { AppDailyConversationsResponse, AppDailyEndUsersResponse, AppDailyMessagesResponse, AppTokenCostsResponse } from '@/models/app';
import * as React from 'react';
type IChartType = 'messages' | 'conversations' | 'endUsers' | 'costs' | 'workflowCosts';
export type PeriodParams = {
    name: string;
    query?: {
        start: string;
        end: string;
    };
};
export type TimeRange = {
    start: Dayjs;
    end: Dayjs;
};
export type PeriodParamsWithTimeRange = {
    name: string;
    query?: TimeRange;
};
export type IBizChartProps = {
    period: PeriodParams;
    id: string;
};
export type IChartProps = {
    className?: string;
    basicInfo: {
        title: string;
        explanation: string;
        timePeriod: string;
    };
    valueKey?: string;
    isAvg?: boolean;
    unit?: string;
    yMax?: number;
    chartType: IChartType;
    chartData: AppDailyMessagesResponse | AppDailyConversationsResponse | AppDailyEndUsersResponse | AppTokenCostsResponse | {
        data: Array<{
            date: string;
            count: number;
        }>;
    };
};
declare const Chart: React.FC<IChartProps>;
export declare const MessagesChart: FC<IBizChartProps>;
export declare const ConversationsChart: FC<IBizChartProps>;
export declare const EndUsersChart: FC<IBizChartProps>;
export declare const AvgSessionInteractions: FC<IBizChartProps>;
export declare const AvgResponseTime: FC<IBizChartProps>;
export declare const TokenPerSecond: FC<IBizChartProps>;
export declare const UserSatisfactionRate: FC<IBizChartProps>;
export declare const CostChart: FC<IBizChartProps>;
export declare const WorkflowMessagesChart: FC<IBizChartProps>;
export declare const WorkflowDailyTerminalsChart: FC<IBizChartProps>;
export declare const WorkflowCostChart: FC<IBizChartProps>;
export declare const AvgUserInteractions: FC<IBizChartProps>;
export default Chart;
