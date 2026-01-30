"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/block-selector/types");
const types_2 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const types_3 = require("./types");
const metaData = (0, utils_1.genNodeMetaData)({
    classification: types_1.BlockClassificationEnum.Utilities,
    sort: 1,
    type: types_2.BlockEnum.HttpRequest,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        variables: [],
        method: types_3.Method.get,
        url: '',
        authorization: {
            type: types_3.AuthorizationType.none,
            config: null,
        },
        headers: '',
        params: '',
        body: {
            type: types_3.BodyType.none,
            data: [],
        },
        ssl_verify: true,
        timeout: {
            max_connect_timeout: 0,
            max_read_timeout: 0,
            max_write_timeout: 0,
        },
        retry_config: {
            retry_enabled: true,
            max_retries: 3,
            retry_interval: 100,
        },
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages && !payload.url)
            errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.http.api', { ns: 'workflow' }) });
        if (!errorMessages
            && payload.body.type === types_3.BodyType.binary
            && ((!payload.body.data[0]?.file) || payload.body.data[0]?.file?.length === 0)) {
            errorMessages = t('errorMsg.fieldRequired', { ns: 'workflow', field: t('nodes.http.binaryFileVariable', { ns: 'workflow' }) });
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwRUFBd0Y7QUFDeEYsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUNqRSxtQ0FBNkQ7QUFFN0QsTUFBTSxRQUFRLEdBQUcsSUFBQSx1QkFBZSxFQUFDO0lBQy9CLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxTQUFTO0lBQ2pELElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxFQUFFLGlCQUFTLENBQUMsV0FBVztDQUM1QixDQUFDLENBQUE7QUFDRixNQUFNLFdBQVcsR0FBOEI7SUFDN0MsUUFBUTtJQUNSLFlBQVksRUFBRTtRQUNaLFNBQVMsRUFBRSxFQUFFO1FBQ2IsTUFBTSxFQUFFLGNBQU0sQ0FBQyxHQUFHO1FBQ2xCLEdBQUcsRUFBRSxFQUFFO1FBQ1AsYUFBYSxFQUFFO1lBQ2IsSUFBSSxFQUFFLHlCQUFpQixDQUFDLElBQUk7WUFDNUIsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUNELE9BQU8sRUFBRSxFQUFFO1FBQ1gsTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixJQUFJLEVBQUUsZ0JBQVEsQ0FBQyxJQUFJO1lBQ25CLElBQUksRUFBRSxFQUFFO1NBQ1Q7UUFDRCxVQUFVLEVBQUUsSUFBSTtRQUNoQixPQUFPLEVBQUU7WUFDUCxtQkFBbUIsRUFBRSxDQUFDO1lBQ3RCLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQjtRQUNELFlBQVksRUFBRTtZQUNaLGFBQWEsRUFBRSxJQUFJO1lBQ25CLFdBQVcsRUFBRSxDQUFDO1lBQ2QsY0FBYyxFQUFFLEdBQUc7U0FDcEI7S0FDRjtJQUNELFVBQVUsQ0FBQyxPQUFxQixFQUFFLENBQU07UUFDdEMsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFBO1FBRXRCLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztZQUNoQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWpILElBQUksQ0FBQyxhQUFhO2VBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssZ0JBQVEsQ0FBQyxNQUFNO2VBQ3JDLENBQUMsQ0FBQyxDQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFDaEgsQ0FBQztZQUNELGFBQWEsR0FBRyxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsK0JBQStCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEksQ0FBQztRQUVELE9BQU87WUFDTCxPQUFPLEVBQUUsQ0FBQyxhQUFhO1lBQ3ZCLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgQm9keVBheWxvYWQsIEh0dHBOb2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgZ2VuTm9kZU1ldGFEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91dGlscydcbmltcG9ydCB7IEF1dGhvcml6YXRpb25UeXBlLCBCb2R5VHlwZSwgTWV0aG9kIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgbWV0YURhdGEgPSBnZW5Ob2RlTWV0YURhdGEoe1xuICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVXRpbGl0aWVzLFxuICBzb3J0OiAxLFxuICB0eXBlOiBCbG9ja0VudW0uSHR0cFJlcXVlc3QsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PEh0dHBOb2RlVHlwZT4gPSB7XG4gIG1ldGFEYXRhLFxuICBkZWZhdWx0VmFsdWU6IHtcbiAgICB2YXJpYWJsZXM6IFtdLFxuICAgIG1ldGhvZDogTWV0aG9kLmdldCxcbiAgICB1cmw6ICcnLFxuICAgIGF1dGhvcml6YXRpb246IHtcbiAgICAgIHR5cGU6IEF1dGhvcml6YXRpb25UeXBlLm5vbmUsXG4gICAgICBjb25maWc6IG51bGwsXG4gICAgfSxcbiAgICBoZWFkZXJzOiAnJyxcbiAgICBwYXJhbXM6ICcnLFxuICAgIGJvZHk6IHtcbiAgICAgIHR5cGU6IEJvZHlUeXBlLm5vbmUsXG4gICAgICBkYXRhOiBbXSxcbiAgICB9LFxuICAgIHNzbF92ZXJpZnk6IHRydWUsXG4gICAgdGltZW91dDoge1xuICAgICAgbWF4X2Nvbm5lY3RfdGltZW91dDogMCxcbiAgICAgIG1heF9yZWFkX3RpbWVvdXQ6IDAsXG4gICAgICBtYXhfd3JpdGVfdGltZW91dDogMCxcbiAgICB9LFxuICAgIHJldHJ5X2NvbmZpZzoge1xuICAgICAgcmV0cnlfZW5hYmxlZDogdHJ1ZSxcbiAgICAgIG1heF9yZXRyaWVzOiAzLFxuICAgICAgcmV0cnlfaW50ZXJ2YWw6IDEwMCxcbiAgICB9LFxuICB9LFxuICBjaGVja1ZhbGlkKHBheWxvYWQ6IEh0dHBOb2RlVHlwZSwgdDogYW55KSB7XG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICFwYXlsb2FkLnVybClcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KCdlcnJvck1zZy5maWVsZFJlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JywgZmllbGQ6IHQoJ25vZGVzLmh0dHAuYXBpJywgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzXG4gICAgICAmJiBwYXlsb2FkLmJvZHkudHlwZSA9PT0gQm9keVR5cGUuYmluYXJ5XG4gICAgICAmJiAoKCEocGF5bG9hZC5ib2R5LmRhdGEgYXMgQm9keVBheWxvYWQpWzBdPy5maWxlKSB8fCAocGF5bG9hZC5ib2R5LmRhdGEgYXMgQm9keVBheWxvYWQpWzBdPy5maWxlPy5sZW5ndGggPT09IDApXG4gICAgKSB7XG4gICAgICBlcnJvck1lc3NhZ2VzID0gdCgnZXJyb3JNc2cuZmllbGRSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdub2Rlcy5odHRwLmJpbmFyeUZpbGVWYXJpYWJsZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaXNWYWxpZDogIWVycm9yTWVzc2FnZXMsXG4gICAgICBlcnJvck1lc3NhZ2U6IGVycm9yTWVzc2FnZXMsXG4gICAgfVxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlRGVmYXVsdFxuIl19