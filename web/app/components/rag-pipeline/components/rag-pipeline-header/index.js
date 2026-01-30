"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const header_1 = require("@/app/components/workflow/header");
const store_1 = require("@/app/components/workflow/store");
const input_field_button_1 = require("./input-field-button");
const publisher_1 = require("./publisher");
const run_mode_1 = require("./run-mode");
const RagPipelineHeader = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const showDebugAndPreviewPanel = (0, store_1.useStore)(s => s.showDebugAndPreviewPanel);
    const viewHistoryProps = (0, react_1.useMemo)(() => {
        return {
            historyUrl: `/rag/pipelines/${pipelineId}/workflow-runs`,
        };
    }, [pipelineId]);
    const headerProps = (0, react_1.useMemo)(() => {
        return {
            normal: {
                components: {
                    left: <input_field_button_1.default />,
                    middle: <publisher_1.default />,
                },
                runAndHistoryProps: {
                    showRunButton: true,
                    viewHistoryProps,
                    components: {
                        RunMode: run_mode_1.default,
                    },
                },
            },
            viewHistory: {
                viewHistoryProps,
            },
        };
    }, [viewHistoryProps, showDebugAndPreviewPanel, t]);
    return (<header_1.default {...headerProps}/>);
};
exports.default = (0, react_1.memo)(RagPipelineHeader);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FHYztBQUNkLGlEQUE4QztBQUM5Qyw2REFBcUQ7QUFDckQsMkRBRXdDO0FBQ3hDLDZEQUFtRDtBQUNuRCwyQ0FBbUM7QUFDbkMseUNBQWdDO0FBRWhDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDOUMsTUFBTSx3QkFBd0IsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtJQUUxRSxNQUFNLGdCQUFnQixHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNwQyxPQUFPO1lBQ0wsVUFBVSxFQUFFLGtCQUFrQixVQUFVLGdCQUFnQjtTQUN6RCxDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtJQUVoQixNQUFNLFdBQVcsR0FBZ0IsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzVDLE9BQU87WUFDTCxNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFO29CQUNWLElBQUksRUFBRSxDQUFDLDRCQUFnQixDQUFDLEFBQUQsRUFBRztvQkFDMUIsTUFBTSxFQUFFLENBQUMsbUJBQVMsQ0FBQyxBQUFELEVBQUc7aUJBQ3RCO2dCQUNELGtCQUFrQixFQUFFO29CQUNsQixhQUFhLEVBQUUsSUFBSTtvQkFDbkIsZ0JBQWdCO29CQUNoQixVQUFVLEVBQUU7d0JBQ1YsT0FBTyxFQUFQLGtCQUFPO3FCQUNSO2lCQUNGO2FBQ0Y7WUFDRCxXQUFXLEVBQUU7Z0JBQ1gsZ0JBQWdCO2FBQ2pCO1NBQ0YsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFbkQsT0FBTyxDQUNMLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxFQUFHLENBQzVCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQyxpQkFBaUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBIZWFkZXJQcm9wcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaGVhZGVyJ1xuaW1wb3J0IHtcbiAgbWVtbyxcbiAgdXNlTWVtbyxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgSGVhZGVyIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaGVhZGVyJ1xuaW1wb3J0IHtcbiAgdXNlU3RvcmUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgSW5wdXRGaWVsZEJ1dHRvbiBmcm9tICcuL2lucHV0LWZpZWxkLWJ1dHRvbidcbmltcG9ydCBQdWJsaXNoZXIgZnJvbSAnLi9wdWJsaXNoZXInXG5pbXBvcnQgUnVuTW9kZSBmcm9tICcuL3J1bi1tb2RlJ1xuXG5jb25zdCBSYWdQaXBlbGluZUhlYWRlciA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHBpcGVsaW5lSWQgPSB1c2VTdG9yZShzID0+IHMucGlwZWxpbmVJZClcbiAgY29uc3Qgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsID0gdXNlU3RvcmUocyA9PiBzLnNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbClcblxuICBjb25zdCB2aWV3SGlzdG9yeVByb3BzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhpc3RvcnlVcmw6IGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93LXJ1bnNgLFxuICAgIH1cbiAgfSwgW3BpcGVsaW5lSWRdKVxuXG4gIGNvbnN0IGhlYWRlclByb3BzOiBIZWFkZXJQcm9wcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBub3JtYWw6IHtcbiAgICAgICAgY29tcG9uZW50czoge1xuICAgICAgICAgIGxlZnQ6IDxJbnB1dEZpZWxkQnV0dG9uIC8+LFxuICAgICAgICAgIG1pZGRsZTogPFB1Ymxpc2hlciAvPixcbiAgICAgICAgfSxcbiAgICAgICAgcnVuQW5kSGlzdG9yeVByb3BzOiB7XG4gICAgICAgICAgc2hvd1J1bkJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICB2aWV3SGlzdG9yeVByb3BzLFxuICAgICAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgICAgIFJ1bk1vZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB2aWV3SGlzdG9yeToge1xuICAgICAgICB2aWV3SGlzdG9yeVByb3BzLFxuICAgICAgfSxcbiAgICB9XG4gIH0sIFt2aWV3SGlzdG9yeVByb3BzLCBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWwsIHRdKVxuXG4gIHJldHVybiAoXG4gICAgPEhlYWRlciB7Li4uaGVhZGVyUHJvcHN9IC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSYWdQaXBlbGluZUhlYWRlcilcbiJdfQ==