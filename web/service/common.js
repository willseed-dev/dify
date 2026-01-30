"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDefaultModal = exports.getPayUrl = exports.deleteModelProviderModel = exports.setModelProviderModel = exports.changeModelProviderPriority = exports.deleteModelProvider = exports.setModelProvider = exports.validateModelLoadBalancingCredentials = exports.validateModelProvider = exports.fetchModelList = exports.fetchModelProviderModelList = exports.fetchModelLoadBalancingConfig = exports.fetchModelProviderCredentials = exports.fetchModelProviders = exports.activateMember = exports.invitationCheck = exports.updatePluginProviderAIKey = exports.validatePluginProviderKey = exports.fetchPluginProviders = exports.updateDataSourceNotionAction = exports.syncDataSourceNotion = exports.fetchDataSource = exports.updateWorkspaceInfo = exports.switchWorkspace = exports.fetchWorkspaces = exports.updateCurrentWorkspace = exports.fetchCurrentWorkspace = exports.fetchFilePreview = exports.ownershipTransfer = exports.verifyOwnerEmail = exports.sendOwnerEmail = exports.deleteMemberOrCancelInvitation = exports.updateMemberRole = exports.inviteMember = exports.fetchAccountIntegrates = exports.updateProviderAIKey = exports.validateProviderKey = exports.fetchProviders = exports.fetchMembers = exports.oneMoreStep = exports.oauth = exports.fetchLangGeniusVersion = exports.updateUserProfile = exports.fetchUserProfile = exports.fetchSetupStatus = exports.fetchInitValidateStatus = exports.initValidate = exports.setup = exports.webAppLogin = exports.login = void 0;
exports.checkEmailExisted = exports.resetEmail = exports.verifyEmail = exports.sendVerifyCode = exports.getDocDownloadUrl = exports.submitDeleteAccountFeedback = exports.verifyDeleteAccountCode = exports.sendDeleteAccountCode = exports.verifyWebAppResetPasswordCode = exports.sendWebAppResetPasswordCode = exports.webAppEmailLoginWithCode = exports.sendWebAppEMailLoginCode = exports.verifyResetPasswordCode = exports.sendResetPasswordCode = exports.emailLoginWithCode = exports.sendEMailLoginCode = exports.uploadRemoteFileInfo = exports.changeWebAppPasswordWithToken = exports.verifyWebAppForgotPasswordToken = exports.sendWebAppForgotPasswordEmail = exports.changePasswordWithToken = exports.verifyForgotPasswordToken = exports.sendForgotPasswordEmail = exports.disableModel = exports.enableModel = exports.getSystemFeatures = exports.fetchSupportRetrievalMethods = exports.moderate = exports.fetchCodeBasedExtensionList = exports.deleteApiBasedExtension = exports.updateApiBasedExtension = exports.addApiBasedExtension = exports.fetchApiBasedExtensionDetail = exports.fetchApiBasedExtensionList = exports.fetchDataSourceNotionBinding = exports.fetchNotionConnection = exports.fetchFileUploadConfig = exports.fetchModelParameterRules = exports.updateDefaultModel = void 0;
const base_1 = require("./base");
const login = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.login = login;
const webAppLogin = ({ url, body }) => {
    return (0, base_1.post)(url, { body }, { isPublicAPI: true });
};
exports.webAppLogin = webAppLogin;
const setup = ({ body }) => {
    return (0, base_1.post)('/setup', { body });
};
exports.setup = setup;
const initValidate = ({ body }) => {
    return (0, base_1.post)('/init', { body });
};
exports.initValidate = initValidate;
const fetchInitValidateStatus = () => {
    return (0, base_1.get)('/init');
};
exports.fetchInitValidateStatus = fetchInitValidateStatus;
const fetchSetupStatus = () => {
    return (0, base_1.get)('/setup');
};
exports.fetchSetupStatus = fetchSetupStatus;
const fetchUserProfile = ({ url, params }) => {
    return (0, base_1.get)(url, params, { needAllResponseContent: true });
};
exports.fetchUserProfile = fetchUserProfile;
const updateUserProfile = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateUserProfile = updateUserProfile;
const fetchLangGeniusVersion = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.fetchLangGeniusVersion = fetchLangGeniusVersion;
const oauth = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.oauth = oauth;
const oneMoreStep = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.oneMoreStep = oneMoreStep;
const fetchMembers = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.fetchMembers = fetchMembers;
const fetchProviders = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.fetchProviders = fetchProviders;
const validateProviderKey = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.validateProviderKey = validateProviderKey;
const updateProviderAIKey = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateProviderAIKey = updateProviderAIKey;
const fetchAccountIntegrates = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.fetchAccountIntegrates = fetchAccountIntegrates;
const inviteMember = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.inviteMember = inviteMember;
const updateMemberRole = ({ url, body }) => {
    return (0, base_1.put)(url, { body });
};
exports.updateMemberRole = updateMemberRole;
const deleteMemberOrCancelInvitation = ({ url }) => {
    return (0, base_1.del)(url);
};
exports.deleteMemberOrCancelInvitation = deleteMemberOrCancelInvitation;
const sendOwnerEmail = (body) => (0, base_1.post)('/workspaces/current/members/send-owner-transfer-confirm-email', { body });
exports.sendOwnerEmail = sendOwnerEmail;
const verifyOwnerEmail = (body) => (0, base_1.post)('/workspaces/current/members/owner-transfer-check', { body });
exports.verifyOwnerEmail = verifyOwnerEmail;
const ownershipTransfer = (memberID, body) => (0, base_1.post)(`/workspaces/current/members/${memberID}/owner-transfer`, { body });
exports.ownershipTransfer = ownershipTransfer;
const fetchFilePreview = ({ fileID }) => {
    return (0, base_1.get)(`/files/${fileID}/preview`);
};
exports.fetchFilePreview = fetchFilePreview;
const fetchCurrentWorkspace = ({ url, params }) => {
    return (0, base_1.post)(url, { body: params });
};
exports.fetchCurrentWorkspace = fetchCurrentWorkspace;
const updateCurrentWorkspace = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateCurrentWorkspace = updateCurrentWorkspace;
const fetchWorkspaces = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.fetchWorkspaces = fetchWorkspaces;
const switchWorkspace = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.switchWorkspace = switchWorkspace;
const updateWorkspaceInfo = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateWorkspaceInfo = updateWorkspaceInfo;
const fetchDataSource = ({ url }) => {
    return (0, base_1.get)(url);
};
exports.fetchDataSource = fetchDataSource;
const syncDataSourceNotion = ({ url }) => {
    return (0, base_1.get)(url);
};
exports.syncDataSourceNotion = syncDataSourceNotion;
const updateDataSourceNotionAction = ({ url }) => {
    return (0, base_1.patch)(url);
};
exports.updateDataSourceNotionAction = updateDataSourceNotionAction;
const fetchPluginProviders = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchPluginProviders = fetchPluginProviders;
const validatePluginProviderKey = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.validatePluginProviderKey = validatePluginProviderKey;
const updatePluginProviderAIKey = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updatePluginProviderAIKey = updatePluginProviderAIKey;
const invitationCheck = ({ url, params }) => {
    return (0, base_1.get)(url, { params });
};
exports.invitationCheck = invitationCheck;
const activateMember = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.activateMember = activateMember;
const fetchModelProviders = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelProviders = fetchModelProviders;
const fetchModelProviderCredentials = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelProviderCredentials = fetchModelProviderCredentials;
const fetchModelLoadBalancingConfig = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelLoadBalancingConfig = fetchModelLoadBalancingConfig;
const fetchModelProviderModelList = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelProviderModelList = fetchModelProviderModelList;
const fetchModelList = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelList = fetchModelList;
const validateModelProvider = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.validateModelProvider = validateModelProvider;
const validateModelLoadBalancingCredentials = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.validateModelLoadBalancingCredentials = validateModelLoadBalancingCredentials;
const setModelProvider = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.setModelProvider = setModelProvider;
const deleteModelProvider = ({ url, body }) => {
    return (0, base_1.del)(url, { body });
};
exports.deleteModelProvider = deleteModelProvider;
const changeModelProviderPriority = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.changeModelProviderPriority = changeModelProviderPriority;
const setModelProviderModel = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.setModelProviderModel = setModelProviderModel;
const deleteModelProviderModel = ({ url }) => {
    return (0, base_1.del)(url);
};
exports.deleteModelProviderModel = deleteModelProviderModel;
const getPayUrl = (url) => {
    return (0, base_1.get)(url);
};
exports.getPayUrl = getPayUrl;
const fetchDefaultModal = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchDefaultModal = fetchDefaultModal;
const updateDefaultModel = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateDefaultModel = updateDefaultModel;
const fetchModelParameterRules = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchModelParameterRules = fetchModelParameterRules;
const fetchFileUploadConfig = ({ url }) => {
    return (0, base_1.get)(url);
};
exports.fetchFileUploadConfig = fetchFileUploadConfig;
const fetchNotionConnection = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchNotionConnection = fetchNotionConnection;
const fetchDataSourceNotionBinding = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchDataSourceNotionBinding = fetchDataSourceNotionBinding;
const fetchApiBasedExtensionList = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchApiBasedExtensionList = fetchApiBasedExtensionList;
const fetchApiBasedExtensionDetail = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchApiBasedExtensionDetail = fetchApiBasedExtensionDetail;
const addApiBasedExtension = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.addApiBasedExtension = addApiBasedExtension;
const updateApiBasedExtension = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.updateApiBasedExtension = updateApiBasedExtension;
const deleteApiBasedExtension = (url) => {
    return (0, base_1.del)(url);
};
exports.deleteApiBasedExtension = deleteApiBasedExtension;
const fetchCodeBasedExtensionList = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchCodeBasedExtensionList = fetchCodeBasedExtensionList;
const moderate = (url, body) => {
    return (0, base_1.post)(url, { body });
};
exports.moderate = moderate;
const fetchSupportRetrievalMethods = (url) => {
    return (0, base_1.get)(url);
};
exports.fetchSupportRetrievalMethods = fetchSupportRetrievalMethods;
const getSystemFeatures = () => {
    return (0, base_1.get)('/system-features');
};
exports.getSystemFeatures = getSystemFeatures;
const enableModel = (url, body) => (0, base_1.patch)(url, { body });
exports.enableModel = enableModel;
const disableModel = (url, body) => (0, base_1.patch)(url, { body });
exports.disableModel = disableModel;
const sendForgotPasswordEmail = ({ url, body }) => (0, base_1.post)(url, { body });
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
const verifyForgotPasswordToken = ({ url, body }) => {
    return (0, base_1.post)(url, { body });
};
exports.verifyForgotPasswordToken = verifyForgotPasswordToken;
const changePasswordWithToken = ({ url, body }) => (0, base_1.post)(url, { body });
exports.changePasswordWithToken = changePasswordWithToken;
const sendWebAppForgotPasswordEmail = ({ url, body }) => (0, base_1.post)(url, { body }, { isPublicAPI: true });
exports.sendWebAppForgotPasswordEmail = sendWebAppForgotPasswordEmail;
const verifyWebAppForgotPasswordToken = ({ url, body }) => {
    return (0, base_1.post)(url, { body }, { isPublicAPI: true });
};
exports.verifyWebAppForgotPasswordToken = verifyWebAppForgotPasswordToken;
const changeWebAppPasswordWithToken = ({ url, body }) => (0, base_1.post)(url, { body }, { isPublicAPI: true });
exports.changeWebAppPasswordWithToken = changeWebAppPasswordWithToken;
const uploadRemoteFileInfo = (url, isPublic, silent) => {
    return (0, base_1.post)('/remote-files/upload', { body: { url } }, { isPublicAPI: isPublic, silent });
};
exports.uploadRemoteFileInfo = uploadRemoteFileInfo;
const sendEMailLoginCode = (email, language = 'en-US') => (0, base_1.post)('/email-code-login', { body: { email, language } });
exports.sendEMailLoginCode = sendEMailLoginCode;
const emailLoginWithCode = (data) => (0, base_1.post)('/email-code-login/validity', { body: data });
exports.emailLoginWithCode = emailLoginWithCode;
const sendResetPasswordCode = (email, language = 'en-US') => (0, base_1.post)('/forgot-password', { body: { email, language } });
exports.sendResetPasswordCode = sendResetPasswordCode;
const verifyResetPasswordCode = (body) => (0, base_1.post)('/forgot-password/validity', { body });
exports.verifyResetPasswordCode = verifyResetPasswordCode;
const sendWebAppEMailLoginCode = (email, language = 'en-US') => (0, base_1.post)('/email-code-login', { body: { email, language } }, { isPublicAPI: true });
exports.sendWebAppEMailLoginCode = sendWebAppEMailLoginCode;
const webAppEmailLoginWithCode = (data) => (0, base_1.post)('/email-code-login/validity', { body: data }, { isPublicAPI: true });
exports.webAppEmailLoginWithCode = webAppEmailLoginWithCode;
const sendWebAppResetPasswordCode = (email, language = 'en-US') => (0, base_1.post)('/forgot-password', { body: { email, language } }, { isPublicAPI: true });
exports.sendWebAppResetPasswordCode = sendWebAppResetPasswordCode;
const verifyWebAppResetPasswordCode = (body) => (0, base_1.post)('/forgot-password/validity', { body }, { isPublicAPI: true });
exports.verifyWebAppResetPasswordCode = verifyWebAppResetPasswordCode;
const sendDeleteAccountCode = () => (0, base_1.get)('/account/delete/verify');
exports.sendDeleteAccountCode = sendDeleteAccountCode;
const verifyDeleteAccountCode = (body) => (0, base_1.post)('/account/delete', { body });
exports.verifyDeleteAccountCode = verifyDeleteAccountCode;
const submitDeleteAccountFeedback = (body) => (0, base_1.post)('/account/delete/feedback', { body });
exports.submitDeleteAccountFeedback = submitDeleteAccountFeedback;
const getDocDownloadUrl = (doc_name) => (0, base_1.get)('/compliance/download', { params: { doc_name } }, { silent: true });
exports.getDocDownloadUrl = getDocDownloadUrl;
const sendVerifyCode = (body) => (0, base_1.post)('/account/change-email', { body });
exports.sendVerifyCode = sendVerifyCode;
const verifyEmail = (body) => (0, base_1.post)('/account/change-email/validity', { body });
exports.verifyEmail = verifyEmail;
const resetEmail = (body) => (0, base_1.post)('/account/change-email/reset', { body });
exports.resetEmail = resetEmail;
const checkEmailExisted = (body) => (0, base_1.post)('/account/change-email/check-email-unique', { body }, { silent: true });
exports.checkEmailExisted = checkEmailExisted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFxQ0EsaUNBQW1EO0FBYTVDLE1BQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUE4QyxFQUEwQixFQUFFO0lBQ3pHLE9BQU8sSUFBQSxXQUFJLEVBQWdCLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDM0MsQ0FBQyxDQUFBO0FBRlksUUFBQSxLQUFLLFNBRWpCO0FBQ00sTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQThDLEVBQTBCLEVBQUU7SUFDL0csT0FBTyxJQUFBLFdBQUksRUFBZ0IsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUNsRSxDQUFDLENBQUE7QUFGWSxRQUFBLFdBQVcsZUFFdkI7QUFFTSxNQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFpQyxFQUEyQixFQUFFO0lBQ3hGLE9BQU8sSUFBQSxXQUFJLEVBQWlCLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7QUFDakQsQ0FBQyxDQUFBO0FBRlksUUFBQSxLQUFLLFNBRWpCO0FBRU0sTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBaUMsRUFBMkIsRUFBRTtJQUMvRixPQUFPLElBQUEsV0FBSSxFQUFpQixPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ2hELENBQUMsQ0FBQTtBQUZZLFFBQUEsWUFBWSxnQkFFeEI7QUFFTSxNQUFNLHVCQUF1QixHQUFHLEdBQXdDLEVBQUU7SUFDL0UsT0FBTyxJQUFBLFVBQUcsRUFBNkIsT0FBTyxDQUFDLENBQUE7QUFDakQsQ0FBQyxDQUFBO0FBRlksUUFBQSx1QkFBdUIsMkJBRW5DO0FBRU0sTUFBTSxnQkFBZ0Is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QTtBQURqRixRQUFBLGlCQUFpQixxQkFDZ0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIERlZmF1bHRNb2RlbFJlc3BvbnNlLFxuICBNb2RlbCxcbiAgTW9kZWxJdGVtLFxuICBNb2RlbExvYWRCYWxhbmNpbmdDb25maWcsXG4gIE1vZGVsUGFyYW1ldGVyUnVsZSxcbiAgTW9kZWxQcm92aWRlcixcbiAgTW9kZWxUeXBlRW51bSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUge1xuICBVcGRhdGVPcGVuQUlLZXlSZXNwb25zZSxcbiAgVmFsaWRhdGVPcGVuQUlLZXlSZXNwb25zZSxcbn0gZnJvbSAnQC9tb2RlbHMvYXBwJ1xuaW1wb3J0IHR5cGUge1xuICBBY2NvdW50SW50ZWdyYXRlLFxuICBBcGlCYXNlZEV4dGVuc2lvbixcbiAgQ29kZUJhc2VkRXh0ZW5zaW9uLFxuICBDb21tb25SZXNwb25zZSxcbiAgRGF0YVNvdXJjZU5vdGlvbixcbiAgRmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlLFxuICBJQ3VycmVudFdvcmtzcGFjZSxcbiAgSW5pdFZhbGlkYXRlU3RhdHVzUmVzcG9uc2UsXG4gIEludml0YXRpb25SZXNwb25zZSxcbiAgSVdvcmtzcGFjZSxcbiAgTGFuZ0dlbml1c1ZlcnNpb25SZXNwb25zZSxcbiAgTWVtYmVyLFxuICBNb2RlcmF0ZVJlc3BvbnNlLFxuICBPYXV0aFJlc3BvbnNlLFxuICBQbHVnaW5Qcm92aWRlcixcbiAgUHJvdmlkZXIsXG4gIFByb3ZpZGVyQW50aHJvcGljVG9rZW4sXG4gIFByb3ZpZGVyQXp1cmVUb2tlbixcbiAgU2V0dXBTdGF0dXNSZXNwb25zZSxcbiAgVXNlclByb2ZpbGVPcmlnaW5SZXNwb25zZSxcbn0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB0eXBlIHsgU3lzdGVtRmVhdHVyZXMgfSBmcm9tICdAL3R5cGVzL2ZlYXR1cmUnXG5pbXBvcnQgeyBkZWwsIGdldCwgcGF0Y2gsIHBvc3QsIHB1dCB9IGZyb20gJy4vYmFzZSdcblxudHlwZSBMb2dpblN1Y2Nlc3MgPSB7XG4gIHJlc3VsdDogJ3N1Y2Nlc3MnXG4gIGRhdGE/OiB7IGFjY2Vzc190b2tlbj86IHN0cmluZyB9XG59XG50eXBlIExvZ2luRmFpbCA9IHtcbiAgcmVzdWx0OiAnZmFpbCdcbiAgZGF0YTogc3RyaW5nXG4gIGNvZGU6IHN0cmluZ1xuICBtZXNzYWdlOiBzdHJpbmdcbn1cbnR5cGUgTG9naW5SZXNwb25zZSA9IExvZ2luU3VjY2VzcyB8IExvZ2luRmFpbFxuZXhwb3J0IGNvbnN0IGxvZ2luID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IFJlY29yZDxzdHJpbmcsIGFueT4gfSk6IFByb21pc2U8TG9naW5SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxMb2dpblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuZXhwb3J0IGNvbnN0IHdlYkFwcExvZ2luID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IFJlY29yZDxzdHJpbmcsIGFueT4gfSk6IFByb21pc2U8TG9naW5SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxMb2dpblJlc3BvbnNlPih1cmwsIHsgYm9keSB9LCB7IGlzUHVibGljQVBJOiB0cnVlIH0pXG59XG5cbmV4cG9ydCBjb25zdCBzZXR1cCA9ICh7IGJvZHkgfTogeyBib2R5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlPignL3NldHVwJywgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBpbml0VmFsaWRhdGUgPSAoeyBib2R5IH06IHsgYm9keTogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxDb21tb25SZXNwb25zZT4oJy9pbml0JywgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaEluaXRWYWxpZGF0ZVN0YXR1cyA9ICgpOiBQcm9taXNlPEluaXRWYWxpZGF0ZVN0YXR1c1Jlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBnZXQ8SW5pdFZhbGlkYXRlU3RhdHVzUmVzcG9uc2U+KCcvaW5pdCcpXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaFNldHVwU3RhdHVzID0gKCk6IFByb21pc2U8U2V0dXBTdGF0dXNSZXNwb25zZT4gPT4ge1xuICByZXR1cm4gZ2V0PFNldHVwU3RhdHVzUmVzcG9uc2U+KCcvc2V0dXAnKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hVc2VyUHJvZmlsZSA9ICh7IHVybCwgcGFyYW1zIH06IHsgdXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTxVc2VyUHJvZmlsZU9yaWdpblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBnZXQ8VXNlclByb2ZpbGVPcmlnaW5SZXNwb25zZT4odXJsLCBwYXJhbXMsIHsgbmVlZEFsbFJlc3BvbnNlQ29udGVudDogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlVXNlclByb2ZpbGUgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxDb21tb25SZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoTGFuZ0dlbml1c1ZlcnNpb24gPSAoeyB1cmwsIHBhcmFtcyB9OiB7IHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4gfSk6IFByb21pc2U8TGFuZ0dlbml1c1ZlcnNpb25SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gZ2V0PExhbmdHZW5pdXNWZXJzaW9uUmVzcG9uc2U+KHVybCwgeyBwYXJhbXMgfSlcbn1cblxuZXhwb3J0IGNvbnN0IG9hdXRoID0gKHsgdXJsLCBwYXJhbXMgfTogeyB1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPE9hdXRoUmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIGdldDxPYXV0aFJlc3BvbnNlPih1cmwsIHsgcGFyYW1zIH0pXG59XG5cbmV4cG9ydCBjb25zdCBvbmVNb3JlU3RlcCA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hNZW1iZXJzID0gKHsgdXJsLCBwYXJhbXMgfTogeyB1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPHsgYWNjb3VudHM6IE1lbWJlcltdIHwgbnVsbCB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyBhY2NvdW50czogTWVtYmVyW10gfCBudWxsIH0+KHVybCwgeyBwYXJhbXMgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoUHJvdmlkZXJzID0gKHsgdXJsLCBwYXJhbXMgfTogeyB1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPFByb3ZpZGVyW10gfCBudWxsPiA9PiB7XG4gIHJldHVybiBnZXQ8UHJvdmlkZXJbXSB8IG51bGw+KHVybCwgeyBwYXJhbXMgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlUHJvdmlkZXJLZXkgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogeyB0b2tlbjogc3RyaW5nIH0gfSk6IFByb21pc2U8VmFsaWRhdGVPcGVuQUlLZXlSZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxWYWxpZGF0ZU9wZW5BSUtleVJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVByb3ZpZGVyQUlLZXkgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogeyB0b2tlbjogc3RyaW5nIHwgUHJvdmlkZXJBenVyZVRva2VuIHwgUHJvdmlkZXJBbnRocm9waWNUb2tlbiB9IH0pOiBQcm9taXNlPFVwZGF0ZU9wZW5BSUtleVJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PFVwZGF0ZU9wZW5BSUtleVJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hBY2NvdW50SW50ZWdyYXRlcyA9ICh7IHVybCwgcGFyYW1zIH06IHsgdXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTx7IGRhdGE6IEFjY291bnRJbnRlZ3JhdGVbXSB8IG51bGwgfT4gPT4ge1xuICByZXR1cm4gZ2V0PHsgZGF0YTogQWNjb3VudEludGVncmF0ZVtdIHwgbnVsbCB9Pih1cmwsIHsgcGFyYW1zIH0pXG59XG5cbmV4cG9ydCBjb25zdCBpbnZpdGVNZW1iZXIgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTxJbnZpdGF0aW9uUmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8SW52aXRhdGlvblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlTWVtYmVyUm9sZSA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwdXQ8Q29tbW9uUmVzcG9uc2U+KHVybCwgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVNZW1iZXJPckNhbmNlbEludml0YXRpb24gPSAoeyB1cmwgfTogeyB1cmw6IHN0cmluZyB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gZGVsPENvbW1vblJlc3BvbnNlPih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCBzZW5kT3duZXJFbWFpbCA9IChib2R5OiB7IGxhbmd1YWdlPzogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBkYXRhOiBzdHJpbmcgfT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nIH0+KCcvd29ya3NwYWNlcy9jdXJyZW50L21lbWJlcnMvc2VuZC1vd25lci10cmFuc2Zlci1jb25maXJtLWVtYWlsJywgeyBib2R5IH0pXG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlPd25lckVtYWlsID0gKGJvZHk6IHsgY29kZTogc3RyaW5nLCB0b2tlbjogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZywgdG9rZW46IHN0cmluZyB9PiA9PlxuICBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZywgdG9rZW46IHN0cmluZyB9PignL3dvcmtzcGFjZXMvY3VycmVudC9tZW1iZXJzL293bmVyLXRyYW5zZmVyLWNoZWNrJywgeyBib2R5IH0pXG5cbmV4cG9ydCBjb25zdCBvd25lcnNoaXBUcmFuc2ZlciA9IChtZW1iZXJJRDogc3RyaW5nLCBib2R5OiB7IHRva2VuOiBzdHJpbmcgfSk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2UgJiB7IGlzX3ZhbGlkOiBib29sZWFuLCBlbWFpbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nIH0+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2UgJiB7IGlzX3ZhbGlkOiBib29sZWFuLCBlbWFpbDogc3RyaW5nLCB0b2tlbjogc3RyaW5nIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L21lbWJlcnMvJHttZW1iZXJJRH0vb3duZXItdHJhbnNmZXJgLCB7IGJvZHkgfSlcblxuZXhwb3J0IGNvbnN0IGZldGNoRmlsZVByZXZpZXcgPSAoeyBmaWxlSUQgfTogeyBmaWxlSUQ6IHN0cmluZyB9KTogUHJvbWlzZTx7IGNvbnRlbnQ6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyBjb250ZW50OiBzdHJpbmcgfT4oYC9maWxlcy8ke2ZpbGVJRH0vcHJldmlld2ApXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaEN1cnJlbnRXb3Jrc3BhY2UgPSAoeyB1cmwsIHBhcmFtcyB9OiB7IHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4gfSk6IFByb21pc2U8SUN1cnJlbnRXb3Jrc3BhY2U+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8SUN1cnJlbnRXb3Jrc3BhY2U+KHVybCwgeyBib2R5OiBwYXJhbXMgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUN1cnJlbnRXb3Jrc3BhY2UgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTxJQ3VycmVudFdvcmtzcGFjZT4gPT4ge1xuICByZXR1cm4gcG9zdDxJQ3VycmVudFdvcmtzcGFjZT4odXJsLCB7IGJvZHkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoV29ya3NwYWNlcyA9ICh7IHVybCwgcGFyYW1zIH06IHsgdXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgYW55PiB9KTogUHJvbWlzZTx7IHdvcmtzcGFjZXM6IElXb3Jrc3BhY2VbXSB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyB3b3Jrc3BhY2VzOiBJV29ya3NwYWNlW10gfT4odXJsLCB7IHBhcmFtcyB9KVxufVxuXG5leHBvcnQgY29uc3Qgc3dpdGNoV29ya3NwYWNlID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IFJlY29yZDxzdHJpbmcsIGFueT4gfSk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2UgJiB7IG5ld190ZW5hbnQ6IElXb3Jrc3BhY2UgfT4gPT4ge1xuICByZXR1cm4gcG9zdDxDb21tb25SZXNwb25zZSAmIHsgbmV3X3RlbmFudDogSVdvcmtzcGFjZSB9Pih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlV29ya3NwYWNlSW5mbyA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiBSZWNvcmQ8c3RyaW5nLCBhbnk+IH0pOiBQcm9taXNlPElDdXJyZW50V29ya3NwYWNlPiA9PiB7XG4gIHJldHVybiBwb3N0PElDdXJyZW50V29ya3NwYWNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hEYXRhU291cmNlID0gKHsgdXJsIH06IHsgdXJsOiBzdHJpbmcgfSk6IFByb21pc2U8eyBkYXRhOiBEYXRhU291cmNlTm90aW9uW10gfT4gPT4ge1xuICByZXR1cm4gZ2V0PHsgZGF0YTogRGF0YVNvdXJjZU5vdGlvbltdIH0+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IHN5bmNEYXRhU291cmNlTm90aW9uID0gKHsgdXJsIH06IHsgdXJsOiBzdHJpbmcgfSk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIGdldDxDb21tb25SZXNwb25zZT4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlRGF0YVNvdXJjZU5vdGlvbkFjdGlvbiA9ICh7IHVybCB9OiB7IHVybDogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwYXRjaDxDb21tb25SZXNwb25zZT4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hQbHVnaW5Qcm92aWRlcnMgPSAodXJsOiBzdHJpbmcpOiBQcm9taXNlPFBsdWdpblByb3ZpZGVyW10gfCBudWxsPiA9PiB7XG4gIHJldHVybiBnZXQ8UGx1Z2luUHJvdmlkZXJbXSB8IG51bGw+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlUGx1Z2luUHJvdmlkZXJLZXkgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogeyBjcmVkZW50aWFsczogYW55IH0gfSk6IFByb21pc2U8VmFsaWRhdGVPcGVuQUlLZXlSZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxWYWxpZGF0ZU9wZW5BSUtleVJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuZXhwb3J0IGNvbnN0IHVwZGF0ZVBsdWdpblByb3ZpZGVyQUlLZXkgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogeyBjcmVkZW50aWFsczogYW55IH0gfSk6IFByb21pc2U8VXBkYXRlT3BlbkFJS2V5UmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8VXBkYXRlT3BlbkFJS2V5UmVzcG9uc2U+KHVybCwgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBpbnZpdGF0aW9uQ2hlY2sgPSAoeyB1cmwsIHBhcmFtcyB9OiB7IHVybDogc3RyaW5nLCBwYXJhbXM6IHsgd29ya3NwYWNlX2lkPzogc3RyaW5nLCBlbWFpbD86IHN0cmluZywgdG9rZW46IHN0cmluZyB9IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZGF0YTogeyB3b3Jrc3BhY2VfbmFtZTogc3RyaW5nLCBlbWFpbDogc3RyaW5nLCB3b3Jrc3BhY2VfaWQ6IHN0cmluZyB9IH0+ID0+IHtcbiAgcmV0dXJuIGdldDxDb21tb25SZXNwb25zZSAmIHsgaXNfdmFsaWQ6IGJvb2xlYW4sIGRhdGE6IHsgd29ya3NwYWNlX25hbWU6IHN0cmluZywgZW1haWw6IHN0cmluZywgd29ya3NwYWNlX2lkOiBzdHJpbmcgfSB9Pih1cmwsIHsgcGFyYW1zIH0pXG59XG5cbmV4cG9ydCBjb25zdCBhY3RpdmF0ZU1lbWJlciA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiBhbnkgfSk6IFByb21pc2U8TG9naW5SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxMb2dpblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hNb2RlbFByb3ZpZGVycyA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8eyBkYXRhOiBNb2RlbFByb3ZpZGVyW10gfT4gPT4ge1xuICByZXR1cm4gZ2V0PHsgZGF0YTogTW9kZWxQcm92aWRlcltdIH0+KHVybClcbn1cblxuZXhwb3J0IHR5cGUgTW9kZWxQcm92aWRlckNyZWRlbnRpYWxzID0ge1xuICBjcmVkZW50aWFscz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZCB8IGJvb2xlYW4+XG4gIGxvYWRfYmFsYW5jaW5nOiBNb2RlbExvYWRCYWxhbmNpbmdDb25maWdcbn1cbmV4cG9ydCBjb25zdCBmZXRjaE1vZGVsUHJvdmlkZXJDcmVkZW50aWFscyA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8TW9kZWxQcm92aWRlckNyZWRlbnRpYWxzPiA9PiB7XG4gIHJldHVybiBnZXQ8TW9kZWxQcm92aWRlckNyZWRlbnRpYWxzPih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZyA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8e1xuICBjcmVkZW50aWFscz86IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHVuZGVmaW5lZCB8IGJvb2xlYW4+XG4gIGxvYWRfYmFsYW5jaW5nOiBNb2RlbExvYWRCYWxhbmNpbmdDb25maWdcbn0+ID0+IHtcbiAgcmV0dXJuIGdldDx7XG4gICAgY3JlZGVudGlhbHM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQgfCBib29sZWFuPlxuICAgIGxvYWRfYmFsYW5jaW5nOiBNb2RlbExvYWRCYWxhbmNpbmdDb25maWdcbiAgfT4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hNb2RlbFByb3ZpZGVyTW9kZWxMaXN0ID0gKHVybDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGE6IE1vZGVsSXRlbVtdIH0+ID0+IHtcbiAgcmV0dXJuIGdldDx7IGRhdGE6IE1vZGVsSXRlbVtdIH0+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoTW9kZWxMaXN0ID0gKHVybDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGE6IE1vZGVsW10gfT4gPT4ge1xuICByZXR1cm4gZ2V0PHsgZGF0YTogTW9kZWxbXSB9Pih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZU1vZGVsUHJvdmlkZXIgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogYW55IH0pOiBQcm9taXNlPFZhbGlkYXRlT3BlbkFJS2V5UmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8VmFsaWRhdGVPcGVuQUlLZXlSZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlTW9kZWxMb2FkQmFsYW5jaW5nQ3JlZGVudGlhbHMgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogYW55IH0pOiBQcm9taXNlPFZhbGlkYXRlT3BlbkFJS2V5UmVzcG9uc2U+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8VmFsaWRhdGVPcGVuQUlLZXlSZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHNldE1vZGVsUHJvdmlkZXIgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogYW55IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZGVsZXRlTW9kZWxQcm92aWRlciA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5PzogYW55IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBkZWw8Q29tbW9uUmVzcG9uc2U+KHVybCwgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VNb2RlbFByb3ZpZGVyUHJpb3JpdHkgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogYW55IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3Qgc2V0TW9kZWxQcm92aWRlck1vZGVsID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IGFueSB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT4ge1xuICByZXR1cm4gcG9zdDxDb21tb25SZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGRlbGV0ZU1vZGVsUHJvdmlkZXJNb2RlbCA9ICh7IHVybCB9OiB7IHVybDogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBkZWw8Q29tbW9uUmVzcG9uc2U+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBheVVybCA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyB1cmw6IHN0cmluZyB9Pih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaERlZmF1bHRNb2RhbCA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8eyBkYXRhOiBEZWZhdWx0TW9kZWxSZXNwb25zZSB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyBkYXRhOiBEZWZhdWx0TW9kZWxSZXNwb25zZSB9Pih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVEZWZhdWx0TW9kZWwgPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogYW55IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hNb2RlbFBhcmFtZXRlclJ1bGVzID0gKHVybDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGE6IE1vZGVsUGFyYW1ldGVyUnVsZVtdIH0+ID0+IHtcbiAgcmV0dXJuIGdldDx7IGRhdGE6IE1vZGVsUGFyYW1ldGVyUnVsZVtdIH0+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoRmlsZVVwbG9hZENvbmZpZyA9ICh7IHVybCB9OiB7IHVybDogc3RyaW5nIH0pOiBQcm9taXNlPEZpbGVVcGxvYWRDb25maWdSZXNwb25zZT4gPT4ge1xuICByZXR1cm4gZ2V0PEZpbGVVcGxvYWRDb25maWdSZXNwb25zZT4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hOb3Rpb25Db25uZWN0aW9uID0gKHVybDogc3RyaW5nKTogUHJvbWlzZTx7IGRhdGE6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyBkYXRhOiBzdHJpbmcgfT4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hEYXRhU291cmNlTm90aW9uQmluZGluZyA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8eyByZXN1bHQ6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBnZXQ8eyByZXN1bHQ6IHN0cmluZyB9Pih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaEFwaUJhc2VkRXh0ZW5zaW9uTGlzdCA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8QXBpQmFzZWRFeHRlbnNpb25bXT4gPT4ge1xuICByZXR1cm4gZ2V0PEFwaUJhc2VkRXh0ZW5zaW9uW10+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoQXBpQmFzZWRFeHRlbnNpb25EZXRhaWwgPSAodXJsOiBzdHJpbmcpOiBQcm9taXNlPEFwaUJhc2VkRXh0ZW5zaW9uPiA9PiB7XG4gIHJldHVybiBnZXQ8QXBpQmFzZWRFeHRlbnNpb24+KHVybClcbn1cblxuZXhwb3J0IGNvbnN0IGFkZEFwaUJhc2VkRXh0ZW5zaW9uID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IEFwaUJhc2VkRXh0ZW5zaW9uIH0pOiBQcm9taXNlPEFwaUJhc2VkRXh0ZW5zaW9uPiA9PiB7XG4gIHJldHVybiBwb3N0PEFwaUJhc2VkRXh0ZW5zaW9uPih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgdXBkYXRlQXBpQmFzZWRFeHRlbnNpb24gPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogQXBpQmFzZWRFeHRlbnNpb24gfSk6IFByb21pc2U8QXBpQmFzZWRFeHRlbnNpb24+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8QXBpQmFzZWRFeHRlbnNpb24+KHVybCwgeyBib2R5IH0pXG59XG5cbmV4cG9ydCBjb25zdCBkZWxldGVBcGlCYXNlZEV4dGVuc2lvbiA9ICh1cmw6IHN0cmluZyk6IFByb21pc2U8eyByZXN1bHQ6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBkZWw8eyByZXN1bHQ6IHN0cmluZyB9Pih1cmwpXG59XG5cbmV4cG9ydCBjb25zdCBmZXRjaENvZGVCYXNlZEV4dGVuc2lvbkxpc3QgPSAodXJsOiBzdHJpbmcpOiBQcm9taXNlPENvZGVCYXNlZEV4dGVuc2lvbj4gPT4ge1xuICByZXR1cm4gZ2V0PENvZGVCYXNlZEV4dGVuc2lvbj4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgbW9kZXJhdGUgPSAodXJsOiBzdHJpbmcsIGJvZHk6IHsgYXBwX2lkOiBzdHJpbmcsIHRleHQ6IHN0cmluZyB9KTogUHJvbWlzZTxNb2RlcmF0ZVJlc3BvbnNlPiA9PiB7XG4gIHJldHVybiBwb3N0PE1vZGVyYXRlUmVzcG9uc2U+KHVybCwgeyBib2R5IH0pXG59XG5cbnR5cGUgUmV0cmlldmFsTWV0aG9kc1JlcyA9IHtcbiAgcmV0cmlldmFsX21ldGhvZDogUkVUUklFVkVfTUVUSE9EW11cbn1cbmV4cG9ydCBjb25zdCBmZXRjaFN1cHBvcnRSZXRyaWV2YWxNZXRob2RzID0gKHVybDogc3RyaW5nKTogUHJvbWlzZTxSZXRyaWV2YWxNZXRob2RzUmVzPiA9PiB7XG4gIHJldHVybiBnZXQ8UmV0cmlldmFsTWV0aG9kc1Jlcz4odXJsKVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U3lzdGVtRmVhdHVyZXMgPSAoKTogUHJvbWlzZTxTeXN0ZW1GZWF0dXJlcz4gPT4ge1xuICByZXR1cm4gZ2V0PFN5c3RlbUZlYXR1cmVzPignL3N5c3RlbS1mZWF0dXJlcycpXG59XG5cbmV4cG9ydCBjb25zdCBlbmFibGVNb2RlbCA9ICh1cmw6IHN0cmluZywgYm9keTogeyBtb2RlbDogc3RyaW5nLCBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PlxuICBwYXRjaDxDb21tb25SZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcblxuZXhwb3J0IGNvbnN0IGRpc2FibGVNb2RlbCA9ICh1cmw6IHN0cmluZywgYm9keTogeyBtb2RlbDogc3RyaW5nLCBtb2RlbF90eXBlOiBNb2RlbFR5cGVFbnVtIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlPiA9PlxuICBwYXRjaDxDb21tb25SZXNwb25zZT4odXJsLCB7IGJvZHkgfSlcblxuZXhwb3J0IGNvbnN0IHNlbmRGb3Jnb3RQYXNzd29yZEVtYWlsID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IHsgZW1haWw6IHN0cmluZyB9IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBkYXRhOiBzdHJpbmcgfT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nIH0+KHVybCwgeyBib2R5IH0pXG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlGb3Jnb3RQYXNzd29yZFRva2VuID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IHsgdG9rZW46IHN0cmluZyB9IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZyB9Pih1cmwsIHsgYm9keSB9KVxufVxuXG5leHBvcnQgY29uc3QgY2hhbmdlUGFzc3dvcmRXaXRoVG9rZW4gPSAoeyB1cmwsIGJvZHkgfTogeyB1cmw6IHN0cmluZywgYm9keTogeyB0b2tlbjogc3RyaW5nLCBuZXdfcGFzc3dvcmQ6IHN0cmluZywgcGFzc3dvcmRfY29uZmlybTogc3RyaW5nIH0gfSk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2U+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2U+KHVybCwgeyBib2R5IH0pXG5cbmV4cG9ydCBjb25zdCBzZW5kV2ViQXBwRm9yZ290UGFzc3dvcmRFbWFpbCA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiB7IGVtYWlsOiBzdHJpbmcgfSB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nIH0+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZyB9Pih1cmwsIHsgYm9keSB9LCB7IGlzUHVibGljQVBJOiB0cnVlIH0pXG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlXZWJBcHBGb3Jnb3RQYXNzd29yZFRva2VuID0gKHsgdXJsLCBib2R5IH06IHsgdXJsOiBzdHJpbmcsIGJvZHk6IHsgdG9rZW46IHN0cmluZyB9IH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZyB9PiA9PiB7XG4gIHJldHVybiBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZyB9Pih1cmwsIHsgYm9keSB9LCB7IGlzUHVibGljQVBJOiB0cnVlIH0pXG59XG5cbmV4cG9ydCBjb25zdCBjaGFuZ2VXZWJBcHBQYXNzd29yZFdpdGhUb2tlbiA9ICh7IHVybCwgYm9keSB9OiB7IHVybDogc3RyaW5nLCBib2R5OiB7IHRva2VuOiBzdHJpbmcsIG5ld19wYXNzd29yZDogc3RyaW5nLCBwYXNzd29yZF9jb25maXJtOiBzdHJpbmcgfSB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZT4odXJsLCB7IGJvZHkgfSwgeyBpc1B1YmxpY0FQSTogdHJ1ZSB9KVxuXG5leHBvcnQgY29uc3QgdXBsb2FkUmVtb3RlRmlsZUluZm8gPSAodXJsOiBzdHJpbmcsIGlzUHVibGljPzogYm9vbGVhbiwgc2lsZW50PzogYm9vbGVhbik6IFByb21pc2U8eyBpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbWltZV90eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nIH0+ID0+IHtcbiAgcmV0dXJuIHBvc3Q8eyBpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcsIHNpemU6IG51bWJlciwgbWltZV90eXBlOiBzdHJpbmcsIHVybDogc3RyaW5nIH0+KCcvcmVtb3RlLWZpbGVzL3VwbG9hZCcsIHsgYm9keTogeyB1cmwgfSB9LCB7IGlzUHVibGljQVBJOiBpc1B1YmxpYywgc2lsZW50IH0pXG59XG5cbmV4cG9ydCBjb25zdCBzZW5kRU1haWxMb2dpbkNvZGUgPSAoZW1haWw6IHN0cmluZywgbGFuZ3VhZ2UgPSAnZW4tVVMnKTogUHJvbWlzZTxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nIH0+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZyB9PignL2VtYWlsLWNvZGUtbG9naW4nLCB7IGJvZHk6IHsgZW1haWwsIGxhbmd1YWdlIH0gfSlcblxuZXhwb3J0IGNvbnN0IGVtYWlsTG9naW5XaXRoQ29kZSA9IChkYXRhOiB7IGVtYWlsOiBzdHJpbmcsIGNvZGU6IHN0cmluZywgdG9rZW46IHN0cmluZywgbGFuZ3VhZ2U6IHN0cmluZyB9KTogUHJvbWlzZTxMb2dpblJlc3BvbnNlPiA9PlxuICBwb3N0PExvZ2luUmVzcG9uc2U+KCcvZW1haWwtY29kZS1sb2dpbi92YWxpZGl0eScsIHsgYm9keTogZGF0YSB9KVxuXG5leHBvcnQgY29uc3Qgc2VuZFJlc2V0UGFzc3dvcmRDb2RlID0gKGVtYWlsOiBzdHJpbmcsIGxhbmd1YWdlID0gJ2VuLVVTJyk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZywgbWVzc2FnZT86IHN0cmluZywgY29kZT86IHN0cmluZyB9PiA9PlxuICBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBkYXRhOiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcsIGNvZGU/OiBzdHJpbmcgfT4oJy9mb3Jnb3QtcGFzc3dvcmQnLCB7IGJvZHk6IHsgZW1haWwsIGxhbmd1YWdlIH0gfSlcblxuZXhwb3J0IGNvbnN0IHZlcmlmeVJlc2V0UGFzc3dvcmRDb2RlID0gKGJvZHk6IHsgZW1haWw6IHN0cmluZywgY29kZTogc3RyaW5nLCB0b2tlbjogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgdG9rZW46IHN0cmluZyB9PiA9PlxuICBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgdG9rZW46IHN0cmluZyB9PignL2ZvcmdvdC1wYXNzd29yZC92YWxpZGl0eScsIHsgYm9keSB9KVxuXG5leHBvcnQgY29uc3Qgc2VuZFdlYkFwcEVNYWlsTG9naW5Db2RlID0gKGVtYWlsOiBzdHJpbmcsIGxhbmd1YWdlID0gJ2VuLVVTJyk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZyB9PiA9PlxuICBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBkYXRhOiBzdHJpbmcgfT4oJy9lbWFpbC1jb2RlLWxvZ2luJywgeyBib2R5OiB7IGVtYWlsLCBsYW5ndWFnZSB9IH0sIHsgaXNQdWJsaWNBUEk6IHRydWUgfSlcblxuZXhwb3J0IGNvbnN0IHdlYkFwcEVtYWlsTG9naW5XaXRoQ29kZSA9IChkYXRhOiB7IGVtYWlsOiBzdHJpbmcsIGNvZGU6IHN0cmluZywgdG9rZW46IHN0cmluZyB9KTogUHJvbWlzZTxMb2dpblJlc3BvbnNlPiA9PlxuICBwb3N0PExvZ2luUmVzcG9uc2U+KCcvZW1haWwtY29kZS1sb2dpbi92YWxpZGl0eScsIHsgYm9keTogZGF0YSB9LCB7IGlzUHVibGljQVBJOiB0cnVlIH0pXG5cbmV4cG9ydCBjb25zdCBzZW5kV2ViQXBwUmVzZXRQYXNzd29yZENvZGUgPSAoZW1haWw6IHN0cmluZywgbGFuZ3VhZ2UgPSAnZW4tVVMnKTogUHJvbWlzZTxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nLCBjb2RlPzogc3RyaW5nIH0+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZywgbWVzc2FnZT86IHN0cmluZywgY29kZT86IHN0cmluZyB9PignL2ZvcmdvdC1wYXNzd29yZCcsIHsgYm9keTogeyBlbWFpbCwgbGFuZ3VhZ2UgfSB9LCB7IGlzUHVibGljQVBJOiB0cnVlIH0pXG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlXZWJBcHBSZXNldFBhc3N3b3JkQ29kZSA9IChib2R5OiB7IGVtYWlsOiBzdHJpbmcsIGNvZGU6IHN0cmluZywgdG9rZW46IHN0cmluZyB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZSAmIHsgaXNfdmFsaWQ6IGJvb2xlYW4sIHRva2VuOiBzdHJpbmcgfT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZSAmIHsgaXNfdmFsaWQ6IGJvb2xlYW4sIHRva2VuOiBzdHJpbmcgfT4oJy9mb3Jnb3QtcGFzc3dvcmQvdmFsaWRpdHknLCB7IGJvZHkgfSwgeyBpc1B1YmxpY0FQSTogdHJ1ZSB9KVxuXG5leHBvcnQgY29uc3Qgc2VuZERlbGV0ZUFjY291bnRDb2RlID0gKCk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZyB9PiA9PlxuICBnZXQ8Q29tbW9uUmVzcG9uc2UgJiB7IGRhdGE6IHN0cmluZyB9PignL2FjY291bnQvZGVsZXRlL3ZlcmlmeScpXG5cbmV4cG9ydCBjb25zdCB2ZXJpZnlEZWxldGVBY2NvdW50Q29kZSA9IChib2R5OiB7IGNvZGU6IHN0cmluZywgdG9rZW46IHN0cmluZyB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZSAmIHsgaXNfdmFsaWQ6IGJvb2xlYW4gfT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZSAmIHsgaXNfdmFsaWQ6IGJvb2xlYW4gfT4oJy9hY2NvdW50L2RlbGV0ZScsIHsgYm9keSB9KVxuXG5leHBvcnQgY29uc3Qgc3VibWl0RGVsZXRlQWNjb3VudEZlZWRiYWNrID0gKGJvZHk6IHsgZmVlZGJhY2s6IHN0cmluZywgZW1haWw6IHN0cmluZyB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZT4oJy9hY2NvdW50L2RlbGV0ZS9mZWVkYmFjaycsIHsgYm9keSB9KVxuXG5leHBvcnQgY29uc3QgZ2V0RG9jRG93bmxvYWRVcmwgPSAoZG9jX25hbWU6IHN0cmluZyk6IFByb21pc2U8eyB1cmw6IHN0cmluZyB9PiA9PlxuICBnZXQ8eyB1cmw6IHN0cmluZyB9PignL2NvbXBsaWFuY2UvZG93bmxvYWQnLCB7IHBhcmFtczogeyBkb2NfbmFtZSB9IH0sIHsgc2lsZW50OiB0cnVlIH0pXG5cbmV4cG9ydCBjb25zdCBzZW5kVmVyaWZ5Q29kZSA9IChib2R5OiB7IGVtYWlsOiBzdHJpbmcsIHBoYXNlOiBzdHJpbmcsIHRva2VuPzogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBkYXRhOiBzdHJpbmcgfT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZSAmIHsgZGF0YTogc3RyaW5nIH0+KCcvYWNjb3VudC9jaGFuZ2UtZW1haWwnLCB7IGJvZHkgfSlcblxuZXhwb3J0IGNvbnN0IHZlcmlmeUVtYWlsID0gKGJvZHk6IHsgZW1haWw6IHN0cmluZywgY29kZTogc3RyaW5nLCB0b2tlbjogc3RyaW5nIH0pOiBQcm9taXNlPENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZywgdG9rZW46IHN0cmluZyB9PiA9PlxuICBwb3N0PENvbW1vblJlc3BvbnNlICYgeyBpc192YWxpZDogYm9vbGVhbiwgZW1haWw6IHN0cmluZywgdG9rZW46IHN0cmluZyB9PignL2FjY291bnQvY2hhbmdlLWVtYWlsL3ZhbGlkaXR5JywgeyBib2R5IH0pXG5cbmV4cG9ydCBjb25zdCByZXNldEVtYWlsID0gKGJvZHk6IHsgbmV3X2VtYWlsOiBzdHJpbmcsIHRva2VuOiBzdHJpbmcgfSk6IFByb21pc2U8Q29tbW9uUmVzcG9uc2U+ID0+XG4gIHBvc3Q8Q29tbW9uUmVzcG9uc2U+KCcvYWNjb3VudC9jaGFuZ2UtZW1haWwvcmVzZXQnLCB7IGJvZHkgfSlcblxuZXhwb3J0IGNvbnN0IGNoZWNrRW1haWxFeGlzdGVkID0gKGJvZHk6IHsgZW1haWw6IHN0cmluZyB9KTogUHJvbWlzZTxDb21tb25SZXNwb25zZT4gPT5cbiAgcG9zdDxDb21tb25SZXNwb25zZT4oJy9hY2NvdW50L2NoYW5nZS1lbWFpbC9jaGVjay1lbWFpbC11bmlxdWUnLCB7IGJvZHkgfSwgeyBzaWxlbnQ6IHRydWUgfSlcbiJdfQ==