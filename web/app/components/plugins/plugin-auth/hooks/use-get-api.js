"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetApi = void 0;
const types_1 = require("../types");
const useGetApi = ({ category = types_1.AuthCategory.tool, provider }) => {
    if (category === types_1.AuthCategory.tool) {
        return {
            getCredentialInfo: `/workspaces/current/tool-provider/builtin/${provider}/credential/info`,
            setDefaultCredential: `/workspaces/current/tool-provider/builtin/${provider}/default-credential`,
            getCredentials: `/workspaces/current/tool-provider/builtin/${provider}/credentials`,
            addCredential: `/workspaces/current/tool-provider/builtin/${provider}/add`,
            updateCredential: `/workspaces/current/tool-provider/builtin/${provider}/update`,
            deleteCredential: `/workspaces/current/tool-provider/builtin/${provider}/delete`,
            getCredentialSchema: (credential_type) => `/workspaces/current/tool-provider/builtin/${provider}/credential/schema/${credential_type}`,
            getOauthUrl: `/oauth/plugin/${provider}/tool/authorization-url`,
            getOauthClientSchema: `/workspaces/current/tool-provider/builtin/${provider}/oauth/client-schema`,
            setCustomOauthClient: `/workspaces/current/tool-provider/builtin/${provider}/oauth/custom-client`,
            getCustomOAuthClientValues: `/workspaces/current/tool-provider/builtin/${provider}/oauth/custom-client`,
            deleteCustomOAuthClient: `/workspaces/current/tool-provider/builtin/${provider}/oauth/custom-client`,
        };
    }
    if (category === types_1.AuthCategory.datasource) {
        return {
            getCredentialInfo: '',
            setDefaultCredential: `/auth/plugin/datasource/${provider}/default`,
            getCredentials: `/auth/plugin/datasource/${provider}`,
            addCredential: `/auth/plugin/datasource/${provider}`,
            updateCredential: `/auth/plugin/datasource/${provider}/update`,
            deleteCredential: `/auth/plugin/datasource/${provider}/delete`,
            getCredentialSchema: () => '',
            getOauthUrl: `/oauth/plugin/${provider}/datasource/get-authorization-url`,
            getOauthClientSchema: '',
            setCustomOauthClient: `/auth/plugin/datasource/${provider}/custom-client`,
            deleteCustomOAuthClient: `/auth/plugin/datasource/${provider}/custom-client`,
        };
    }
    return {
        getCredentialInfo: '',
        setDefaultCredential: '',
        getCredentials: '',
        addCredential: '',
        updateCredential: '',
        deleteCredential: '',
        getCredentialSchema: () => '',
        getOauthUrl: '',
        getOauthClientSchema: '',
        setCustomOauthClient: '',
        getCustomOAuthClientValues: '',
        deleteCustomOAuthClient: '',
    };
};
exports.useGetApi = useGetApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdldC1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtZ2V0LWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxvQ0FFaUI7QUFFVixNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLG9CQUFZLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBaUIsRUFBRSxFQUFFO0lBQ3JGLElBQUksUUFBUSxLQUFLLG9CQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsT0FBTztZQUNMLGlCQUFpQixFQUFFLDZDQUE2QyxRQUFRLGtCQUFrQjtZQUMxRixvQkFBb0IsRUFBRSw2Q0FBNkMsUUFBUSxxQkFBcUI7WUFDaEcsY0FBYyxFQUFFLDZDQUE2QyxRQUFRLGNBQWM7WUFDbkYsYUFBYSxFQUFFLDZDQUE2QyxRQUFRLE1BQU07WUFDMUUsZ0JBQWdCLEVBQUUsNkNBQTZDLFFBQVEsU0FBUztZQUNoRixnQkFBZ0IsRUFBRSw2Q0FBNkMsUUFBUSxTQUFTO1lBQ2hGLG1CQUFtQixFQUFFLENBQUMsZUFBbUMsRUFBRSxFQUFFLENBQUMsNkNBQTZDLFFBQVEsc0JBQXNCLGVBQWUsRUFBRTtZQUMxSixXQUFXLEVBQUUsaUJBQWlCLFFBQVEseUJBQXlCO1lBQy9ELG9CQUFvQixFQUFFLDZDQUE2QyxRQUFRLHNCQUFzQjtZQUNqRyxvQkFBb0IsRUFBRSw2Q0FBNkMsUUFBUSxzQkFBc0I7WUFDakcsMEJBQTBCLEVBQUUsNkNBQTZDLFFBQVEsc0JBQXNCO1lBQ3ZHLHVCQUF1QixFQUFFLDZDQUE2QyxRQUFRLHNCQUFzQjtTQUNyRyxDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksUUFBUSxLQUFLLG9CQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekMsT0FBTztZQUNMLGlCQUFpQixFQUFFLEVBQUU7WUFDckIsb0JBQW9CLEVBQUUsMkJBQTJCLFFBQVEsVUFBVTtZQUNuRSxjQUFjLEVBQUUsMkJBQTJCLFFBQVEsRUFBRTtZQUNyRCxhQUFhLEVBQUUsMkJBQTJCLFFBQVEsRUFBRTtZQUNwRCxnQkFBZ0IsRUFBRSwyQkFBMkIsUUFBUSxTQUFTO1lBQzlELGdCQUFnQixFQUFFLDJCQUEyQixRQUFRLFNBQVM7WUFDOUQsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtZQUM3QixXQUFXLEVBQUUsaUJBQWlCLFFBQVEsbUNBQW1DO1lBQ3pFLG9CQUFvQixFQUFFLEVBQUU7WUFDeEIsb0JBQW9CLEVBQUUsMkJBQTJCLFFBQVEsZ0JBQWdCO1lBQ3pFLHVCQUF1QixFQUFFLDJCQUEyQixRQUFRLGdCQUFnQjtTQUM3RSxDQUFBO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxpQkFBaUIsRUFBRSxFQUFFO1FBQ3JCLG9CQUFvQixFQUFFLEVBQUU7UUFDeEIsY0FBYyxFQUFFLEVBQUU7UUFDbEIsYUFBYSxFQUFFLEVBQUU7UUFDakIsZ0JBQWdCLEVBQUUsRUFBRTtRQUNwQixnQkFBZ0IsRUFBRSxFQUFFO1FBQ3BCLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUU7UUFDN0IsV0FBVyxFQUFFLEVBQUU7UUFDZixvQkFBb0IsRUFBRSxFQUFFO1FBQ3hCLG9CQUFvQixFQUFFLEVBQUU7UUFDeEIsMEJBQTBCLEVBQUUsRUFBRTtRQUM5Qix1QkFBdUIsRUFBRSxFQUFFO0tBQzVCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFoRFksUUFBQSxTQUFTLGFBZ0RyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQ3JlZGVudGlhbFR5cGVFbnVtLFxuICBQbHVnaW5QYXlsb2FkLFxufSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7XG4gIEF1dGhDYXRlZ29yeSxcbn0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VHZXRBcGkgPSAoeyBjYXRlZ29yeSA9IEF1dGhDYXRlZ29yeS50b29sLCBwcm92aWRlciB9OiBQbHVnaW5QYXlsb2FkKSA9PiB7XG4gIGlmIChjYXRlZ29yeSA9PT0gQXV0aENhdGVnb3J5LnRvb2wpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0Q3JlZGVudGlhbEluZm86IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsL2luZm9gLFxuICAgICAgc2V0RGVmYXVsdENyZWRlbnRpYWw6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9kZWZhdWx0LWNyZWRlbnRpYWxgLFxuICAgICAgZ2V0Q3JlZGVudGlhbHM6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsc2AsXG4gICAgICBhZGRDcmVkZW50aWFsOiBgL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL2J1aWx0aW4vJHtwcm92aWRlcn0vYWRkYCxcbiAgICAgIHVwZGF0ZUNyZWRlbnRpYWw6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS91cGRhdGVgLFxuICAgICAgZGVsZXRlQ3JlZGVudGlhbDogYC93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluLyR7cHJvdmlkZXJ9L2RlbGV0ZWAsXG4gICAgICBnZXRDcmVkZW50aWFsU2NoZW1hOiAoY3JlZGVudGlhbF90eXBlOiBDcmVkZW50aWFsVHlwZUVudW0pID0+IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsL3NjaGVtYS8ke2NyZWRlbnRpYWxfdHlwZX1gLFxuICAgICAgZ2V0T2F1dGhVcmw6IGAvb2F1dGgvcGx1Z2luLyR7cHJvdmlkZXJ9L3Rvb2wvYXV0aG9yaXphdGlvbi11cmxgLFxuICAgICAgZ2V0T2F1dGhDbGllbnRTY2hlbWE6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9vYXV0aC9jbGllbnQtc2NoZW1hYCxcbiAgICAgIHNldEN1c3RvbU9hdXRoQ2xpZW50OiBgL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL2J1aWx0aW4vJHtwcm92aWRlcn0vb2F1dGgvY3VzdG9tLWNsaWVudGAsXG4gICAgICBnZXRDdXN0b21PQXV0aENsaWVudFZhbHVlczogYC93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluLyR7cHJvdmlkZXJ9L29hdXRoL2N1c3RvbS1jbGllbnRgLFxuICAgICAgZGVsZXRlQ3VzdG9tT0F1dGhDbGllbnQ6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8ke3Byb3ZpZGVyfS9vYXV0aC9jdXN0b20tY2xpZW50YCxcbiAgICB9XG4gIH1cblxuICBpZiAoY2F0ZWdvcnkgPT09IEF1dGhDYXRlZ29yeS5kYXRhc291cmNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldENyZWRlbnRpYWxJbmZvOiAnJyxcbiAgICAgIHNldERlZmF1bHRDcmVkZW50aWFsOiBgL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvJHtwcm92aWRlcn0vZGVmYXVsdGAsXG4gICAgICBnZXRDcmVkZW50aWFsczogYC9hdXRoL3BsdWdpbi9kYXRhc291cmNlLyR7cHJvdmlkZXJ9YCxcbiAgICAgIGFkZENyZWRlbnRpYWw6IGAvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS8ke3Byb3ZpZGVyfWAsXG4gICAgICB1cGRhdGVDcmVkZW50aWFsOiBgL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvJHtwcm92aWRlcn0vdXBkYXRlYCxcbiAgICAgIGRlbGV0ZUNyZWRlbnRpYWw6IGAvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS8ke3Byb3ZpZGVyfS9kZWxldGVgLFxuICAgICAgZ2V0Q3JlZGVudGlhbFNjaGVtYTogKCkgPT4gJycsXG4gICAgICBnZXRPYXV0aFVybDogYC9vYXV0aC9wbHVnaW4vJHtwcm92aWRlcn0vZGF0YXNvdXJjZS9nZXQtYXV0aG9yaXphdGlvbi11cmxgLFxuICAgICAgZ2V0T2F1dGhDbGllbnRTY2hlbWE6ICcnLFxuICAgICAgc2V0Q3VzdG9tT2F1dGhDbGllbnQ6IGAvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS8ke3Byb3ZpZGVyfS9jdXN0b20tY2xpZW50YCxcbiAgICAgIGRlbGV0ZUN1c3RvbU9BdXRoQ2xpZW50OiBgL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvJHtwcm92aWRlcn0vY3VzdG9tLWNsaWVudGAsXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRDcmVkZW50aWFsSW5mbzogJycsXG4gICAgc2V0RGVmYXVsdENyZWRlbnRpYWw6ICcnLFxuICAgIGdldENyZWRlbnRpYWxzOiAnJyxcbiAgICBhZGRDcmVkZW50aWFsOiAnJyxcbiAgICB1cGRhdGVDcmVkZW50aWFsOiAnJyxcbiAgICBkZWxldGVDcmVkZW50aWFsOiAnJyxcbiAgICBnZXRDcmVkZW50aWFsU2NoZW1hOiAoKSA9PiAnJyxcbiAgICBnZXRPYXV0aFVybDogJycsXG4gICAgZ2V0T2F1dGhDbGllbnRTY2hlbWE6ICcnLFxuICAgIHNldEN1c3RvbU9hdXRoQ2xpZW50OiAnJyxcbiAgICBnZXRDdXN0b21PQXV0aENsaWVudFZhbHVlczogJycsXG4gICAgZGVsZXRlQ3VzdG9tT0F1dGhDbGllbnQ6ICcnLFxuICB9XG59XG4iXX0=