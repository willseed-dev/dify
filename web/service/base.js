"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchPublic = exports.patch = exports.delPublic = exports.del = exports.putPublic = exports.put = exports.postPublic = exports.postMarketplace = exports.post = exports.getMarketplace = exports.getPublic = exports.get = exports.request = exports.ssePost = exports.upload = exports.handleStream = void 0;
exports.format = format;
const js_cookie_1 = require("js-cookie");
const toast_1 = require("@/app/components/base/toast");
const config_1 = require("@/config");
const utils_1 = require("@/utils");
const var_1 = require("@/utils/var");
const fetch_1 = require("./fetch");
const refresh_token_1 = require("./refresh-token");
const webapp_auth_1 = require("./webapp-auth");
const TIME_OUT = 100000;
function jumpTo(url) {
    if (!url)
        return;
    const targetPath = new URL(url, globalThis.location.origin).pathname;
    if (targetPath === globalThis.location.pathname)
        return;
    globalThis.location.href = url;
}
function unicodeToChar(text) {
    if (!text)
        return '';
    return text.replace(/\\u([0-9a-f]{4})/g, (_match, p1) => {
        return String.fromCharCode(Number.parseInt(p1, 16));
    });
}
const WBB_APP_LOGIN_PATH = '/webapp-signin';
function requiredWebSSOLogin(message, code) {
    const params = new URLSearchParams();
    // prevent redirect loop
    if (globalThis.location.pathname === WBB_APP_LOGIN_PATH)
        return;
    params.append('redirect_url', encodeURIComponent(`${globalThis.location.pathname}${globalThis.location.search}`));
    if (message)
        params.append('message', message);
    if (code)
        params.append('code', String(code));
    globalThis.location.href = `${globalThis.location.origin}${var_1.basePath}${WBB_APP_LOGIN_PATH}?${params.toString()}`;
}
function format(text) {
    let res = text.trim();
    if (res.startsWith('\n'))
        res = res.replace('\n', '');
    return res.replaceAll('\n', '<br/>').replaceAll('```', '');
}
const handleStream = (response, onData, onCompleted, onThought, onMessageEnd, onMessageReplace, onFile, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onIterationStart, onIterationNext, onIterationFinish, onLoopStart, onLoopNext, onLoopFinish, onNodeRetry, onParallelBranchStarted, onParallelBranchFinished, onTextChunk, onTTSChunk, onTTSEnd, onTextReplace, onAgentLog, onDataSourceNodeProcessing, onDataSourceNodeCompleted, onDataSourceNodeError) => {
    if (!response.ok)
        throw new Error('Network response was not ok');
    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let bufferObj;
    let isFirstMessage = true;
    function read() {
        let hasError = false;
        reader?.read().then((result) => {
            if (result.done) {
                onCompleted?.();
                return;
            }
            buffer += decoder.decode(result.value, { stream: true });
            const lines = buffer.split('\n');
            try {
                lines.forEach((message) => {
                    if (message.startsWith('data: ')) { // check if it starts with data:
                        try {
                            bufferObj = JSON.parse(message.substring(6)); // remove data: and parse as json
                        }
                        catch {
                            // mute handle message cut off
                            onData('', isFirstMessage, {
                                conversationId: bufferObj?.conversation_id,
                                messageId: bufferObj?.message_id,
                            });
                            return;
                        }
                        if (!bufferObj || typeof bufferObj !== 'object') {
                            onData('', isFirstMessage, {
                                conversationId: undefined,
                                messageId: '',
                                errorMessage: 'Invalid response data',
                                errorCode: 'invalid_data',
                            });
                            hasError = true;
                            onCompleted?.(true, 'Invalid response data');
                            return;
                        }
                        if (bufferObj.status === 400 || !bufferObj.event) {
                            onData('', false, {
                                conversationId: undefined,
                                messageId: '',
                                errorMessage: bufferObj?.message,
                                errorCode: bufferObj?.code,
                            });
                            hasError = true;
                            onCompleted?.(true, bufferObj?.message);
                            return;
                        }
                        if (bufferObj.event === 'message' || bufferObj.event === 'agent_message') {
                            // can not use format here. Because message is splitted.
                            onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
                                conversationId: bufferObj.conversation_id,
                                taskId: bufferObj.task_id,
                                messageId: bufferObj.id,
                            });
                            isFirstMessage = false;
                        }
                        else if (bufferObj.event === 'agent_thought') {
                            onThought?.(bufferObj);
                        }
                        else if (bufferObj.event === 'message_file') {
                            onFile?.(bufferObj);
                        }
                        else if (bufferObj.event === 'message_end') {
                            onMessageEnd?.(bufferObj);
                        }
                        else if (bufferObj.event === 'message_replace') {
                            onMessageReplace?.(bufferObj);
                        }
                        else if (bufferObj.event === 'workflow_started') {
                            onWorkflowStarted?.(bufferObj);
                        }
                        else if (bufferObj.event === 'workflow_finished') {
                            onWorkflowFinished?.(bufferObj);
                        }
                        else if (bufferObj.event === 'node_started') {
                            onNodeStarted?.(bufferObj);
                        }
                        else if (bufferObj.event === 'node_finished') {
                            onNodeFinished?.(bufferObj);
                        }
                        else if (bufferObj.event === 'iteration_started') {
                            onIterationStart?.(bufferObj);
                        }
                        else if (bufferObj.event === 'iteration_next') {
                            onIterationNext?.(bufferObj);
                        }
                        else if (bufferObj.event === 'iteration_completed') {
                            onIterationFinish?.(bufferObj);
                        }
                        else if (bufferObj.event === 'loop_started') {
                            onLoopStart?.(bufferObj);
                        }
                        else if (bufferObj.event === 'loop_next') {
                            onLoopNext?.(bufferObj);
                        }
                        else if (bufferObj.event === 'loop_completed') {
                            onLoopFinish?.(bufferObj);
                        }
                        else if (bufferObj.event === 'node_retry') {
                            onNodeRetry?.(bufferObj);
                        }
                        else if (bufferObj.event === 'parallel_branch_started') {
                            onParallelBranchStarted?.(bufferObj);
                        }
                        else if (bufferObj.event === 'parallel_branch_finished') {
                            onParallelBranchFinished?.(bufferObj);
                        }
                        else if (bufferObj.event === 'text_chunk') {
                            onTextChunk?.(bufferObj);
                        }
                        else if (bufferObj.event === 'text_replace') {
                            onTextReplace?.(bufferObj);
                        }
                        else if (bufferObj.event === 'agent_log') {
                            onAgentLog?.(bufferObj);
                        }
                        else if (bufferObj.event === 'tts_message') {
                            onTTSChunk?.(bufferObj.message_id, bufferObj.audio, bufferObj.audio_type);
                        }
                        else if (bufferObj.event === 'tts_message_end') {
                            onTTSEnd?.(bufferObj.message_id, bufferObj.audio);
                        }
                        else if (bufferObj.event === 'datasource_processing') {
                            onDataSourceNodeProcessing?.(bufferObj);
                        }
                        else if (bufferObj.event === 'datasource_completed') {
                            onDataSourceNodeCompleted?.(bufferObj);
                        }
                        else if (bufferObj.event === 'datasource_error') {
                            onDataSourceNodeError?.(bufferObj);
                        }
                        else {
                            console.warn(`Unknown event: ${bufferObj.event}`, bufferObj);
                        }
                    }
                });
                buffer = lines[lines.length - 1];
            }
            catch (e) {
                onData('', false, {
                    conversationId: undefined,
                    messageId: '',
                    errorMessage: `${e}`,
                });
                hasError = true;
                onCompleted?.(true, e);
                return;
            }
            if (!hasError)
                read();
        });
    }
    read();
};
exports.handleStream = handleStream;
const baseFetch = fetch_1.base;
const upload = async (options, isPublicAPI, url, searchParams) => {
    const urlPrefix = isPublicAPI ? config_1.PUBLIC_API_PREFIX : config_1.API_PREFIX;
    const shareCode = globalThis.location.pathname.split('/').slice(-1)[0];
    const defaultOptions = {
        method: 'POST',
        url: (url ? `${urlPrefix}${url}` : `${urlPrefix}/files/upload`) + (searchParams || ''),
        headers: {
            [config_1.CSRF_HEADER_NAME]: js_cookie_1.default.get((0, config_1.CSRF_COOKIE_NAME)()) || '',
            [config_1.PASSPORT_HEADER_NAME]: (0, webapp_auth_1.getWebAppPassport)(shareCode),
            [config_1.WEB_APP_SHARE_CODE_HEADER_NAME]: shareCode,
        },
    };
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        url: options.url || defaultOptions.url,
        headers: { ...defaultOptions.headers, ...options.headers },
    };
    return new Promise((resolve, reject) => {
        const xhr = mergedOptions.xhr;
        xhr.open(mergedOptions.method, mergedOptions.url);
        for (const key in mergedOptions.headers)
            xhr.setRequestHeader(key, mergedOptions.headers[key]);
        xhr.withCredentials = true;
        xhr.responseType = 'json';
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 201)
                    resolve(xhr.response);
                else
                    reject(xhr);
            }
        };
        if (mergedOptions.onprogress)
            xhr.upload.onprogress = mergedOptions.onprogress;
        xhr.send(mergedOptions.data);
    });
};
exports.upload = upload;
const ssePost = async (url, fetchOptions, otherOptions) => {
    const { isPublicAPI = false, onData, onCompleted, onThought, onFile, onMessageEnd, onMessageReplace, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onIterationStart, onIterationNext, onIterationFinish, onNodeRetry, onParallelBranchStarted, onParallelBranchFinished, onTextChunk, onTTSChunk, onTTSEnd, onTextReplace, onAgentLog, onError, getAbortController, onLoopStart, onLoopNext, onLoopFinish, onDataSourceNodeProcessing, onDataSourceNodeCompleted, onDataSourceNodeError, } = otherOptions;
    const abortController = new AbortController();
    // No need to get token from localStorage, cookies will be sent automatically
    const baseOptions = (0, fetch_1.getBaseOptions)();
    const shareCode = globalThis.location.pathname.split('/').slice(-1)[0];
    const options = Object.assign({}, baseOptions, {
        method: 'POST',
        signal: abortController.signal,
        headers: new Headers({
            [config_1.CSRF_HEADER_NAME]: js_cookie_1.default.get((0, config_1.CSRF_COOKIE_NAME)()) || '',
            [config_1.WEB_APP_SHARE_CODE_HEADER_NAME]: shareCode,
            [config_1.PASSPORT_HEADER_NAME]: (0, webapp_auth_1.getWebAppPassport)(shareCode),
        }),
    }, fetchOptions);
    const contentType = options.headers.get('Content-Type');
    if (!contentType)
        options.headers.set('Content-Type', fetch_1.ContentType.json);
    getAbortController?.(abortController);
    const urlPrefix = isPublicAPI ? config_1.PUBLIC_API_PREFIX : config_1.API_PREFIX;
    const urlWithPrefix = (url.startsWith('http://') || url.startsWith('https://'))
        ? url
        : `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`;
    const { body } = options;
    if (body)
        options.body = JSON.stringify(body);
    globalThis.fetch(urlWithPrefix, options)
        .then((res) => {
        if (!/^[23]\d{2}$/.test(String(res.status))) {
            if (res.status === 401) {
                if (isPublicAPI) {
                    res.json().then((data) => {
                        if (isPublicAPI) {
                            if (data.code === 'web_app_access_denied')
                                requiredWebSSOLogin(data.message, 403);
                            if (data.code === 'web_sso_auth_required')
                                requiredWebSSOLogin();
                            if (data.code === 'unauthorized')
                                requiredWebSSOLogin();
                        }
                    });
                }
                else {
                    (0, refresh_token_1.refreshAccessTokenOrRelogin)(TIME_OUT).then(() => {
                        (0, exports.ssePost)(url, fetchOptions, otherOptions);
                    }).catch((err) => {
                        console.error(err);
                    });
                }
            }
            else {
                res.json().then((data) => {
                    toast_1.default.notify({ type: 'error', message: data.message || 'Server Error' });
                });
                onError?.('Server Error');
            }
            return;
        }
        return (0, exports.handleStream)(res, (str, isFirstMessage, moreInfo) => {
            if (moreInfo.errorMessage) {
                onError?.(moreInfo.errorMessage, moreInfo.errorCode);
                // TypeError: Cannot assign to read only property ... will happen in page leave, so it should be ignored.
                if (moreInfo.errorMessage !== 'AbortError: The user aborted a request.' && !moreInfo.errorMessage.includes('TypeError: Cannot assign to read only property'))
                    toast_1.default.notify({ type: 'error', message: moreInfo.errorMessage });
                return;
            }
            onData?.(str, isFirstMessage, moreInfo);
        }, onCompleted, onThought, onMessageEnd, onMessageReplace, onFile, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onIterationStart, onIterationNext, onIterationFinish, onLoopStart, onLoopNext, onLoopFinish, onNodeRetry, onParallelBranchStarted, onParallelBranchFinished, onTextChunk, onTTSChunk, onTTSEnd, onTextReplace, onAgentLog, onDataSourceNodeProcessing, onDataSourceNodeCompleted, onDataSourceNodeError);
    })
        .catch((e) => {
        if (e.toString() !== 'AbortError: The user aborted a request.' && !e.toString().includes('TypeError: Cannot assign to read only property'))
            toast_1.default.notify({ type: 'error', message: e });
        onError?.(e);
    });
};
exports.ssePost = ssePost;
// base request
const request = async (url, options = {}, otherOptions) => {
    try {
        const otherOptionsForBaseFetch = otherOptions || {};
        const [err, resp] = await (0, utils_1.asyncRunSafe)(baseFetch(url, options, otherOptionsForBaseFetch));
        if (err === null)
            return resp;
        const errResp = err;
        if (errResp.status === 401) {
            const [parseErr, errRespData] = await (0, utils_1.asyncRunSafe)(errResp.json());
            const loginUrl = `${globalThis.location.origin}${var_1.basePath}/signin`;
            if (parseErr) {
                globalThis.location.href = loginUrl;
                return Promise.reject(err);
            }
            if (/\/login/.test(url))
                return Promise.reject(errRespData);
            // special code
            const { code, message } = errRespData;
            // webapp sso
            if (code === 'web_app_access_denied') {
                requiredWebSSOLogin(message, 403);
                return Promise.reject(err);
            }
            if (code === 'web_sso_auth_required') {
                requiredWebSSOLogin();
                return Promise.reject(err);
            }
            if (code === 'unauthorized_and_force_logout') {
                // Cookies will be cleared by the backend
                globalThis.location.reload();
                return Promise.reject(err);
            }
            const { isPublicAPI = false, silent, } = otherOptionsForBaseFetch;
            if (isPublicAPI && code === 'unauthorized') {
                requiredWebSSOLogin();
                return Promise.reject(err);
            }
            if (code === 'init_validate_failed' && config_1.IS_CE_EDITION && !silent) {
                toast_1.default.notify({ type: 'error', message, duration: 4000 });
                return Promise.reject(err);
            }
            if (code === 'not_init_validated' && config_1.IS_CE_EDITION) {
                jumpTo(`${globalThis.location.origin}${var_1.basePath}/init`);
                return Promise.reject(err);
            }
            if (code === 'not_setup' && config_1.IS_CE_EDITION) {
                jumpTo(`${globalThis.location.origin}${var_1.basePath}/install`);
                return Promise.reject(err);
            }
            // refresh token
            const [refreshErr] = await (0, utils_1.asyncRunSafe)((0, refresh_token_1.refreshAccessTokenOrRelogin)(TIME_OUT));
            if (refreshErr === null)
                return baseFetch(url, options, otherOptionsForBaseFetch);
            if (location.pathname !== `${var_1.basePath}/signin` || !config_1.IS_CE_EDITION) {
                jumpTo(loginUrl);
                return Promise.reject(err);
            }
            if (!silent) {
                toast_1.default.notify({ type: 'error', message });
                return Promise.reject(err);
            }
            jumpTo(loginUrl);
            return Promise.reject(err);
        }
        else {
            return Promise.reject(err);
        }
    }
    catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
exports.request = request;
// request methods
const get = (url, options = {}, otherOptions) => {
    return (0, exports.request)(url, Object.assign({}, options, { method: 'GET' }), otherOptions);
};
exports.get = get;
// For public API
const getPublic = (url, options = {}, otherOptions) => {
    return (0, exports.get)(url, options, { ...otherOptions, isPublicAPI: true });
};
exports.getPublic = getPublic;
// For Marketplace API
const getMarketplace = (url, options = {}, otherOptions) => {
    return (0, exports.get)(url, options, { ...otherOptions, isMarketplaceAPI: true });
};
exports.getMarketplace = getMarketplace;
const post = (url, options = {}, otherOptions) => {
    return (0, exports.request)(url, Object.assign({}, options, { method: 'POST' }), otherOptions);
};
exports.post = post;
// For Marketplace API
const postMarketplace = (url, options = {}, otherOptions) => {
    return (0, exports.post)(url, options, { ...otherOptions, isMarketplaceAPI: true });
};
exports.postMarketplace = postMarketplace;
const postPublic = (url, options = {}, otherOptions) => {
    return (0, exports.post)(url, options, { ...otherOptions, isPublicAPI: true });
};
exports.postPublic = postPublic;
const put = (url, options = {}, otherOptions) => {
    return (0, exports.request)(url, Object.assign({}, options, { method: 'PUT' }), otherOptions);
};
exports.put = put;
const putPublic = (url, options = {}, otherOptions) => {
    return (0, exports.put)(url, options, { ...otherOptions, isPublicAPI: true });
};
exports.putPublic = putPublic;
const del = (url, options = {}, otherOptions) => {
    return (0, exports.request)(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions);
};
exports.del = del;
const delPublic = (url, options = {}, otherOptions) => {
    return (0, exports.del)(url, options, { ...otherOptions, isPublicAPI: true });
};
exports.delPublic = delPublic;
const patch = (url, options = {}, otherOptions) => {
    return (0, exports.request)(url, Object.assign({}, options, { method: 'PATCH' }), otherOptions);
};
exports.patch = patch;
const patchPublic = (url, options = {}, otherOptions) => {
    return (0, exports.patch)(url, options, { ...otherOptions, isPublicAPI: true });
};
exports.patchPublic = patchPublic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBc0pBLHdCQU1DO0FBbklELHlDQUErQjtBQUMvQix1REFBK0M7QUFDL0MscUNBQWlLO0FBQ2pLLG1DQUFzQztBQUN0QyxxQ0FBc0M7QUFDdEMsbUNBQTJEO0FBQzNELG1EQUE2RDtBQUM3RCwrQ0FBaUQ7QUFFakQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFBO0FBbUZ2QixTQUFTLE1BQU0sQ0FBQyxHQUFXO0lBQ3pCLElBQUksQ0FBQyxHQUFHO1FBQ04sT0FBTTtJQUNSLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQTtJQUNwRSxJQUFJLFVBQVUsS0FBSyxVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVE7UUFDN0MsT0FBTTtJQUNSLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQTtBQUNoQyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsSUFBWTtJQUNqQyxJQUFJLENBQUMsSUFBSTtRQUNQLE9BQU8sRUFBRSxDQUFBO0lBRVgsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ3RELE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3JELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELE1BQU0sa0JBQWtCLEdBQUcsZ0JBQWdCLENBQUE7QUFDM0MsU0FBUyxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLElBQWE7SUFDMUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQTtJQUNwQyx3QkFBd0I7SUFDeEIsSUFBSSxVQUFVLENBQUMs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bnQiOlsiaW1wb3J0IHR5cGUgeyBGZXRjaE9wdGlvblR5cGUsIFJlc3BvbnNlRXJyb3IgfSBmcm9tICcuL2ZldGNoJ1xuaW1wb3J0IHR5cGUgeyBBbm5vdGF0aW9uUmVwbHksIE1lc3NhZ2VFbmQsIE1lc3NhZ2VSZXBsYWNlLCBUaG91Z2h0SXRlbSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9jaGF0L2NoYXQvdHlwZSdcbmltcG9ydCB0eXBlIHsgVmlzaW9uRmlsZSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHR5cGUge1xuICBEYXRhU291cmNlTm9kZUNvbXBsZXRlZFJlc3BvbnNlLFxuICBEYXRhU291cmNlTm9kZUVycm9yUmVzcG9uc2UsXG4gIERhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZ1Jlc3BvbnNlLFxufSBmcm9tICdAL3R5cGVzL3BpcGVsaW5lJ1xuaW1wb3J0IHR5cGUge1xuICBBZ2VudExvZ1Jlc3BvbnNlLFxuICBJdGVyYXRpb25GaW5pc2hlZFJlc3BvbnNlLFxuICBJdGVyYXRpb25OZXh0UmVzcG9uc2UsXG4gIEl0ZXJhdGlvblN0YXJ0ZWRSZXNwb25zZSxcbiAgTG9vcEZpbmlzaGVkUmVzcG9uc2UsXG4gIExvb3BOZXh0UmVzcG9uc2UsXG4gIExvb3BTdGFydGVkUmVzcG9uc2UsXG4gIE5vZGVGaW5pc2hlZFJlc3BvbnNlLFxuICBOb2RlU3RhcnRlZFJlc3BvbnNlLFxuICBQYXJhbGxlbEJyYW5jaEZpbmlzaGVkUmVzcG9uc2UsXG4gIFBhcmFsbGVsQnJhbmNoU3RhcnRlZFJlc3BvbnNlLFxuICBUZXh0Q2h1bmtSZXNwb25zZSxcbiAgVGV4dFJlcGxhY2VSZXNwb25zZSxcbiAgV29ya2Zsb3dGaW5pc2hlZFJlc3BvbnNlLFxuICBXb3JrZmxvd1N0YXJ0ZWRSZXNwb25zZSxcbn0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCBDb29raWVzIGZyb20gJ2pzLWNvb2tpZSdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBBUElfUFJFRklYLCBDU1JGX0NPT0tJRV9OQU1FLCBDU1JGX0hFQURFUl9OQU1FLCBJU19DRV9FRElUSU9OLCBQQVNTUE9SVF9IRUFERVJfTkFNRSwgUFVCTElDX0FQSV9QUkVGSVgsIFdFQl9BUFBfU0hBUkVfQ09ERV9IRUFERVJfTkFNRSB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgYXN5bmNSdW5TYWZlIH0gZnJvbSAnQC91dGlscydcbmltcG9ydCB7IGJhc2VQYXRoIH0gZnJvbSAnQC91dGlscy92YXInXG5pbXBvcnQgeyBiYXNlLCBDb250ZW50VHlwZSwgZ2V0QmFzZU9wdGlvbnMgfSBmcm9tICcuL2ZldGNoJ1xuaW1wb3J0IHsgcmVmcmVzaEFjY2Vzc1Rva2VuT3JSZWxvZ2luIH0gZnJvbSAnLi9yZWZyZXNoLXRva2VuJ1xuaW1wb3J0IHsgZ2V0V2ViQXBwUGFzc3BvcnQgfSBmcm9tICcuL3dlYmFwcC1hdXRoJ1xuXG5jb25zdCBUSU1FX09VVCA9IDEwMDAwMFxuXG5leHBvcnQgdHlwZSBJT25EYXRhTW9yZUluZm8gPSB7XG4gIGNvbnZlcnNhdGlvbklkPzogc3RyaW5nXG4gIHRhc2tJZD86IHN0cmluZ1xuICBtZXNzYWdlSWQ6IHN0cmluZ1xuICBlcnJvck1lc3NhZ2U/OiBzdHJpbmdcbiAgZXJyb3JDb2RlPzogc3RyaW5nXG59XG5cbmV4cG9ydCB0eXBlIElPbkRhdGEgPSAobWVzc2FnZTogc3RyaW5nLCBpc0ZpcnN0TWVzc2FnZTogYm9vbGVhbiwgbW9yZUluZm86IElPbkRhdGFNb3JlSW5mbykgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uVGhvdWdodCA9ICh0aG91Z2g6IFRob3VnaHRJdGVtKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25GaWxlID0gKGZpbGU6IFZpc2lvbkZpbGUpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPbk1lc3NhZ2VFbmQgPSAobWVzc2FnZUVuZDogTWVzc2FnZUVuZCkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uTWVzc2FnZVJlcGxhY2UgPSAobWVzc2FnZVJlcGxhY2U6IE1lc3NhZ2VSZXBsYWNlKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25Bbm5vdGF0aW9uUmVwbHkgPSAobWVzc2FnZVJlcGxhY2U6IEFubm90YXRpb25SZXBseSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uQ29tcGxldGVkID0gKGhhc0Vycm9yPzogYm9vbGVhbiwgZXJyb3JNZXNzYWdlPzogc3RyaW5nKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25FcnJvciA9IChtc2c6IHN0cmluZywgY29kZT86IHN0cmluZykgPT4gdm9pZFxuXG5leHBvcnQgdHlwZSBJT25Xb3JrZmxvd1N0YXJ0ZWQgPSAod29ya2Zsb3dTdGFydGVkOiBXb3JrZmxvd1N0YXJ0ZWRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uV29ya2Zsb3dGaW5pc2hlZCA9ICh3b3JrZmxvd0ZpbmlzaGVkOiBXb3JrZmxvd0ZpbmlzaGVkUmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPbk5vZGVTdGFydGVkID0gKG5vZGVTdGFydGVkOiBOb2RlU3RhcnRlZFJlc3BvbnNlKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25Ob2RlRmluaXNoZWQgPSAobm9kZUZpbmlzaGVkOiBOb2RlRmluaXNoZWRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uSXRlcmF0aW9uU3RhcnRlZCA9ICh3b3JrZmxvd1N0YXJ0ZWQ6IEl0ZXJhdGlvblN0YXJ0ZWRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uSXRlcmF0aW9uTmV4dCA9ICh3b3JrZmxvd1N0YXJ0ZWQ6IEl0ZXJhdGlvbk5leHRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uTm9kZVJldHJ5ID0gKG5vZGVGaW5pc2hlZDogTm9kZUZpbmlzaGVkUmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPbkl0ZXJhdGlvbkZpbmlzaGVkID0gKHdvcmtmbG93RmluaXNoZWQ6IEl0ZXJhdGlvbkZpbmlzaGVkUmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPblBhcmFsbGVsQnJhbmNoU3RhcnRlZCA9IChwYXJhbGxlbEJyYW5jaFN0YXJ0ZWQ6IFBhcmFsbGVsQnJhbmNoU3RhcnRlZFJlc3BvbnNlKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25QYXJhbGxlbEJyYW5jaEZpbmlzaGVkID0gKHBhcmFsbGVsQnJhbmNoRmluaXNoZWQ6IFBhcmFsbGVsQnJhbmNoRmluaXNoZWRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uVGV4dENodW5rID0gKHRleHRDaHVuazogVGV4dENodW5rUmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPblRUU0NodW5rID0gKG1lc3NhZ2VJZDogc3RyaW5nLCBhdWRpb1N0cjogc3RyaW5nLCBhdWRpb1R5cGU/OiBzdHJpbmcpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPblRUU0VuZCA9IChtZXNzYWdlSWQ6IHN0cmluZywgYXVkaW9TdHI6IHN0cmluZywgYXVkaW9UeXBlPzogc3RyaW5nKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25UZXh0UmVwbGFjZSA9ICh0ZXh0UmVwbGFjZTogVGV4dFJlcGxhY2VSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uTG9vcFN0YXJ0ZWQgPSAod29ya2Zsb3dTdGFydGVkOiBMb29wU3RhcnRlZFJlc3BvbnNlKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25Mb29wTmV4dCA9ICh3b3JrZmxvd1N0YXJ0ZWQ6IExvb3BOZXh0UmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPbkxvb3BGaW5pc2hlZCA9ICh3b3JrZmxvd0ZpbmlzaGVkOiBMb29wRmluaXNoZWRSZXNwb25zZSkgPT4gdm9pZFxuZXhwb3J0IHR5cGUgSU9uQWdlbnRMb2cgPSAoYWdlbnRMb2c6IEFnZW50TG9nUmVzcG9uc2UpID0+IHZvaWRcblxuZXhwb3J0IHR5cGUgSU9uRGF0YVNvdXJjZU5vZGVQcm9jZXNzaW5nID0gKGRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZzogRGF0YVNvdXJjZU5vZGVQcm9jZXNzaW5nUmVzcG9uc2UpID0+IHZvaWRcbmV4cG9ydCB0eXBlIElPbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkID0gKGRhdGFTb3VyY2VOb2RlQ29tcGxldGVkOiBEYXRhU291cmNlTm9kZUNvbXBsZXRlZFJlc3BvbnNlKSA9PiB2b2lkXG5leHBvcnQgdHlwZSBJT25EYXRhU291cmNlTm9kZUVycm9yID0gKGRhdGFTb3VyY2VOb2RlRXJyb3I6IERhdGFTb3VyY2VOb2RlRXJyb3JSZXNwb25zZSkgPT4gdm9pZFxuXG5leHBvcnQgdHlwZSBJT3RoZXJPcHRpb25zID0ge1xuICBpc1B1YmxpY0FQST86IGJvb2xlYW5cbiAgaXNNYXJrZXRwbGFjZUFQST86IGJvb2xlYW5cbiAgYm9keVN0cmluZ2lmeT86IGJvb2xlYW5cbiAgbmVlZEFsbFJlc3BvbnNlQ29udGVudD86IGJvb2xlYW5cbiAgZGVsZXRlQ29udGVudFR5cGU/OiBib29sZWFuXG4gIHNpbGVudD86IGJvb2xlYW5cbiAgb25EYXRhPzogSU9uRGF0YSAvLyBmb3Igc3RyZWFtXG4gIG9uVGhvdWdodD86IElPblRob3VnaHRcbiAgb25GaWxlPzogSU9uRmlsZVxuICBvbk1lc3NhZ2VFbmQ/OiBJT25NZXNzYWdlRW5kXG4gIG9uTWVzc2FnZVJlcGxhY2U/OiBJT25NZXNzYWdlUmVwbGFjZVxuICBvbkVycm9yPzogSU9uRXJyb3JcbiAgb25Db21wbGV0ZWQ/OiBJT25Db21wbGV0ZWQgLy8gZm9yIHN0cmVhbVxuICBnZXRBYm9ydENvbnRyb2xsZXI/OiAoYWJvcnRDb250cm9sbGVyOiBBYm9ydENvbnRyb2xsZXIpID0+IHZvaWRcblxuICBvbldvcmtmbG93U3RhcnRlZD86IElPbldvcmtmbG93U3RhcnRlZFxuICBvbldvcmtmbG93RmluaXNoZWQ/OiBJT25Xb3JrZmxvd0ZpbmlzaGVkXG4gIG9uTm9kZVN0YXJ0ZWQ/OiBJT25Ob2RlU3RhcnRlZFxuICBvbk5vZGVGaW5pc2hlZD86IElPbk5vZGVGaW5pc2hlZFxuICBvbkl0ZXJhdGlvblN0YXJ0PzogSU9uSXRlcmF0aW9uU3RhcnRlZFxuICBvbkl0ZXJhdGlvbk5leHQ/OiBJT25JdGVyYXRpb25OZXh0XG4gIG9uSXRlcmF0aW9uRmluaXNoPzogSU9uSXRlcmF0aW9uRmluaXNoZWRcbiAgb25Ob2RlUmV0cnk/OiBJT25Ob2RlUmV0cnlcbiAgb25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWQ/OiBJT25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWRcbiAgb25QYXJhbGxlbEJyYW5jaEZpbmlzaGVkPzogSU9uUGFyYWxsZWxCcmFuY2hGaW5pc2hlZFxuICBvblRleHRDaHVuaz86IElPblRleHRDaHVua1xuICBvblRUU0NodW5rPzogSU9uVFRTQ2h1bmtcbiAgb25UVFNFbmQ/OiBJT25UVFNFbmRcbiAgb25UZXh0UmVwbGFjZT86IElPblRleHRSZXBsYWNlXG4gIG9uTG9vcFN0YXJ0PzogSU9uTG9vcFN0YXJ0ZWRcbiAgb25Mb29wTmV4dD86IElPbkxvb3BOZXh0XG4gIG9uTG9vcEZpbmlzaD86IElPbkxvb3BGaW5pc2hlZFxuICBvbkFnZW50TG9nPzogSU9uQWdlbnRMb2dcblxuICAvLyBQaXBlbGluZSBkYXRhIHNvdXJjZSBub2RlIHJ1blxuICBvbkRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZz86IElPbkRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZ1xuICBvbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkPzogSU9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWRcbiAgb25EYXRhU291cmNlTm9kZUVycm9yPzogSU9uRGF0YVNvdXJjZU5vZGVFcnJvclxufVxuXG5mdW5jdGlvbiBqdW1wVG8odXJsOiBzdHJpbmcpIHtcbiAgaWYgKCF1cmwpXG4gICAgcmV0dXJuXG4gIGNvbnN0IHRhcmdldFBhdGggPSBuZXcgVVJMKHVybCwgZ2xvYmFsVGhpcy5sb2NhdGlvbi5vcmlnaW4pLnBhdGhuYW1lXG4gIGlmICh0YXJnZXRQYXRoID09PSBnbG9iYWxUaGlzLmxvY2F0aW9uLnBhdGhuYW1lKVxuICAgIHJldHVyblxuICBnbG9iYWxUaGlzLmxvY2F0aW9uLmhyZWYgPSB1cmxcbn1cblxuZnVuY3Rpb24gdW5pY29kZVRvQ2hhcih0ZXh0OiBzdHJpbmcpIHtcbiAgaWYgKCF0ZXh0KVxuICAgIHJldHVybiAnJ1xuXG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoL1xcXFx1KFswLTlhLWZdezR9KS9nLCAoX21hdGNoLCBwMSkgPT4ge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKE51bWJlci5wYXJzZUludChwMSwgMTYpKVxuICB9KVxufVxuXG5jb25zdCBXQkJfQVBQX0xPR0lOX1BBVEggPSAnL3dlYmFwcC1zaWduaW4nXG5mdW5jdGlvbiByZXF1aXJlZFdlYlNTT0xvZ2luKG1lc3NhZ2U/OiBzdHJpbmcsIGNvZGU/OiBudW1iZXIpIHtcbiAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpXG4gIC8vIHByZXZlbnQgcmVkaXJlY3QgbG9vcFxuICBpZiAoZ2xvYmFsVGhpcy5sb2NhdGlvbi5wYXRobmFtZSA9PT0gV0JCX0FQUF9MT0dJTl9QQVRIKVxuICAgIHJldHVyblxuXG4gIHBhcmFtcy5hcHBlbmQoJ3JlZGlyZWN0X3VybCcsIGVuY29kZVVSSUNvbXBvbmVudChgJHtnbG9iYWxUaGlzLmxvY2F0aW9uLnBhdGhuYW1lfSR7Z2xvYmFsVGhpcy5sb2NhdGlvbi5zZWFyY2h9YCkpXG4gIGlmIChtZXNzYWdlKVxuICAgIHBhcmFtcy5hcHBlbmQoJ21lc3NhZ2UnLCBtZXNzYWdlKVxuICBpZiAoY29kZSlcbiAgICBwYXJhbXMuYXBwZW5kKCdjb2RlJywgU3RyaW5nKGNvZGUpKVxuICBnbG9iYWxUaGlzLmxvY2F0aW9uLmhyZWYgPSBgJHtnbG9iYWxUaGlzLmxvY2F0aW9uLm9yaWdpbn0ke2Jhc2VQYXRofSR7V0JCX0FQUF9MT0dJTl9QQVRIfT8ke3BhcmFtcy50b1N0cmluZygpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdCh0ZXh0OiBzdHJpbmcpIHtcbiAgbGV0IHJlcyA9IHRleHQudHJpbSgpXG4gIGlmIChyZXMuc3RhcnRzV2l0aCgnXFxuJykpXG4gICAgcmVzID0gcmVzLnJlcGxhY2UoJ1xcbicsICcnKVxuXG4gIHJldHVybiByZXMucmVwbGFjZUFsbCgnXFxuJywgJzxici8+JykucmVwbGFjZUFsbCgnYGBgJywgJycpXG59XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVTdHJlYW0gPSAoXG4gIHJlc3BvbnNlOiBSZXNwb25zZSxcbiAgb25EYXRhOiBJT25EYXRhLFxuICBvbkNvbXBsZXRlZD86IElPbkNvbXBsZXRlZCxcbiAgb25UaG91Z2h0PzogSU9uVGhvdWdodCxcbiAgb25NZXNzYWdlRW5kPzogSU9uTWVzc2FnZUVuZCxcbiAgb25NZXNzYWdlUmVwbGFjZT86IElPbk1lc3NhZ2VSZXBsYWNlLFxuICBvbkZpbGU/OiBJT25GaWxlLFxuICBvbldvcmtmbG93U3RhcnRlZD86IElPbldvcmtmbG93U3RhcnRlZCxcbiAgb25Xb3JrZmxvd0ZpbmlzaGVkPzogSU9uV29ya2Zsb3dGaW5pc2hlZCxcbiAgb25Ob2RlU3RhcnRlZD86IElPbk5vZGVTdGFydGVkLFxuICBvbk5vZGVGaW5pc2hlZD86IElPbk5vZGVGaW5pc2hlZCxcbiAgb25JdGVyYXRpb25TdGFydD86IElPbkl0ZXJhdGlvblN0YXJ0ZWQsXG4gIG9uSXRlcmF0aW9uTmV4dD86IElPbkl0ZXJhdGlvbk5leHQsXG4gIG9uSXRlcmF0aW9uRmluaXNoPzogSU9uSXRlcmF0aW9uRmluaXNoZWQsXG4gIG9uTG9vcFN0YXJ0PzogSU9uTG9vcFN0YXJ0ZWQsXG4gIG9uTG9vcE5leHQ/OiBJT25Mb29wTmV4dCxcbiAgb25Mb29wRmluaXNoPzogSU9uTG9vcEZpbmlzaGVkLFxuICBvbk5vZGVSZXRyeT86IElPbk5vZGVSZXRyeSxcbiAgb25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWQ/OiBJT25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWQsXG4gIG9uUGFyYWxsZWxCcmFuY2hGaW5pc2hlZD86IElPblBhcmFsbGVsQnJhbmNoRmluaXNoZWQsXG4gIG9uVGV4dENodW5rPzogSU9uVGV4dENodW5rLFxuICBvblRUU0NodW5rPzogSU9uVFRTQ2h1bmssXG4gIG9uVFRTRW5kPzogSU9uVFRTRW5kLFxuICBvblRleHRSZXBsYWNlPzogSU9uVGV4dFJlcGxhY2UsXG4gIG9uQWdlbnRMb2c/OiBJT25BZ2VudExvZyxcbiAgb25EYXRhU291cmNlTm9kZVByb2Nlc3Npbmc/OiBJT25EYXRhU291cmNlTm9kZVByb2Nlc3NpbmcsXG4gIG9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQ/OiBJT25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCxcbiAgb25EYXRhU291cmNlTm9kZUVycm9yPzogSU9uRGF0YVNvdXJjZU5vZGVFcnJvcixcbikgPT4ge1xuICBpZiAoIXJlc3BvbnNlLm9rKVxuICAgIHRocm93IG5ldyBFcnJvcignTmV0d29yayByZXNwb25zZSB3YXMgbm90IG9rJylcblxuICBjb25zdCByZWFkZXIgPSByZXNwb25zZS5ib2R5Py5nZXRSZWFkZXIoKVxuICBjb25zdCBkZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpXG4gIGxldCBidWZmZXIgPSAnJ1xuICBsZXQgYnVmZmVyT2JqOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gIGxldCBpc0ZpcnN0TWVzc2FnZSA9IHRydWVcbiAgZnVuY3Rpb24gcmVhZCgpIHtcbiAgICBsZXQgaGFzRXJyb3IgPSBmYWxzZVxuICAgIHJlYWRlcj8ucmVhZCgpLnRoZW4oKHJlc3VsdDogUmVhZGFibGVTdHJlYW1SZWFkUmVzdWx0PFVpbnQ4QXJyYXk+KSA9PiB7XG4gICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgb25Db21wbGV0ZWQ/LigpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgYnVmZmVyICs9IGRlY29kZXIuZGVjb2RlKHJlc3VsdC52YWx1ZSwgeyBzdHJlYW06IHRydWUgfSlcbiAgICAgIGNvbnN0IGxpbmVzID0gYnVmZmVyLnNwbGl0KCdcXG4nKVxuICAgICAgdHJ5IHtcbiAgICAgICAgbGluZXMuZm9yRWFjaCgobWVzc2FnZSkgPT4ge1xuICAgICAgICAgIGlmIChtZXNzYWdlLnN0YXJ0c1dpdGgoJ2RhdGE6ICcpKSB7IC8vIGNoZWNrIGlmIGl0IHN0YXJ0cyB3aXRoIGRhdGE6XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBidWZmZXJPYmogPSBKU09OLnBhcnNlKG1lc3NhZ2Uuc3Vic3RyaW5nKDYpKSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+Ly8gcmVtb3ZlIGRhdGE6IGFuZCBwYXJzZSBhcyBqc29uXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgICAgIC8vIG11dGUgaGFuZGxlIG1lc3NhZ2UgY3V0IG9mZlxuICAgICAgICAgICAgICBvbkRhdGEoJycsIGlzRmlyc3RNZXNzYWdlLCB7XG4gICAgICAgICAgICAgICAgY29udmVyc2F0aW9uSWQ6IGJ1ZmZlck9iaj8uY29udmVyc2F0aW9uX2lkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogYnVmZmVyT2JqPy5tZXNzYWdlX2lkLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYnVmZmVyT2JqIHx8IHR5cGVvZiBidWZmZXJPYmogIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgIG9uRGF0YSgnJywgaXNGaXJzdE1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogJycsXG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiAnSW52YWxpZCByZXNwb25zZSBkYXRhJyxcbiAgICAgICAgICAgICAgICBlcnJvckNvZGU6ICdpbnZhbGlkX2RhdGEnLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBoYXNFcnJvciA9IHRydWVcbiAgICAgICAgICAgICAgb25Db21wbGV0ZWQ/Lih0cnVlLCAnSW52YWxpZCByZXNwb25zZSBkYXRhJylcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYnVmZmVyT2JqLnN0YXR1cyA9PT0gNDAwIHx8ICFidWZmZXJPYmouZXZlbnQpIHtcbiAgICAgICAgICAgICAgb25EYXRhKCcnLCBmYWxzZSwge1xuICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbklkOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZUlkOiAnJyxcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGJ1ZmZlck9iaj8ubWVzc2FnZSxcbiAgICAgICAgICAgICAgICBlcnJvckNvZGU6IGJ1ZmZlck9iaj8uY29kZSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgaGFzRXJyb3IgPSB0cnVlXG4gICAgICAgICAgICAgIG9uQ29tcGxldGVkPy4odHJ1ZSwgYnVmZmVyT2JqPy5tZXNzYWdlKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdtZXNzYWdlJyB8fCBidWZmZXJPYmouZXZlbnQgPT09ICdhZ2VudF9tZXNzYWdlJykge1xuICAgICAgICAgICAgICAvLyBjYW4gbm90IHVzZSBmb3JtYXQgaGVyZS4gQmVjYXVzZSBtZXNzYWdlIGlzIHNwbGl0dGVkLlxuICAgICAgICAgICAgICBvbkRhdGEodW5pY29kZVRvQ2hhcihidWZmZXJPYmouYW5zd2VyKSwgaXNGaXJzdE1lc3NhZ2UsIHtcbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25JZDogYnVmZmVyT2JqLmNvbnZlcnNhdGlvbl9pZCxcbiAgICAgICAgICAgICAgICB0YXNrSWQ6IGJ1ZmZlck9iai50YXNrX2lkLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VJZDogYnVmZmVyT2JqLmlkLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBpc0ZpcnN0TWVzc2FnZSA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdhZ2VudF90aG91Z2h0Jykge1xuICAgICAgICAgICAgICBvblRob3VnaHQ/LihidWZmZXJPYmogYXMgVGhvdWdodEl0ZW0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdtZXNzYWdlX2ZpbGUnKSB7XG4gICAgICAgICAgICAgIG9uRmlsZT8uKGJ1ZmZlck9iaiBhcyBWaXNpb25GaWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAnbWVzc2FnZV9lbmQnKSB7XG4gICAgICAgICAgICAgIG9uTWVzc2FnZUVuZD8uKGJ1ZmZlck9iaiBhcyBNZXNzYWdlRW5kKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAnbWVzc2FnZV9yZXBsYWNlJykge1xuICAgICAgICAgICAgICBvbk1lc3NhZ2VSZXBsYWNlPy4oYnVmZmVyT2JqIGFzIE1lc3NhZ2VSZXBsYWNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAnd29ya2Zsb3dfc3RhcnRlZCcpIHtcbiAgICAgICAgICAgICAgb25Xb3JrZmxvd1N0YXJ0ZWQ/LihidWZmZXJPYmogYXMgV29ya2Zsb3dTdGFydGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICd3b3JrZmxvd19maW5pc2hlZCcpIHtcbiAgICAgICAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkPy4oYnVmZmVyT2JqIGFzIFdvcmtmbG93RmluaXNoZWRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ25vZGVfc3RhcnRlZCcpIHtcbiAgICAgICAgICAgICAgb25Ob2RlU3RhcnRlZD8uKGJ1ZmZlck9iaiBhcyBOb2RlU3RhcnRlZFJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAnbm9kZV9maW5pc2hlZCcpIHtcbiAgICAgICAgICAgICAgb25Ob2RlRmluaXNoZWQ/LihidWZmZXJPYmogYXMgTm9kZUZpbmlzaGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdpdGVyYXRpb25fc3RhcnRlZCcpIHtcbiAgICAgICAgICAgICAgb25JdGVyYXRpb25TdGFydD8uKGJ1ZmZlck9iaiBhcyBJdGVyYXRpb25TdGFydGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdpdGVyYXRpb25fbmV4dCcpIHtcbiAgICAgICAgICAgICAgb25JdGVyYXRpb25OZXh0Py4oYnVmZmVyT2JqIGFzIEl0ZXJhdGlvbk5leHRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ2l0ZXJhdGlvbl9jb21wbGV0ZWQnKSB7XG4gICAgICAgICAgICAgIG9uSXRlcmF0aW9uRmluaXNoPy4oYnVmZmVyT2JqIGFzIEl0ZXJhdGlvbkZpbmlzaGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdsb29wX3N0YXJ0ZWQnKSB7XG4gICAgICAgICAgICAgIG9uTG9vcFN0YXJ0Py4oYnVmZmVyT2JqIGFzIExvb3BTdGFydGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdsb29wX25leHQnKSB7XG4gICAgICAgICAgICAgIG9uTG9vcE5leHQ/LihidWZmZXJPYmogYXMgTG9vcE5leHRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ2xvb3BfY29tcGxldGVkJykge1xuICAgICAgICAgICAgICBvbkxvb3BGaW5pc2g/LihidWZmZXJPYmogYXMgTG9vcEZpbmlzaGVkUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdub2RlX3JldHJ5Jykge1xuICAgICAgICAgICAgICBvbk5vZGVSZXRyeT8uKGJ1ZmZlck9iaiBhcyBOb2RlRmluaXNoZWRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ3BhcmFsbGVsX2JyYW5jaF9zdGFydGVkJykge1xuICAgICAgICAgICAgICBvblBhcmFsbGVsQnJhbmNoU3RhcnRlZD8uKGJ1ZmZlck9iaiBhcyBQYXJhbGxlbEJyYW5jaFN0YXJ0ZWRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ3BhcmFsbGVsX2JyYW5jaF9maW5pc2hlZCcpIHtcbiAgICAgICAgICAgICAgb25QYXJhbGxlbEJyYW5jaEZpbmlzaGVkPy4oYnVmZmVyT2JqIGFzIFBhcmFsbGVsQnJhbmNoRmluaXNoZWRSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ3RleHRfY2h1bmsnKSB7XG4gICAgICAgICAgICAgIG9uVGV4dENodW5rPy4oYnVmZmVyT2JqIGFzIFRleHRDaHVua1Jlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAndGV4dF9yZXBsYWNlJykge1xuICAgICAgICAgICAgICBvblRleHRSZXBsYWNlPy4oYnVmZmVyT2JqIGFzIFRleHRSZXBsYWNlUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdhZ2VudF9sb2cnKSB7XG4gICAgICAgICAgICAgIG9uQWdlbnRMb2c/LihidWZmZXJPYmogYXMgQWdlbnRMb2dSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ3R0c19tZXNzYWdlJykge1xuICAgICAgICAgICAgICBvblRUU0NodW5rPy4oYnVmZmVyT2JqLm1lc3NhZ2VfaWQsIGJ1ZmZlck9iai5hdWRpbywgYnVmZmVyT2JqLmF1ZGlvX3R5cGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICd0dHNfbWVzc2FnZV9lbmQnKSB7XG4gICAgICAgICAgICAgIG9uVFRTRW5kPy4oYnVmZmVyT2JqLm1lc3NhZ2VfaWQsIGJ1ZmZlck9iai5hdWRpbylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmZlck9iai5ldmVudCA9PT0gJ2RhdGFzb3VyY2VfcHJvY2Vzc2luZycpIHtcbiAgICAgICAgICAgICAgb25EYXRhU291cmNlTm9kZVByb2Nlc3Npbmc/LihidWZmZXJPYmogYXMgRGF0YVNvdXJjZU5vZGVQcm9jZXNzaW5nUmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChidWZmZXJPYmouZXZlbnQgPT09ICdkYXRhc291cmNlX2NvbXBsZXRlZCcpIHtcbiAgICAgICAgICAgICAgb25EYXRhU291cmNlTm9kZUNvbXBsZXRlZD8uKGJ1ZmZlck9iaiBhcyBEYXRhU291cmNlTm9kZUNvbXBsZXRlZFJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYnVmZmVyT2JqLmV2ZW50ID09PSAnZGF0YXNvdXJjZV9lcnJvcicpIHtcbiAgICAgICAgICAgICAgb25EYXRhU291cmNlTm9kZUVycm9yPy4oYnVmZmVyT2JqIGFzIERhdGFTb3VyY2VOb2RlRXJyb3JSZXNwb25zZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFVua25vd24gZXZlbnQ6ICR7YnVmZmVyT2JqLmV2ZW50fWAsIGJ1ZmZlck9iailcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGJ1ZmZlciA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdXG4gICAgICB9XG4gICAgICBjYXRjaCAoZSkge1xuICAgICAgICBvbkRhdGEoJycsIGZhbHNlLCB7XG4gICAgICAgICAgY29udmVyc2F0aW9uSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtZXNzYWdlSWQ6ICcnLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogYCR7ZX1gLFxuICAgICAgICB9KVxuICAgICAgICBoYXNFcnJvciA9IHRydWVcbiAgICAgICAgb25Db21wbGV0ZWQ/Lih0cnVlLCBlIGFzIHN0cmluZylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIWhhc0Vycm9yKVxuICAgICAgICByZWFkKClcbiAgICB9KVxuICB9XG4gIHJlYWQoKVxufVxuXG5jb25zdCBiYXNlRmV0Y2ggPSBiYXNlXG5cbnR5cGUgVXBsb2FkT3B0aW9ucyA9IHtcbiAgeGhyOiBYTUxIdHRwUmVxdWVzdFxuICBtZXRob2Q/OiBzdHJpbmdcbiAgdXJsPzogc3RyaW5nXG4gIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+XG4gIGRhdGE6IEZvcm1EYXRhXG4gIG9ucHJvZ3Jlc3M/OiAodGhpczogWE1MSHR0cFJlcXVlc3QsIGV2OiBQcm9ncmVzc0V2ZW50PEV2ZW50VGFyZ2V0PikgPT4gdm9pZFxufVxuXG50eXBlIFVwbG9hZFJlc3BvbnNlID0ge1xuICBpZDogc3RyaW5nXG4gIFtrZXk6IHN0cmluZ106IHVua25vd25cbn1cblxuZXhwb3J0IGNvbnN0IHVwbG9hZCA9IGFzeW5jIChvcHRpb25zOiBVcGxvYWRPcHRpb25zLCBpc1B1YmxpY0FQST86IGJvb2xlYW4sIHVybD86IHN0cmluZywgc2VhcmNoUGFyYW1zPzogc3RyaW5nKTogUHJvbWlzZTxVcGxvYWRSZXNwb25zZT4gPT4ge1xuICBjb25zdCB1cmxQcmVmaXggPSBpc1B1YmxpY0FQSSA/IFBVQkxJQ19BUElfUFJFRklYIDogQVBJX1BSRUZJWFxuICBjb25zdCBzaGFyZUNvZGUgPSBnbG9iYWxUaGlzLmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdXG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIHVybDogKHVybCA/IGAke3VybFByZWZpeH0ke3VybH1gIDogYCR7dXJsUHJlZml4fS9maWxlcy91cGxvYWRgKSArIChzZWFyY2hQYXJhbXMgfHwgJycpLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFtDU1JGX0hFQURFUl9OQU1FXTogQ29va2llcy5nZXQoQ1NSRl9DT09LSUVfTkFNRSgpKSB8fCAnJyxcbiAgICAgIFtQQVNTUE9SVF9IRUFERVJfTkFNRV06IGdldFdlYkFwcFBhc3Nwb3J0KHNoYXJlQ29kZSksXG4gICAgICBbV0VCX0FQUF9TSEFSRV9DT0RFX0hFQURFUl9OQU1FXTogc2hhcmVDb2RlLFxuICAgIH0sXG4gIH1cbiAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAuLi5vcHRpb25zLFxuICAgIHVybDogb3B0aW9ucy51cmwgfHwgZGVmYXVsdE9wdGlvbnMudXJsLFxuICAgIGhlYWRlcnM6IHsgLi4uZGVmYXVsdE9wdGlvbnMuaGVhZGVycywgLi4ub3B0aW9ucy5oZWFkZXJzIH0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHhociA9IG1lcmdlZE9wdGlvbnMueGhyXG4gICAgeGhyLm9wZW4obWVyZ2VkT3B0aW9ucy5tZXRob2QsIG1lcmdlZE9wdGlvbnMudXJsKVxuICAgIGZvciAoY29uc3Qga2V5IGluIG1lcmdlZE9wdGlvbnMuaGVhZGVycylcbiAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgbWVyZ2VkT3B0aW9ucy5oZWFkZXJzW2tleV0pXG5cbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbidcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDEpXG4gICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWplY3QoeGhyKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWVyZ2VkT3B0aW9ucy5vbnByb2dyZXNzKVxuICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gbWVyZ2VkT3B0aW9ucy5vbnByb2dyZXNzXG4gICAgeGhyLnNlbmQobWVyZ2VkT3B0aW9ucy5kYXRhKVxuICB9KVxufVxuXG5leHBvcnQgY29uc3Qgc3NlUG9zdCA9IGFzeW5jIChcbiAgdXJsOiBzdHJpbmcsXG4gIGZldGNoT3B0aW9uczogRmV0Y2hPcHRpb25UeXBlLFxuICBvdGhlck9wdGlvbnM6IElPdGhlck9wdGlvbnMsXG4pID0+IHtcbiAgY29uc3Qge1xuICAgIGlzUHVibGljQVBJID0gZmFsc2UsXG4gICAgb25EYXRhLFxuICAgIG9uQ29tcGxldGVkLFxuICAgIG9uVGhvdWdodCxcbiAgICBvbkZpbGUsXG4gICAgb25NZXNzYWdlRW5kLFxuICAgIG9uTWVzc2FnZVJlcGxhY2UsXG4gICAgb25Xb3JrZmxvd1N0YXJ0ZWQsXG4gICAgb25Xb3JrZmxvd0ZpbmlzaGVkLFxuICAgIG9uTm9kZVN0YXJ0ZWQsXG4gICAgb25Ob2RlRmluaXNoZWQsXG4gICAgb25JdGVyYXRpb25TdGFydCxcbiAgICBvbkl0ZXJhdGlvbk5leHQsXG4gICAgb25JdGVyYXRpb25GaW5pc2gsXG4gICAgb25Ob2RlUmV0cnksXG4gICAgb25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWQsXG4gICAgb25QYXJhbGxlbEJyYW5jaEZpbmlzaGVkLFxuICAgIG9uVGV4dENodW5rLFxuICAgIG9uVFRTQ2h1bmssXG4gICAgb25UVFNFbmQsXG4gICAgb25UZXh0UmVwbGFjZSxcbiAgICBvbkFnZW50TG9nLFxuICAgIG9uRXJyb3IsXG4gICAgZ2V0QWJvcnRDb250cm9sbGVyLFxuICAgIG9uTG9vcFN0YXJ0LFxuICAgIG9uTG9vcE5leHQsXG4gICAgb25Mb29wRmluaXNoLFxuICAgIG9uRGF0YVNvdXJjZU5vZGVQcm9jZXNzaW5nLFxuICAgIG9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQsXG4gICAgb25EYXRhU291cmNlTm9kZUVycm9yLFxuICB9ID0gb3RoZXJPcHRpb25zXG4gIGNvbnN0IGFib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuXG4gIC8vIE5vIG5lZWQgdG8gZ2V0IHRva2VuIGZyb20gbG9jYWxTdG9yYWdlLCBjb29raWVzIHdpbGwgYmUgc2VudCBhdXRvbWF0aWNhbGx5XG5cbiAgY29uc3QgYmFzZU9wdGlvbnMgPSBnZXRCYXNlT3B0aW9ucygpXG4gIGNvbnN0IHNoYXJlQ29kZSA9IGdsb2JhbFRoaXMubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKS5zbGljZSgtMSlbMF1cbiAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGJhc2VPcHRpb25zLCB7XG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgc2lnbmFsOiBhYm9ydENvbnRyb2xsZXIuc2lnbmFsLFxuICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgIFtDU1JGX0hFQURFUl9OQU1FXTogQ29va2llcy5nZXQoQ1NSRl9DT09LSUVfTkFNRSgpKSB8fCAnJyxcbiAgICAgIFtXRUJfQVBQX1NIQVJFX0NPREVfSEVBREVSX05BTUVdOiBzaGFyZUNvZGUsXG4gICAgICBbUEFTU1BPUlRfSEVBREVSX05BTUVdOiBnZXRXZWJBcHBQYXNzcG9ydChzaGFyZUNvZGUpLFxuICAgIH0pLFxuICB9IGFzIFJlcXVlc3RJbml0LCBmZXRjaE9wdGlvbnMpXG5cbiAgY29uc3QgY29udGVudFR5cGUgPSAob3B0aW9ucy5oZWFkZXJzIGFzIEhlYWRlcnMpLmdldCgnQ29udGVudC1UeXBlJylcbiAgaWYgKCFjb250ZW50VHlwZSlcbiAgICAob3B0aW9ucy5oZWFkZXJzIGFzIEhlYWRlcnMpLnNldCgnQ29udGVudC1UeXBlJywgQ29udGVudFR5cGUuanNvbilcblxuICBnZXRBYm9ydENvbnRyb2xsZXI/LihhYm9ydENvbnRyb2xsZXIpXG5cbiAgY29uc3QgdXJsUHJlZml4ID0gaXNQdWJsaWNBUEkgPyBQVUJMSUNfQVBJX1BSRUZJWCA6IEFQSV9QUkVGSVhcbiAgY29uc3QgdXJsV2l0aFByZWZpeCA9ICh1cmwuc3RhcnRzV2l0aCgnaHR0cDovLycpIHx8IHVybC5zdGFydHNXaXRoKCdodHRwczovLycpKVxuICAgID8gdXJsXG4gICAgOiBgJHt1cmxQcmVmaXh9JHt1cmwuc3RhcnRzV2l0aCgnLycpID8gdXJsIDogYC8ke3VybH1gfWBcblxuICBjb25zdCB7IGJvZHkgfSA9IG9wdGlvbnNcbiAgaWYgKGJvZHkpXG4gICAgb3B0aW9ucy5ib2R5ID0gSlNPTi5zdHJpbmdpZnkoYm9keSlcblxuICBnbG9iYWxUaGlzLmZldGNoKHVybFdpdGhQcmVmaXgsIG9wdGlvbnMgYXMgUmVxdWVzdEluaXQpXG4gICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgaWYgKCEvXlsyM11cXGR7Mn0kLy50ZXN0KFN0cmluZyhyZXMuc3RhdHVzKSkpIHtcbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICAgIGlmIChpc1B1YmxpY0FQSSkge1xuICAgICAgICAgICAgcmVzLmpzb24oKS50aGVuKChkYXRhOiB7IGNvZGU/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICAgICAgICBpZiAoaXNQdWJsaWNBUEkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAnd2ViX2FwcF9hY2Nlc3NfZGVuaWVkJylcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkV2ViU1NPTG9naW4oZGF0YS5tZXNzYWdlLCA0MDMpXG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAnd2ViX3Nzb19hdXRoX3JlcXVpcmVkJylcbiAgICAgICAgICAgICAgICAgIHJlcXVpcmVkV2ViU1NPTG9naW4oKVxuXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PT0gJ3VuYXV0aG9yaXplZCcpXG4gICAgICAgICAgICAgICAgICByZXF1aXJlZFdlYlNTT0xvZ2luKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZWZyZXNoQWNjZXNzVG9rZW5PclJlbG9naW4oVElNRV9PVVQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBzc2VQb3N0KHVybCwgZmV0Y2hPcHRpb25zLCBvdGhlck9wdGlvbnMpXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzLmpzb24oKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBkYXRhLm1lc3NhZ2UgfHwgJ1NlcnZlciBFcnJvcicgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIG9uRXJyb3I/LignU2VydmVyIEVycm9yJylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHJldHVybiBoYW5kbGVTdHJlYW0oXG4gICAgICAgIHJlcyxcbiAgICAgICAgKHN0cjogc3RyaW5nLCBpc0ZpcnN0TWVzc2FnZTogYm9vbGVhbiwgbW9yZUluZm86IElPbkRhdGFNb3JlSW5mbykgPT4ge1xuICAgICAgICAgIGlmIChtb3JlSW5mby5lcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgIG9uRXJyb3I/Lihtb3JlSW5mby5lcnJvck1lc3NhZ2UsIG1vcmVJbmZvLmVycm9yQ29kZSlcbiAgICAgICAgICAgIC8vIFR5cGVFcnJvcjogQ2Fubm90IGFzc2lnbiB0byByZWFkIG9ubHkgcHJvcGVydHkgLi4uIHdpbGwgaGFwcGVuIGluIHBhZ2UgbGVhdmUsIHNvIGl0IHNob3VsZCBiZSBpZ25vcmVkLlxuICAgICAgICAgICAgaWYgKG1vcmVJbmZvLmVycm9yTWVzc2FnZSAhPT0gJ0Fib3J0RXJyb3I6IFRoZSB1c2VyIGFib3J0ZWQgYSByZXF1ZXN0LicgJiYgIW1vcmVJbmZvLmVycm9yTWVzc2FnZS5pbmNsdWRlcygnVHlwZUVycm9yOiBDYW5ub3QgYXNzaWduIHRvIHJlYWQgb25seSBwcm9wZXJ0eScpKVxuICAgICAgICAgICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBtb3JlSW5mby5lcnJvck1lc3NhZ2UgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBvbkRhdGE/LihzdHIsIGlzRmlyc3RNZXNzYWdlLCBtb3JlSW5mbylcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZWQsXG4gICAgICAgIG9uVGhvdWdodCxcbiAgICAgICAgb25NZXNzYWdlRW5kLFxuICAgICAgICBvbk1lc3NhZ2VSZXBsYWNlLFxuICAgICAgICBvbkZpbGUsXG4gICAgICAgIG9uV29ya2Zsb3dTdGFydGVkLFxuICAgICAgICBvbldvcmtmbG93RmluaXNoZWQsXG4gICAgICAgIG9uTm9kZVN0YXJ0ZWQsXG4gICAgICAgIG9uTm9kZUZpbmlzaGVkLFxuICAgICAgICBvbkl0ZXJhdGlvblN0YXJ0LFxuICAgICAgICBvbkl0ZXJhdGlvbk5leHQsXG4gICAgICAgIG9uSXRlcmF0aW9uRmluaXNoLFxuICAgICAgICBvbkxvb3BTdGFydCxcbiAgICAgICAgb25Mb29wTmV4dCxcbiAgICAgICAgb25Mb29wRmluaXNoLFxuICAgICAgICBvbk5vZGVSZXRyeSxcbiAgICAgICAgb25QYXJhbGxlbEJyYW5jaFN0YXJ0ZWQsXG4gICAgICAgIG9uUGFyYWxsZWxCcmFuY2hGaW5pc2hlZCxcbiAgICAgICAgb25UZXh0Q2h1bmssXG4gICAgICAgIG9uVFRTQ2h1bmssXG4gICAgICAgIG9uVFRTRW5kLFxuICAgICAgICBvblRleHRSZXBsYWNlLFxuICAgICAgICBvbkFnZW50TG9nLFxuICAgICAgICBvbkRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZyxcbiAgICAgICAgb25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCxcbiAgICAgICAgb25EYXRhU291cmNlTm9kZUVycm9yLFxuICAgICAgKVxuICAgIH0pXG4gICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICBpZiAoZS50b1N0cmluZygpICE9PSAnQWJvcnRFcnJvcjogVGhlIHVzZXIgYWJvcnRlZCBhIHJlcXVlc3QuJyAmJiAhZS50b1N0cmluZygpLmluY2x1ZGVzKCdUeXBlRXJyb3I6IENhbm5vdCBhc3NpZ24gdG8gcmVhZCBvbmx5IHByb3BlcnR5JykpXG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGUgfSlcbiAgICAgIG9uRXJyb3I/LihlKVxuICAgIH0pXG59XG5cbi8vIGJhc2UgcmVxdWVzdFxuZXhwb3J0IGNvbnN0IHJlcXVlc3QgPSBhc3luYzxUPih1cmw6IHN0cmluZywgb3B0aW9ucyA9IHt9LCBvdGhlck9wdGlvbnM/OiBJT3RoZXJPcHRpb25zKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3RoZXJPcHRpb25zRm9yQmFzZUZldGNoID0gb3RoZXJPcHRpb25zIHx8IHt9XG4gICAgY29uc3QgW2VyciwgcmVzcF0gPSBhd2FpdCBhc3luY1J1blNhZmU8VD4oYmFzZUZldGNoKHVybCwgb3B0aW9ucywgb3RoZXJPcHRpb25zRm9yQmFzZUZldGNoKSlcbiAgICBpZiAoZXJyID09PSBudWxsKVxuICAgICAgcmV0dXJuIHJlc3BcbiAgICBjb25zdCBlcnJSZXNwOiBSZXNwb25zZSA9IGVyciBhcyBhbnlcbiAgICBpZiAoZXJyUmVzcC5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgY29uc3QgW3BhcnNlRXJyLCBlcnJSZXNwRGF0YV0gPSBhd2FpdCBhc3luY1J1blNhZmU8UmVzcG9uc2VFcnJvcj4oZXJyUmVzcC5qc29uKCkpXG4gICAgICBjb25zdCBsb2dpblVybCA9IGAke2dsb2JhbFRoaXMubG9jYXRpb24ub3JpZ2lufSR7YmFzZVBhdGh9L3NpZ25pbmBcbiAgICAgIGlmIChwYXJzZUVycikge1xuICAgICAgICBnbG9iYWxUaGlzLmxvY2F0aW9uLmhyZWYgPSBsb2dpblVybFxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgICAgfVxuICAgICAgaWYgKC9cXC9sb2dpbi8udGVzdCh1cmwpKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyUmVzcERhdGEpXG4gICAgICAvLyBzcGVjaWFsIGNvZGVcbiAgICAgIGNvbnN0IHsgY29kZSwgbWVzc2FnZSB9ID0gZXJyUmVzcERhdGFcbiAgICAgIC8vIHdlYmFwcCBzc29cbiAgICAgIGlmIChjb2RlID09PSAnd2ViX2FwcF9hY2Nlc3NfZGVuaWVkJykge1xuICAgICAgICByZXF1aXJlZFdlYlNTT0xvZ2luKG1lc3NhZ2UsIDQwMylcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSAnd2ViX3Nzb19hdXRoX3JlcXVpcmVkJykge1xuICAgICAgICByZXF1aXJlZFdlYlNTT0xvZ2luKClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSAndW5hdXRob3JpemVkX2FuZF9mb3JjZV9sb2dvdXQnKSB7XG4gICAgICAgIC8vIENvb2tpZXMgd2lsbCBiZSBjbGVhcmVkIGJ5IHRoZSBiYWNrZW5kXG4gICAgICAgIGdsb2JhbFRoaXMubG9jYXRpb24ucmVsb2FkKClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH1cbiAgICAgIGNvbnN0IHtcbiAgICAgICAgaXNQdWJsaWNBUEkgPSBmYWxzZSxcbiAgICAgICAgc2lsZW50LFxuICAgICAgfSA9IG90aGVyT3B0aW9uc0ZvckJhc2VGZXRjaFxuICAgICAgaWYgKGlzUHVibGljQVBJICYmIGNvZGUgPT09ICd1bmF1dGhvcml6ZWQnKSB7XG4gICAgICAgIHJlcXVpcmVkV2ViU1NPTG9naW4oKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKVxuICAgICAgfVxuICAgICAgaWYgKGNvZGUgPT09ICdpbml0X3ZhbGlkYXRlX2ZhaWxlZCcgJiYgSVNfQ0VfRURJVElPTiAmJiAhc2lsZW50KSB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UsIGR1cmF0aW9uOiA0MDAwIH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gJ25vdF9pbml0X3ZhbGlkYXRlZCcgJiYgSVNfQ0VfRURJVElPTikge1xuICAgICAgICBqdW1wVG8oYCR7Z2xvYmFsVGhpcy5sb2NhdGlvbi5vcmlnaW59JHtiYXNlUGF0aH0vaW5pdGApXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICB9XG4gICAgICBpZiAoY29kZSA9PT0gJ25vdF9zZXR1cCcgJiYgSVNfQ0VfRURJVElPTikge1xuICAgICAgICBqdW1wVG8oYCR7Z2xvYmFsVGhpcy5sb2NhdGlvbi5vcmlnaW59JHtiYXNlUGF0aH0vaW5zdGFsbGApXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgICB9XG5cbiAgICAgIC8vIHJlZnJlc2ggdG9rZW5cbiAgICAgIGNvbnN0IFtyZWZyZXNoRXJyXSA9IGF3YWl0IGFzeW5jUnVuU2FmZShyZWZyZXNoQWNjZXNzVG9rZW5PclJlbG9naW4oVElNRV9PVVQpKVxuICAgICAgaWYgKHJlZnJlc2hFcnIgPT09IG51bGwpXG4gICAgICAgIHJldHVybiBiYXNlRmV0Y2g8VD4odXJsLCBvcHRpb25zLCBvdGhlck9wdGlvbnNGb3JCYXNlRmV0Y2gpXG4gICAgICBpZiAobG9jYXRpb24ucGF0aG5hbWUgIT09IGAke2Jhc2VQYXRofS9zaWduaW5gIHx8ICFJU19DRV9FRElUSU9OKSB7XG4gICAgICAgIGp1bXBUbyhsb2dpblVybClcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH1cbiAgICAgIGlmICghc2lsZW50KSB7XG4gICAgICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICAgIH1cbiAgICAgIGp1bXBUbyhsb2dpblVybClcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlcnIpXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycilcbiAgICB9XG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpXG4gIH1cbn1cblxuLy8gcmVxdWVzdCBtZXRob2RzXG5leHBvcnQgY29uc3QgZ2V0ID0gPFQ+KHVybDogc3RyaW5nLCBvcHRpb25zID0ge30sIG90aGVyT3B0aW9ucz86IElPdGhlck9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHJlcXVlc3Q8VD4odXJsLCBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IG1ldGhvZDogJ0dFVCcgfSksIG90aGVyT3B0aW9ucylcbn1cblxuLy8gRm9yIHB1YmxpYyBBUElcbmV4cG9ydCBjb25zdCBnZXRQdWJsaWMgPSA8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSwgb3RoZXJPcHRpb25zPzogSU90aGVyT3B0aW9ucykgPT4ge1xuICByZXR1cm4gZ2V0PFQ+KHVybCwgb3B0aW9ucywgeyAuLi5vdGhlck9wdGlvbnMsIGlzUHVibGljQVBJOiB0cnVlIH0pXG59XG5cbi8vIEZvciBNYXJrZXRwbGFjZSBBUElcbmV4cG9ydCBjb25zdCBnZXRNYXJrZXRwbGFjZSA9IDxUPih1cmw6IHN0cmluZywgb3B0aW9ucyA9IHt9LCBvdGhlck9wdGlvbnM/OiBJT3RoZXJPcHRpb25zKSA9PiB7XG4gIHJldHVybiBnZXQ8VD4odXJsLCBvcHRpb25zLCB7IC4uLm90aGVyT3B0aW9ucywgaXNNYXJrZXRwbGFjZUFQSTogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgcG9zdCA9IDxUPih1cmw6IHN0cmluZywgb3B0aW9ucyA9IHt9LCBvdGhlck9wdGlvbnM/OiBJT3RoZXJPcHRpb25zKSA9PiB7XG4gIHJldHVybiByZXF1ZXN0PFQ+KHVybCwgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywgeyBtZXRob2Q6ICdQT1NUJyB9KSwgb3RoZXJPcHRpb25zKVxufVxuXG4vLyBGb3IgTWFya2V0cGxhY2UgQVBJXG5leHBvcnQgY29uc3QgcG9zdE1hcmtldHBsYWNlID0gPFQ+KHVybDogc3RyaW5nLCBvcHRpb25zID0ge30sIG90aGVyT3B0aW9ucz86IElPdGhlck9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHBvc3Q8VD4odXJsLCBvcHRpb25zLCB7IC4uLm90aGVyT3B0aW9ucywgaXNNYXJrZXRwbGFjZUFQSTogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgcG9zdFB1YmxpYyA9IDxUPih1cmw6IHN0cmluZywgb3B0aW9ucyA9IHt9LCBvdGhlck9wdGlvbnM/OiBJT3RoZXJPcHRpb25zKSA9PiB7XG4gIHJldHVybiBwb3N0PFQ+KHVybCwgb3B0aW9ucywgeyAuLi5vdGhlck9wdGlvbnMsIGlzUHVibGljQVBJOiB0cnVlIH0pXG59XG5cbmV4cG9ydCBjb25zdCBwdXQgPSA8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSwgb3RoZXJPcHRpb25zPzogSU90aGVyT3B0aW9ucykgPT4ge1xuICByZXR1cm4gcmVxdWVzdDxUPih1cmwsIE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMsIHsgbWV0aG9kOiAnUFVUJyB9KSwgb3RoZXJPcHRpb25zKVxufVxuXG5leHBvcnQgY29uc3QgcHV0UHVibGljID0gPFQ+KHVybDogc3RyaW5nLCBvcHRpb25zID0ge30sIG90aGVyT3B0aW9ucz86IElPdGhlck9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHB1dDxUPih1cmwsIG9wdGlvbnMsIHsgLi4ub3RoZXJPcHRpb25zLCBpc1B1YmxpY0FQSTogdHJ1ZSB9KVxufVxuXG5leHBvcnQgY29uc3QgZGVsID0gPFQ+KHVybDogc3RyaW5nLCBvcHRpb25zID0ge30sIG90aGVyT3B0aW9ucz86IElPdGhlck9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHJlcXVlc3Q8VD4odXJsLCBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IG1ldGhvZDogJ0RFTEVURScgfSksIG90aGVyT3B0aW9ucylcbn1cblxuZXhwb3J0IGNvbnN0IGRlbFB1YmxpYyA9IDxUPih1cmw6IHN0cmluZywgb3B0aW9ucyA9IHt9LCBvdGhlck9wdGlvbnM/OiBJT3RoZXJPcHRpb25zKSA9PiB7XG4gIHJldHVybiBkZWw8VD4odXJsLCBvcHRpb25zLCB7IC4uLm90aGVyT3B0aW9ucywgaXNQdWJsaWNBUEk6IHRydWUgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHBhdGNoID0gPFQ+KHVybDogc3RyaW5nLCBvcHRpb25zID0ge30sIG90aGVyT3B0aW9ucz86IElPdGhlck9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIHJlcXVlc3Q8VD4odXJsLCBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7IG1ldGhvZDogJ1BBVENIJyB9KSwgb3RoZXJPcHRpb25zKVxufVxuXG5leHBvcnQgY29uc3QgcGF0Y2hQdWJsaWMgPSA8VD4odXJsOiBzdHJpbmcsIG9wdGlvbnMgPSB7fSwgb3RoZXJPcHRpb25zPzogSU90aGVyT3B0aW9ucykgPT4ge1xuICByZXR1cm4gcGF0Y2g8VD4odXJsLCBvcHRpb25zLCB7IC4uLm90aGVyT3B0aW9ucywgaXNQdWJsaWNBUEk6IHRydWUgfSlcbn1cbiJdfQ==