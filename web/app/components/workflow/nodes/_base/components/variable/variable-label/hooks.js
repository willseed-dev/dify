"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVarBgColorInEditor = exports.useVarName = exports.useVarColor = exports.useVarIcon = void 0;
const react_1 = require("react");
const others_1 = require("@/app/components/base/icons/src/vender/line/others");
const pipeline_1 = require("@/app/components/base/icons/src/vender/pipeline");
const development_1 = require("@/app/components/base/icons/src/vender/solid/development");
const workflow_1 = require("@/app/components/base/icons/src/vender/workflow");
const constants_1 = require("@/app/components/workflow/constants");
const workflow_2 = require("@/types/workflow");
const utils_1 = require("../utils");
const useVarIcon = (variables, variableCategory) => {
    if (variableCategory === 'loop')
        return workflow_1.Loop;
    if (variableCategory === 'rag' || (0, utils_1.isRagVariableVar)(variables))
        return pipeline_1.InputField;
    if ((0, utils_1.isENV)(variables) || variableCategory === workflow_2.VarInInspectType.environment || variableCategory === 'environment')
        return others_1.Env;
    if ((0, utils_1.isConversationVar)(variables) || variableCategory === workflow_2.VarInInspectType.conversation || variableCategory === 'conversation')
        return others_1.BubbleX;
    if ((0, utils_1.isGlobalVar)(variables) || variableCategory === workflow_2.VarInInspectType.system)
        return others_1.GlobalVariable;
    return development_1.Variable02;
};
exports.useVarIcon = useVarIcon;
const useVarColor = (variables, isExceptionVariable, variableCategory) => {
    return (0, react_1.useMemo)(() => {
        if (isExceptionVariable)
            return 'text-text-warning';
        if (variableCategory === 'loop')
            return 'text-util-colors-cyan-cyan-500';
        if ((0, utils_1.isENV)(variables) || variableCategory === workflow_2.VarInInspectType.environment || variableCategory === 'environment')
            return 'text-util-colors-violet-violet-600';
        if ((0, utils_1.isConversationVar)(variables) || variableCategory === workflow_2.VarInInspectType.conversation || variableCategory === 'conversation')
            return 'text-util-colors-teal-teal-700';
        if ((0, utils_1.isGlobalVar)(variables) || variableCategory === workflow_2.VarInInspectType.system)
            return 'text-util-colors-orange-orange-600';
        return 'text-text-accent';
    }, [variables, isExceptionVariable, variableCategory]);
};
exports.useVarColor = useVarColor;
const useVarName = (variables, notShowFullPath) => {
    const showName = constants_1.VAR_SHOW_NAME_MAP[variables.join('.')];
    let variableFullPathName = variables.slice(1).join('.');
    if ((0, utils_1.isRagVariableVar)(variables))
        variableFullPathName = variables.slice(2).join('.');
    const varName = (0, react_1.useMemo)(() => {
        variableFullPathName = variables.slice(1).join('.');
        if ((0, utils_1.isRagVariableVar)(variables))
            variableFullPathName = variables.slice(2).join('.');
        const variablesLength = variables.length;
        const isSystem = (0, utils_1.isSystemVar)(variables);
        const varName = notShowFullPath ? variables[variablesLength - 1] : variableFullPathName;
        return `${isSystem ? 'sys.' : ''}${varName}`;
    }, [variables, notShowFullPath]);
    if (showName)
        return showName;
    return varName;
};
exports.useVarName = useVarName;
const useVarBgColorInEditor = (variables, hasError) => {
    if (hasError) {
        return {
            hoverBorderColor: 'hover:border-state-destructive-active',
            hoverBgColor: 'hover:bg-state-destructive-hover',
            selectedBorderColor: '!border-state-destructive-solid',
            selectedBgColor: '!bg-state-destructive-hover',
        };
    }
    if ((0, utils_1.isENV)(variables)) {
        return {
            hoverBorderColor: 'hover:border-util-colors-violet-violet-100',
            hoverBgColor: 'hover:bg-util-colors-violet-violet-50',
            selectedBorderColor: 'border-util-colors-violet-violet-600',
            selectedBgColor: 'bg-util-colors-violet-violet-50',
        };
    }
    if ((0, utils_1.isConversationVar)(variables)) {
        return {
            hoverBorderColor: 'hover:border-util-colors-teal-teal-100',
            hoverBgColor: 'hover:bg-util-colors-teal-teal-50',
            selectedBorderColor: 'border-util-colors-teal-teal-600',
            selectedBgColor: 'bg-util-colors-teal-teal-50',
        };
    }
    return {
        hoverBorderColor: 'hover:border-state-accent-alt',
        hoverBgColor: 'hover:bg-state-accent-hover',
        selectedBorderColor: 'border-state-accent-solid',
        selectedBgColor: 'bg-state-accent-hover',
    };
};
exports.useVarBgColorInEditor = useVarBgColorInEditor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0IsK0VBQWlHO0FBQ2pHLDhFQUE0RTtBQUM1RSwwRkFBcUY7QUFDckYsOEVBQXNFO0FBQ3RFLG1FQUF1RTtBQUN2RSwrQ0FBbUQ7QUFDbkQsb0NBTWlCO0FBRVYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxTQUFtQixFQUFFLGdCQUE0QyxFQUFFLEVBQUU7SUFDOUYsSUFBSSxnQkFBZ0IsS0FBSyxNQUFNO1FBQzdCLE9BQU8sZUFBSSxDQUFBO0lBRWIsSUFBSSxnQkFBZ0IsS0FBSyxLQUFLLElBQUksSUFBQSx3QkFBZ0IsRUFBQyxTQUFTLENBQUM7UUFDM0QsT0FBTyxxQkFBVSxDQUFBO0lBRW5CLElBQUksSUFBQSxhQUFLLEVBQUMsU0FBUyxDQUFDLElBQUksZ0JBQWdCLEtBQUssMkJBQWdCLENBQUMsV0FBVyxJQUFJLGdCQUFnQixLQUFLLGFBQWE7UUFDN0csT0FBTyxZQUFHLENBQUE7SUFFWixJQUFJLElBQUEseUJBQWlCLEVBQUMsU0FBUyxDQUFDLElBQUksZ0JBQWdCLEtBQUssMkJBQWdCLENBQUMsWUFBWSxJQUFJLGdCQUFnQixLQUFLLGNBQWM7UUFDM0gsT0FBTyxnQkFBTyxDQUFBO0lBRWhCLElBQUksSUFBQSxtQkFBVyxFQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixLQUFLLDJCQUFnQixDQUFDLE1BQU07UUFDeEUsT0FBTyx1QkFBYyxDQUFBO0lBRXZCLE9BQU8sd0JBQVUsQ0FBQTtBQUNuQixDQUFDLENBQUE7QUFqQlksUUFBQSxVQUFVLGNBaUJ0QjtBQUVNLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBbUIsRUFBRSxtQkFBNkIsRUFBRSxnQkFBNEMsRUFBRSxFQUFFO0lBQzlILE9BQU8sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ2xCLElBQUksbUJBQW1CO1lBQ3JCLE9BQU8sbUJBQW1C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QztZQUNyRCxtQkFBbUIsRUFBRSxzQ0FBc0M7WUFDM0QsZUFBZSxFQUFFLGlDQUFpQztTQUNuRCxDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksSUFBQSx5QkFBaUIsRUFBQyxTQUFTLENBQUMsRUFBRSxDQUFDO1FBQ2pDLE9BQU87WUFDTCxnQkFBZ0IsRUFBRSx3Q0FBd0M7WUFDMUQsWUFBWSxFQUFFLG1DQUFtQztZQUNqRCxtQkFBbUIsRUFBRSxrQ0FBa0M7WUFDdkQsZUFBZSxFQUFFLDZCQUE2QjtTQUMvQyxDQUFBO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxnQkFBZ0IsRUFBRSwrQkFBK0I7UUFDakQsWUFBWSxFQUFFLDZCQUE2QjtRQUMzQyxtQkFBbUIsRUFBRSwyQkFBMkI7UUFDaEQsZUFBZSxFQUFFLHVCQUF1QjtLQUN6QyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbENZLFFBQUEscUJBQXFCLHlCQWtDakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCdWJibGVYLCBFbnYsIEdsb2JhbFZhcmlhYmxlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvbGluZS9vdGhlcnMnXG5pbXBvcnQgeyBJbnB1dEZpZWxkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvcGlwZWxpbmUnXG5pbXBvcnQgeyBWYXJpYWJsZTAyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvc29saWQvZGV2ZWxvcG1lbnQnXG5pbXBvcnQgeyBMb29wIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvd29ya2Zsb3cnXG5pbXBvcnQgeyBWQVJfU0hPV19OQU1FX01BUCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzJ1xuaW1wb3J0IHsgVmFySW5JbnNwZWN0VHlwZSB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQge1xuICBpc0NvbnZlcnNhdGlvblZhcixcbiAgaXNFTlYsXG4gIGlzR2xvYmFsVmFyLFxuICBpc1JhZ1ZhcmlhYmxlVmFyLFxuICBpc1N5c3RlbVZhcixcbn0gZnJvbSAnLi4vdXRpbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VWYXJJY29uID0gKHZhcmlhYmxlczogc3RyaW5nW10sIHZhcmlhYmxlQ2F0ZWdvcnk/OiBWYXJJbkluc3BlY3RUeXBlIHwgc3RyaW5nKSA9PiB7XG4gIGlmICh2YXJpYWJsZUNhdGVnb3J5ID09PSAnbG9vcCcpXG4gICAgcmV0dXJuIExvb3BcblxuICBpZiAodmFyaWFibGVDYXRlZ29yeSA9PT0gJ3JhZycgfHwgaXNSYWdWYXJpYWJsZVZhcih2YXJpYWJsZXMpKVxuICAgIHJldHVybiBJbnB1dEZpZWxkXG5cbiAgaWYgKGlzRU5WKHZhcmlhYmxlcykgfHwgdmFyaWFibGVDYXRlZ29yeSA9PT0gVmFySW5JbnNwZWN0VHlwZS5lbnZpcm9ubWVudCB8fCB2YXJpYWJsZUNhdGVnb3J5ID09PSAnZW52aXJvbm1lbnQnKVxuICAgIHJldHVybiBFbnZcblxuICBpZiAoaXNDb252ZXJzYXRpb25WYXIodmFyaWFibGVzKSB8fCB2YXJpYWJsZUNhdGVnb3J5ID09PSBWYXJJbkluc3BlY3RUeXBlLmNvbnZlcnNhdGlvbiB8fCB2YXJpYWJsZUNhdGVnb3J5ID09PSAnY29udmVyc2F0aW9uJylcbiAgICByZXR1cm4gQnViYmxlWFxuXG4gIGlmIChpc0dsb2JhbFZhcih2YXJpYWJsZXMpIHx8IHZhcmlhYmxlQ2F0ZWdvcnkgPT09IFZhckluSW5zcGVjdFR5cGUuc3lzdGVtKVxuICAgIHJldHVybiBHbG9iYWxWYXJpYWJsZVxuXG4gIHJldHVybiBWYXJpYWJsZTAyXG59XG5cbmV4cG9ydCBjb25zdCB1c2VWYXJDb2xvciA9ICh2YXJpYWJsZXM6IHN0cmluZ1tdLCBpc0V4Y2VwdGlvblZhcmlhYmxlPzogYm9vbGVhbiwgdmFyaWFibGVDYXRlZ29yeT86IFZhckluSW5zcGVjdFR5cGUgfCBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChpc0V4Y2VwdGlvblZhcmlhYmxlKVxuICAgICAgcmV0dXJuICd0ZXh0LXRleHQtd2FybmluZydcblxuICAgIGlmICh2YXJpYWJsZUNhdGVnb3J5ID09PSAnbG9vcCcpXG4gICAgICByZXR1cm4gJ3RleHQtdXRpbC1jb2xvcnMtY3lhbi1jeWFuLTUwMCdcblxuICAgIGlmIChpc0VOVih2YXJpYWJsZXMpIHx8IHZhcmlhYmxlQ2F0ZWdvcnkgPT09IFZhckluSW5zcGVjdFR5cGUuZW52aXJvbm1lbnQgfHwgdmFyaWFibGVDYXRlZ29yeSA9PT0gJ2Vudmlyb25tZW50JylcbiAgICAgIHJldHVybiAndGV4dC11dGlsLWNvbG9ycy12aW9sZXQtdmlvbGV0LTYwMCdcblxuICAgIGlmIChpc0NvbnZlcnNhdGlvblZhcih2YXJpYWJsZXMpIHx8IHZhcmlhYmxlQ2F0ZWdvcnkgPT09IFZhckluSW5zcGVjdFR5cGUuY29udmVyc2F0aW9uIHx8IHZhcmlhYmxlQ2F0ZWdvcnkgPT09ICdjb252ZXJzYXRpb24nKVxuICAgICAgcmV0dXJuICd0ZXh0LXV0aWwtY29sb3JzLXRlYWwtdGVhbC03MDAnXG5cbiAgICBpZiAoaXNHbG9iYWxWYXIodmFyaWFibGVzKSB8fCB2YXJpYWJsZUNhdGVnb3J5ID09PSBWYXJJbkluc3BlY3RUeXBlLnN5c3RlbSlcbiAgICAgIHJldHVybiAndGV4dC11dGlsLWNvbG9ycy1vcmFuZ2Utb3JhbmdlLTYwMCdcblxuICAgIHJldHVybiAndGV4dC10ZXh0LWFjY2VudCdcbiAgfSwgW3ZhcmlhYmxlcywgaXNFeGNlcHRpb25WYXJpYWJsZSwgdmFyaWFibGVDYXRlZ29yeV0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VWYXJOYW1lID0gKHZhcmlhYmxlczogc3RyaW5nW10sIG5vdFNob3dGdWxsUGF0aD86IGJvb2xlYW4pID0+IHtcbiAgY29uc3Qgc2hvd05hbWUgPSBWQVJfU0hPV19OQU1FX01BUFt2YXJpYWJsZXMuam9pbignLicpXVxuICBsZXQgdmFyaWFibGVGdWxsUGF0aE5hbWUgPSB2YXJpYWJsZXMuc2xpY2UoMSkuam9pbignLicpXG5cbiAgaWYgKGlzUmFnVmFyaWFibGVWYXIodmFyaWFibGVzKSlcbiAgICB2YXJpYWJsZUZ1bGxQYXRoTmFtZSA9IHZhcmlhYmxlcy5zbGljZSgyKS5qb2luKCcuJylcblxuICBjb25zdCB2YXJOYW1lID0gdXNlTWVtbygoKSA9PiB7XG4gICAgdmFyaWFibGVGdWxsUGF0aE5hbWUgPSB2YXJpYWJsZXMuc2xpY2UoMSkuam9pbignLicpXG5cbiAgICBpZiAoaXNSYWdWYXJpYWJsZVZhcih2YXJpYWJsZXMpKVxuICAgICAgdmFyaWFibGVGdWxsUGF0aE5hbWUgPSB2YXJpYWJsZXMuc2xpY2UoMikuam9pbignLicpXG5cbiAgICBjb25zdCB2YXJpYWJsZXNMZW5ndGggPSB2YXJpYWJsZXMubGVuZ3RoXG4gICAgY29uc3QgaXNTeXN0ZW0gPSBpc1N5c3RlbVZhcih2YXJpYWJsZXMpXG4gICAgY29uc3QgdmFyTmFtZSA9IG5vdFNob3dGdWxsUGF0aCA/IHZhcmlhYmxlc1t2YXJpYWJsZXNMZW5ndGggLSAxXSA6IHZhcmlhYmxlRnVsbFBhdGhOYW1lXG4gICAgcmV0dXJuIGAke2lzU3lzdGVtID8gJ3N5cy4nIDogJyd9JHt2YXJOYW1lfWBcbiAgfSwgW3ZhcmlhYmxlcywgbm90U2hvd0Z1bGxQYXRoXSlcblxuICBpZiAoc2hvd05hbWUpXG4gICAgcmV0dXJuIHNob3dOYW1lXG4gIHJldHVybiB2YXJOYW1lXG59XG5cbmV4cG9ydCBjb25zdCB1c2VWYXJCZ0NvbG9ySW5FZGl0b3IgPSAodmFyaWFibGVzOiBzdHJpbmdbXSwgaGFzRXJyb3I/OiBib29sZWFuKSA9PiB7XG4gIGlmIChoYXNFcnJvcikge1xuICAgIHJldHVybiB7XG4gICAgICBob3ZlckJvcmRlckNvbG9yOiAnaG92ZXI6Ym9yZGVyLXN0YXRlLWRlc3RydWN0aXZlLWFjdGl2ZScsXG4gICAgICBob3ZlckJnQ29sb3I6ICdob3ZlcjpiZy1zdGF0ZS1kZXN0cnVjdGl2ZS1ob3ZlcicsXG4gICAgICBzZWxlY3RlZEJvcmRlckNvbG9yOiAnIWJvcmRlci1zdGF0ZS1kZXN0cnVjdGl2ZS1zb2xpZCcsXG4gICAgICBzZWxlY3RlZEJnQ29sb3I6ICchYmctc3RhdGUtZGVzdHJ1Y3RpdmUtaG92ZXInLFxuICAgIH1cbiAgfVxuXG4gIGlmIChpc0VOVih2YXJpYWJsZXMpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvdmVyQm9yZGVyQ29sb3I6ICdob3Zlcjpib3JkZXItdXRpbC1jb2xvcnMtdmlvbGV0LXZpb2xldC0xMDAnLFxuICAgICAgaG92ZXJCZ0NvbG9yOiAnaG92ZXI6YmctdXRpbC1jb2xvcnMtdmlvbGV0LXZpb2xldC01MCcsXG4gICAgICBzZWxlY3RlZEJvcmRlckNvbG9yOiAnYm9yZGVyLXV0aWwtY29sb3JzLXZpb2xldC12aW9sZXQtNjAwJyxcbiAgICAgIHNlbGVjdGVkQmdDb2xvcjogJ2JnLXV0aWwtY29sb3JzLXZpb2xldC12aW9sZXQtNTAnLFxuICAgIH1cbiAgfVxuXG4gIGlmIChpc0NvbnZlcnNhdGlvblZhcih2YXJpYWJsZXMpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhvdmVyQm9yZGVyQ29sb3I6ICdob3Zlcjpib3JkZXItdXRpbC1jb2xvcnMtdGVhbC10ZWFsLTEwMCcsXG4gICAgICBob3ZlckJnQ29sb3I6ICdob3ZlcjpiZy11dGlsLWNvbG9ycy10ZWFsLXRlYWwtNTAnLFxuICAgICAgc2VsZWN0ZWRCb3JkZXJDb2xvcjogJ2JvcmRlci11dGlsLWNvbG9ycy10ZWFsLXRlYWwtNjAwJyxcbiAgICAgIHNlbGVjdGVkQmdDb2xvcjogJ2JnLXV0aWwtY29sb3JzLXRlYWwtdGVhbC01MCcsXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBob3ZlckJvcmRlckNvbG9yOiAnaG92ZXI6Ym9yZGVyLXN0YXRlLWFjY2VudC1hbHQnLFxuICAgIGhvdmVyQmdDb2xvcjogJ2hvdmVyOmJnLXN0YXRlLWFjY2VudC1ob3ZlcicsXG4gICAgc2VsZWN0ZWRCb3JkZXJDb2xvcjogJ2JvcmRlci1zdGF0ZS1hY2NlbnQtc29saWQnLFxuICAgIHNlbGVjdGVkQmdDb2xvcjogJ2JnLXN0YXRlLWFjY2VudC1ob3ZlcicsXG4gIH1cbn1cbiJdfQ==