type StatusIndicatorsProps = {
    needsConfiguration: boolean;
    modelProvider: boolean;
    inModelList: boolean;
    disabled: boolean;
    pluginInfo: any;
    t: any;
};
declare const StatusIndicators: ({ needsConfiguration, modelProvider, inModelList, disabled, pluginInfo, t }: StatusIndicatorsProps) => any;
export default StatusIndicators;
