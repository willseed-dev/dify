"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFile = exports.useFileSizeLimit = void 0;
const function_1 = require("es-toolkit/function");
const immer_1 = require("immer");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const uuid_1 = require("uuid");
const constants_1 = require("@/app/components/base/file-uploader/constants");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const common_1 = require("@/service/common");
const app_1 = require("@/types/app");
const format_1 = require("@/utils/format");
const store_1 = require("./store");
const utils_1 = require("./utils");
const useFileSizeLimit = (fileUploadConfig) => {
    const imgSizeLimit = Number(fileUploadConfig?.image_file_size_limit) * 1024 * 1024 || constants_1.IMG_SIZE_LIMIT;
    const docSizeLimit = Number(fileUploadConfig?.file_size_limit) * 1024 * 1024 || constants_1.FILE_SIZE_LIMIT;
    const audioSizeLimit = Number(fileUploadConfig?.audio_file_size_limit) * 1024 * 1024 || constants_1.AUDIO_SIZE_LIMIT;
    const videoSizeLimit = Number(fileUploadConfig?.video_file_size_limit) * 1024 * 1024 || constants_1.VIDEO_SIZE_LIMIT;
    const maxFileUploadLimit = Number(fileUploadConfig?.workflow_file_upload_limit) || constants_1.MAX_FILE_UPLOAD_LIMIT;
    return {
        imgSizeLimit,
        docSizeLimit,
        audioSizeLimit,
        videoSizeLimit,
        maxFileUploadLimit,
    };
};
exports.useFileSizeLimit = useFileSizeLimit;
const useFile = (fileConfig, noNeedToCheckEnable = true) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const fileStore = (0, store_1.useFileStore)();
    const params = (0, navigation_1.useParams)();
    const { imgSizeLimit, docSizeLimit, audioSizeLimit, videoSizeLimit } = (0, exports.useFileSizeLimit)(fileConfig.fileUploadConfig);
    const checkSizeLimit = (0, react_1.useCallback)((fileType, fileSize) => {
        switch (fileType) {
            case types_1.SupportUploadFileTypes.image: {
                if (fileSize > imgSizeLimit) {
                    notify({
                        type: 'error',
                        message: t('fileUploader.uploadFromComputerLimit', {
                            ns: 'common',
                            type: types_1.SupportUploadFileTypes.image,
                            size: (0, format_1.formatFileSize)(imgSizeLimit),
                        }),
                    });
                    return false;
                }
                return true;
            }
            case types_1.SupportUploadFileTypes.custom:
            case types_1.SupportUploadFileTypes.document: {
                if (fileSize > docSizeLimit) {
                    notify({
                        type: 'error',
                        message: t('fileUploader.uploadFromComputerLimit', {
                            ns: 'common',
                            type: types_1.SupportUploadFileTypes.document,
                            size: (0, format_1.formatFileSize)(docSizeLimit),
                        }),
                    });
                    return false;
                }
                return true;
            }
            case types_1.SupportUploadFileTypes.audio: {
                if (fileSize > audioSizeLimit) {
                    notify({
                        type: 'error',
                        message: t('fileUploader.uploadFromComputerLimit', {
                            ns: 'common',
                            type: types_1.SupportUploadFileTypes.audio,
                            size: (0, format_1.formatFileSize)(audioSizeLimit),
                        }),
                    });
                    return false;
                }
                return true;
            }
            case types_1.SupportUploadFileTypes.video: {
                if (fileSize > videoSizeLimit) {
                    notify({
                        type: 'error',
                        message: t('fileUploader.uploadFromComputerLimit', {
                            ns: 'common',
                            type: types_1.SupportUploadFileTypes.video,
                            size: (0, format_1.formatFileSize)(videoSizeLimit),
                        }),
                    });
                    return false;
                }
                return true;
            }
            default: {
                return true;
            }
        }
    }, [audioSizeLimit, docSizeLimit, imgSizeLimit, notify, t, videoSizeLimit]);
    const handleAddFile = (0, react_1.useCallback)((newFile) => {
        const { files, setFiles, } = fileStore.getState();
        const newFiles = (0, immer_1.produce)(files, (draft) => {
            draft.push(newFile);
        });
        setFiles(newFiles);
    }, [fileStore]);
    const handleUpdateFile = (0, react_1.useCallback)((newFile) => {
        const { files, setFiles, } = fileStore.getState();
        const newFiles = (0, immer_1.produce)(files, (draft) => {
            const index = draft.findIndex(file => file.id === newFile.id);
            if (index > -1)
                draft[index] = newFile;
        });
        setFiles(newFiles);
    }, [fileStore]);
    const handleRemoveFile = (0, react_1.useCallback)((fileId) => {
        const { files, setFiles, } = fileStore.getState();
        const newFiles = files.filter(file => file.id !== fileId);
        setFiles(newFiles);
    }, [fileStore]);
    const handleReUploadFile = (0, react_1.useCallback)((fileId) => {
        const { files, setFiles, } = fileStore.getState();
        const index = files.findIndex(file => file.id === fileId);
        if (index > -1) {
            const uploadingFile = files[index];
            const newFiles = (0, immer_1.produce)(files, (draft) => {
                draft[index].progress = 0;
            });
            setFiles(newFiles);
            (0, utils_1.fileUpload)({
                file: uploadingFile.originalFile,
                onProgressCallback: (progress) => {
                    handleUpdateFile({ ...uploadingFile, progress });
                },
                onSuccessCallback: (res) => {
                    handleUpdateFile({ ...uploadingFile, uploadedId: res.id, progress: 100 });
                },
                onErrorCallback: (error) => {
                    const errorMessage = (0, utils_1.getFileUploadErrorMessage)(error, t('fileUploader.uploadFromComputerUploadError', { ns: 'common' }), t);
                    notify({ type: 'error', message: errorMessage });
                    handleUpdateFile({ ...uploadingFile, progress: -1 });
                },
            }, !!params.token);
        }
    }, [fileStore, notify, t, handleUpdateFile, params]);
    const startProgressTimer = (0, react_1.useCallback)((fileId) => {
        const timer = setInterval(() => {
            const files = fileStore.getState().files;
            const file = files.find(file => file.id === fileId);
            if (file && file.progress < 80 && file.progress >= 0)
                handleUpdateFile({ ...file, progress: file.progress + 20 });
            else
                clearTimeout(timer);
        }, 200);
    }, [fileStore, handleUpdateFile]);
    const handleLoadFileFromLink = (0, react_1.useCallback)((url) => {
        const allowedFileTypes = fileConfig.allowed_file_types;
        const uploadingFile = {
            id: (0, uuid_1.v4)(),
            name: url,
            type: '',
            size: 0,
            progress: 0,
            transferMethod: app_1.TransferMethod.remote_url,
            supportFileType: '',
            url,
            isRemote: true,
        };
        handleAddFile(uploadingFile);
        startProgressTimer(uploadingFile.id);
        (0, common_1.uploadRemoteFileInfo)(url, !!params.token).then((res) => {
            const newFile = {
                ...uploadingFile,
                type: res.mime_type,
                size: res.size,
                progress: 100,
                supportFileType: (0, utils_1.getSupportFileType)(res.name, res.mime_type, allowedFileTypes?.includes(types_1.SupportUploadFileTypes.custom)),
                uploadedId: res.id,
                url: res.url,
            };
            if (!(0, utils_1.isAllowedFileExtension)(res.name, res.mime_type, fileConfig.allowed_file_types || [], fileConfig.allowed_file_extensions || [])) {
                notify({ type: 'error', message: `${t('fileUploader.fileExtensionNotSupport', { ns: 'common' })} ${newFile.type}` });
                handleRemoveFile(uploadingFile.id);
            }
            if (!checkSizeLimit(newFile.supportFileType, newFile.size))
                handleRemoveFile(uploadingFile.id);
            else
                handleUpdateFile(newFile);
        }).catch(() => {
            notify({ type: 'error', message: t('fileUploader.pasteFileLinkInvalid', { ns: 'common' }) });
            handleRemoveFile(uploadingFile.id);
        });
    }, [checkSizeLimit, handleAddFile, handleUpdateFile, notify, t, handleRemoveFile, fileConfig?.allowed_file_types, fileConfig.allowed_file_extensions, startProgressTimer, params.token]);
    const handleLoadFileFromLinkSuccess = (0, react_1.useCallback)(function_1.noop, []);
    const handleLoadFileFromLinkError = (0, react_1.useCallback)(function_1.noop, []);
    const handleClearFiles = (0, react_1.useCallback)(() => {
        const { setFiles, } = fileStore.getState();
        setFiles([]);
    }, [fileStore]);
    const handleLocalFileUpload = (0, react_1.useCallback)((file) => {
        // Check file upload enabled
        if (!noNeedToCheckEnable && !fileConfig.enabled) {
            notify({ type: 'error', message: t('fileUploader.uploadDisabled', { ns: 'common' }) });
            return;
        }
        if (!(0, utils_1.isAllowedFileExtension)(file.name, file.type, fileConfig.allowed_file_types || [], fileConfig.allowed_file_extensions || [])) {
            notify({ type: 'error', message: `${t('fileUploader.fileExtensionNotSupport', { ns: 'common' })} ${file.type}` });
            return;
        }
        const allowedFileTypes = fileConfig.allowed_file_types;
        const fileType = (0, utils_1.getSupportFileType)(file.name, file.type, allowedFileTypes?.includes(types_1.SupportUploadFileTypes.custom));
        if (!checkSizeLimit(fileType, file.size))
            return;
        const reader = new FileReader();
        const isImage = file.type.startsWith('image');
        reader.addEventListener('load', () => {
            const uploadingFile = {
                id: (0, uuid_1.v4)(),
                name: file.name,
                type: file.type,
                size: file.size,
                progress: 0,
                transferMethod: app_1.TransferMethod.local_file,
                supportFileType: (0, utils_1.getSupportFileType)(file.name, file.type, allowedFileTypes?.includes(types_1.SupportUploadFileTypes.custom)),
                originalFile: file,
                base64Url: isImage ? reader.result : '',
            };
            handleAddFile(uploadingFile);
            (0, utils_1.fileUpload)({
                file: uploadingFile.originalFile,
                onProgressCallback: (progress) => {
                    handleUpdateFile({ ...uploadingFile, progress });
                },
                onSuccessCallback: (res) => {
                    handleUpdateFile({ ...uploadingFile, uploadedId: res.id, progress: 100 });
                },
                onErrorCallback: (error) => {
                    const errorMessage = (0, utils_1.getFileUploadErrorMessage)(error, t('fileUploader.uploadFromComputerUploadError', { ns: 'common' }), t);
                    notify({ type: 'error', message: errorMessage });
                    handleUpdateFile({ ...uploadingFile, progress: -1 });
                },
            }, !!params.token);
        }, false);
        reader.addEventListener('error', () => {
            notify({ type: 'error', message: t('fileUploader.uploadFromComputerReadError', { ns: 'common' }) });
        }, false);
        reader.readAsDataURL(file);
    }, [noNeedToCheckEnable, checkSizeLimit, notify, t, handleAddFile, handleUpdateFile, params.token, fileConfig?.allowed_file_types, fileConfig?.allowed_file_extensions, fileConfig?.enabled]);
    const handleClipboardPasteFile = (0, react_1.useCallback)((e) => {
        const file = e.clipboardData?.files[0];
        const text = e.clipboardData?.getData('text/plain');
        if (file && !text) {
            e.preventDefault();
            handleLocalFileUpload(file);
        }
    }, [handleLocalFileUpload]);
    const [isDragActive, setIsDragActive] = (0, react_1.useState)(false);
    const handleDragFileEnter = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);
    const handleDragFileOver = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const handleDragFileLeave = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);
    const handleDropFile = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file)
            handleLocalFileUpload(file);
    }, [handleLocalFileUpload]);
    return {
        handleAddFile,
        handleUpdateFile,
        handleRemoveFile,
        handleReUploadFile,
        handleLoadFileFromLink,
        handleLoadFileFromLinkSuccess,
        handleLoadFileFromLinkError,
        handleClearFiles,
        handleLocalFileUpload,
        handleClipboardPasteFile,
        isDragActive,
        handleDragFileEnter,
        handleDragFileOver,
        handleDragFileLeave,
        handleDropFile,
    };
};
exports.useFile = useFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob29rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxrREFBMEM7QUFDMUMsaUNBQStCO0FBQy9CLGdEQUEyQztBQUMzQyxpQ0FHYztBQUNkLGlEQUE4QztBQUM5QywrQkFBa0M7QUFDbEMsNkVBTXNEO0FBQ3RELHVEQUE2RDtBQUM3RCwyREFBd0U7QUFDeEUsNkNBQXVEO0FBQ3ZELHFDQUE0QztBQUM1QywyQ0FBK0M7QUFDL0MsbUNBQXNDO0FBQ3RDLG1DQUtnQjtBQUVULE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxnQkFBMkMsRUFBRSxFQUFFO0lBQzlFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksMEJBQWMsQ0FBQTtJQUNwRyxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSwyQkFBZSxDQUFBO0lBQy9GLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksNEJBQWdCLENBQUE7SUFDeEcsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksSUFBSSw0QkFBZ0IsQ0FBQTtJQUN4RyxNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSwwQkFBMEIsQ0FBQyxJQUFJLGlDQUFxQixDQUFBO0lBRXhHLE9BQU87UUFDTCxZQUFZO1FBQ1osWUFBWTtRQUNaLGNBQWM7UUFDZCxjQUFjO1FBQ2Qsa0JBQWtCO0tBQ25CLENBQUE7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLGdCQUFnQixvQkFjNUI7QUFFTSxNQUFNLE9BQU8sR0FBRyxDQUFDLFVBQXNCLEVBQUUsbUJBQW1CLEdBQUcsSUFBSSxFQUFFLEVBQUU7SUFDNUUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLHVCQUFlLEdBQUUsQ0FBQTtJQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFBLG9CQUFZLEdBQUUsQ0FBQTtJQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFBLHNCQUFTLEdBQUUsQ0FBQTtJQUMxQixNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBQSx3QkFBZ0IsRUFBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUVwSCxNQUFNLGNBQWMsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsRUFBRTtRQUN4RSxRQUFRLFFBQVEsRUFBRSxDQUFDO1lBQ2pCLEtBQUssOEJBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxRQUFRLEdBQUcsWUFBWSxFQUFFLENBQUM7b0JBQzVCLE1BQU0sQ0FBQzt3QkFDTCxJQUFJLEVBQUUsT0FBTzt3QkFDYixPQUFPLEVBQUUsQ0FBQyxDQUFDLHNDQUFzQyxFQUFFOzRCQUNqRCxFQUFFLEVBQUUsUUFBUTs0QkFDWixJQUFJLEVBQUUsOEJBQXNCLENBQUMsS0FBSzs0QkFDbEMsSUFBSSxFQUFFLElBQUEsdUJBQWMsRUFBQyxZQUFZLENBQUM7eUJBQ25DLENBQUM7cUJBQ0gsQ0FBQyxDQUFBO29CQUNGLE9BQU8sS0FBSyxDQUFBO2dCQUNkLENBQUM7Z0JBQ0QsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1lBQ0QsS0FBSyw4QkFBc0IsQ0FBQyxNQUFNLENBQUM7WUFDbkMsS0FBSyw4QkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLFFBQVEsR0FBRyxZQUFZLEVBQUUsQ0FBQztvQkFDNUIsTUFBTSxDQUFDO3dCQUNMLElBQUksRUFBRSxPQUFPO3dCQUNiLE9BQU8sRUFBRSxDQUFDLENBQUMsc0NBQXNDLEVBQUU7NEJBQ2pELEVBQUUsRUFBRSxRQUFROzRCQUNaLElBQUksRUFBRSw4QkFBc0IsQ0FBQyxRQUFROzRCQUNyQyxJQUFJLEVBQUUsSUFBQSx1QkFBYyxFQUFDLFlBQVksQ0FBQzt5QkFDbkMsQ0FBQztxQkFDSCxDQUFDLENBQUE7b0JBQ0YsT0FBTyxLQUFLLENBQUE7Z0JBQ2QsQ0FBQztnQkFDRCxPQUFPLElBQUksQ0FBQTtZQUNiLENBQUM7WUFDRCxLQUFLLDhCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksUUFBUSxHQUFHLGNBQWMsRUFBRSxDQUFDO29CQUM5QixNQUFNLENBQUM7d0JBQ0wsSUFBSSxFQUFFLE9BQU87d0JBQ2IsT0FBTyxFQUFFLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRTs0QkFDakQsRUFBRSxFQUFFLFFBQVE7NEJBQ1osSUFBSSxFQUFFLDhCQUFzQixDQUFDLEtBQUs7NEJBQ2xDLElBQUksRUFBRSxJQUFBLHVCQUFjLEVBQUMsY0FBYyxDQUFDO3lCQUNyQyxDQUFDO3FCQUNILENBQUMsQ0FBQTtvQkFDRixPQUFPLEtBQUssQ0FBQTtnQkFDZCxDQUFDO2dCQUNELE9BQU8sSUFBSSxDQUFBO1lBQ2IsQ0FBQztZQUNELEtBQUssOEJBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxRQUFRLEdBQUcsY0FBYyxFQUFFLENBQUM7b0JBQzlCLE1BQU0sQ0FBQzt3QkFDTCxJQUFJLEVBQUUsT0FBTzt3QkFDYixPQUFPLEVBQUUsQ0FBQyxDQUFDLHNDQUFzQyxFQUFFOzRCQUNqRCxFQUFFLEVBQUUsUUFBUTs0QkFDWixJQUFJLEVBQUUsOEJBQXNCLENBQUMsS0FBSzs0QkFDbEMsSUFBSSxFQUFFLElBQUEsdUJBQWMsRUFBQyxjQUFjLENBQUM7eUJBQ3JDLENBQUM7cUJBQ0gsQ0FBQyxDQUFBO29CQUNGLE9BQU8sS0FBSyxDQUFBO2dCQUNkLENBQUM7Z0JBQ0QsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLElBQUksQ0FBQTtZQUNiLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0lBRTNFLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE9BQW1CLEVBQUUsRUFBRTtRQUN4RCxNQUFNLEVBQ0osS0FBSyxFQUNMLFFBQVEsR0FDVCxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFBLGVBQU8sRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN4QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFZixNQUFNLGdCQUFnQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE9BQW1CLEVBQUUsRUFBRTtRQUMzRCxNQUFNLEVBQ0osS0FBSyxFQUNMLFFBQVEsR0FDVCxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUV4QixNQUFNLFFBQVEsR0FBRyxJQUFBLGVBQU8sRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN4QyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFN0QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUE7UUFDRixRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDcEIsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUVmLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDdEQsTUFBTSxFQUNKLEtBQUssRUFDTCxRQUFRLEdBQ1QsR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFeEIsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUE7UUFDekQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFZixNQUFNLGtCQUFrQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE1BQWMsRUFBRSxFQUFFO1FBQ3hELE1BQU0sRUFDSixLQUFLLEVBQ0wsUUFBUSxHQUNULEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFBO1FBRXpELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDZixNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDbEMsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3hDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO1lBQzNCLENBQUMsQ0FBQyxDQUFBO1lBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ2xCLElBQUEsa0JBQVUsRUFBQztnQkFDVCxJQUFJLEVBQUUsYUFBYSxDQUFDLFlBQWE7Z0JBQ2pDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQy9CLGdCQUFnQixDQUFDLEVBQUUsR0FBRyxhQUFhLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtnQkFDbEQsQ0FBQztnQkFDRCxpQkFBaUIsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUN6QixnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsYUFBYSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFBO2dCQUMzRSxDQUFDO2dCQUNELGVBQWUsRUFBRSxDQUFDLEtBQVcsRUFBRSxFQUFFO29CQUMvQixNQUFNLFlBQVksR0FBRyxJQUFBLGlDQUF5QixFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsNENBQTRDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDM0gsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQTtvQkFDaEQsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLGFBQWEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RCxDQUFDO2FBQ0YsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3BCLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBRXBELE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBYyxFQUFFLEVBQUU7UUFDeEQsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUM3QixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFBO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFBO1lBRW5ELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQztnQkFDbEQsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBOztnQkFFM0QsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNULENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUE7SUFDakMsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxHQUFXLEVBQUUsRUFBRTtRQUN6RCxNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQTtRQUV0RCxNQUFNLGFBQWEsR0FBRztZQUNwQixFQUFFLEVBQUUsSUFBQSxTQUFLLEdBQUU7WUFDWCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRSxFQUFFO1lBQ1IsSUFBSSxFQUFFLENBQUM7WUFDUCxRQUFRLEVBQUUsQ0FBQztZQUNYLGNBQWMsRUFBRSxvQkFBYyxDQUFDLFVBQVU7WUFDekMsZUFBZSxFQUFFLEVBQUU7WUFDbkIsR0FBRztZQUNILFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQTtRQUNELGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUM1QixrQkFBa0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFcEMsSUFBQSw2QkFBb0IsRUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyRCxNQUFNLE9BQU8sR0FBRztnQkFDZCxHQUFHLGFBQWE7Z0JBQ2hCLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUztnQkFDbkIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNkLFFBQVEsRUFBRSxHQUFHO2dCQUNiLGVBQWUsRUFBRSxJQUFBLDBCQUFrQixFQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsOEJBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZILFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDbEIsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO2FBQ2IsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFBLDhCQUFzQixFQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsa0JBQWtCLElBQUksRUFBRSxFQUFFLFVBQVUsQ0FBQyx1QkFBdUIsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUNwSSxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxzQ0FBc0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQ3BILGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNwQyxDQUFDO1lBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUM7Z0JBQ3hELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQTs7Z0JBRWxDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDWixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsbUNBQW1DLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUYsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxVQUFVLENBQUMsdUJBQXVCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFeEwsTUFBTSw2QkFBNkIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsZUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRTNELE1BQU0sMkJBQTJCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLGVBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUV6RCxNQUFNLGdCQUFnQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDeEMsTUFBTSxFQUNKLFFBQVEsR0FDVCxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUN4QixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZCxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRWYsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRTtRQUN2RCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLG1CQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyw2QkFBNkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN0RixPQUFNO1FBQ1IsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFBLDhCQUFzQixFQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsa0JBQWtCLElBQUksRUFBRSxFQUFFLFVBQVUsQ0FBQyx1QkFBdUIsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ2pJLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLHNDQUFzQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUNqSCxPQUFNO1FBQ1IsQ0FBQztRQUNELE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFBO1FBQ3RELE1BQU0sUUFBUSxHQUFHLElBQUEsMEJBQWtCLEVBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsQ0FBQyw4QkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQ3BILElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDdEMsT0FBTTtRQUVSLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUE7UUFDL0IsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFN0MsTUFBTSxDQUFDLGdCQUFnQixDQUNyQixNQUFNLEVBQ04sR0FBRyxFQUFFO1lBQ0gsTUFBTSxhQUFhLEdBQUc7Z0JBQ3BCLEVBQUUsRUFBRSxJQUFBLFNBQUssR0FBRTtnQkFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtnQkFDZixRQUFRLEVBQUUsQ0FBQztnQkFDWCxjQUFjLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO2dCQUN6QyxlQUFlLEVBQUUsSUFBQSwwQkFBa0IsRUFBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLDhCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNwSCxZQUFZLEVBQUUsSUFBSTtnQkFDbEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDbEQsQ0FBQTtZQUNELGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUM1QixJQUFBLGtCQUFVLEVBQUM7Z0JBQ1QsSUFBSSxFQUFFLGFBQWEsQ0FBQyxZQUFZO2dCQUNoQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO29CQUMvQixnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsYUFBYSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ2xELENBQUM7Z0JBQ0QsaUJBQWlCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDekIsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLGFBQWEsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtnQkFDM0UsQ0FBQztnQkFDRCxlQUFlLEVBQUUsQ0FBQyxLQUFXLEVBQUUsRUFBRTtvQkFDL0IsTUFBTSxZQUFZLEdBQUcsSUFBQSxpQ0FBeUIsRUFBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLDRDQUE0QyxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBUSxDQUFDLENBQUE7b0JBQ2xJLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7b0JBQ2hELGdCQUFnQixDQUFDLEVBQUUsR0FBRyxhQUFhLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtnQkFDdEQsQ0FBQzthQUNGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQixDQUFDLEVBQ0QsS0FBSyxDQUNOLENBQUE7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQ3JCLE9BQU8sRUFDUCxHQUFHLEVBQUU7WUFDSCxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsMENBQTBDLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDckcsQ0FBQyxFQUNELEtBQUssQ0FDTixDQUFBO1FBQ0QsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFFLHVCQUF1QixFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBRTdMLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsQ0FBc0MsRUFBRSxFQUFFO1FBQ3RGLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQ25ELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEIsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ2xCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdCLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7SUFFM0IsTUFBTSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdkQsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUErQixFQUFFLEVBQUU7UUFDMUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUNuQixlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBRU4sTUFBTSxrQkFBa0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUErQixFQUFFLEVBQUU7UUFDekUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUNyQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixNQUFNLG1CQUFtQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQStCLEVBQUUsRUFBRTtRQUMxRSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7UUFDbEIsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO1FBQ25CLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN4QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixNQUFNLGNBQWMsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUErQixFQUFFLEVBQUU7UUFDckUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUNuQixlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFdEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFcEMsSUFBSSxJQUFJO1lBQ04scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDL0IsQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBO0lBRTNCLE9BQU87UUFDTCxhQUFhO1FBQ2IsZ0JBQWdCO1FBQ2hCLGdCQUFnQjtRQUNoQixrQkFBa0I7UUFDbEIsc0JBQXNCO1FBQ3RCLDZCQUE2QjtRQUM3QiwyQkFBMkI7UUFDM0IsZ0JBQWdCO1FBQ2hCLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsWUFBWTtRQUNaLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLGNBQWM7S0FDZixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBN1RZLFFBQUEsT0FBTyxXQTZUbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENsaXBib2FyZEV2ZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGaWxlVXBsb2FkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZVBhcmFtcyB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB2NCBhcyB1dWlkNCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQge1xuICBBVURJT19TSVpFX0xJTUlULFxuICBGSUxFX1NJWkVfTElNSVQsXG4gIElNR19TSVpFX0xJTUlULFxuICBNQVhfRklMRV9VUExPQURfTElNSVQsXG4gIFZJREVPX1NJWkVfTElNSVQsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9maWxlLXVwbG9hZGVyL2NvbnN0YW50cydcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXBsb2FkUmVtb3RlRmlsZUluZm8gfSBmcm9tICdAL3NlcnZpY2UvY29tbW9uJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGZvcm1hdEZpbGVTaXplIH0gZnJvbSAnQC91dGlscy9mb3JtYXQnXG5pbXBvcnQgeyB1c2VGaWxlU3RvcmUgfSBmcm9tICcuL3N0b3JlJ1xuaW1wb3J0IHtcbiAgZmlsZVVwbG9hZCxcbiAgZ2V0RmlsZVVwbG9hZEVycm9yTWVzc2FnZSxcbiAgZ2V0U3VwcG9ydEZpbGVUeXBlLFxuICBpc0FsbG93ZWRGaWxlRXh0ZW5zaW9uLFxufSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgY29uc3QgdXNlRmlsZVNpemVMaW1pdCA9IChmaWxlVXBsb2FkQ29uZmlnPzogRmlsZVVwbG9hZENvbmZpZ1Jlc3BvbnNlKSA9PiB7XG4gIGNvbnN0IGltZ1NpemVMaW1pdCA9IE51bWJlcihmaWxlVXBsb2FkQ29uZmlnPy5pbWFnZV9maWxlX3NpemVfbGltaXQpICogMTAyNCAqIDEwMjQgfHwgSU1HX1NJWkVfTElNSVRcbiAgY29uc3QgZG9jU2l6ZUxpbWl0ID0gTnVtYmVyKGZpbGVVcGxvYWRDb25maWc/LmZpbGVfc2l6ZV9saW1pdCkgKiAxMDI0ICogMTAyNCB8fCBGSUxFX1NJWkVfTElNSVRcbiAgY29uc3QgYXVkaW9TaXplTGltaXQgPSBOdW1iZXIoZmlsZVVwbG9hZENvbmZpZz8uYXVkaW9fZmlsZV9zaXplX2xpbWl0KSAqIDEwMjQgKiAxMDI0IHx8IEFVRElPX1NJWkVfTElNSVRcbiAgY29uc3QgdmlkZW9TaXplTGltaXQgPSBOdW1iZXIoZmlsZVVwbG9hZENvbmZpZz8udmlkZW9fZmlsZV9zaXplX2xpbWl0KSAqIDEwMjQgKiAxMDI0IHx8IFZJREVPX1NJWkVfTElNSVRcbiAgY29uc3QgbWF4RmlsZVVwbG9hZExpbWl0ID0gTnVtYmVyKGZpbGVVcGxvYWRDb25maWc/LndvcmtmbG93X2ZpbGVfdXBsb2FkX2xpbWl0KSB8fCBNQVhfRklMRV9VUExPQURfTElNSVRcblxuICByZXR1cm4ge1xuICAgIGltZ1NpemVMaW1pdCxcbiAgICBkb2NTaXplTGltaXQsXG4gICAgYXVkaW9TaXplTGltaXQsXG4gICAgdmlkZW9TaXplTGltaXQsXG4gICAgbWF4RmlsZVVwbG9hZExpbWl0LFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VGaWxlID0gKGZpbGVDb25maWc6IEZpbGVVcGxvYWQsIG5vTmVlZFRvQ2hlY2tFbmFibGUgPSB0cnVlKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcbiAgY29uc3QgZmlsZVN0b3JlID0gdXNlRmlsZVN0b3JlKClcbiAgY29uc3QgcGFyYW1zID0gdXNlUGFyYW1zKClcbiAgY29uc3QgeyBpbWdTaXplTGltaXQsIGRvY1NpemVMaW1pdCwgYXVkaW9TaXplTGltaXQsIHZpZGVvU2l6ZUxpbWl0IH0gPSB1c2VGaWxlU2l6ZUxpbWl0KGZpbGVDb25maWcuZmlsZVVwbG9hZENvbmZpZylcblxuICBjb25zdCBjaGVja1NpemVMaW1pdCA9IHVzZUNhbGxiYWNrKChmaWxlVHlwZTogc3RyaW5nLCBmaWxlU2l6ZTogbnVtYmVyKSA9PiB7XG4gICAgc3dpdGNoIChmaWxlVHlwZSkge1xuICAgICAgY2FzZSBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmltYWdlOiB7XG4gICAgICAgIGlmIChmaWxlU2l6ZSA+IGltZ1NpemVMaW1pdCkge1xuICAgICAgICAgIG5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogdCgnZmlsZVVwbG9hZGVyLnVwbG9hZEZyb21Db21wdXRlckxpbWl0Jywge1xuICAgICAgICAgICAgICBuczogJ2NvbW1vbicsXG4gICAgICAgICAgICAgIHR5cGU6IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuaW1hZ2UsXG4gICAgICAgICAgICAgIHNpemU6IGZvcm1hdEZpbGVTaXplKGltZ1NpemVMaW1pdCksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjYXNlIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuY3VzdG9tOlxuICAgICAgY2FzZSBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmRvY3VtZW50OiB7XG4gICAgICAgIGlmIChmaWxlU2l6ZSA+IGRvY1NpemVMaW1pdCkge1xuICAgICAgICAgIG5vdGlmeSh7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgbWVzc2FnZTogdCgnZmlsZVVwbG9hZGVyLnVwbG9hZEZyb21Db21wdXRlckxpbWl0Jywge1xuICAgICAgICAgICAgICBuczogJ2NvbW1vbicsXG4gICAgICAgICAgICAgIHR5cGU6IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuZG9jdW1lbnQsXG4gICAgICAgICAgICAgIHNpemU6IGZvcm1hdEZpbGVTaXplKGRvY1NpemVMaW1pdCksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjYXNlIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuYXVkaW86IHtcbiAgICAgICAgaWYgKGZpbGVTaXplID4gYXVkaW9TaXplTGltaXQpIHtcbiAgICAgICAgICBub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ2ZpbGVVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJMaW1pdCcsIHtcbiAgICAgICAgICAgICAgbnM6ICdjb21tb24nLFxuICAgICAgICAgICAgICB0eXBlOiBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmF1ZGlvLFxuICAgICAgICAgICAgICBzaXplOiBmb3JtYXRGaWxlU2l6ZShhdWRpb1NpemVMaW1pdCksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBjYXNlIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMudmlkZW86IHtcbiAgICAgICAgaWYgKGZpbGVTaXplID4gdmlkZW9TaXplTGltaXQpIHtcbiAgICAgICAgICBub3RpZnkoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6IHQoJ2ZpbGVVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJMaW1pdCcsIHtcbiAgICAgICAgICAgICAgbnM6ICdjb21tb24nLFxuICAgICAgICAgICAgICB0eXBlOiBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLnZpZGVvLFxuICAgICAgICAgICAgICBzaXplOiBmb3JtYXRGaWxlU2l6ZSh2aWRlb1NpemVMaW1pdCksXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9LCBbYXVkaW9TaXplTGltaXQsIGRvY1NpemVMaW1pdCwgaW1nU2l6ZUxpbWl0LCBub3RpZnksIHQsIHZpZGVvU2l6ZUxpbWl0XSlcblxuICBjb25zdCBoYW5kbGVBZGRGaWxlID0gdXNlQ2FsbGJhY2soKG5ld0ZpbGU6IEZpbGVFbnRpdHkpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBmaWxlcyxcbiAgICAgIHNldEZpbGVzLFxuICAgIH0gPSBmaWxlU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgbmV3RmlsZXMgPSBwcm9kdWNlKGZpbGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnB1c2gobmV3RmlsZSlcbiAgICB9KVxuICAgIHNldEZpbGVzKG5ld0ZpbGVzKVxuICB9LCBbZmlsZVN0b3JlXSlcblxuICBjb25zdCBoYW5kbGVVcGRhdGVGaWxlID0gdXNlQ2FsbGJhY2soKG5ld0ZpbGU6IEZpbGVFbnRpdHkpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBmaWxlcyxcbiAgICAgIHNldEZpbGVzLFxuICAgIH0gPSBmaWxlU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgbmV3RmlsZXMgPSBwcm9kdWNlKGZpbGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZHJhZnQuZmluZEluZGV4KGZpbGUgPT4gZmlsZS5pZCA9PT0gbmV3RmlsZS5pZClcblxuICAgICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIGRyYWZ0W2luZGV4XSA9IG5ld0ZpbGVcbiAgICB9KVxuICAgIHNldEZpbGVzKG5ld0ZpbGVzKVxuICB9LCBbZmlsZVN0b3JlXSlcblxuICBjb25zdCBoYW5kbGVSZW1vdmVGaWxlID0gdXNlQ2FsbGJhY2soKGZpbGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZmlsZXMsXG4gICAgICBzZXRGaWxlcyxcbiAgICB9ID0gZmlsZVN0b3JlLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG5ld0ZpbGVzID0gZmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZS5pZCAhPT0gZmlsZUlkKVxuICAgIHNldEZpbGVzKG5ld0ZpbGVzKVxuICB9LCBbZmlsZVN0b3JlXSlcblxuICBjb25zdCBoYW5kbGVSZVVwbG9hZEZpbGUgPSB1c2VDYWxsYmFjaygoZmlsZUlkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBmaWxlcyxcbiAgICAgIHNldEZpbGVzLFxuICAgIH0gPSBmaWxlU3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IGluZGV4ID0gZmlsZXMuZmluZEluZGV4KGZpbGUgPT4gZmlsZS5pZCA9PT0gZmlsZUlkKVxuXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnN0IHVwbG9hZGluZ0ZpbGUgPSBmaWxlc1tpbmRleF1cbiAgICAgIGNvbnN0IG5ld0ZpbGVzID0gcHJvZHVjZShmaWxlcywgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0W2luZGV4XS5wcm9ncmVzcyA9IDBcbiAgICAgIH0pXG4gICAgICBzZXRGaWxlcyhuZXdGaWxlcylcbiAgICAgIGZpbGVVcGxvYWQoe1xuICAgICAgICBmaWxlOiB1cGxvYWRpbmdGaWxlLm9yaWdpbmFsRmlsZSEsXG4gICAgICAgIG9uUHJvZ3Jlc3NDYWxsYmFjazogKHByb2dyZXNzKSA9PiB7XG4gICAgICAgICAgaGFuZGxlVXBkYXRlRmlsZSh7IC4uLnVwbG9hZGluZ0ZpbGUsIHByb2dyZXNzIH0pXG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VjY2Vzc0NhbGxiYWNrOiAocmVzKSA9PiB7XG4gICAgICAgICAgaGFuZGxlVXBkYXRlRmlsZSh7IC4uLnVwbG9hZGluZ0ZpbGUsIHVwbG9hZGVkSWQ6IHJlcy5pZCwgcHJvZ3Jlc3M6IDEwMCB9KVxuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yQ2FsbGJhY2s6IChlcnJvcj86IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGdldEZpbGVVcGxvYWRFcnJvck1lc3NhZ2UoZXJyb3IsIHQoJ2ZpbGVVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJVcGxvYWRFcnJvcicsIHsgbnM6ICdjb21tb24nIH0pLCB0KVxuICAgICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSB9KVxuICAgICAgICAgIGhhbmRsZVVwZGF0ZUZpbGUoeyAuLi51cGxvYWRpbmdGaWxlLCBwcm9ncmVzczogLTEgfSlcbiAgICAgICAgfSxcbiAgICAgIH0sICEhcGFyYW1zLnRva2VuKVxuICAgIH1cbiAgfSwgW2ZpbGVTdG9yZSwgbm90aWZ5LCB0LCBoYW5kbGVVcGRhdGVGaWxlLCBwYXJhbXNdKVxuXG4gIGNvbnN0IHN0YXJ0UHJvZ3Jlc3NUaW1lciA9IHVzZUNhbGxiYWNrKChmaWxlSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBmaWxlU3RvcmUuZ2V0U3RhdGUoKS5maWxlc1xuICAgICAgY29uc3QgZmlsZSA9IGZpbGVzLmZpbmQoZmlsZSA9PiBmaWxlLmlkID09PSBmaWxlSWQpXG5cbiAgICAgIGlmIChmaWxlICYmIGZpbGUucHJvZ3Jlc3MgPCA4MCAmJiBmaWxlLnByb2dyZXNzID49IDApXG4gICAgICAgIGhhbmRsZVVwZGF0ZUZpbGUoeyAuLi5maWxlLCBwcm9ncmVzczogZmlsZS5wcm9ncmVzcyArIDIwIH0pXG4gICAgICBlbHNlXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcilcbiAgICB9LCAyMDApXG4gIH0sIFtmaWxlU3RvcmUsIGhhbmRsZVVwZGF0ZUZpbGVdKVxuICBjb25zdCBoYW5kbGVMb2FkRmlsZUZyb21MaW5rID0gdXNlQ2FsbGJhY2soKHVybDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgYWxsb3dlZEZpbGVUeXBlcyA9IGZpbGVDb25maWcuYWxsb3dlZF9maWxlX3R5cGVzXG5cbiAgICBjb25zdCB1cGxvYWRpbmdGaWxlID0ge1xuICAgICAgaWQ6IHV1aWQ0KCksXG4gICAgICBuYW1lOiB1cmwsXG4gICAgICB0eXBlOiAnJyxcbiAgICAgIHNpemU6IDAsXG4gICAgICBwcm9ncmVzczogMCxcbiAgICAgIHRyYW5zZmVyTWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5yZW1vdGVfdXJsLFxuICAgICAgc3VwcG9ydEZpbGVUeXBlOiAnJyxcbiAgICAgIHVybCxcbiAgICAgIGlzUmVtb3RlOiB0cnVlLFxuICAgIH1cbiAgICBoYW5kbGVBZGRGaWxlKHVwbG9hZGluZ0ZpbGUpXG4gICAgc3RhcnRQcm9ncmVzc1RpbWVyKHVwbG9hZGluZ0ZpbGUuaWQpXG5cbiAgICB1cGxvYWRSZW1vdGVGaWxlSW5mbyh1cmwsICEhcGFyYW1zLnRva2VuKS50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IG5ld0ZpbGUgPSB7XG4gICAgICAgIC4uLnVwbG9hZGluZ0ZpbGUsXG4gICAgICAgIHR5cGU6IHJlcy5taW1lX3R5cGUsXG4gICAgICAgIHNpemU6IHJlcy5zaXplLFxuICAgICAgICBwcm9ncmVzczogMTAwLFxuICAgICAgICBzdXBwb3J0RmlsZVR5cGU6IGdldFN1cHBvcnRGaWxlVHlwZShyZXMubmFtZSwgcmVzLm1pbWVfdHlwZSwgYWxsb3dlZEZpbGVUeXBlcz8uaW5jbHVkZXMoU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5jdXN0b20pKSxcbiAgICAgICAgdXBsb2FkZWRJZDogcmVzLmlkLFxuICAgICAgICB1cmw6IHJlcy51cmwsXG4gICAgICB9XG4gICAgICBpZiAoIWlzQWxsb3dlZEZpbGVFeHRlbnNpb24ocmVzLm5hbWUsIHJlcy5taW1lX3R5cGUsIGZpbGVDb25maWcuYWxsb3dlZF9maWxlX3R5cGVzIHx8IFtdLCBmaWxlQ29uZmlnLmFsbG93ZWRfZmlsZV9leHRlbnNpb25zIHx8IFtdKSkge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBgJHt0KCdmaWxlVXBsb2FkZXIuZmlsZUV4dGVuc2lvbk5vdFN1cHBvcnQnLCB7IG5zOiAnY29tbW9uJyB9KX0gJHtuZXdGaWxlLnR5cGV9YCB9KVxuICAgICAgICBoYW5kbGVSZW1vdmVGaWxlKHVwbG9hZGluZ0ZpbGUuaWQpXG4gICAgICB9XG4gICAgICBpZiAoIWNoZWNrU2l6ZUxpbWl0KG5ld0ZpbGUuc3VwcG9ydEZpbGVUeXBlLCBuZXdGaWxlLnNpemUpKVxuICAgICAgICBoYW5kbGVSZW1vdmVGaWxlKHVwbG9hZGluZ0ZpbGUuaWQpXG4gICAgICBlbHNlXG4gICAgICAgIGhhbmRsZVVwZGF0ZUZpbGUobmV3RmlsZSlcbiAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdmaWxlVXBsb2FkZXIucGFzdGVGaWxlTGlua0ludmFsaWQnLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgaGFuZGxlUmVtb3ZlRmlsZSh1cGxvYWRpbmdGaWxlLmlkKVxuICAgIH0pXG4gIH0sIFtjaGVja1NpemVMaW1pdCwgaGFuZGxlQWRkRmlsZSwgaGFuZGxlVXBkYXRlRmlsZSwgbm90aWZ5LCB0LCBoYW5kbGVSZW1vdmVGaWxlLCBmaWxlQ29uZmlnPy5hbGxvd2VkX2ZpbGVfdHlwZXMsIGZpbGVDb25maWcuYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMsIHN0YXJ0UHJvZ3Jlc3NUaW1lciwgcGFyYW1zLnRva2VuXSlcblxuICBjb25zdCBoYW5kbGVMb2FkRmlsZUZyb21MaW5rU3VjY2VzcyA9IHVzZUNhbGxiYWNrKG5vb3AsIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUxvYWRGaWxlRnJvbUxpbmtFcnJvciA9IHVzZUNhbGxiYWNrKG5vb3AsIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUNsZWFyRmlsZXMgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2V0RmlsZXMsXG4gICAgfSA9IGZpbGVTdG9yZS5nZXRTdGF0ZSgpXG4gICAgc2V0RmlsZXMoW10pXG4gIH0sIFtmaWxlU3RvcmVdKVxuXG4gIGNvbnN0IGhhbmRsZUxvY2FsRmlsZVVwbG9hZCA9IHVzZUNhbGxiYWNrKChmaWxlOiBGaWxlKSA9PiB7XG4gICAgLy8gQ2hlY2sgZmlsZSB1cGxvYWQgZW5hYmxlZFxuICAgIGlmICghbm9OZWVkVG9DaGVja0VuYWJsZSAmJiAhZmlsZUNvbmZpZy5lbmFibGVkKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdmaWxlVXBsb2FkZXIudXBsb2FkRGlzYWJsZWQnLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghaXNBbGxvd2VkRmlsZUV4dGVuc2lvbihmaWxlLm5hbWUsIGZpbGUudHlwZSwgZmlsZUNvbmZpZy5hbGxvd2VkX2ZpbGVfdHlwZXMgfHwgW10sIGZpbGVDb25maWcuYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMgfHwgW10pKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBgJHt0KCdmaWxlVXBsb2FkZXIuZmlsZUV4dGVuc2lvbk5vdFN1cHBvcnQnLCB7IG5zOiAnY29tbW9uJyB9KX0gJHtmaWxlLnR5cGV9YCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IGFsbG93ZWRGaWxlVHlwZXMgPSBmaWxlQ29uZmlnLmFsbG93ZWRfZmlsZV90eXBlc1xuICAgIGNvbnN0IGZpbGVUeXBlID0gZ2V0U3VwcG9ydEZpbGVUeXBlKGZpbGUubmFtZSwgZmlsZS50eXBlLCBhbGxvd2VkRmlsZVR5cGVzPy5pbmNsdWRlcyhTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmN1c3RvbSkpXG4gICAgaWYgKCFjaGVja1NpemVMaW1pdChmaWxlVHlwZSwgZmlsZS5zaXplKSlcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIGNvbnN0IGlzSW1hZ2UgPSBmaWxlLnR5cGUuc3RhcnRzV2l0aCgnaW1hZ2UnKVxuXG4gICAgcmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnbG9hZCcsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwbG9hZGluZ0ZpbGUgPSB7XG4gICAgICAgICAgaWQ6IHV1aWQ0KCksXG4gICAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICAgIHR5cGU6IGZpbGUudHlwZSxcbiAgICAgICAgICBzaXplOiBmaWxlLnNpemUsXG4gICAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICAgICAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgICAgICAgc3VwcG9ydEZpbGVUeXBlOiBnZXRTdXBwb3J0RmlsZVR5cGUoZmlsZS5uYW1lLCBmaWxlLnR5cGUsIGFsbG93ZWRGaWxlVHlwZXM/LmluY2x1ZGVzKFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuY3VzdG9tKSksXG4gICAgICAgICAgb3JpZ2luYWxGaWxlOiBmaWxlLFxuICAgICAgICAgIGJhc2U2NFVybDogaXNJbWFnZSA/IHJlYWRlci5yZXN1bHQgYXMgc3RyaW5nIDogJycsXG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlQWRkRmlsZSh1cGxvYWRpbmdGaWxlKVxuICAgICAgICBmaWxlVXBsb2FkKHtcbiAgICAgICAgICBmaWxlOiB1cGxvYWRpbmdGaWxlLm9yaWdpbmFsRmlsZSxcbiAgICAgICAgICBvblByb2dyZXNzQ2FsbGJhY2s6IChwcm9ncmVzcykgPT4ge1xuICAgICAgICAgICAgaGFuZGxlVXBkYXRlRmlsZSh7IC4uLnVwbG9hZGluZ0ZpbGUsIHByb2dyZXNzIH0pXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvblN1Y2Nlc3NDYWxsYmFjazogKHJlcykgPT4ge1xuICAgICAgICAgICAgaGFuZGxlVXBkYXRlRmlsZSh7IC4uLnVwbG9hZGluZ0ZpbGUsIHVwbG9hZGVkSWQ6IHJlcy5pZCwgcHJvZ3Jlc3M6IDEwMCB9KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgb25FcnJvckNhbGxiYWNrOiAoZXJyb3I/OiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGdldEZpbGVVcGxvYWRFcnJvck1lc3NhZ2UoZXJyb3IsIHQoJ2ZpbGVVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJVcGxvYWRFcnJvcicsIHsgbnM6ICdjb21tb24nIH0pLCB0IGFzIGFueSlcbiAgICAgICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSB9KVxuICAgICAgICAgICAgaGFuZGxlVXBkYXRlRmlsZSh7IC4uLnVwbG9hZGluZ0ZpbGUsIHByb2dyZXNzOiAtMSB9KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sICEhcGFyYW1zLnRva2VuKVxuICAgICAgfSxcbiAgICAgIGZhbHNlLFxuICAgIClcbiAgICByZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdlcnJvcicsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2ZpbGVVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJSZWFkRXJyb3InLCB7IG5zOiAnY29tbW9uJyB9KSB9KVxuICAgICAgfSxcbiAgICAgIGZhbHNlLFxuICAgIClcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKVxuICB9LCBbbm9OZWVkVG9DaGVja0VuYWJsZSwgY2hlY2tTaXplTGltaXQsIG5vdGlmeSwgdCwgaGFuZGxlQWRkRmlsZSwgaGFuZGxlVXBkYXRlRmlsZSwgcGFyYW1zLnRva2VuLCBmaWxlQ29uZmlnPy5hbGxvd2VkX2ZpbGVfdHlwZXMsIGZpbGVDb25maWc/LmFsbG93ZWRfZmlsZV9leHRlbnNpb25zLCBmaWxlQ29uZmlnPy5lbmFibGVkXSlcblxuICBjb25zdCBoYW5kbGVDbGlwYm9hcmRQYXN0ZUZpbGUgPSB1c2VDYWxsYmFjaygoZTogQ2xpcGJvYXJkRXZlbnQ8SFRNTFRleHRBcmVhRWxlbWVudD4pID0+IHtcbiAgICBjb25zdCBmaWxlID0gZS5jbGlwYm9hcmREYXRhPy5maWxlc1swXVxuICAgIGNvbnN0IHRleHQgPSBlLmNsaXBib2FyZERhdGE/LmdldERhdGEoJ3RleHQvcGxhaW4nKVxuICAgIGlmIChmaWxlICYmICF0ZXh0KSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGhhbmRsZUxvY2FsRmlsZVVwbG9hZChmaWxlKVxuICAgIH1cbiAgfSwgW2hhbmRsZUxvY2FsRmlsZVVwbG9hZF0pXG5cbiAgY29uc3QgW2lzRHJhZ0FjdGl2ZSwgc2V0SXNEcmFnQWN0aXZlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVEcmFnRmlsZUVudGVyID0gdXNlQ2FsbGJhY2soKGU6IFJlYWN0LkRyYWdFdmVudDxIVE1MRWxlbWVudD4pID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgc2V0SXNEcmFnQWN0aXZlKHRydWUpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZURyYWdGaWxlT3ZlciA9IHVzZUNhbGxiYWNrKChlOiBSZWFjdC5EcmFnRXZlbnQ8SFRNTEVsZW1lbnQ+KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVEcmFnRmlsZUxlYXZlID0gdXNlQ2FsbGJhY2soKGU6IFJlYWN0LkRyYWdFdmVudDxIVE1MRWxlbWVudD4pID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgc2V0SXNEcmFnQWN0aXZlKGZhbHNlKVxuICB9LCBbXSlcblxuICBjb25zdCBoYW5kbGVEcm9wRmlsZSA9IHVzZUNhbGxiYWNrKChlOiBSZWFjdC5EcmFnRXZlbnQ8SFRNTEVsZW1lbnQ+KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIHNldElzRHJhZ0FjdGl2ZShmYWxzZSlcblxuICAgIGNvbnN0IGZpbGUgPSBlLmRhdGFUcmFuc2Zlci5maWxlc1swXVxuXG4gICAgaWYgKGZpbGUpXG4gICAgICBoYW5kbGVMb2NhbEZpbGVVcGxvYWQoZmlsZSlcbiAgfSwgW2hhbmRsZUxvY2FsRmlsZVVwbG9hZF0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVBZGRGaWxlLFxuICAgIGhhbmRsZVVwZGF0ZUZpbGUsXG4gICAgaGFuZGxlUmVtb3ZlRmlsZSxcbiAgICBoYW5kbGVSZVVwbG9hZEZpbGUsXG4gICAgaGFuZGxlTG9hZEZpbGVGcm9tTGluayxcbiAgICBoYW5kbGVMb2FkRmlsZUZyb21MaW5rU3VjY2VzcyxcbiAgICBoYW5kbGVMb2FkRmlsZUZyb21MaW5rRXJyb3IsXG4gICAgaGFuZGxlQ2xlYXJGaWxlcyxcbiAgICBoYW5kbGVMb2NhbEZpbGVVcGxvYWQsXG4gICAgaGFuZGxlQ2xpcGJvYXJkUGFzdGVGaWxlLFxuICAgIGlzRHJhZ0FjdGl2ZSxcbiAgICBoYW5kbGVEcmFnRmlsZUVudGVyLFxuICAgIGhhbmRsZURyYWdGaWxlT3ZlcixcbiAgICBoYW5kbGVEcmFnRmlsZUxlYXZlLFxuICAgIGhhbmRsZURyb3BGaWxlLFxuICB9XG59XG4iXX0=